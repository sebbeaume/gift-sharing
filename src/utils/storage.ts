import type { GiftEvent, Gift } from '../types';

const STORAGE_KEY = 'gift-sharing-events';

export const getEvents = (): GiftEvent[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const events: GiftEvent[] = JSON.parse(raw);
  return events.map(e => ({
    contributions: [],
    ...e,
    gifts: (e.gifts ?? []).map((g: Gift) => ({ contributions: [], ...g })),
  }));
};

export const getEvent = (id: string): GiftEvent | null => {
  return getEvents().find(e => e.id === id) ?? null;
};

export const saveEvent = (event: GiftEvent): void => {
  const events = getEvents();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...events, event]));
};

export const updateEvent = (updated: GiftEvent): void => {
  const events = getEvents().map(e => e.id === updated.id ? updated : e);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};
