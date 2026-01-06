import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Toaster, toaster } from '../../../components/ui/toaster'

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

jest.mock('@chakra-ui/react', () => {
    const actual = jest.requireActual('@chakra-ui/react')
    return {
        ...actual,
        Toaster: ({ children }) => (
            <div data-testid="chakra-toaster-mock">
                {children({
                    id: '1',
                    title: 'Test Success',
                    description: 'This is a test toast',
                    type: 'success',
                })}
            </div>
        ),
        Toast: {
            Root: ({ children }) => <div data-testid="toast-root">{children}</div>,
            Title: ({ children }) => <div data-testid="toast-title">{children}</div>,
            Description: ({ children }) => <div data-testid="toast-description">{children}</div>,
            ActionTrigger: ({ children }) => <button>{children}</button>,
            CloseTrigger: () => <button>Close</button>,
            Indicator: () => <div>Indicator</div>,
        },
        ToastTitle: ({ children }) => <div data-testid="toast-title">{children}</div>,
        ToastDescription: ({ children }) => <div data-testid="toast-description">{children}</div>,
    }
})

describe('Toaster Component', () => {
    test('renders and shows a success toast', async () => {
        render(
            <ChakraProvider value={defaultSystem}>
                <Toaster />
            </ChakraProvider>
        )
        expect(screen.getByText('Test Success')).toBeInTheDocument()
        expect(screen.getByText('This is a test toast')).toBeInTheDocument()
    })
})
