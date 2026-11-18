// Operation Lights Out: board API as a Netlify Function, with data kept in Netlify Blobs.
// Routes: POST /api/join, /api/me, /api/set, /api/delete   GET /api/state
import { getStore } from '@netlify/blobs';
import { timingSafeEqual, randomUUID } from 'node:crypto';

export const config = { path: '/api/:route' };

const COLLECTIONS = new Set(['session', 'steps', 'seats', 'fixes', 'decisions']);
const MAX_DOCS = 2000;
const VERSION_KEY = 'meta/version';

const env = (k) => (globalThis.Netlify && Netlify.env.get(k)) || process.env[k] || '';
const same = (a, b) => { a = Buffer.from(String(a || '')); b = Buffer.from(String(b || '')); return a.length === b.length && timingSafeEqual(a, b); };
const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const store = () => getStore({ name: 'lights-out', consistency: 'strong' });

function parsePath(p) {
  const m = /^([a-z]+)\/([A-Za-z0-9_-]{1,60})$/.exec(String(p || ''));
  return m && COLLECTIONS.has(m[1]) ? { coll: m[1], id: m[2], full: m[1] + '/' + m[2] } : null;
}

async function readAll(s, prefix) {
  const { blobs } = await s.list({ prefix });
  const vals = await Promise.all(blobs.map((b) => s.get(b.key, { type: 'json' })));
  const out = {};
  blobs.forEach((b, i) => { if (vals[i] != null) out[b.key.slice(prefix.length)] = vals[i]; });
  return out;
}
const bump = (s) => s.set(VERSION_KEY, randomUUID());

export default async (req, context) => {
  const JOIN_CODE = env('JOIN_CODE').toUpperCase();
  const ADMIN_KEY = env('ADMIN_KEY');
  if (!JOIN_CODE || !ADMIN_KEY) return json(500, { error: 'JOIN_CODE and ADMIN_KEY must be set in Netlify environment variables' });
  if (!same(String(req.headers.get('x-code') || '').toUpperCase(), JOIN_CODE)) return json(403, { error: 'wrong code' });
  const admin = same(req.headers.get('x-admin'), ADMIN_KEY);
  const route = context.params.route;
  const s = store();

  if (route === 'state' && req.method === 'GET') {
    const v = (await s.get(VERSION_KEY)) || '0';
    if (req.headers.get('x-version') === v) return json(200, { v, same: true });
    const [docs, people] = await Promise.all([readAll(s, 'd/'), readAll(s, 'p/')]);
    return json(200, { v, state: { docs, people } });
  }
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' });

  let body;
  try {
    const text = await req.text();
    if (text.length > 100000) return json(413, { error: 'too large' });
    body = JSON.parse(text || '{}');
  } catch (e) { return json(400, { error: 'bad request' }); }
  const uid = String(body.uid || '').slice(0, 60);

  if (route === 'me') return json(200, { admin });
  if (route === 'join') {
    const name = String(body.name || '').trim().slice(0, 60);
    if (!uid || !name || !/^[A-Za-z0-9_-]+$/.test(uid)) return json(400, { error: 'name needed' });
    await s.setJSON('p/' + uid, { name }); await bump(s);
    return json(200, { admin });
  }
  if (!uid) return json(400, { error: 'uid needed' });
  const key = parsePath(body.path);
  if (!key) return json(400, { error: 'bad path' });
  const cur = await s.get('d/' + key.full, { type: 'json' });
  const owned = key.coll === 'seats' || key.coll === 'fixes' || key.coll === 'decisions';

  if (route === 'set') {
    const data = body.data;
    if (!data || typeof data !== 'object' || Array.isArray(data) || JSON.stringify(data).length > 20000) return json(400, { error: 'bad data' });
    if (key.coll === 'session' && !admin) return json(403, { error: 'facilitator only' });
    if (key.coll === 'seats' && !admin && cur && cur.uid !== uid) return json(409, { error: 'seat taken' });
    if (key.coll === 'seats' && !admin && data.uid !== uid) return json(403, { error: 'not yours' });
    if ((key.coll === 'fixes' || key.coll === 'decisions') && cur && cur.uid !== uid && !admin) return json(403, { error: 'not yours' });
    if (!cur) { const { blobs } = await s.list({ prefix: 'd/' }); if (blobs.length >= MAX_DOCS) return json(507, { error: 'full' }); }
    await s.setJSON('d/' + key.full, data); await bump(s);
    return json(200, { ok: true });
  }
  if (route === 'delete') {
    if (key.coll === 'session' && !admin) return json(403, { error: 'facilitator only' });
    if (cur && owned && cur.uid !== uid && !admin) return json(403, { error: 'not yours' });
    await s.delete('d/' + key.full); await bump(s);
    return json(200, { ok: true });
  }
  return json(404, { error: 'no such route' });
};
