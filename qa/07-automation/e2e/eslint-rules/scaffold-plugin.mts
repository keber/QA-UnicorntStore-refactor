/**
 * Local ESLint plugin: AST-level enforcement of the mechanical subset of the
 * Constitution documented in `.github/skills/qa-automation/references/
 * constitution.md` (adopted from `Playwright-Scaffold-AI-Assisted-Development`;
 * see `FRAMEWORK-FIXES-qa-framework*.md`, reviewed earlier in this project's
 * setup and no longer present in the repo, for the original provenance).
 *
 * The Claude Code `PreToolUse` hook (`.claude/scripts/enforce_constitution.py`
 * at the repo root) checks the same rules with regexes at agent-write time;
 * these rules are the durable layer -- AST matching survives formatting,
 * aliasing, and line-wrapping that a regex can miss, and it gates HUMAN
 * commits too (via `.githooks/pre-commit` + CI), not just agent tool calls.
 * Rule ids mirror the hook's ids so a violation reads the same in both
 * layers.
 *
 * Path scoping lives in eslint.config.mts -- each rule is only enabled for
 * the directories where the Constitution applies it.
 */

/* eslint-disable */

// Minimal structural AST/context types — enough for strict tsc without
// depending on ESLint's type packages.
type AstNode = {
  type: string;
  [key: string]: unknown;
};

type RuleContext = {
  report(descriptor: { node: AstNode; message: string }): void;
};

type RuleModule = {
  meta: {
    type: 'problem';
    docs: { description: string };
    schema: never[];
  };
  create(context: RuleContext): Record<string, (node: AstNode) => void>;
};

function rule(
  description: string,
  create: (context: RuleContext) => Record<string, (node: AstNode) => void>
): RuleModule {
  return {
    meta: { type: 'problem', docs: { description }, schema: [] },
    create,
  };
}

function calleeName(node: AstNode): string | undefined {
  const callee = node.callee as AstNode | undefined;
  if (!callee) return undefined;
  if (callee.type === 'Identifier') return callee.name as string;
  if (callee.type === 'MemberExpression') {
    return memberPropertyName(callee);
  }
  return undefined;
}

function calleeObjectName(node: AstNode): string | undefined {
  const callee = node.callee as AstNode | undefined;
  if (!callee || callee.type !== 'MemberExpression') return undefined;
  const object = callee.object as AstNode;
  return object.type === 'Identifier' ? (object.name as string) : undefined;
}

/** Property name of a MemberExpression — handles `a.b` AND `a['b']`. */
function memberPropertyName(member: AstNode): string | undefined {
  const property = member.property as AstNode;
  if (property.type === 'Identifier' && !member.computed) {
    return property.name as string;
  }
  if (property.type === 'Literal' && typeof property.value === 'string') {
    return property.value;
  }
  return undefined;
}

/** String value of a Literal or a no-substitution TemplateLiteral. */
function stringValue(node: AstNode | undefined): string | undefined {
  if (!node) return undefined;
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  if (node.type === 'TemplateLiteral') {
    const quasis = node.quasis as AstNode[];
    if (quasis.length === 1) {
      const cooked = (quasis[0].value as { cooked?: string }).cooked;
      return cooked;
    }
    // For templates with substitutions, the leading static part is enough
    // for prefix checks (`https://...${x}` is still a hardcoded origin).
    const cooked = (quasis[0].value as { cooked?: string }).cooked;
    return cooked;
  }
  return undefined;
}

/**
 * Full text of a string-ish node for CONTAINS checks — unlike stringValue(),
 * a substituted TemplateLiteral returns every static part joined, so a tag
 * hidden after the first `${...}` is still visible.
 */
function fullStringText(node: AstNode | undefined): string | undefined {
  if (!node) return undefined;
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  if (node.type === 'TemplateLiteral') {
    const quasis = node.quasis as AstNode[];
    return quasis.map((q) => (q.value as { cooked?: string }).cooked ?? '').join(' ');
  }
  return undefined;
}

// `-` and `.`+word excluded after the tag so email/domain mentions
// (`@functional-tests.example.com`, `user@api.example.com`) are not tag hits
// while `@functional ` / `@api'` are.
const TAG_PATTERN =
  /@(smoke|sanity|regression|e2e|api|destructive|functional|P0|P1|P2|P3)(?!(?:[\w-]|\.\w))/g;

function countTags(text: string): number {
  return (text.match(TAG_PATTERN) ?? []).length;
}

