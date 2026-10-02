import type { Company } from './types';
const fields = ['name', 'category', 'address', 'phone', 'whatsapp', 'website'] as const;
export function companiesCsv(companies: Company[]) {
  const cell = (value: string) => '"' + (/^[\s]*[=+@-]/.test(value) ? "'" + value : value).replaceAll('"', '""') + '"';
  return '\uFEFF' + [fields.join(','), ...companies.map(c => fields.map(key => cell(c[key] ?? '')).join(','))].join('\r\n');
}
export function parseCompaniesCsv(text: string): Array<Pick<Company, 'name' | 'category' | 'address'> & Partial<Company>> {
  const rows: string[][] = []; let row: string[] = []; let value = ''; let quoted = false; let closed = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"') { if (text[i + 1] === '"') { value += '"'; i++; } else { quoted = false; closed = true; } } else value += c; }
    else if (c === '"') { if (value || closed) throw new Error('Invalid CSV quoting.'); quoted = true; }
    else if (c === ',' || c === '\r' || c === '\n') { row.push(value); value = ''; closed = false; if (c !== ',') { if (row.some(Boolean)) rows.push(row); row = []; if (c === '\r' && text[i + 1] === '\n') i++; } }
    else { if (closed) throw new Error('Invalid text after a quoted CSV field.'); value += c; }
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field.');
  row.push(value); if (row.some(Boolean)) rows.push(row);
  const header = rows.shift()?.map(v => v.trim().toLowerCase());
  if (!header || !['name', 'category', 'address'].every(f => header.includes(f)) || new Set(header).size !== header.length) throw new Error('CSV needs unique name, category and address column headers.');
  if (!rows.length) throw new Error('CSV contains no companies.');
  if (rows.length > 5000) throw new Error('Import up to 5,000 companies at a time.');
  return rows.map((r, index) => {
    if (r.length !== header.length) throw new Error(`Row ${index + 2} has the wrong number of columns.`);
    const get = (key: string) => { const v = (r[header.indexOf(key)] ?? '').trim(); return /^'[\s]*[=+@-]/.test(v) ? v.slice(1) : v; };
    if (!get('name') || !get('category') || !get('address')) throw new Error(`Row ${index + 2} needs a name, category and address.`);
    return { name: get('name'), category: get('category'), address: get('address'), phone: get('phone') || undefined, whatsapp: get('whatsapp') || undefined, website: get('website') || undefined };
  });
}
export function downloadFile(name: string, content: string, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function webUrl(value?: string) { if (!value) return undefined; try { const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`); return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined; } catch { return undefined; } }
