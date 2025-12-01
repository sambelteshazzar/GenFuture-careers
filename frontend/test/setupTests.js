import '@testing-library/jest-dom'

// polyfill IntersectionObserver for framer-motion viewport/in-view features
if (typeof globalThis.IntersectionObserver === 'undefined') {
    class IntersectionObserverMock {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    globalThis.IntersectionObserver = IntersectionObserverMock
}