export type Language = "en" | "ru";
export type WorkingStatus = "Not yet" | "In progress" | "Worked with" | "Declined";
export type Priority = "A" | "B" | "C";
export type Stage = "New" | "Qualified" | "Contact made" | "Meeting" | "Proposal" | "Negotiation" | "Won" | "Lost";

export interface Note { id: string; text: string; author: string; createdAt: string; }
export interface Activity { id: string; type: string; text: string; date: string; author: string; }
export interface Deal { id: string; title: string; stage: Stage; amount: number; currency: "KGS" | "USD"; assignee: string; nextAction: string; priority: Priority; }
export interface Company {
  id: string; name: string; category: string; address: string; district: string; rating: number; ratingCount: number;
  status: WorkingStatus; priority: Priority; tags: string[]; assignee: string; favourite: boolean; wishlist: boolean;
  phone?: string; whatsapp?: string; instagram?: string; website?: string; nextAction?: string; nextActionDate?: string;
  source?: '2gis' | 'manual' | 'csv'; sourceId?: string; longitude?: number; latitude?: number;
  notes: Note[]; activities: Activity[]; deals: Deal[]; verified: boolean;
}
export interface Task { id: string; title: string; companyId: string; companyName: string; due: string; bucket: "Overdue" | "Today" | "This week" | "Completed"; assignee: string; completed: boolean; }
