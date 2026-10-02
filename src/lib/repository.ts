import { stages } from './mock-data';
import type { Company, Language, Task } from './types';
import { createClient } from './supabase/client';

export interface WorkspaceSettings { name: string; currency: 'KGS' | 'USD'; notifications: boolean }
export interface WorkspaceData { version: 1; companies: Company[]; tasks: Task[]; language: Language; settings: WorkspaceSettings }
export interface WorkspaceSnapshot { data: WorkspaceData; revision: number | null }
export interface CrmRepository { load(userId: string): Promise<WorkspaceSnapshot>; save(userId: string, data: WorkspaceData, revision: number | null): Promise<number> }
export const defaultData: WorkspaceData = { version: 1, companies: [], tasks: [], language: 'en', settings: { name: 'OshBiz CRM', currency: 'KGS', notifications: true } };
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object';
const strings = (value: Record<string, unknown>, keys: string[]) => keys.every(key => typeof value[key] === 'string');
const oneOf = (value: unknown, options: readonly string[]) => typeof value === 'string' && options.includes(value);
function validCompany(value: unknown): boolean {
  if (!record(value) || !strings(value, ['id', 'name', 'category', 'address', 'district', 'assignee'])) return false;
  return ['favourite', 'wishlist', 'verified'].every(key => typeof value[key] === 'boolean')
    && ['rating', 'ratingCount'].every(key => typeof value[key] === 'number' && Number.isFinite(value[key]))
    && oneOf(value.status, ['Not yet', 'In progress', 'Worked with', 'Declined']) && oneOf(value.priority, ['A', 'B', 'C'])
    && ['phone', 'whatsapp', 'instagram', 'website', 'nextAction', 'nextActionDate', 'source', 'sourceId'].every(key => value[key] === undefined || typeof value[key] === 'string')
    && ['longitude', 'latitude'].every(key => value[key] === undefined || (typeof value[key] === 'number' && Number.isFinite(value[key])))
    && Array.isArray(value.tags) && value.tags.every(tag => typeof tag === 'string')
    && Array.isArray(value.notes) && value.notes.every(note => record(note) && strings(note, ['id', 'text', 'author', 'createdAt']))
    && Array.isArray(value.activities) && value.activities.every(activity => record(activity) && strings(activity, ['id', 'type', 'text', 'date', 'author']))
    && Array.isArray(value.deals) && value.deals.every(deal => record(deal) && strings(deal, ['id', 'title', 'assignee', 'nextAction']) && oneOf(deal.stage, stages) && oneOf(deal.currency, ['KGS', 'USD']) && oneOf(deal.priority, ['A', 'B', 'C']) && typeof deal.amount === 'number' && Number.isFinite(deal.amount) && deal.amount >= 0);
}
export function validateWorkspace(data: WorkspaceData): WorkspaceData {
    if (!data || data.version !== 1 || !Array.isArray(data.companies) || !Array.isArray(data.tasks) || !record(data.settings) || typeof data.settings.name !== 'string' || !oneOf(data.settings.currency, ['KGS', 'USD']) || typeof data.settings.notifications !== 'boolean' || !['en', 'ru'].includes(data.language)) throw new Error('Saved workspace could not be read. The original data has been left untouched.');
    if (!data.companies.every(validCompany) || !data.tasks.every(task => record(task) && strings(task, ['id', 'title', 'companyId', 'companyName', 'due', 'assignee']) && typeof task.completed === 'boolean' && oneOf(task.bucket, ['Overdue', 'Today', 'This week', 'Completed']))) throw new Error('Saved CRM data is invalid. The original data has been left untouched.');
    return data;
}
export const supabaseRepository: CrmRepository = {
  async load(userId) {
    const { data, error } = await createClient().from('crm_workspaces').select('data,revision').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data ? { data: validateWorkspace(data.data as WorkspaceData), revision: data.revision } : { data: structuredClone(defaultData), revision: null };
  },
  async save(userId, data, revision) {
    validateWorkspace(data);
    const table = createClient().from('crm_workspaces');
    const nextRevision = (revision ?? 0) + 1;
    const row = { user_id: userId, data, revision: nextRevision, updated_at: new Date().toISOString() };
    const { data: saved, error } = revision === null
      ? await table.insert(row).select('revision')
      : await table.update(row).eq('user_id', userId).eq('revision', revision).select('revision');
    if (error?.code === '23505' || error?.code === 'PGRST116' || (!error && !saved?.length)) throw new Error('This workspace changed in another tab or device. Download your unsaved data, then reload before editing again.');
    if (error) throw error;
    return saved![0].revision as number;
  },
};

/** Reads the prior release's browser-only records without changing or deleting them. */
export function readBrowserBackup(email?: string, userId?: string): WorkspaceData | null {
  // Newer releases used email-scoped keys. Never scan other users' keys.
  const scopedCompanies = (email && localStorage.getItem(`oshbiz_companies_${email}`)) || (userId && localStorage.getItem(`oshbiz_companies_${userId}`));
  const scopedTasks = (email && localStorage.getItem(`oshbiz_tasks_${email}`)) || (userId && localStorage.getItem(`oshbiz_tasks_${userId}`));
  if (scopedCompanies || scopedTasks) return validateWorkspace({ ...structuredClone(defaultData), companies: scopedCompanies ? JSON.parse(scopedCompanies) : [], tasks: scopedTasks ? JSON.parse(scopedTasks) : [] });
  const versioned = localStorage.getItem('oshbiz.workspace.v1');
  if (versioned) return validateWorkspace(JSON.parse(versioned) as WorkspaceData);
  const oldCompanies = localStorage.getItem('oshbiz_companies');
  const oldTasks = localStorage.getItem('oshbiz_tasks');
  if (!oldCompanies && !oldTasks) return null;
  return validateWorkspace({ ...structuredClone(defaultData), companies: oldCompanies ? JSON.parse(oldCompanies) : [], tasks: oldTasks ? JSON.parse(oldTasks) : [] });
}

export function newCompany(input: Pick<Company, 'name' | 'category' | 'address'> & Partial<Company>): Company {
  return { id: crypto.randomUUID(), district: 'Osh', rating: 0, ratingCount: 0, status: 'Not yet', priority: 'B', tags: [], assignee: 'Unassigned', favourite: false, wishlist: false, notes: [], activities: [], deals: [], verified: false, source: 'manual', ...input };
}
