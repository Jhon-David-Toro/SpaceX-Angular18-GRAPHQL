import type { ResourceRef } from '@angular/core';
import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import type { DocumentNode, OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Kind } from 'graphql';
import { map } from 'rxjs';

export interface QueryResourceOptions<TData, TVariables extends OperationVariables, TResult> {
  /** Reactive variables. Returning `undefined` keeps the resource idle. */
  readonly variables?: () => TVariables | undefined;
  /** Maps the raw GraphQL payload into a domain model. */
  readonly select: (data: TData) => TResult;
}

/** Raised when the API answers without data (e.g. the entity does not exist). */
export class EmptyResponseError extends Error {
  constructor(operation: string) {
    super(`La operación ${operation} no devolvió datos.`);
    this.name = 'EmptyResponseError';
  }
}

function operationName(document: DocumentNode): string {
  const definition = document.definitions[0];
  return definition?.kind === Kind.OPERATION_DEFINITION
    ? (definition.name?.value ?? 'anónima')
    : 'anónima';
}

/**
 * Bridges Apollo with Angular's signal-based `resource` API: status, value and error are signals,
 * and changing `variables` cancels the in-flight request automatically.
 * Must be called in an injection context.
 */
export function queryResource<TData, TVariables extends OperationVariables, TResult>(
  document: TypedDocumentNode<TData, TVariables>,
  options: QueryResourceOptions<TData, TVariables, TResult>,
): ResourceRef<TResult | undefined> {
  const apollo = inject(Apollo);
  const name = operationName(document);
  const variables = options.variables ?? (() => ({}) as TVariables);

  return rxResource({
    params: variables,
    stream: ({ params }) =>
      apollo.query<TData, TVariables>({ query: document, variables: params }).pipe(
        map(({ data }) => {
          if (data === undefined) {
            throw new EmptyResponseError(name);
          }
          return options.select(data);
        }),
      ),
  });
}

/** Use inside `select` to turn a missing entity into a "not found" error state. */
export function required<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) {
    throw new EmptyResponseError(what);
  }
  return value;
}