const XPATH_AXIS =
  /(?:^|[\s(/"'`])(?:descendant|descendant-or-self|ancestor|ancestor-or-self|following|following-sibling|preceding|preceding-sibling|child|parent|self|attribute|namespace)::/;

function isXpathString(value: string): boolean {
  if (value.includes('xpath=')) return true;
  if (XPATH_AXIS.test(value)) return true;
  const trimmed = value.trimStart();
  return (
    trimmed.startsWith('//') ||
    trimmed.startsWith('(//') ||
    trimmed === '..' ||
    trimmed.startsWith('../')
  );
}

/** Dotted path of a (possibly nested) member callee, e.g. "test.describe.only". */
function describeCalleePath(callee: AstNode): string {
  if (callee.type === 'Identifier') return callee.name as string;
  if (callee.type === 'MemberExpression') {
    const object = callee.object as AstNode;
    const propertyName = memberPropertyName(callee) ?? '';
    return `${describeCalleePath(object)}.${propertyName}`;
  }
  return '';
}

/** True for `describe`, `test.describe`, `test.describe.only/serial/...` —
 *  but NOT for `describeScenario` or other names merely containing the word. */
function isDescribeCallee(callee: AstNode): boolean {
  const segments = describeCalleePath(callee).split('.');
  return segments.includes('describe');
}

/** True for a test-level call that carries tags: `test`, `test.only`,
 *  `test.skip`, `test.fixme` — but NOT `test.describe` or `test.step`. */
function isTestCallee(callee: AstNode): boolean {
  const segments = describeCalleePath(callee).split('.');
  return segments[0] === 'test' && !segments.includes('describe') && !segments.includes('step');
}

/** DFS a subtree for CallExpressions to `setTimeout` — bare identifier or the
 *  window/globalThis/global member form. Skips `parent` back-edges to avoid
 *  cycles. Returns the matching call nodes. */
function collectSetTimeoutCalls(node: AstNode): AstNode[] {
  const calls: AstNode[] = [];
  const visit = (n: unknown): void => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) {
      for (const c of n) visit(c);
      return;
    }
    const obj = n as AstNode;
    if (obj.type === 'CallExpression') {
      const callee = obj.callee as AstNode | undefined;
      const isBare = callee?.type === 'Identifier' && (callee.name as string) === 'setTimeout';
      const objectNode =
        callee?.type === 'MemberExpression' ? (callee.object as AstNode) : undefined;
      const isGlobalMember =
        callee?.type === 'MemberExpression' &&
        memberPropertyName(callee) === 'setTimeout' &&
        objectNode?.type === 'Identifier' &&
        ['window', 'globalThis', 'global'].includes(objectNode.name as string);
      if (isBare || isGlobalMember) calls.push(obj);
    }
    for (const key of Object.keys(obj)) {
      if (key === 'parent') continue;
      visit((obj as Record<string, unknown>)[key]);
    }
  };
  visit(node);
  return calls;
}

/** True when a subtree contains an Identifier reference with this name. */
function referencesIdentifier(node: AstNode, name: string): boolean {
  let found = false;
  const visit = (n: unknown): void => {
    if (found || !n || typeof n !== 'object') return;
    if (Array.isArray(n)) {
      for (const c of n) visit(c);
      return;
    }
    const obj = n as AstNode;
    if (obj.type === 'Identifier' && (obj.name as string) === name) {
      found = true;
      return;
    }
    for (const key of Object.keys(obj)) {
      if (key === 'parent') continue;
      visit((obj as Record<string, unknown>)[key]);
    }
  };
  visit(node);
  return found;
}

/** True when `new Promise(...)` is a hard-wait SLEEP: a setTimeout inside the
 *  executor schedules the executor's RESOLVE (first parameter). A watchdog
 *  that only calls reject — the Promise.race timeout pattern — is not a
 *  sleep. Unknown executor shapes stay flagged (conservative). */
function isPromiseSleep(node: AstNode): boolean {
  const calls = collectSetTimeoutCalls(node);
  if (calls.length === 0) return false;
  const executor = (node.arguments as AstNode[] | undefined)?.[0];
  if (
    executor &&
    (executor.type === 'ArrowFunctionExpression' || executor.type === 'FunctionExpression')
  ) {
    const first = (executor.params as AstNode[])[0];
    if (first?.type === 'Identifier') {
      const resolveName = first.name as string;
      return calls.some((c) => referencesIdentifier(c, resolveName));
    }
  }
  return true;
}

/** Count tags across a test's title and its `{ tag: ... }` option — the
 *  "exactly one tag" rule is violated when the SUM is >= 2, so a tag in the
 *  title plus one in the option (which each looked single in isolation) is
 *  caught. Returns the total tag count for a test-level call. */
function countTestTags(args: AstNode[]): number {
  let count = 0;
  const title = fullStringText(args[0]);
  if (title) count += countTags(title);
  for (const arg of args) {
    if (arg.type !== 'ObjectExpression') continue;
    for (const p of arg.properties as AstNode[]) {
      const key = p.key as AstNode | undefined;
      const keyName = key?.type === 'Identifier' ? key.name : undefined;
      if (keyName !== 'tag') continue;
      const value = p.value as AstNode;
      if (value.type === 'ArrayExpression') {
        for (const el of value.elements as AstNode[]) {
          const s = stringValue(el);
          count += s ? Math.max(countTags(s), 1) : 1;
        }
      } else {
        const s = stringValue(value);
        count += s ? Math.max(countTags(s), 1) : 0;
      }
    }
  }
  return count;
}

export const rules: Record<string, RuleModule> = {
  /** WON'T: No Hard Waits — waitForTimeout() (incl. computed member) and
   *  new Promise(... setTimeout ...) sleeps. eslint-plugin-playwright's
   *  no-wait-for-timeout only sees `page.waitForTimeout`; this rule also
   *  catches the computed-member form and the setTimeout-Promise sleep the
   *  hook checks, so the CI layer no longer under-covers hard waits. */
  'no-hard-wait': rule(
    'No hard waits — waitForTimeout() or new Promise(setTimeout) sleeps',
    (context) => ({
      CallExpression(node) {
        // memberPropertyName (via calleeName) resolves a.b AND a['b'].
        if (calleeName(node) === 'waitForTimeout') {
          context.report({
            node,
            message:
              '`waitForTimeout()` is a hard wait — use a web-first assertion, e.g. expect(locator).toBeVisible() (Constitution WON’T: No Hard Waits).',
          });
        }
      },
      NewExpression(node) {
        const callee = node.callee as AstNode;
        if (
          callee.type === 'Identifier' &&
          (callee.name as string) === 'Promise' &&
          isPromiseSleep(node)
        ) {
          context.report({
            node,
            message:
              'new Promise(… setTimeout(resolve) …) is a hard-wait sleep — use a web-first assertion instead (Constitution WON’T: No Hard Waits).',
          });
        }
      },
    })
  ),

  /** WON'T: No Manual Instantiation — new XxxPage()/XxxComponent() in specs. */
  'no-manual-instantiation': rule(
    'Page objects come from fixtures, never new PageObject() in tests',
    (context) => {
      // Locals whose IMPORTED name is a page object, even if aliased:
      // `import { LoginPage as LP } ...; new LP(page)`.
      const pageLocals = new Set<string>();
      return {
        ImportDeclaration(node) {
          for (const s of node.specifiers as AstNode[]) {
            if (s.type !== 'ImportSpecifier') continue;
            const imported = s.imported as AstNode;
            const name = imported.type === 'Identifier' ? (imported.name as string) : undefined;
            if (name && /(Page|Component)$/.test(name)) {
              pageLocals.add((s.local as AstNode).name as string);
            }
          }
        },
        NewExpression(node) {
          const callee = node.callee as AstNode;
          let name: string | undefined;
          if (callee.type === 'Identifier') {
            name = callee.name as string;
          } else if (callee.type === 'MemberExpression') {
            // `new pages.LoginPage(page)`
            name = memberPropertyName(callee);
          }
          if (!name) return;
          const looksLikePom = /(Page|Component)$/.test(name) && /^[A-Z]/.test(name);
          if (looksLikePom || pageLocals.has(name)) {
            context.report({
              node,
              message: `Never instantiate ${name} manually in a test — inject it via the fixtures from fixtures/pom/test-options.ts (Constitution MUST: Dependency Injection).`,
            });
          }
        },
      };
    }
  ),

  /** WON'T: No XPath — xpath= / axes / '//...' in locator-taking calls,
   *  including the deprecated page.click/fill/waitForSelector selector-string
   *  APIs. The deprecated set is checked only when called on `page` (e.g.
   *  `page.click(...)`, `this.page.fill(...)`) — on a locator these methods
   *  take a VALUE, not a selector, and would false-positive. */
  'no-xpath': rule('XPath selectors are forbidden', (context) => ({
    CallExpression(node) {
      const name = calleeName(node);
      if (name === undefined) return;
      const alwaysSelector = ['locator', 'frameLocator', '$', '$$'];
      const pageSelector = [
        'click',
        'dblclick',
        'fill',
        'check',
        'uncheck',
        'hover',
        'tap',
        'type',
        'selectOption',
        'waitForSelector',
        'dispatchEvent',
        'setChecked',
        'setInputFiles',
        'press',
      ];
      let selectorTaking = alwaysSelector.includes(name);
      if (!selectorTaking && pageSelector.includes(name)) {
        const callee = node.callee as AstNode;
        if (callee.type === 'MemberExpression') {
          const object = callee.object as AstNode;
          const objectName =
            object.type === 'Identifier'
              ? (object.name as string)
              : object.type === 'MemberExpression'
                ? memberPropertyName(object)
                : undefined;
          selectorTaking = objectName === 'page';
        }
      }
      if (!selectorTaking) return;
      const args = node.arguments as AstNode[];
      const value = fullStringText(args[0]);
      if (value === undefined) return;
      if (isXpathString(value)) {
        context.report({
          node: args[0],
          message:
            'XPath selector detected. Use getByRole > getByLabel > getByPlaceholder > getByText > getByTestId (Constitution WON’T: No XPath).',
        });
      }
    },
  })),

  /** MUST: Sources of Truth — no page.goto('https://...'). */
  'no-hardcoded-goto-url': rule('goto() must not receive a URL literal', (context) => ({
    CallExpression(node) {
      if (calleeName(node) !== 'goto') return;
      const args = node.arguments as AstNode[];
      const value = stringValue(args[0]);
      if (value && /^https?:\/\//i.test(value)) {
        context.report({
          node: args[0],
          message:
            'Hardcoded URL in goto() — navigate with process.env.QA_BASE_URL + a route constant (Constitution MUST: Sources of Truth).',
        });
      }
    },
  })),

  /** MUST: Sources of Truth — no url/baseUrl/baseURL/apiUrl: 'https://...'. */
  'no-hardcoded-url-prop': rule(
    'url/baseUrl/baseURL/apiUrl properties must come from env/config',
    (context) => ({
      Property(node) {
        const key = node.key as AstNode;
        const keyName =
          key.type === 'Identifier'
            ? (key.name as string)
            : key.type === 'Literal'
              ? String(key.value)
              : undefined;
        if (!keyName || !['url', 'baseUrl', 'baseURL', 'apiUrl'].includes(keyName)) {
          return;
        }
        const value = stringValue(node.value as AstNode);
        if (value && /^https?:\/\//i.test(value)) {
          context.report({
            node: node.value as AstNode,
            message: `Hardcoded URL in \`${keyName}\` — base URLs come from process.env.QA_BASE_URL / process.env.QA_API_URL (declared in .env.example) (Constitution MUST: Sources of Truth).`,
          });
        }
      },
    })
  ),

  /** MUST: Imports — specs import test/expect from test-options, not @playwright/test. */
  'no-playwright-test-import': rule(
    'Spec files must import test/expect from fixtures/pom/test-options.ts',
    (context) => ({
      ImportDeclaration(node) {
        const source = node.source as AstNode;
        if (source.value !== '@playwright/test') return;
        if (node.importKind === 'type') return;
        const specifiers = node.specifiers as AstNode[];
        const offending = specifiers.some((s) => {
          // Namespace/default imports expose test/expect wholesale.
          if (s.type === 'ImportNamespaceSpecifier' || s.type === 'ImportDefaultSpecifier') {
            return true;
          }
          if (s.type !== 'ImportSpecifier') return false;
          if (s.importKind === 'type') return false;
          const imported = s.imported as AstNode;
          return (
            imported.type === 'Identifier' && ['test', 'expect'].includes(imported.name as string)
          );
        });
        if (offending) {
          context.report({
            node,
            message:
              'Import test/expect from fixtures/pom/test-options.ts, never from @playwright/test in spec/setup files (Constitution MUST: Imports).',
          });
        }
      },
    })
  ),

  /** WON'T: No Tags on Describe — title tags AND the { tag: ... } options API. */
  'no-tags-on-describe': rule(
    'Tags belong on individual tests, never on test.describe()',
    (context) => ({
      CallExpression(node) {
        const callee = node.callee as AstNode;
        if (!isDescribeCallee(callee)) return;
        const args = node.arguments as AstNode[];
        const title = fullStringText(args[0]);
        if (title && countTags(title) > 0) {
          context.report({
            node: args[0],
            message:
              'Tag found in a describe() title — tags go on individual tests only (Constitution WON’T: No Tags on Describe).',
          });
        }
        // Playwright's official tag API: test.describe('t', { tag: '@x' }, fn)
        for (const arg of args) {
          if (arg.type !== 'ObjectExpression') continue;
          for (const p of arg.properties as AstNode[]) {
            const key = p.key as AstNode | undefined;
            if (key?.type === 'Identifier' && key.name === 'tag') {
              context.report({
                node: p,
                message:
                  '`tag` option on describe() — tags go on individual tests only (Constitution WON’T: No Tags on Describe).',
              });
            }
          }
        }
      },
    })
  ),

  /** WON'T: No Multiple Tags — @functional is forbidden everywhere. */
  'no-functional-tag': rule('The @functional tag is forbidden', (context) => ({
    Literal(node) {
      if (typeof node.value === 'string' && /@functional(?![\w-])/.test(node.value)) {
        context.report({
          node,
          message:
            'The @functional tag is forbidden — use exactly one of @P0, @P1, @P2, @P3, or @destructive (Constitution WON’T: No Multiple Tags; see the qa-automation skill, tag-taxonomy reference).',
        });
      }
    },
    TemplateLiteral(node) {
      const quasis = node.quasis as AstNode[];
      const hasTag = quasis.some((q) => {
        const cooked = (q.value as { cooked?: string }).cooked;
        return cooked !== undefined && /@functional(?![\w-])/.test(cooked);
      });
      if (hasTag) {
        context.report({
          node,
          message:
            'The @functional tag is forbidden — use exactly one of @P0, @P1, @P2, @P3, or @destructive (Constitution WON’T: No Multiple Tags; see the qa-automation skill, tag-taxonomy reference).',
        });
      }
    },
  })),

  /** WON'T: No Multiple Tags — a test carries exactly ONE tag, counted
   *  across the title AND the { tag: ... } option together, so a tag split
   *  one-in-title-one-in-option (each single in isolation) is still caught.
   *  Scoped to test-level calls, so a two-tag string in unrelated UI content
   *  is no longer a false positive. */
  'no-multiple-tags': rule(
    'Each test has exactly one tag — counted across the title and the tag option',
    (context) => ({
      CallExpression(node) {
        const callee = node.callee as AstNode;
        if (!isTestCallee(callee)) return;
        if (countTestTags(node.arguments as AstNode[]) >= 2) {
          context.report({
            node,
            message:
              'Multiple tags on one test — each test has exactly ONE tag: @P0, @P1, @P2, @P3, or @destructive (@destructive always wins for shared/global state); counted across the title and the `tag` option (Constitution WON’T: No Multiple Tags; see the qa-automation skill, tag-taxonomy reference).',
          });
        }
      },
    })
  ),

  /** Data Strategy: static data files are literals-only. */
  'static-data-literals-only': rule(
    'test-data/static files may only export literal values',
    (context) => ({
      ImportDeclaration(node) {
        if (node.importKind === 'type') return;
        const specifiers = node.specifiers as AstNode[];
        const allType =
          specifiers.length > 0 &&
          specifiers.every((s) => s.type === 'ImportSpecifier' && s.importKind === 'type');
        if (allType) return;
        context.report({
          node,
          message:
            'Runtime import in a static-data file — test-data/static/** may only export literal values (`as const`); dynamic data belongs in test-data/factories/ (data-strategy reference, three-tier rule). `import type` is fine.',
        });
      },
      CallExpression(node) {
        context.report({
          node,
          message:
            'Runtime call in a static-data file (Date.now(), Math.random(), faker, string builders…) — static data is literals-only; dynamic data belongs in test-data/factories/ (data-strategy reference, three-tier rule).',
        });
      },
      NewExpression(node) {
        context.report({
          node,
          message:
            'Runtime constructor call in a static-data file — static data is literals-only; dynamic data belongs in test-data/factories/ (data-strategy reference, three-tier rule).',
        });
      },
      TaggedTemplateExpression(node) {
        context.report({
          node,
          message:
            'Tagged template in a static-data file (String.raw`…`, …) — static data is literals-only; dynamic data belongs in test-data/factories/ (data-strategy reference, three-tier rule).',
        });
      },
    })
  ),
};

const plugin = { rules };
export default plugin;
