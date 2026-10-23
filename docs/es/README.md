# Electron Release Template

Plantilla mínima y ejecutable de Electron con GitHub Actions para generar instaladores de escritorio. Podés crear un repositorio desde **Use this template**, reemplazar la app de ejemplo y conservar el pipeline de releases.

[README en inglés](../../README.md) · [Cobertura Linux](../compatibility.md) · [Guía de publicación](../releasing.md) · [Contribuir](../../CONTRIBUTING.md)

## Qué genera

| Sistema | Arquitecturas | Archivos |
| --- | --- | --- |
| Windows | x64, ARM64 | Instalador `.exe` (NSIS) |
| macOS | Intel x64, Apple Silicon ARM64 | `.dmg` |
| Linux | x64, ARM64 | `.AppImage`, `.deb`, `.rpm`, `.pacman` |

Los paquetes Linux se construyen en Ubuntu. Eso no demuestra que funcionen en todas las distribuciones. Probá los formatos en los sistemas que vayas a declarar compatibles. AppImage cubre muchos casos, pero no garantiza compatibilidad universal. La [tabla de cobertura](../compatibility.md) separa formato generado de validación real.

## Empezar

1. Activá **Settings → General → Template repository** en GitHub y creá un repositorio con **Use this template**.
2. Instalá Node.js 24 y ejecutá `npm ci` y `npm start`.
3. Reemplazá `src/` con tu aplicación.
4. Cambiá los datos de ejemplo en `package.json` (`name`, `desktopName`, autor, correo, URL, repositorio y versión) y en `electron-builder.yml` (`appId`, `productName` y targets). Agregá íconos propios en `build/` antes de publicar.
5. Corré `npm run lint`, `npm test` y `npm run pack`. Con `npm run dist` generás instaladores para tu sistema y arquitectura actuales.
6. Configurá firma de código para distribución de producción y seguí la [guía de publicación](../releasing.md).

El correo `maintainers@example.com` y la URL `github.com/your-org` son valores de ejemplo. Si el proyecto pertenece a tu empresa, revisá también quién debe figurar como titular del copyright y qué licencia autoriza publicar.

## Crear un release

```bash
npm version 0.1.1
git push origin main --follow-tags
```

El tag tiene que coincidir con la versión de `package.json`, con prefijo `v`. El workflow construye los instaladores y los carga en un **GitHub Release en borrador**. Revisalo antes de publicarlo. Si ya está publicado, el workflow no lo sobrescribe.

## Adaptar otro proyecto con un agente

Esta plantilla incluye la [skill `electron-cross-platform`](../../skills/electron-cross-platform/SKILL.md). Podés pasarle ese archivo a tu agente o copiar la carpeta `skills/electron-cross-platform` al directorio de skills de Codex y mencionarla como `$electron-cross-platform`.

```bash
mkdir -p ~/.codex/skills
cp -R skills/electron-cross-platform ~/.codex/skills/
```

Prompt de ejemplo:

> Usá `$electron-cross-platform` para adaptar este proyecto Electron a Windows, macOS y las familias Linux que necesitamos. Conservá la app y su stack actual. Agregá los formatos requeridos y documentá qué distribuciones probaste de verdad.

## Alcance

La plantilla resuelve empaquetado y publicación como borrador. No trae actualización automática: esa función necesita `electron-updater`, archivos de metadatos y una estrategia de publicación propia. Los builds pueden salir sin firma; macOS y Windows mostrarán advertencias o restricciones a usuarios finales. La [guía de publicación](../releasing.md) detalla los pasos pendientes.
