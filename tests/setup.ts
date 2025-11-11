import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {
    // no-op
  }

  unobserve() {
    // no-op
  }

  disconnect() {
    // no-op
  }
}

(
  globalThis as unknown as { ResizeObserver: typeof ResizeObserver }
).ResizeObserver = ResizeObserver;
