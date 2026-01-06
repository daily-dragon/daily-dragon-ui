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

    test('renders a loading toast with spinner', async () => {
        const mockToaster = jest.requireMock('@chakra-ui/react').Toaster
        const originalImplementation = mockToaster
        
        jest.requireMock('@chakra-ui/react').Toaster = ({ children }) => (
            <div data-testid="chakra-toaster-mock">
                {children({
                    id: '2',
                    title: 'Loading...',
                    type: 'loading',
                })}
            </div>
        )

        render(
            <ChakraProvider value={defaultSystem}>
                <Toaster />
            </ChakraProvider>
        )
        
        expect(screen.getByText('Loading...')).toBeInTheDocument()
        
        jest.requireMock('@chakra-ui/react').Toaster = originalImplementation
    })

    test('renders a toast with action button', async () => {
        const mockToaster = jest.requireMock('@chakra-ui/react').Toaster
        const originalImplementation = mockToaster
        
        jest.requireMock('@chakra-ui/react').Toaster = ({ children }) => (
            <div data-testid="chakra-toaster-mock">
                {children({
                    id: '3',
                    title: 'Action Toast',
                    type: 'info',
                    action: { label: 'Undo' },
                })}
            </div>
        )

        render(
            <ChakraProvider value={defaultSystem}>
                <Toaster />
            </ChakraProvider>
        )
        
        expect(screen.getByText('Action Toast')).toBeInTheDocument()
        expect(screen.getByText('Undo')).toBeInTheDocument()
        
        jest.requireMock('@chakra-ui/react').Toaster = originalImplementation
    })

    test('renders a closable toast with close button', async () => {
        const mockToaster = jest.requireMock('@chakra-ui/react').Toaster
        const originalImplementation = mockToaster
        
        jest.requireMock('@chakra-ui/react').Toaster = ({ children }) => (
            <div data-testid="chakra-toaster-mock">
                {children({
                    id: '4',
                    title: 'Closable Toast',
                    type: 'warning',
                    closable: true,
                })}
            </div>
        )

        render(
            <ChakraProvider value={defaultSystem}>
                <Toaster />
            </ChakraProvider>
        )
        
        expect(screen.getByText('Closable Toast')).toBeInTheDocument()
        expect(screen.getByText('Close')).toBeInTheDocument()
        
        jest.requireMock('@chakra-ui/react').Toaster = originalImplementation
    })
})
