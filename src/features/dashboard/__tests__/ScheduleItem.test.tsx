import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScheduleItemRow from '../components/ScheduleCard/ScheduleItem';

describe('ScheduleItemRow component', () => {
  it('renders time, title, and subtitle correctly', () => {
    render(
      <ScheduleItemRow
        item={{
          id: '1',
          time: '10:00 AM',
          title: 'Client Photoshoot',
          subtitle: 'Studio A - Fashion Line',
          status: 'IN_PROGRESS',
          participants: ['Alice', 'Bob'],
        }}
      />
    );

    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Client Photoshoot')).toBeInTheDocument();
    expect(screen.getByText('Studio A - Fashion Line')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders status text for upcoming status', () => {
    render(
      <ScheduleItemRow
        item={{
          id: '2',
          time: '02:00 PM',
          title: 'Product Launch Meeting',
          subtitle: 'Conference Room 3',
          status: 'UPCOMING',
        }}
      />
    );

    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });
});
