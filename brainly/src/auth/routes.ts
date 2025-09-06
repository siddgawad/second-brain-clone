import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { StatusCodes as S } from 'http-status-codes';
import { cookieOpts, signAccessToken, signRefreshToken, verifyRefreshToken } from './jwt';
import { getVersion, bumpVersion, setVersion } from './refreshStore';
import { ENV } from '../env';
import { logger } from '../logger';
import { User } from '../models/User'; 

export const authRouter = Router();

function setAuthCookies(res: any, access: string, refresh: string) {
  const dom = ENV.COOKIE_DOMAIN ?? undefined;
  res.cookie('access_token', access, dom ? { ...cookieOpts.access, domain: dom } : cookieOpts.access);
  res.cookie('refresh_token', refresh, dom ? { ...cookieOpts.refresh, domain: dom } : cookieOpts.refresh);
}

function clearAuthCookies(res: any) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
}

authRouter.post('/signup', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(S.BAD_REQUEST).json({ error: 'email & password required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(S.CONFLICT).json({ error: 'email in use' });

  const passwordHash = await bcrypt.hash(password, 10);
  const u = await User.create({ email, passwordHash });
  await setVersion(String(u._id), 0);

  const acc = signAccessToken(String(u._id), u.email);
  const ref = signRefreshToken(String(u._id), 0);
  setAuthCookies(res, acc, ref);

  res.status(S.CREATED).json({ user: { id: String(u._id), email: u.email } });
});

authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(S.BAD_REQUEST).json({ error: 'email & password required' });

  const u = await User.findOne({ email });
  if (!u) return res.status(S.UNAUTHORIZED).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(S.UNAUTHORIZED).json({ error: 'invalid credentials' });

  const ver = await getVersion(String(u._id));
  const acc = signAccessToken(String(u._id), u.email);
  const ref = signRefreshToken(String(u._id), ver);
  setAuthCookies(res, acc, ref);

  res.json({ user: { id: String(u._id), email: u.email } });
});

authRouter.post('/signout', async (_req, res) => {
  clearAuthCookies(res);
  res.status(S.NO_CONTENT).end();
});

authRouter.post('/auth/refresh', async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(S.UNAUTHORIZED).json({ error: 'missing refresh token' });
  try {
    const payload = verifyRefreshToken(token);
    const userId = payload.sub!;
    const currentVer = await getVersion(userId);
    if (payload.ver !== currentVer) {
      return res.status(S.UNAUTHORIZED).json({ error: 'refresh token rotated' });
    }
    const newVer = await bumpVersion(userId);
    const newAcc = signAccessToken(userId);
    const newRef = signRefreshToken(userId, newVer);
    setAuthCookies(res, newAcc, newRef);
    res.status(S.OK).json({ ok: true });
  } catch (e) {
    logger.warn({ e }, 'refresh-failed');
    return res.status(S.UNAUTHORIZED).json({ error: 'invalid refresh token' });
  }
});

authRouter.get('/me', (req, res) => {
  const u = req.user;
  if (!u) return res.status(S.UNAUTHORIZED).json({ error: 'unauthorized' });
  res.json({ user: u });
});
