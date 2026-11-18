// Installed-app sign-in: Google sends the page back with #access_token=…; the token must be kept (the router must not eat it).
import { createRequire } from 'node:module';
import { createFakeGoogle } from './fake-google.mjs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const U = process.env.WEB_URL || 'http://localhost:8765/';
const G = createFakeGoogle(); const b = await chromium.launch(); const ctx = await b.newContext(); await G.attach(ctx);
await ctx.route(/accounts\.google\.com\/gsi\/client/, r => r.fulfill({ status: 200, contentType: 'text/javascript', body: 'window.google={accounts:{oauth2:{initTokenClient(){return{requestAccessToken(){}}}}}}' }));
await ctx.addInitScript(() => { if (!sessionStorage.getItem('x')) { sessionStorage.setItem('x', 1); localStorage.setItem('bassiet.google.back', JSON.stringify({ state: 'abc', hash: '#today', at: Date.now() })); } });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(U + '#access_token=tok123&token_type=Bearer&expires_in=3599&state=abc&scope=' + encodeURIComponent('https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email'));
await p.waitForFunction(() => window.CT && CT.web, null, { timeout: 15000 }); await p.waitForTimeout(2500);
const r = await p.evaluate(() => ({ hash: location.hash, tok: JSON.parse(localStorage.getItem('bassiet.google') || '{}').access_token, btn: document.getElementById('bassiet-cloud')?.textContent }));
const pass = r.tok === 'tok123' && !/access_token/.test(r.hash) && !/Connect Drive/.test(r.btn || '');
console.log(JSON.stringify(r), errs); console.log(pass ? 'ALL PASS' : 'FAILED'); await b.close(); process.exit(pass ? 0 : 1);
