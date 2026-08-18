/**
 * Centralised mock data layer.
 * Every screen reads from here through `src/lib/dayly/service.ts`, so swapping
 * in real API/database calls later means changing only the service module.
 * Sample content only — nothing here is product configuration.
 */

import type {
  DaylyEvent,
  DaylyNotification,
  HouseholdMember,
  MemoryItem,
  MockFile,
  ProposedItem,
  Reminder,
  Task,
  UserProfile,
} from "./types";

export const mockUser: UserProfile = {
  id: "u_owner",
  name: "Joshua A.",
  email: "joshua@example.com",
  initials: "JA",
  timezone: "(UTC+01:00) West Africa Time",
  householdName: "The Adeyemi Household",
};

export const mockMembers: HouseholdMember[] = [
  {
    id: "u_owner",
    name: "Joshua A.",
    email: "joshua@example.com",
    role: "Owner",
    status: "active",
    initials: "JA",
    isCurrentUser: true,
  },
  {
    id: "u_adult",
    name: "Sarah A.",
    email: "sarah@example.com",
    role: "Adult",
    status: "pending",
    initials: "SA",
  },
];

export const mockTasks: Task[] = [
  {
    id: "t_1",
    title: "Submit permission slip",
    description: "Hand in the signed form to the school office.",
    dueDate: "2026-09-02",
    dueLabel: "Due Wed, Sep 2",
    status: "open",
    priority: "high",
    assigneeId: "u_adult",
    assignedById: "u_owner",
    reminderAt: "Tue, Sep 1 at 7:00 PM",
    visibility: "household",
    sourceId: "m_1",
  },
  {
    id: "t_2",
    title: "Pay school fees",
    dueDate: "2026-08-10",
    dueLabel: "Overdue since Aug 10",
    status: "overdue",
    priority: "high",
    assigneeId: "u_owner",
    visibility: "household",
    sourceId: "m_1",
  },
  {
    id: "t_3",
    title: "Renew home insurance",
    description: "Policy expires at the end of the month.",
    dueDate: "2026-08-28",
    dueLabel: "Due Fri, Aug 28",
    status: "open",
    priority: "medium",
    assigneeId: "u_owner",
    visibility: "private",
    sourceId: "m_2",
  },
  {
    id: "t_4",
    title: "Pick up report card",
    dueDate: "2026-09-12",
    dueLabel: "Due Sat, Sep 12",
    status: "open",
    priority: "medium",
    assigneeId: "u_owner",
    assignedById: "u_adult",
    visibility: "household",
  },
  {
    id: "t_5",
    title: "Buy birthday gift",
    dueDate: "2026-09-15",
    dueLabel: "Due Tue, Sep 15",
    status: "open",
    priority: "low",
    assigneeId: "u_adult",
    assignedById: "u_owner",
    visibility: "household",
  },
];

export const mockEvents: DaylyEvent[] = [
  {
    id: "e_1",
    title: "Doctor appointment",
    date: "2026-08-18",
    startTime: "10:00 AM",
    endTime: "10:45 AM",
    allDay: false,
    location: "Grove Family Clinic",
    notes: "Bring the referral letter.",
    reminderAt: "Today at 9:00 AM",
    visibility: "private",
  },
  {
    id: "e_2",
    title: "School pickup",
    date: "2026-08-18",
    startTime: "4:00 PM",
    allDay: false,
    location: "Greenfield School",
    visibility: "household",
  },
  {
    id: "e_3",
    title: "School excursion",
    date: "2026-09-04",
    allDay: true,
    location: "Greenfield School",
    notes: "Bring lunch and water.",
    reminderAt: "Thu, Sep 3 at 7:00 PM",
    visibility: "household",
    sourceId: "m_1",
  },
  {
    id: "e_4",
    title: "Parent meeting",
    date: "2026-09-12",
    startTime: "6:30 PM",
    endTime: "7:30 PM",
    allDay: false,
    location: "Greenfield School hall",
    visibility: "household",
  },
];

export const mockReminders: Reminder[] = [
  {
    id: "r_1",
    relatedItemId: "e_3",
    relatedItemTitle: "School excursion",
    relatedItemType: "event",
    date: "2026-09-03",
    time: "7:00 PM",
    repeat: "none",
    visibility: "household",
  },
  {
    id: "r_2",
    relatedItemId: "t_1",
    relatedItemTitle: "Submit permission slip",
    relatedItemType: "task",
    date: "2026-09-01",
    time: "7:00 PM",
    repeat: "none",
    visibility: "household",
  },
];

export const mockMemory: MemoryItem[] = [
  {
    id: "m_1",
    title: "School excursion notice",
    kind: "document",
    capturedAt: "May 26, 2026",
    pages: 1,
    fileSize: "1.2 MB",
    summary:
      "Notice from the school office about an upcoming excursion, including a permission slip deadline and a fees reminder.",
    notes: "Original notice from the school office.",
    visibility: "household",
    linkedTaskIds: ["t_1", "t_2"],
    linkedEventIds: ["e_3"],
    relatedTitles: ["School fees payment due Sep 10", "Parent meeting Sep 12"],
  },
  {
    id: "m_2",
    title: "Home insurance policy",
    kind: "document",
    capturedAt: "May 18, 2026",
    pages: 8,
    fileSize: "1.1 MB",
    summary:
      "Annual home insurance policy document. Cover renews at the end of August.",
    visibility: "private",
    linkedTaskIds: ["t_3"],
    linkedEventIds: [],
    relatedTitles: ["Insurance renewal quote email"],
  },
  {
    id: "m_3",
    title: "Clinic receipt",
    kind: "photo",
    capturedAt: "May 12, 2026",
    fileSize: "1.3 MB",
    summary: "Photo of a clinic payment receipt kept for records.",
    visibility: "private",
    linkedTaskIds: [],
    linkedEventIds: ["e_1"],
    relatedTitles: [],
  },
];

