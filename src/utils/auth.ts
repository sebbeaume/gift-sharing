const AUTH_KEY = 'gift-sharing-auth';

const getAuthenticatedEvents = (): string[] => {
  const raw = sessionStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const setAuthenticated = (eventId: string): void => {
  const events = getAuthenticatedEvents();
  if (!events.includes(eventId)) {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify([...events, eventId]));
  }
};

export const isAuthenticated = (eventId: string): boolean => {
  return getAuthenticatedEvents().includes(eventId);
};
