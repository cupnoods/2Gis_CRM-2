import type { Company, Deal, Task } from "./types";

const people = ["Alex", "Nurai", "Daniyar", "Aizada"];
const bases = [
  ["Sulaiman Coffee", "Restaurants", "Central Osh", 4.8], ["Silk Road Kitchen", "Restaurants", "East district", 4.7],
  ["Archa Bakery", "Restaurants", "Central Osh", 4.6], ["Dostuk Restaurant", "Restaurants", "South district", 4.5],
  ["Ala-Too Bistro", "Restaurants", "Central Osh", 4.4], ["Osh Plaza Hotel", "Hotels", "Lenin Street", 4.7],
  ["Navat Boutique Hotel", "Hotels", "Kurmanjan Datka", 4.3], ["Berekе Market", "Supermarkets", "Masalieva Street", 4.2],
  ["Dordoi Mini Market", "Supermarkets", "Alimbek Datka", 4.1], ["Neman Pharmacy", "Pharmacies", "Mamyrova Street", 4.5],
  ["Aibolit Pharmacy", "Pharmacies", "Kurmanjan Datka", 4.4], ["Pulse Fitness Osh", "Fitness", "Lenin Street", 4.8],
  ["Bilim Academy", "Education", "Razzakova Street", 4.9], ["OshBuild Group", "Construction", "Kyrgyz-Ata", 4.1],
  ["Silk Road Logistics", "Logistics", "Industrial zone", 4.3], ["Mosaic Beauty Studio", "Beauty", "Alymbek Datka", 4.6],
  ["Tumar Tech", "Technology", "Navoi Street", 4.5], ["Kelechek IT School", "Education", "Kurmanjan Datka", 4.7],
] as const;

export const stages = ["New", "Qualified", "Contact made", "Meeting", "Proposal", "Negotiation", "Won", "Lost"] as const;
const deal = (id: string, title: string, stage: Deal["stage"], amount: number, currency: Deal["currency"], assignee: string, nextAction: string, priority: Deal["priority"]): Deal => ({ id, title, stage, amount, currency, assignee, nextAction, priority });

export const companies: Company[] = bases.map(([name, category, district, rating], i) => {
  const status = (["In progress", "Not yet", "Worked with", "Not yet", "In progress", "Worked with", "Declined"] as const)[i % 7];
  const notes = i % 3 === 0 ? [{ id: `note-${i}`, text: "Interested in a customer retention package. Follow up with the owner this week.", author: people[i % people.length], createdAt: "Today, 10:20" }] : [];
  const activities = i % 2 === 0 ? [{ id: `activity-${i}`, type: "call", text: "Call logged", date: "Yesterday", author: people[i % people.length] }] : [];
  const deals = i % 3 === 0 ? [deal(`deal-${i}`, i % 2 ? "Growth partnership" : "Retention package", (stages[(i + 2) % 6]) as Deal["stage"], 20000 + i * 12500, i % 5 === 0 ? "USD" : "KGS", people[i % people.length], i % 4 === 0 ? "Overdue" : "Tomorrow", (['A', 'B', 'C'] as const)[i % 3])] : [];
  return { id: `company-${i + 1}`, name, category, address: `${district}, Osh`, district, rating, ratingCount: 32 + i * 13, status, priority: (['A', 'B', 'C'] as const)[i % 3], tags: [category === "Restaurants" ? "hospitality" : "priority lead", i % 2 ? "new segment" : "warm lead", "Osh"], assignee: people[i % people.length], favourite: i % 4 === 0, wishlist: i % 5 === 0, phone: i % 4 !== 2 ? "+996 550 12 34 56" : undefined, whatsapp: i % 3 !== 1 ? "wa.me/996550123456" : undefined, instagram: i % 4 !== 3 ? "@oshbiz" : undefined, website: i % 2 === 0 ? "oshbiz.example" : undefined, nextAction: deals.length ? deals[0].title : undefined, nextActionDate: deals.length ? deals[0].nextAction : undefined, notes, activities, deals, verified: i % 3 !== 1 };
});

export const tasks: Task[] = [
  { id: "task-1", title: "Call Aida about the proposal", companyId: "company-1", companyName: "Sulaiman Coffee", due: "Today · 14:30", bucket: "Today", assignee: "Alex", completed: false },
  { id: "task-2", title: "Send a follow-up WhatsApp", companyId: "company-2", companyName: "Silk Road Kitchen", due: "Yesterday", bucket: "Overdue", assignee: "Nurai", completed: false },
  { id: "task-3", title: "Prepare discovery questions", companyId: "company-6", companyName: "Osh Plaza Hotel", due: "Tomorrow · 09:00", bucket: "This week", assignee: "Daniyar", completed: false },
  { id: "task-4", title: "Log the meeting outcome", companyId: "company-3", companyName: "Archa Bakery", due: "Friday", bucket: "This week", assignee: "Alex", completed: false },
  { id: "task-5", title: "Send welcome note", companyId: "company-8", companyName: "Berekе Market", due: "Monday", bucket: "Completed", assignee: "Aizada", completed: true },
];
