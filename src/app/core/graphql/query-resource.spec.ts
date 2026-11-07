import {
  ApplicationRef,
  Injector,
  importProvidersFrom,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { LaunchDetailDocument, RoadsterDocument } from './generated/graphql';
import { EmptyResponseError, queryResource, required } from './query-resource';

describe('queryResource', () => {
  let controller: ApolloTestingController;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [importProvidersFrom(ApolloTestingModule)] });
    controller = TestBed.inject(ApolloTestingController);
    injector = TestBed.inject(Injector);
  });

  afterEach(() => {
    controller.verify();
  });

  const settle = () => TestBed.inject(ApplicationRef).whenStable();

  it('exposes Apollo data as a signal, mapped through `select`', async () => {
    const resource = runInInjectionContext(injector, () =>
      queryResource(RoadsterDocument, { select: (d) => d.roadster?.name ?? null }),
    );
    TestBed.tick();
    expect(resource.isLoading()).toBe(true);

    controller
      .expectOne(RoadsterDocument)
      .flush({ data: { roadster: { name: "Elon Musk's Tesla Roadster" } } });
    await settle();

    expect(resource.status()).toBe('resolved');
    expect(resource.value()).toBe("Elon Musk's Tesla Roadster");
  });

  it('refetches when the variables change', async () => {
    const id = signal('1');
    const resource = runInInjectionContext(injector, () =>
      queryResource(LaunchDetailDocument, {
        variables: () => ({ id: id() }),
        select: (d) => d.launch?.id ?? null,
      }),
    );
    TestBed.tick();
    const first = controller.expectOne(LaunchDetailDocument);
    expect(first.operation.variables).toEqual({ id: '1' });
    first.flush({ data: { launch: null } });
    await settle();

    id.set('2');
    TestBed.tick();
    const second = controller.expectOne(LaunchDetailDocument);
    expect(second.operation.variables).toEqual({ id: '2' });
    second.flush({ data: { launch: null } });
    await settle();
    expect(resource.status()).toBe('resolved');
  });

  it('turns a missing entity into an EmptyResponseError', async () => {
    const resource = runInInjectionContext(injector, () =>
      queryResource(RoadsterDocument, { select: (d) => required(d.roadster, 'Roadster') }),
    );
    TestBed.tick();
    controller.expectOne(RoadsterDocument).flush({ data: { roadster: null } });
    await settle();

    expect(resource.status()).toBe('error');
    expect(resource.error()).toBeInstanceOf(EmptyResponseError);
  });

  it('surfaces network failures as an error state', async () => {
    const resource = runInInjectionContext(injector, () =>
      queryResource(RoadsterDocument, { select: (d) => d.roadster }),
    );
    TestBed.tick();
    controller.expectOne(RoadsterDocument).networkError(new Error('offline'));
    await settle();

    expect(resource.status()).toBe('error');
  });
});
