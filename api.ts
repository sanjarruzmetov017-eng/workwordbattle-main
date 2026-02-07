import type { UserStats } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const TOKEN_KEY = 'wordbattle_tokens';

type Tokens = {
  access: string;
  refresh: string;
};

type ProfilePayload = {
  username: string;
  email?: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  streak: number;
  coins: number;
  avatar_emoji?: string | null;
  profile_image?: string | null;
};

const toStats = (profile: ProfilePayload): UserStats => ({
  username: profile.username,
  elo: profile.elo,
  wins: profile.wins,
  losses: profile.losses,
  draws: profile.draws,
  streak: profile.streak,
  coins: profile.coins,
  avatarEmoji: profile.avatar_emoji || undefined,
  profileImage: profile.profile_image || undefined,
  email: profile.email,
});

const toProfileUpdatePayload = (stats: Partial<UserStats>) => {
  const payload: Record<string, unknown> = {};
  if (stats.username !== undefined) payload.username = stats.username;
  if (stats.email !== undefined) payload.email = stats.email;
  if (stats.elo !== undefined) payload.elo = stats.elo;
  if (stats.wins !== undefined) payload.wins = stats.wins;
  if (stats.losses !== undefined) payload.losses = stats.losses;
  if (stats.draws !== undefined) payload.draws = stats.draws;
  if (stats.streak !== undefined) payload.streak = stats.streak;
  if (stats.coins !== undefined) payload.coins = stats.coins;
  if (stats.avatarEmoji !== undefined) payload.avatar_emoji = stats.avatarEmoji;
  if (stats.profileImage !== undefined) payload.profile_image = stats.profileImage;
  return payload;
};

const getTokens = (): Tokens | null => {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
};

const setTokens = (tokens: Tokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const parseError = async (response: Response) => {
  try {
    const data = await response.json();
    if (typeof data?.detail === 'string') return data.detail;
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.error === 'string') return data.error;
    if (typeof data?.non_field_errors?.[0] === 'string') return data.non_field_errors[0];
  } catch {
    // ignore
  }
  return `${response.status} ${response.statusText}`.trim();
};

const refreshAccessToken = async (): Promise<Tokens | null> => {
  const tokens = getTokens();
  if (!tokens?.refresh) return null;
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { access: string };
  const updated = { ...tokens, access: data.access };
  setTokens(updated);
  return updated;
};

const apiFetch = async (path: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const tokens = getTokens();
  const isAuthPath = path.startsWith('/api/auth/');
  if (!isAuthPath && tokens?.access) {
    headers.set('Authorization', `Bearer ${tokens.access}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!isAuthPath && response.status === 401 && tokens?.refresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed?.access) {
      headers.set('Authorization', `Bearer ${refreshed.access}`);
      const retry = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      });
      if (!retry.ok) {
        throw new Error(await parseError(retry));
      }
      return retry.status === 204 ? null : retry.json();
    }
    clearTokens();
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.status === 204 ? null : response.json();
};

export const isAuthenticated = () => Boolean(getTokens()?.access);

export const loginUser = async (login: string, password: string): Promise<UserStats> => {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  });
  setTokens({ access: data.access, refresh: data.refresh });
  return toStats(data.profile as ProfilePayload);
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<UserStats> => {
  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  setTokens({ access: data.access, refresh: data.refresh });
  return toStats(data.profile as ProfilePayload);
};


export const fetchMe = async (): Promise<UserStats> => {
  const data = await apiFetch('/api/me');
  return toStats(data as ProfilePayload);
};

export const updateProfile = async (stats: Partial<UserStats>): Promise<UserStats> => {
  const data = await apiFetch('/api/me', {
    method: 'PATCH',
    body: JSON.stringify(toProfileUpdatePayload(stats)),
  });
  return toStats(data as ProfilePayload);
};

export const submitGameResult = async (result: 'win' | 'loss' | 'draw', opponentElo: number) => {
  return apiFetch('/api/game/result', {
    method: 'POST',
    body: JSON.stringify({ result, opponent_elo: opponentElo }),
  });
};

export const aiWord = async (lastWord: string, usedWords: string[]) => {
  return apiFetch('/api/game/ai-word', {
    method: 'POST',
    body: JSON.stringify({ last_word: lastWord, used_words: usedWords }),
  });
};

export const aiHint = async (startChar: string, usedWords: string[]) => {
  return apiFetch('/api/game/hint', {
    method: 'POST',
    body: JSON.stringify({ start_char: startChar, used_words: usedWords }),
  });
};

export const validateWord = async (
  word: string,
  startChar?: string,
  usedWords?: string[]
) => {
  return apiFetch('/api/game/validate-word', {
    method: 'POST',
    body: JSON.stringify({
      word,
      start_char: startChar,
      used_words: usedWords,
    }),
  });
};
