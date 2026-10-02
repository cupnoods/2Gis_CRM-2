import { test, expect, type Page } from '@playwright/test';
import type { WorkspaceData } from '../src/lib/repository';
import { companies } from '../src/lib/mock-data';

// A controlled Supabase HTTP boundary verifies UI requests, responses and reloads.
// These tests do not assert that a live project's SQL/RLS has been configured.
async function mockSupabase(page: Page, initial?: WorkspaceData) {
  const user = { id: '11111111-1111-4111-8111-111111111111', email: 'test@example.com', aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: { full_name: 'Test User' }, created_at: new Date().toISOString() };
  const token = `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated' })).toString('base64url')}.test`;
  const state = { row: initial ? { user_id: user.id, data: structuredClone(initial), revision: 1 } : null as { user_id: string; data: WorkspaceData; revision: number } | null, failWrites: false };
  await page.route('https://crm-test.supabase.co/**', async route => {
    const request = route.request(); const url = new URL(request.url());
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body), headers: { 'access-control-allow-origin': '*' } });
    if (url.pathname === '/auth/v1/token') {
      if (request.postDataJSON().password !== 'valid-password') return json({ code: 'invalid_credentials', msg: 'Invalid login credentials' }, 400);
      return json({ access_token: token, refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer', user });
    }
    if (url.pathname === '/auth/v1/user') return json(user);
    if (url.pathname === '/auth/v1/logout') return route.fulfill({ status: 204 });
    if (url.pathname === '/rest/v1/crm_workspaces') {
      if (request.method() === 'GET') return json(state.row ? [{ data: state.row.data, revision: state.row.revision }] : []);
      if (state.failWrites) return json({ code: '42501', message: 'Simulated database write failure' }, 403);
      if (request.method() === 'PATCH' && url.searchParams.get('revision') !== `eq.${state.row?.revision}`) return json([]);
      if (request.method() === 'POST' && state.row) return json({ code: '23505', message: 'Duplicate owner' }, 409);
      state.row = request.postDataJSON();
      return json([{ revision: state.row!.revision }], request.method() === 'POST' ? 201 : 200);
    }
    throw new Error(`Unexpected Supabase request: ${request.method()} ${url.pathname}`);
  });
  return state;
}

async function signIn(page: Page, path = '/catalogue') {
  await page.goto(path);
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await page.getByLabel('Email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Password', { exact: true }).fill('valid-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
}
const saved = (page: Page) => expect(page.getByRole('status').filter({ hasText: /^Saved to Supabase$/ })).toBeVisible();
async function addCompany(page: Page, name: string) {
  await page.getByRole('button', { name: 'Add company', exact: true }).click();
  await page.getByLabel('Company name', { exact: true }).fill(name);
  await page.getByLabel('Category', { exact: true }).fill('Services');
  await page.getByLabel('Address', { exact: true }).fill('Osh');
  await page.getByRole('button', { name: 'Create company', exact: true }).click();
}

test('failed authentication cannot enter the CRM', async ({ page }) => {
  await mockSupabase(page);
  await page.goto('/catalogue');
  await page.getByLabel('Email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Password', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Invalid login credentials' })).toBeVisible();
  await expect(page).toHaveURL(/\/login\?next=/);
  expect(await page.evaluate(() => localStorage.getItem('oshbiz_user'))).toBeNull();
});

test('companies, status, notes, tasks and deals persist across reloads', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', err => errors.push(err.message));
  const database = await mockSupabase(page);
  await signIn(page);
  await addCompany(page, 'Saved Business'); await saved(page);
  await page.getByLabel('Status for Saved Business').selectOption('In progress'); await saved(page);
  await page.getByRole('button', { name: 'Saved Business', exact: true }).click();
  await page.getByRole('button', { name: 'Notes', exact: true }).click();
  await page.getByPlaceholder('Add a note').fill('Remember this after reload');
  await page.getByRole('button', { name: 'Save', exact: true }).click(); await saved(page);
  await page.reload();
  await page.getByRole('button', { name: 'Notes', exact: true }).click();
  await expect(page.getByText('Remember this after reload')).toBeVisible();
  await expect(page.getByLabel('Change status', { exact: true })).toHaveValue('In progress');
  await page.goto('/tasks');
  await page.getByRole('button', { name: '+ New task', exact: true }).click();
  await page.getByLabel('Title', { exact: true }).fill('Call saved business');
  await page.getByLabel('Due', { exact: true }).fill('Tomorrow');
  await page.getByRole('button', { name: 'Create task', exact: true }).click(); await saved(page);
  await page.goto('/pipeline');
  await page.getByRole('button', { name: 'New deal', exact: true }).click();
  await page.getByLabel('Title', { exact: true }).fill('Saved opportunity');
  await page.getByLabel('Amount', { exact: true }).fill('1000');
  await page.getByRole('button', { name: 'Create deal', exact: true }).click(); await saved(page);
  await page.reload();
  await expect(page.getByText('Saved opportunity', { exact: true })).toBeVisible();
  expect(database.row?.data.tasks[0].title).toBe('Call saved business');
  expect(database.row?.data.companies[0].notes[0].text).toBe('Remember this after reload');
  expect(errors).toEqual([]);
});

test('failed saves remain visible and retry before sign-out succeeds', async ({ page }) => {
  const database = await mockSupabase(page);
  await signIn(page); database.failWrites = true;
  await addCompany(page, 'Unsaved Business');
  await expect(page.getByRole('alert').filter({ hasText: 'Changes were not saved' })).toBeVisible();
  expect(database.row).toBeNull();
  await page.getByRole('button', { name: 'Open user menu' }).click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/catalogue$/);
  database.failWrites = false;
  await page.getByRole('button', { name: 'Retry save', exact: true }).click(); await saved(page);
  expect(database.row?.data.companies[0].name).toBe('Unsaved Business');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
});

test('stale saves cannot overwrite another device and scoped browser records can be recovered', async ({ page }) => {
  const database = await mockSupabase(page);
  await page.addInitScript(company => localStorage.setItem('oshbiz_companies_test@example.com', JSON.stringify([company])), { ...companies[0], name: 'Recovered Business' });
  await signIn(page, '/import-export');
  await page.getByRole('button', { name: 'Import browser data' }).click(); await saved(page);
  await page.goto('/catalogue');
  await expect(page.getByLabel('Status for Recovered Business')).toHaveValue(companies[0].status);
  database.row!.revision += 1;
  await page.getByLabel('Status for Recovered Business').selectOption('Declined');
  await expect(page.getByRole('alert').filter({ hasText: 'changed in another tab or device' })).toBeVisible();
  expect(database.row?.data.companies[0].status).toBe(companies[0].status);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download unsaved data' }).click();
  expect((await download).suggestedFilename()).toBe('unsaved-workspace.json');
});
