import { COOKIE_STORAGE_KEYS } from '../constants/cookieKeys.constants';
import { COOKIES_DOMAIN } from '@workspace/types/constants/config';
import { ICurrentUser } from '@workspace/types/interfaces/user';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

interface JwtPayload {
  email: string;
  exp: number;
  iat: number;
  sub: string;
  userKey: string;
}

const getUserDetailsFromToken = (token: string): JwtPayload | null => {
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === 'object' && 'email' in decoded) {
    return decoded as JwtPayload;
  }
  return null;
};

export const setSessionCookies = (accessToken: string, refreshToken: string) => {
  const decodeResponse = getUserDetailsFromToken(accessToken);
  if (decodeResponse?.userKey && decodeResponse?.exp && decodeResponse?.sub) {
    const expiryDate = new Date(decodeResponse.exp * 1000);
    expiryDate.setMinutes(expiryDate.getMinutes() - 6);

    Cookies.set(COOKIE_STORAGE_KEYS.ACCESS_TOKEN_EXP, expiryDate.getTime().toString(), {
      expires: 1 / 24,
      secure: true,
      sameSite: 'Lax',
      domain: COOKIES_DOMAIN,
    });
  }
  Cookies.set(COOKIE_STORAGE_KEYS.ACCESS_TOKEN, accessToken, {
    expires: 1 / 24,
    secure: true,
    sameSite: 'Lax',
    domain: COOKIES_DOMAIN,
  });
  Cookies.set(COOKIE_STORAGE_KEYS.REFRESH_TOKEN, refreshToken, {
    expires: 7,
    secure: true,
    sameSite: 'Lax',
    domain: COOKIES_DOMAIN,
  });
};

export const setUserCookie = (user: ICurrentUser) => {
  Cookies.set(COOKIE_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user), {
    expires: 1 / 24,
    secure: true,
    sameSite: 'Lax',
    domain: COOKIES_DOMAIN,
  });
};

export const setServerCookies = (
  accessToken: string,
  refreshToken: string,
  user: ICurrentUser,
  response: NextResponse,
) => {
  const decodeResponse = getUserDetailsFromToken(accessToken);

  if (decodeResponse?.userKey && decodeResponse?.exp && decodeResponse?.sub) {
    const expiryDate = new Date(decodeResponse.exp * 1000);
    expiryDate.setMinutes(expiryDate.getMinutes() - 6);

    response.cookies.set(COOKIE_STORAGE_KEYS.ACCESS_TOKEN_EXP, expiryDate.getTime().toString(), {
      maxAge: 3600,
      secure: true,
      sameSite: 'lax',
      domain: COOKIES_DOMAIN,
    });

    response.cookies.set(COOKIE_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user), {
      maxAge: 3600,
      secure: true,
      sameSite: 'lax',
      domain: COOKIES_DOMAIN,
    });
  }
  response.cookies.set(COOKIE_STORAGE_KEYS.ACCESS_TOKEN, accessToken, {
    maxAge: 3600,
    secure: true,
    sameSite: 'lax',
    domain: COOKIES_DOMAIN,
  });
  response.cookies.set(COOKIE_STORAGE_KEYS.REFRESH_TOKEN, refreshToken, {
    maxAge: 3600 * 24 * 7,
    secure: true,
    sameSite: 'lax',
    domain: COOKIES_DOMAIN,
  });
};

export const clearSessionCookies = () => {
  Cookies.remove(COOKIE_STORAGE_KEYS.ACCESS_TOKEN_EXP, {
    secure: true,
    sameSite: 'Lax',
    domain: COOKIES_DOMAIN,
  });
  Cookies.remove(COOKIE_STORAGE_KEYS.ACCESS_TOKEN, {
    secure: true,
    sameSite: 'Lax',
    domain: COOKIES_DOMAIN,
  });
  Cookies.remove(COOKIE_STORAGE_KEYS.REFRESH_TOKEN, {
    secure: true,
    sameSite: 'Lax',
    domain: COOKIES_DOMAIN,
  });
  Cookies.remove(COOKIE_STORAGE_KEYS.CURRENT_USER, {
    secure: true,
    sameSite: 'Lax',
    domain: COOKIES_DOMAIN,
  });
};
