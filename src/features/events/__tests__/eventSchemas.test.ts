import { describe, it, expect } from 'vitest';
import { eventDetailsSchema } from '../schemas/event-details.schema';
import { clientInformationSchema } from '../schemas/client-information.schema';

describe('Event Wizard Zod Schemas', () => {
  it('validates event details schema correctly', () => {
    const validData = {
      title: 'Tech Gala 2026',
      eventTypeId: 'type-123',
      eventDate: '2026-10-15',
      startTime: '09:00',
      endTime: '17:00',
      status: 'Confirmed',
    };

    const result = eventDetailsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails event details schema when title is missing or empty', () => {
    const invalidData = {
      title: '',
      eventTypeId: 'type-123',
      eventDate: '2026-10-15',
      startTime: '09:00',
      endTime: '17:00',
    };

    const result = eventDetailsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates client information schema with valid email and phone', () => {
    const validClient = {
      client: {
        name: 'Sarah Connor',
        email: 'sarah@skynet.com',
        phone: '+1 555 0199',
      },
    };

    const result = clientInformationSchema.safeParse(validClient);
    expect(result.success).toBe(true);
  });
});
