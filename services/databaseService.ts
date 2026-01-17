
import { User, ResurrectionResult, SpectralMessage } from '../types';

const STORAGE_KEYS = {
  USERS: 'punchrevive_db_users',
  CARDS: 'punchrevive_db_cards',
  MESSAGES: 'punchrevive_db_messages',
};

export const database = {
  // --- USER OPERATIONS ---
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  
  saveUser: (user: User) => {
    const users = database.getUsers();
    const existing = users.findIndex(u => u.username === user.username);
    if (existing >= 0) users[existing] = user;
    else users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const session = sessionStorage.getItem('punchrevive_session');
    return session ? JSON.parse(session) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) sessionStorage.setItem('punchrevive_session', JSON.stringify(user));
    else sessionStorage.removeItem('punchrevive_session');
  },

  // --- CARD OPERATIONS ---
  getCards: (): ResurrectionResult[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS) || '[]'),
  
  saveCard: (card: ResurrectionResult) => {
    const cards = database.getCards();
    cards.unshift(card);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards.slice(0, 50)));
  },

  // --- MESSAGE OPERATIONS ---
  getMessages: (username: string): SpectralMessage[] => {
    const msgs: SpectralMessage[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    return msgs.filter(m => m.to === username || m.from === username);
  },

  sendMessage: (msg: SpectralMessage) => {
    const msgs = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    msgs.unshift(msg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(msgs));
  }
};
