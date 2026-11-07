import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * GraphQL code generation → fully typed `TypedDocumentNode`s, no `any`.
 * - Local (default): validates operations against the versioned snapshot `schema/spacex.graphql`.
 * - Remote: `npm run codegen:remote` validates them against the live API.
 */
const config: CodegenConfig = {
  schema: process.env['GRAPHQL_SCHEMA'] ?? 'schema/spacex.graphql',
  documents: ['src/app/**/*.graphql'],
  generates: {
    'src/app/core/graphql/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        strictScalars: true,
        scalars: { Date: 'string' },
        enumsAsTypes: true,
        useTypeImports: true,
        skipTypename: true,
        onlyOperationTypes: true,
        dedupeFragments: true,
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
