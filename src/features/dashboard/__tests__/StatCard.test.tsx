import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../components/StatCard';
import { Calendar } from 'lucide-react';

describe('StatCard component', () => {
  it('renders title and value correctly', () => {
    render(
      <StatCard
        title="Total Events"
        value={128}
        icon={Calendar}
      />
    );

    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
  });

  it('renders positive change badge with green styling', () => {
    render(
      <StatCard
        title="Revenue"
        value="$12,400"
        icon={Calendar}
        change={15.5}
      />
    );

    const badge = screen.getByText('15.5%');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-emerald-600');
  });

  it('renders negative change badge with rose styling', () => {
    render(
      <StatCard
        title="Pending Approvals"
        value={4}
        icon={Calendar}
        change={-8.2}
      />
    );

    const badge = screen.getByText('8.2%');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-rose-500');
  });
});
