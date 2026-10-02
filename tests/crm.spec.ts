import { test, expect } from '@playwright/test';
import { companiesCsv, parseCompaniesCsv, webUrl } from '../src/lib/csv';
import { safeReturnPath } from '../src/lib/auth';
import { companies } from '../src/lib/mock-data';
import { defaultData, validateWorkspace } from '../src/lib/repository';

test('CSV and workspace validation reject malformed records', () => {
  const source = { ...companies[0], name: '=SUM(1,2)', address: 'Ош, "Central"\nStreet' };
  const rows = parseCompaniesCsv(companiesCsv([source]));
  expect(rows[0]).toMatchObject({ name: source.name, address: source.address });
  expect(companiesCsv([source])).toContain("'=SUM");
  expect(() => parseCompaniesCsv('name,category,address\n"broken')).toThrow();
  expect(() => parseCompaniesCsv('name,category,address\nName,,Osh')).toThrow();
  expect(webUrl('javascript:alert(1)')).toBeUndefined();
  expect(safeReturnPath('//evil.example')).toBe('/catalogue');
  expect(validateWorkspace(defaultData).companies).toEqual([]);
  expect(() => validateWorkspace({ ...defaultData, companies: [{ id: 'broken' }] as never })).toThrow();
});

test('2GIS search fails closed when the Places integration is absent', async ({ request }) => {
  const response = await request.get('/api/2gis/search?q=cafe');
  expect(response.status()).toBe(503);
  expect((await response.json()).error).toContain('not configured');
});
