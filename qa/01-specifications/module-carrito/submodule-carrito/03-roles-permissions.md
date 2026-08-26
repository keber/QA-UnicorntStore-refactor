# Roles and Permissions — Carrito de compras (offcanvas)

## Access Matrix

| Feature / Action | Visitante (único "rol") |
|-------------------|:---:|
| Abrir/cerrar el carrito | ✅ |
| Modificar cantidades | ✅ |
| Eliminar un ítem | ✅ |
| Vaciar el carrito | ✅ |
| Finalizar compra (simulado) | ✅ |

## Test User Reference

No aplica. Mismo motivo que en CAT: la aplicación no tiene login, registro ni roles. Ver
`qa/memory/arquitectura-unicornstore-2026-08-26.md`.

**Notes**: El carrito no está ligado a ninguna cuenta de usuario — es puramente
`localStorage` del navegador, por lo que "el carrito de un visitante" no persiste entre
dispositivos ni navegadores distintos.
