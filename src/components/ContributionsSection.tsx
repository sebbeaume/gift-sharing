import type { Contribution } from '../types';
import { formatContributionDate } from '../utils/date';
import {
  EVENT_CONTRIBUTE_BTN,
  EVENT_CONTRIBUTE_FORM,
  EVENT_CONTRIBUTE_AMOUNT_INPUT,
  EVENT_CONTRIBUTE_SUBMIT,
  EVENT_CONTRIBUTIONS_TOTAL,
  EVENT_CONTRIBUTION_ITEM,
} from '../pages/EventPageTestIds';

type Props = {
  contributions: Contribution[];
  showContributeForm: boolean;
  contributeAmount: string;
  onToggleForm: () => void;
  onAmountChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const ContributionsSection = ({
  contributions,
  showContributeForm,
  contributeAmount,
  onToggleForm,
  onAmountChange,
  onSubmit,
}: Props) => {
  const total = contributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <section className="contributions-section">
      <div className="contributions-header">
        <div>
          <h2>Contributions</h2>
          <p className="contributions-total" data-testid={EVENT_CONTRIBUTIONS_TOTAL}>
            Total: <strong>€{total.toFixed(2)}</strong>
          </p>
        </div>
        <button
          className="btn-primary"
          data-testid={EVENT_CONTRIBUTE_BTN}
          onClick={onToggleForm}
        >
          {showContributeForm ? 'Cancel' : '+ Contribute'}
        </button>
      </div>

      {showContributeForm && (
        <form className="contribute-form" data-testid={EVENT_CONTRIBUTE_FORM} onSubmit={onSubmit}>
          <label>
            Amount (€)
            <input
              type="number"
              data-testid={EVENT_CONTRIBUTE_AMOUNT_INPUT}
              min="0.01"
              step="0.01"
              value={contributeAmount}
              onChange={e => onAmountChange(e.target.value)}
              placeholder="e.g. 20"
              required
              autoFocus
            />
          </label>
          <button type="submit" className="btn-primary" data-testid={EVENT_CONTRIBUTE_SUBMIT}>
            Confirm contribution
          </button>
        </form>
      )}

      {contributions.length > 0 && (
        <ul className="contribution-list">
          {contributions.map(c => (
            <li key={c.id} className="contribution-item" data-testid={EVENT_CONTRIBUTION_ITEM}>
              <span className="contribution-amount">€{c.amount.toFixed(2)}</span>
              <span className="contribution-date">
                {formatContributionDate(c.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