export const mockFiles: MockFile[] = [
  { id: "f_1", name: "School_Notice.pdf", kind: "pdf", meta: "May 26, 2026 · 1 page · 1.2 MB" },
  { id: "f_2", name: "Report_Card.pdf", kind: "pdf", meta: "May 20, 2026 · 2 pages · 900 KB" },
  { id: "f_3", name: "Insurance_Doc.pdf", kind: "pdf", meta: "May 18, 2026 · 8 pages · 1.1 MB" },
  { id: "f_4", name: "Receipt.jpg", kind: "image", meta: "May 12, 2026 · 1.3 MB" },
];

export const mockProposals: ProposedItem[] = [
  {
    id: "p_1",
    type: "task",
    title: "Submit permission slip",
    confidence: "clear",
    fields: [
      { label: "Due", value: "Wednesday, September 2" },
      { label: "Assign to", value: "Sarah A. (Adult)" },
      { label: "Reminder", value: "Tue, Sep 1 at 7:00 PM" },
    ],
    evidence: {
      sourceId: "m_1",
      sourceTitle: "School_Notice.pdf",
      sourceKind: "document",
      capturedAt: "May 26, 2026",
      locator: "Page 1",
      quote:
        "Permission slips must be submitted to the school office by Wednesday, September 2.",
    },
    visibility: "household",
  },
  {
    id: "p_2",
    type: "event",
    title: "School excursion",
    confidence: "clear",
    fields: [
      { label: "Date", value: "Friday, September 4 (all day)" },
      { label: "Location", value: "Greenfield School" },
    ],
    evidence: {
      sourceId: "m_1",
      sourceTitle: "School_Notice.pdf",
      sourceKind: "document",
      capturedAt: "May 26, 2026",
      locator: "Page 1",
      quote:
        "The excursion will take place on Friday, September 4. Students should assemble at the school gate.",
    },
    visibility: "household",
  },
  {
    id: "p_3",
    type: "reminder",
    title: "School fees payment",
    confidence: "uncertain",
    question: "I'm not sure which date you mean.",
    interpretations: [
      "Thursday, September 10 — the payment deadline in the notice",
      "Friday, September 4 — the excursion date mentioned nearby",
    ],
    fields: [{ label: "Reminder", value: "Not set yet" }],
    evidence: {
      sourceId: "m_1",
      sourceTitle: "School_Notice.pdf",
      sourceKind: "document",
      capturedAt: "May 26, 2026",
      locator: "Page 1",
      quote: "Outstanding fees should be settled before the trip.",
    },
    visibility: "household",
  },
];

export const mockNotifications: DaylyNotification[] = [
  {
    id: "n_1",
    category: "reminder",
    title: "Doctor appointment",
    body: "Tomorrow at 10:00 AM.",
    timeLabel: "9:00 AM",
    read: false,
  },
  {
    id: "n_2",
    category: "review",
    title: "Review needed",
    body: "School excursion notice has 2 items to review.",
    timeLabel: "Yesterday",
    read: false,
  },
  {
    id: "n_3",
    category: "assignment",
    title: "Task assigned to you",
    body: "Pay school fees was assigned to you.",
    timeLabel: "Yesterday",
    read: true,
  },
  {
    id: "n_4",
    category: "update",
    title: "Event updated",
    body: "Parent meeting time changed to 6:30 PM.",
    timeLabel: "May 30",
    read: true,
  },
];

export const mockSuggestedSearches = [
  "When is the next school event?",
  "What documents do I need?",
  "When does the insurance expire?",
];

export interface SearchAnswer {
  query: string;
  answer: string | null;
  evidence?: {
    sourceId: string;
    sourceTitle: string;
    locator: string;
    quote: string;
  };
  related: string[];
}

export const mockSearchAnswers: SearchAnswer[] = [
  {
    query: "When is the next school event?",
    answer:
      "The next school event is the School excursion on Friday, September 4, 2026.",
    evidence: {
      sourceId: "m_1",
      sourceTitle: "School excursion notice",
      locator: "May 26, 2026 · Page 1",
      quote: "The excursion will take place on Friday, September 4.",
    },
    related: ["School fees payment due Sep 10", "Parent meeting Sep 12"],
  },
  {
    query: "When does the insurance expire?",
    answer: "Your home insurance cover renews at the end of August 2026.",
    evidence: {
      sourceId: "m_2",
      sourceTitle: "Home insurance policy",
      locator: "May 18, 2026 · Page 3",
      quote: "Cover period ends on 31 August 2026 unless renewed.",
    },
    related: ["Renew home insurance"],
  },
];

export const mockTimezones = [
  "(UTC+01:00) West Africa Time",
  "(UTC+00:00) Greenwich Mean Time",
  "(UTC+02:00) Central European Time",
  "(UTC-05:00) Eastern Time",
  "(UTC-08:00) Pacific Time",
];
