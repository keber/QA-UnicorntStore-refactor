import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import playwright from 'eslint-plugin-playwright';
// NodeNext resolution maps the .mjs specifier to the .mts source file.
import scaffold from './eslint-rules/scaffold-plugin.mjs';

/**
 * Prettier configuration for consistent code formatting.
 * Mirrors .prettierrc (tabWidth 2 - matches this project's existing e2e
 * files, e.g. the retired global-setup.ts).
 */
const prettierConfig = {
  semi: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'preserve',
};

/**
 * Extract recommended rules from plugins with proper typing.
 * Plugin config objects are typed loosely; we narrow to a rules record.
 */
type PluginConfig = { rules?: Record<string, unknown> };

const tsRecommendedRules = (tseslint.configs?.recommended as PluginConfig)?.rules ?? {};

const playwrightRecommendedRules =
  (playwright.configs?.['flat/recommended'] as PluginConfig)?.rules ?? {};

/**
 * ESLint flat configuration for this project's e2e automation
 * (qa/07-automation/e2e). Uses TypeScript, Prettier, and Playwright plugins
 * for comprehensive linting. Adopted from
 * `Playwright-Scaffold-AI-Assisted-Development` - see
 * `FRAMEWORK-FIXES-qa-framework*.md`, reviewed earlier in this project's
 * setup and no longer present in the repo, for the original provenance.
 */
const config = [
  {
    ignores: ['node_modules', 'dist', 'playwright-report', 'test-results', 'diagnosis'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      playwright,
    },
    rules: {
      ...tsRecommendedRules,
      ...playwrightRecommendedRules,

      // Prettier integration
      'prettier/prettier': ['error', prettierConfig],

      // TypeScript strict rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-floating-promises': 'error',

      // General JavaScript rules
      'no-console': 'error',
      'prefer-const': 'error',

      // Playwright-specific rules - Constitution enforcement
      'playwright/missing-playwright-await': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-useless-await': 'error',
      // OFF, deliberately: PENDING-CODE is the sanctioned pattern for
      // documented-but-not-yet-automatable TCs (see qa-test-stabilization
      // skill, Step 5) - this rule at error/warn would fail CI on
      // exactly that. Unjustified skips are a review-time finding, not
      // a lint error.
      'playwright/no-skipped-test': 'off',

      // Additional Playwright rules for Constitution compliance
      'playwright/no-wait-for-timeout': 'error', // WON'T: No Hard Waits
      'playwright/no-force-option': 'warn', // Prefer natural interactions
      'playwright/prefer-web-first-assertions': 'error', // MUST: Web-first assertions
      'playwright/no-raw-locators': 'warn', // MUST: Prefer semantic locators
      'playwright/no-useless-not': 'error', // Clean assertions
      'playwright/no-nth-methods': 'warn', // Avoid brittle nth selectors
      'playwright/prefer-lowercase-title': 'warn', // Consistent test naming
      'playwright/prefer-to-be': 'error', // Use toBe over toEqual for primitives
      'playwright/prefer-to-have-length': 'error', // Cleaner length assertions
      'playwright/require-top-level-describe': 'error', // Organized test structure
      'playwright/expect-expect': 'error', // Tests must have assertions
      'playwright/no-conditional-in-test': 'warn', // Avoid flaky conditionals
      'playwright/no-eval': 'error', // Security: no eval in tests
      'playwright/valid-expect': 'error', // Valid expect usage
      'playwright/no-focused-test': 'error', // No test.only in commits
      'playwright/no-standalone-expect': 'error', // Expect must be in test
    },
  },

  // ------------------------------------------------------------------
  // Constitution enforcement — AST layer (local plugin, path-scoped).
  // Mirrors the mechanical rules the PreToolUse hook checks with regexes
  // (.claude/scripts/enforce_constitution.py at the repo root); AST
  // matching survives formatting/aliasing and gates human commits, not
  // just agent writes.
  // ------------------------------------------------------------------
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { scaffold },
  },
  {
    // Hard waits are forbidden everywhere (matches the hook's all-.ts
    // scope): waitForTimeout() incl. computed member, and the
    // new Promise(setTimeout) sleep that the playwright rule cannot see.
    files: ['**/*.ts', '**/*.tsx'],
    rules: { 'scaffold/no-hard-wait': 'error' },
  },
  {
    // Spec/setup files: DI, imports, tagging.
    files: ['tests/**/*.spec.ts', 'tests/**/*.setup.ts'],
    rules: {
      'scaffold/no-manual-instantiation': 'error',
      'scaffold/no-playwright-test-import': 'error',
      'scaffold/no-tags-on-describe': 'error',
      'scaffold/no-functional-tag': 'error',
      'scaffold/no-multiple-tags': 'error',
    },
  },
  {
    // UI + test code: no XPath. `page-objects/` matches this project's
    // POM location (see the qa-automation skill), not the scaffold's
    // original `pages/`.
    files: ['page-objects/**/*.ts', 'tests/**/*.ts'],
    rules: { 'scaffold/no-xpath': 'error' },
  },
  {
    // Anywhere URLs can leak in: env vars are the source of truth.
    // fixtures/page-objects carry auth bootstrap and env plumbing - a
    // literal https:// origin there is the same violation as in a test.
    // playwright.config.ts is the single most likely home of a
    // hardcoded `baseURL:`, so it is scoped in too.
    files: ['tests/**/*.ts', 'page-objects/**/*.ts', 'fixtures/**/*.ts', 'playwright.config.ts'],
    rules: {
      'scaffold/no-hardcoded-goto-url': 'error',
      'scaffold/no-hardcoded-url-prop': 'error',
    },
  },
  {
    // Static test data: literals only (three-tier rule).
    files: ['test-data/static/**/*.ts'],
    rules: { 'scaffold/static-data-literals-only': 'error' },
  },
];

export default config;
