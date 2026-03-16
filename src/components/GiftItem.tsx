import type { Gift } from '../types';
import {
  EVENT_GIFT_ITEM,
  EVENT_GIFT_NAME,
  EVENT_GIFT_LINK,
  EVENT_GIFT_PRICE,
  EVENT_GIFT_STATUS_BTN,
  EVENT_GIFT_REMOVE_BTN,
} from './EventPageTestIds';

type Props = {
  gift: Gift;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
};

export const GiftItem = ({ gift, onToggleStatus, onRemove }: Props) => (
  <li data-testid={EVENT_GIFT_ITEM} className={`gift-item ${gift.status}`}>
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
        onClick={() => onToggleStatus(gift.id)}
      >
        {gift.status === 'suggested' ? 'Mark purchased' : '✓ Purchased'}
      </button>
      <button className="btn-remove" data-testid={EVENT_GIFT_REMOVE_BTN} onClick={() => onRemove(gift.id)}>✕</button>
    </div>
  </li>
);
