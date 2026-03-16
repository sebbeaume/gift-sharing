import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { GiftEvent, Gift } from '../types';
import { getEvent, updateEvent } from '../utils/storage';
import { isAuthenticated } from '../utils/auth';
import {
  EVENT_BACK_BTN,
  EVENT_ID_CODE,
  EVENT_COPY_BTN,
  EVENT_ADD_GIFT_BTN,
  EVENT_ADD_GIFT_FORM,
  EVENT_GIFT_NAME_INPUT,
  EVENT_GIFT_LINK_INPUT,
  EVENT_GIFT_PRICE_INPUT,
  EVENT_GIFT_SUBMIT,
  EVENT_EMPTY_STATE,
  EVENT_GIFT_ITEM,
  EVENT_GIFT_NAME,
  EVENT_GIFT_LINK,
  EVENT_GIFT_PRICE,
  EVENT_GIFT_STATUS_BTN,
  EVENT_GIFT_REMOVE_BTN,
} from './EventPageTestIds';

export const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<GiftEvent | null>(null);

  // Add gift form state
  const [giftName, setGiftName] = useState('');
  const [giftLink, setGiftLink] = useState('');
  const [giftPrice, setGiftPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!id || !isAuthenticated(id)) {
      navigate('/');
      return;
    }
    const found = getEvent(id);
    if (!found) {
      navigate('/');
      return;
    }
    setEvent(found);
  }, [id, navigate]);

  if (!event) return null;

  const persist = (updated: GiftEvent) => {
    setEvent(updated);
    updateEvent(updated);
  };

  const handleAddGift = (e: React.FormEvent) => {
    e.preventDefault();
    const gift: Gift = {
      id: crypto.randomUUID(),
      name: giftName,
      link: giftLink || undefined,
      price: giftPrice ? parseFloat(giftPrice) : undefined,
      status: 'suggested',
    };
    persist({ ...event, gifts: [...event.gifts, gift] });
    setGiftName('');
    setGiftLink('');
    setGiftPrice('');
    setShowAddForm(false);
  };

  const toggleStatus = (giftId: string) => {
    const gifts = event.gifts.map(g =>
      g.id === giftId
        ? { ...g, status: g.status === 'suggested' ? 'purchased' : 'suggested' } as Gift
        : g
    );
    persist({ ...event, gifts });
  };

  const removeGift = (giftId: string) => {
    persist({ ...event, gifts: event.gifts.filter(g => g.id !== giftId) });
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="event-page">
      <header className="event-header">
        <button className="btn-back" data-testid={EVENT_BACK_BTN} onClick={() => navigate('/')}>← Back</button>
        <div>
          <h1>{event.name}</h1>
          <p className="event-date">📅 {formattedDate}</p>
        </div>
      </header>

      <div className="event-id-box">
        <span>Event ID:</span>
        <code data-testid={EVENT_ID_CODE}>{event.id}</code>
        <button
          className="btn-copy"
          data-testid={EVENT_COPY_BTN}
          onClick={() => navigator.clipboard.writeText(event.id)}
        >
          Copy
        </button>
      </div>

      <section className="gifts-section">
        <div className="gifts-header">
          <h2>Gifts</h2>
          <button className="btn-primary" data-testid={EVENT_ADD_GIFT_BTN} onClick={() => setShowAddForm(v => !v)}>
            {showAddForm ? 'Cancel' : '+ Add Gift'}
          </button>
        </div>

        {showAddForm && (
          <form className="add-gift-form" data-testid={EVENT_ADD_GIFT_FORM} onSubmit={handleAddGift}>
            <label>
              Gift name *
              <input
                type="text"
                data-testid={EVENT_GIFT_NAME_INPUT}
                value={giftName}
                onChange={e => setGiftName(e.target.value)}
                placeholder="e.g. Wireless headphones"
                required
              />
            </label>
            <label>
              Link (optional)
              <input
                type="url"
                data-testid={EVENT_GIFT_LINK_INPUT}
                value={giftLink}
                onChange={e => setGiftLink(e.target.value)}
                placeholder="e.g. https://www.amazon.com/..."
              />
            </label>
            <label>
              Price (€)
              <input
                type="number"
                data-testid={EVENT_GIFT_PRICE_INPUT}
                min="0"
                step="0.01"
                value={giftPrice}
                onChange={e => setGiftPrice(e.target.value)}
                placeholder="Optional"
              />
            </label>
            <button type="submit" className="btn-primary" data-testid={EVENT_GIFT_SUBMIT}>Add Gift</button>
          </form>
        )}

        {event.gifts.length === 0 ? (
          <p className="empty-state" data-testid={EVENT_EMPTY_STATE}>No gifts yet. Add the first one!</p>
        ) : (
          <ul className="gift-list">
            {event.gifts.map(gift => (
              <li key={gift.id} data-testid={EVENT_GIFT_ITEM} className={`gift-item ${gift.status}`}>
                <div className="gift-info">
                  <span className="gift-name" data-testid={EVENT_GIFT_NAME}>{gift.name}</span>
                  {gift.link && (
                    <a
                      className="gift-link"
                      data-testid={EVENT_GIFT_LINK}
                      href={gift.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View listing ↗
                    </a>
                  )}
                  {gift.price !== undefined && (
                    <span className="gift-price" data-testid={EVENT_GIFT_PRICE}>€{gift.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="gift-actions">
                  <button
                    className={`btn-status ${gift.status}`}
                    data-testid={EVENT_GIFT_STATUS_BTN}
                    onClick={() => toggleStatus(gift.id)}
                  >
                    {gift.status === 'suggested' ? 'Mark purchased' : '✓ Purchased'}
                  </button>
                  <button className="btn-remove" data-testid={EVENT_GIFT_REMOVE_BTN} onClick={() => removeGift(gift.id)}>✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
