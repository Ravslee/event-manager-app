import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
        token: 'mock-jwt-token',
      });
    }
    return new HttpResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
  }),

  http.get('/events', () => {
    return HttpResponse.json([
      {
        id: 'evt-1',
        title: 'Annual Tech Summit 2026',
        date: '2026-09-15',
        type: 'Conference',
        status: 'Upcoming',
      },
    ]);
  }),
];
