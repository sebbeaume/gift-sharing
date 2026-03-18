import { useState } from 'react';
import type { Gift, Contribution } from '../types';
import {
  EVENT_GIFT_ITEM,
  EVENT_GIFT_NAME,
  EVENT_GIFT_LINK,
  EVENT_GIFT_PRICE,
  EVENT_GIFT_STATUS_BTN,
  EVENT_GIFT_REMOVE_BTN,
  EVENT_GIFT_CONTRIBUTE_BTN,
  EVENT_GIFT_CONTRIBUTE_FORM,
  EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT,
  EVENT_GIFT_CONTRIBUTE_SUBMIT,
  EVENT_GIFT_PROGRESS_BAR,
  EVENT_GIFT_PROGRESS_TOOLTIP,
} from '../pages/EventPageTestIds';

type Props = {
  gift: Gift;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
  onContribute: (giftId: string, amount: number) => void;
};

export const GiftItem = ({ gift, onToggleStatus, onRemove, onContribute }: Props) => {
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [contributeAmount, setContributeAmount] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const totalContributed = gift.contributions.reduce((sum, c) => sum + c.amount, 0);
  const remaining = gift.price !== undefined ? gift.price - totalContributed : undefined;
  const progressPercent = gift.price && gift.price > 0
    ? Math.min(100, (totalContributed / gift.price) * 100)
    : 0;

  const hasPartialContributions =
    gift.contributions.length > 0 &&
    gift.price !== undefined &&
    gift.status === 'suggested';

  const canContribute =
    gift.status === 'suggested' &&
    gift.price !== undefined &&
    remaining !== undefined &&
    remaining > 0;

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContribute(gift.id, parseFloat(contributeAmount));
    setContributeAmount('');
    setShowContributeForm(false);
  };

  return (
    <li data-testid={EVENT_GIFT_ITEM} className={`gift-item ${gift.status}`}>
      <div className="gift-item-row">
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
          {hasPartialContributions && (
            <div
              className="gift-progress-wrapper"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="gift-progress-bar" data-testid={EVENT_GIFT_PROGRESS_BAR}>
                <div className="gift-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="gift-progress-label">
                €{totalContributed.toFixed(2)} / €{gift.price!.toFixed(2)}
              </span>
              {showTooltip && (
                <div className="gift-progress-tooltip" data-testid={EVENT_GIFT_PROGRESS_TOOLTIP}>
                  <strong>Contributions:</strong>
                  {gift.contributions.map((c: Contribution) => (
                    <div key={c.id} className="gift-tooltip-entry">
                      €{c.amount.toFixed(2)} — {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  ))}
                  <div className="gift-tooltip-total">
                    Total: €{totalContributed.toFixed(2)} / €{gift.price!.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="gift-actions">
          {canContribute && (
            <button
              className="btn-contribute"
              data-testid={EVENT_GIFT_CONTRIBUTE_BTN}
              onClick={() => setShowContributeForm(v => !v)}
            >
              {showContributeForm ? 'Cancel' : 'Contribute'}
            </button>
          )}
          <button
            className={`btn-status ${gift.status}`}
            data-testid={EVENT_GIFT_STATUS_BTN}
            onClick={() => onToggleStatus(gift.id)}
          >
            {gift.status === 'suggested' ? 'Mark purchased' : '✓ Purchased'}
          </button>
          <button className="btn-remove" data-testid={EVENT_GIFT_REMOVE_BTN} onClick={() => onRemove(gift.id)}>✕</button>
        </div>
      </div>

      {showContributeForm && (
        <form className="gift-contribute-form" data-testid={EVENT_GIFT_CONTRIBUTE_FORM} onSubmit={handleContributeSubmit}>
          <label>
            Amount (€)
            <input
              type="number"
              data-testid={EVENT_GIFT_CONTRIBUTE_AMOUNT_INPUT}
              min="0.01"
              max={remaining?.toFixed(2)}
              step="0.01"
              value={contributeAmount}
              onChange={e => setContributeAmount(e.target.value)}
              placeholder={`Max €${remaining?.toFixed(2)}`}
              required
              autoFocus
            />
          </label>
          <button type="submit" className="btn-primary" data-testid={EVENT_GIFT_CONTRIBUTE_SUBMIT}>
            Confirm
          </button>
        </form>
      )}
    </li>
  );
};
