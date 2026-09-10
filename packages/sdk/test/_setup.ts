// Tests must inject fetch or explicitly replace it with a local mock.
globalThis.fetch = (() => {
  throw new Error('SDK tests are offline: inject a mock fetch instead of making a network request');
}) as unknown as typeof fetch;
