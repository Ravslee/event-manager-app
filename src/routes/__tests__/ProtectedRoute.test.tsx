import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import ProtectedRoute from '../ProtectedRoute';
import { Routes, Route } from 'react-router-dom';

const mockUseAuth = vi.fn();

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('ProtectedRoute component', () => {
  it('renders loader when auth state is loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Secret Page</div>} />
        </Route>
      </Routes>
    );

    expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
  });

  it('renders child outlet content when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Dashboard Secret</div>} />
        </Route>
      </Routes>
    );

    expect(screen.getByText('Protected Dashboard Secret')).toBeInTheDocument();
  });
});
