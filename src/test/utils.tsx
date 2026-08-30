import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  routerOptions?: MemoryRouterProps;
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', routerOptions, ...renderOptions }: CustomRenderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]} {...routerOptions}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
