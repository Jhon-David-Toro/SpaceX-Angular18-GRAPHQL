import type { ResourceRef } from '@angular/core';
import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import type { DocumentNode, OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Kind } from 'graphql';
import { map } from 'rxjs';

/**
 * Configuration options for creating a query resource.
 *
 * @template TData - Raw GraphQL response data type
 * @template TVariables - GraphQL query variables type
 * @template TResult - Transformed domain model type
 */
export interface QueryResourceOptions<TData, TVariables extends OperationVariables, TResult> {
  /**
   * Optional reactive variables function.
   * Returning `undefined` keeps the resource idle (won't execute the query).
   */
  readonly variables?: () => TVariables | undefined;
  /**
   * Transforms raw GraphQL payload into a domain model.
   * Called with the response data when the query succeeds.
   */
  readonly select: (data: TData) => TResult;
}

/**
 * Error thrown when the GraphQL API returns a successful response without data.
 * This typically indicates the requested entity does not exist.
 */
export class EmptyResponseError extends Error {
  constructor(operation: string) {
    super(`La operación ${operation} no devolvió datos.`);
    this.name = 'EmptyResponseError';
  }
}

/**
 * Extracts the operation name from a GraphQL document for error messages.
 *
 * @param document - GraphQL document node
 * @returns Operation name or 'anónima' if not found
 */
function operationName(document: DocumentNode): string {
  const definition = document.definitions[0];
  return definition?.kind === Kind.OPERATION_DEFINITION
    ? (definition.name?.value ?? 'anónima')
    : 'anónima';
}

/**
 * Bridges Apollo Client with Angular's signal-based resource API.
 *
 * Creates a resource where status, value, and error are reactive signals.
 * Changing variables automatically cancels in-flight requests and triggers a new query.
 * Integrates with Apollo's cache, so identical queries return cached data instantly.
 *
 * **Usage:**
 * ```typescript
 * const resource = queryResource(LaunchesDocument, {
 *   select: toLaunchArchive
 * });
 * // Access: resource.status(), resource.value(), resource.error(), resource.hasValue()
 * ```
 *
 * @template TData - Raw GraphQL response data type
 * @template TVariables - GraphQL query variables type
 * @template TResult - Transformed domain model type
 * @param document - TypedDocumentNode for the GraphQL query
 * @param options - Configuration with select transformer and optional variables
 * @returns ResourceRef with reactive status, value, and error signals
 * @throws EmptyResponseError if the API returns success without data
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

/**
 * Utility for use inside `select` to turn a missing entity into an error state.
 * Throws EmptyResponseError if the value is null or undefined, otherwise returns it.
 *
 * **Example:**
 * ```typescript
 * queryResource(LaunchDetailDocument, {
 *   variables: () => ({ id: launchId() }),
 *   select: (data) => required(toLaunchDetail(data), 'launch detail')
 * })
 * ```
 *
 * @template T - Type of the required value
 * @param value - Value to check
 * @param what - Description for the error message (e.g., 'launch detail')
 * @returns The value if not null/undefined
 * @throws EmptyResponseError if value is null or undefined
 */
export function required<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) {
    throw new EmptyResponseError(what);
  }
  return value;
}
