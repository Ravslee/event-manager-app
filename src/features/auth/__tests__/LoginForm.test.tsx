import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import { LoginForm } from '../components/LoginForm';

// Mock AuthContext
const mockLogin = vi.fn();

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    logout: vi.fn(),
    refreshToken: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

describe('LoginForm component', () => {
  it('renders login form elements properly', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In to NIVO/i })).toBeInTheDocument();
  });

  it('allows user to type into inputs', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('Username or Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'securepassword');

    expect(emailInput).toHaveValue('admin@example.com');
    expect(passwordInput).toHaveValue('securepassword');
  });
});
