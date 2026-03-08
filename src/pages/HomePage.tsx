import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GiftEvent } from '../types';
import { saveEvent, getEvent } from '../utils/storage';
import { setAuthenticated } from '../utils/auth';
import {
  HOME_CREATE_BTN,
  HOME_JOIN_BTN,
  HOME_CREATE_NAME_INPUT,
  HOME_CREATE_DATE_INPUT,
  HOME_CREATE_PASSWORD_INPUT,
  HOME_CREATE_SUBMIT,
  HOME_CREATE_CANCEL,
  HOME_JOIN_ID_INPUT,
  HOME_JOIN_PASSWORD_INPUT,
  HOME_JOIN_SUBMIT,
  HOME_JOIN_CANCEL,
  HOME_JOIN_ERROR,
} from './HomePageTestIds';

type Mode = 'none' | 'create' | 'join';

export const HomePage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('none');

  // Create form state
  const [createName, setCreateName] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  // Join form state
  const [joinId, setJoinId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    const event: GiftEvent = {
      id,
      name: createName,
      date: createDate,
      password: createPassword,
      gifts: [],
      createdAt: new Date().toISOString(),
    };
    saveEvent(event);
    setAuthenticated(id);
    navigate(`/event/${id}`);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    const event = getEvent(joinId.trim());
    if (!event) {
      setJoinError('No event found with that ID.');
      return;
    }
    if (event.password !== joinPassword) {
      setJoinError('Incorrect password. Please try again.');
      return;
    }
    setAuthenticated(event.id);
    navigate(`/event/${event.id}`);
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>🎁 Gift Sharing</h1>
        <p>Plan gifts together for any occasion</p>
      </header>

      <div className="home-actions">
        <button className="card-btn" data-testid={HOME_CREATE_BTN} onClick={() => setMode('create')}>
          <span className="card-btn-icon">✨</span>
          <span className="card-btn-title">Create an Event</span>
          <span className="card-btn-desc">Start planning a new occasion</span>
        </button>
        <button className="card-btn" data-testid={HOME_JOIN_BTN} onClick={() => setMode('join')}>
          <span className="card-btn-icon">🔗</span>
          <span className="card-btn-title">Join an Event</span>
          <span className="card-btn-desc">Enter an event ID and password</span>
        </button>
      </div>

      {mode === 'create' && (
        <div className="form-panel">
          <h2>Create Event</h2>
          <form onSubmit={handleCreate}>
            <label>
              Event name
              <input
                type="text"
                data-testid={HOME_CREATE_NAME_INPUT}
                value={createName}
                onChange={e => setCreateName(e.target.value)}
                placeholder="e.g. Sarah's Birthday"
                required
              />
            </label>
            <label>
              Date
              <input
                type="date"
                data-testid={HOME_CREATE_DATE_INPUT}
                value={createDate}
                onChange={e => setCreateDate(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                data-testid={HOME_CREATE_PASSWORD_INPUT}
                value={createPassword}
                onChange={e => setCreatePassword(e.target.value)}
                placeholder="Share this with your group"
                required
              />
            </label>
            <div className="form-actions">
              <button type="button" className="btn-secondary" data-testid={HOME_CREATE_CANCEL} onClick={() => setMode('none')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" data-testid={HOME_CREATE_SUBMIT}>Create</button>
            </div>
          </form>
        </div>
      )}

      {mode === 'join' && (
        <div className="form-panel">
          <h2>Join Event</h2>
          <form onSubmit={handleJoin}>
            <label>
              Event ID
              <input
                type="text"
                data-testid={HOME_JOIN_ID_INPUT}
                value={joinId}
                onChange={e => { setJoinId(e.target.value); setJoinError(''); }}
                placeholder="Paste the event ID here"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                data-testid={HOME_JOIN_PASSWORD_INPUT}
                value={joinPassword}
                onChange={e => { setJoinPassword(e.target.value); setJoinError(''); }}
                placeholder="Enter the event password"
                required
              />
            </label>
            {joinError && <p className="error-msg" data-testid={HOME_JOIN_ERROR}>{joinError}</p>}
            <div className="form-actions">
              <button type="button" className="btn-secondary" data-testid={HOME_JOIN_CANCEL} onClick={() => setMode('none')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" data-testid={HOME_JOIN_SUBMIT}>Join</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
