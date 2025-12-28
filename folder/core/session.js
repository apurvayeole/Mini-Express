import crypto from 'crypto';

const sessions = new Map();

export function createSession(userId) {
    const sessionId = crypto.randomUUID();

    sessions.set(sessionId, {
        userId,
        createdAt: Date.now()
    });
    return sessionId;
}

export function getSession(sessionId) {
    return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
    return sessions.delete(sessionId);
}