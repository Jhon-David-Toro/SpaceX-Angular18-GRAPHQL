# Archivo SpaceX

Archivo interactivo de las misiones de SpaceX entre 2006 y 2022, construido con **Angular 22** y
**GraphQL**. Cada lanzamiento se puede buscar, filtrar, compartir por URL y explorar en detalle.

> Los datos vienen de la [SpaceX API comunitaria](https://github.com/r-spacex/SpaceX-API), que dejó
> de actualizarse en 2022. Por eso el sitio se presenta como un archivo histórico y no como un
> seguimiento en vivo.

## Qué incluye

| Sección          | Qué hace                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Inicio**       | Gráfico de cadencia: cada línea es un lanzamiento, su altura es la masa de carga útil. Se recorre con el ratón o con las flechas del teclado (es un `slider` accesible). |
| **Lanzamientos** | Búsqueda sin acentos ni mayúsculas, filtros por año, cohete y resultado. Los filtros viven en la URL, así que cualquier búsqueda se puede compartir.                     |
| **Misión**       | Vídeo con carga diferida, núcleos y aterrizajes, cargas útiles con su órbita, galería y navegación a la misión anterior y siguiente.                                     |
| **Cohetes**      | Siluetas a escala real junto a la Estatua de la Libertad, ficha técnica y capacidad de carga comparada por destino.                                                      |
| **Flota**        | Barcos de recuperación filtrables por función y estado.                                                                                                                  |
| **Roadster**     | La órbita solar del Tesla de Starman dibujada a partir de sus elementos orbitales.                                                                                       |
| **Hitos**        | Línea de tiempo con los momentos clave de la compañía.                                                                                                                   |

Además:

- **Paleta de comandos** (`Ctrl/⌘ K` o `/`) para saltar a cualquier misión o sección.
- **Unidades métricas o imperiales** y **tema claro, oscuro o del sistema**, guardados por visitante.
- **WebMCP** (experimental en Angular 22): el archivo expone las herramientas `search_launches` y
  `open_launch` a agentes de IA del navegador que soporten `navigator.modelContext`.

## Stack y decisiones

- **Angular 22**: componentes standalone, `OnPush` por defecto, **zoneless**, control de flujo
  nativo (`@if`, `@for`, `@defer`), `input()`/`output()`, `linkedSignal`, `debounced`, servicios con
  `@Service()` y rutas cargadas de forma diferida.
- **Signal Forms** (`@angular/forms/signals`) para todos los formularios.
- **`@angular/aria`** para pestañas accesibles (comportamiento y ARIA; el estilo es propio).
- **Apollo Angular 14 + Apollo Client 4** con caché normalizada. El helper
  [`queryResource`](src/app/core/graphql/query-resource.ts) convierte cualquier consulta en un
  `resource` de signals (`status`, `value`, `error`, `reload`) y cancela la petición si cambian las
  variables.
- **GraphQL Code Generator** genera `TypedDocumentNode`s a partir de los archivos `.graphql`
  colocados junto a cada feature. Los datos crudos (todo `nullable`) pasan por mapeadores puros a
  modelos de dominio limpios antes de llegar a la vista.
- **SCSS** con tokens propios (`light-dark()`, escala tipográfica, espaciado y radios por
  jerarquía). Sin frameworks de CSS.
- **TypeScript estricto** con `noUncheckedIndexedAccess` y **cero `any`**, garantizado por ESLint
  (`strictTypeChecked` + `no-explicit-any` + `no-unsafe-*`) también en las plantillas.
- **Accesibilidad**: WCAG AA, enlace para saltar al contenido, foco visible, landmarks, resultados
  anunciados con `aria-live`, estados que no dependen solo del color y `prefers-reduced-motion`.
  Todas las páginas pasan axe sin incidencias en ambos temas.

## Estructura

```
src/app
├── core/                 # Infraestructura transversal
│   ├── graphql/          # Apollo, queryResource y tipos generados
│   ├── layout/           # Cabecera y pie
│   ├── command-palette/  # Ctrl/⌘ K
│   ├── preferences/      # Unidades y tema
│   ├── seo/              # Estrategia de títulos
│   └── web-mcp/          # Herramientas para agentes de IA
├── features/             # Una carpeta por sección, con data/ (queries + modelos) y ui/
└── shared/               # Formato de unidades, componentes y utilidades puras
```

## Scripts

| Comando                  | Descripción                                              |
| ------------------------ | -------------------------------------------------------- |
| `npm start`              | Servidor de desarrollo en `http://localhost:4200`        |
| `npm run build`          | Build de producción en `dist/spacex`                     |
| `npm test`               | Tests unitarios con Vitest                               |
| `npm run test:ci`        | Tests una sola vez, con cobertura                        |
| `npm run lint`           | ESLint para TypeScript y plantillas                      |
| `npm run typecheck`      | Verificación de tipos de app y tests                     |
| `npm run format`         | Prettier                                                 |
| `npm run codegen`        | Regenera los tipos GraphQL desde `schema/spacex.graphql` |
| `npm run codegen:remote` | Valida las consultas contra la API en vivo               |

## Convenciones

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/) con un máximo de 100
caracteres por línea. Husky ejecuta commitlint en cada commit, y lint más Prettier antes de cada
uno.

## Despliegue

`.github/workflows/ci.yml` valida cada pull request (tipos generados al día, formato, lint, tipos,
tests y build). `.github/workflows/deploy.yml` publica en GitHub Pages cada push a `master`; activa
Pages en **Settings → Pages → Source: GitHub Actions**.
