import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';

export async function verifyAuth(request) {
  try {
    // 1. Try Authorization header first (preferred for SPA/API calls)
    const incomingHeaders = headers();
    const authHeader = incomingHeaders.get('authorization');

    let rawToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      rawToken = authHeader.substring(7);
    }

    // 2. Fallback to httpOnly cookie for browser navigations
    if (!rawToken) {
      const cookieStore = cookies();
      const cookieToken = cookieStore.get('token');
      if (cookieToken) rawToken = cookieToken.value;
    }

    if (!rawToken) {
      return null;
    }

    return decodeToken(rawToken);
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function decodeToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateToken(role , username) {
  return jwt.sign(
    { role: role, username: username },
    process.env.JWT_SECRET,
    { expiresIn: '3h' }
  );
}

export async function getToken() {
  try {
    const cookieStore = cookies();
    const token = await cookieStore.get('token');

    if (!token) {
      return null;
    }

    return token.value;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}
