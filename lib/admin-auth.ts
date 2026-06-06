'use client';

import crypto from 'crypto';

const ADMIN_PASSWORD = 'admin123'; // Change this in production
const SESSION_KEY = 'admin_session_token';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSession {
  token: string;
  timestamp: number;
  isValid: boolean;
}

// Simple client-side password hashing (for demo - use proper backend auth in production)
export function hashPassword(password: string): string {
  // Browser-safe hash function
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createAdminSession(): AdminSession {
  const token = crypto.getRandomValues(new Uint8Array(32)).toString();
  const session: AdminSession = {
    token,
    timestamp: Date.now(),
    isValid: true,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getAdminSession(): AdminSession | null {
  const sessionStr = sessionStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const session: AdminSession = JSON.parse(sessionStr);
    const now = Date.now();

    // Check if session has expired
    if (now - session.timestamp > SESSION_TIMEOUT) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return session !== null && session.isValid;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
