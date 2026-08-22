/**
 * Realistic mock data for the Dayly intelligence layer.
 * Nothing here calls a network: it stands in for what a real backend will
 * return once inbox ingestion + AI extraction are connected.
 */

import type {
  AskAnswer,
  CalendarEventDto,
  ChangeItem,
  InboxItemDetail,
  SourceCluster,
  SourceRef,
} from "../types";

const schoolEmail: SourceRef = {
  id: "src-school-email",
  name: "Lincoln Elementary email",
  type: "email",
  date: "Sep 2, 2026",
  excerpt:
    "Our 4th grade fall field trip to Washington Nature Center takes place September 14, 9:00 AM – 3:00 PM. Signed permission slips are due September 8.",
  relation: "Original announcement the event and deadline were extracted from",
  memoryId: "mem-1",
};

const schoolPdf: SourceRef = {
  id: "src-school-pdf",
  name: "Field_Trip_Permission.pdf",
  type: "pdf",
  date: "Sep 2, 2026",
  excerpt: "Permission slip — parent/guardian signature required. Return to homeroom teacher by Sep 8.",
  relation: "Attachment that confirms the return deadline",
  memoryId: "mem-1",
};

const soccerEmail: SourceRef = {
  id: "src-soccer-email",
  name: "Soccer Club email",
  type: "email",
  date: "Sep 5, 2026",
  excerpt:
    "Starting this week, U10 practice moves to Wednesdays at 5:30 PM at Riverside Park. Coach Daniel Reyes will lead sessions.",
  relation: "Newest schedule information",
  memoryId: "mem-2",
};

const soccerPdf: SourceRef = {
  id: "src-soccer-pdf",
  name: "Fall_Practice_Schedule.pdf",
  type: "pdf",
  date: "Sep 5, 2026",
  excerpt: "U10 — Wednesday 17:30–18:45, Riverside Park (field 2).",
  relation: "Attached schedule matching the email",
  memoryId: "mem-2",
};

const soccerCalendar: SourceRef = {
  id: "src-soccer-calendar",
  name: "Family calendar — Soccer practice",
  type: "calendar",
  date: "Recurring, Tuesdays",
  excerpt: "Soccer practice · Tuesday 5:30 PM · Riverside Park",
  relation: "Existing calendar entry that disagrees with the new schedule",
};

const soccerPastEvent: SourceRef = {
  id: "src-soccer-prev",
  name: "Previous soccer event (Aug)",
  type: "memory",
  date: "Aug 26, 2026",
  excerpt: "Soccer practice · Tuesday 5:30 PM · Riverside Park — attended",
  relation: "Historical pattern before the change",
};

const dentistVoice: SourceRef = {
  id: "src-dentist-voice",
  name: "Voice note — dentist call",
  type: "voice",
  date: "Sep 4, 2026",
  excerpt: "“They moved Emma's cleaning to September 10 at 4 in the afternoon.”",
  relation: "Voice capture describing the new appointment time",
  memoryId: "mem-3",
};

const dentistEmail: SourceRef = {
  id: "src-dentist-email",
  name: "Riverside Dental confirmation",
  type: "email",
  date: "Sep 4, 2026",
  excerpt: "Appointment confirmed: Thursday, September 10 at 4:00 PM with Dr. Okafor.",
  relation: "Written confirmation of the rescheduled time",
};

const dismissalPhoto: SourceRef = {
  id: "src-dismissal-photo",
  name: "Photo — school newsletter",
  type: "image",
  date: "Sep 3, 2026",
  excerpt: "Reminder: Friday, September 11 is an early-release day. Dismissal at 12:30 PM.",
  relation: "Photographed notice with the new dismissal time",
  memoryId: "mem-4",
};

export const mockInboxItems: InboxItemDetail[] = [
  {
    id: "inb-1",
    title: "Fall Field Trip Information",
    preview: "4th grade trip to Washington Nature Center — permission slip due Sep 8.",
    sourceName: "Lincoln Elementary",
    sourceKind: "email",
    person: "Ms. Harper (Grade 4)",
    receivedAt: "2026-09-02T08:12:00Z",
    receivedLabel: "Sep 2",
    aiStatus: "needs_action",
    detected: [{ label: "event", count: 1 }, { label: "deadline", count: 1 }, { label: "task", count: 1 }],
    actionsDetected: 3,
    reviewStatus: "needs_review",
    important: true,
    archived: false,
    categories: ["emails", "events", "tasks", "documents", "important"],
    content:
      "Dear families,\n\nOur 4th grade fall field trip to Washington Nature Center takes place on Monday, September 14 from 9:00 AM to 3:00 PM. Students should bring a packed lunch and weather-appropriate clothing.\n\nSigned permission slips are due to your child's homeroom teacher by Monday, September 8. The trip fee of $12 can be paid online.\n\nWarm regards,\nMs. Harper",
    summary:
      "Lincoln Elementary announced the 4th grade fall field trip on September 14 and needs a signed permission slip returned by September 8.",
    importantInfo: [
      "Trip fee is $12, payable online",
      "Students need a packed lunch and outdoor clothing",
      "Permission slip must be signed by a parent or guardian",
    ],
    people: ["Ms. Harper", "Emma"],
    locations: ["Washington Nature Center"],
    deadlines: [{ label: "Return permission slip", value: "September 8, 2026" }],
    proposals: [
      {
        id: "prop-inb1-event",
        kicker: "Field trip permission",
        title: "Fall field trip — Washington Nature Center",
        fields: [
          { label: "Event", value: "September 14, 2026" },
          { label: "Time", value: "9:00 AM – 3:00 PM" },
          { label: "Location", value: "Washington Nature Center" },
        ],
        suggestedReminder: "September 13 at 7:00 PM",
        confidence: "clear",
        status: "needs_review",
        sources: [schoolEmail, schoolPdf],
      },
      {
        id: "prop-inb1-task",
        kicker: "Task",
        title: "Return permission slip",
        fields: [
          { label: "Task", value: "Return signed permission slip" },
          { label: "Deadline", value: "September 8, 2026" },
          { label: "Assignee", value: "You" },
        ],
        suggestedReminder: "September 6 at 9:00 AM",
        confidence: "clear",
        status: "needs_review",
        sources: [schoolPdf, schoolEmail],
      },
      {
        id: "prop-inb1-fee",
        kicker: "Task",
        title: "Pay $12 trip fee",
        fields: [
          { label: "Task", value: "Pay field trip fee online" },
          { label: "Amount", value: "$12.00" },
        ],
        confidence: "uncertain",
        question: "The email doesn't give a payment deadline. When should this be due?",
        interpretations: ["Same as slip — Sep 8", "Day before trip — Sep 13", "No deadline"],
        status: "needs_review",
        sources: [schoolEmail],
      },
    ],
    sources: [schoolEmail, schoolPdf],
  },
  {
    id: "inb-2",
    title: "Practice Schedule Update",
    preview: "U10 practice moves from Tuesday to Wednesday at 5:30 PM, Riverside Park.",
    sourceName: "Soccer Club",
    sourceKind: "email",
    person: "Coach Daniel Reyes",
    receivedAt: "2026-09-05T15:40:00Z",
    receivedLabel: "Sep 5",
    aiStatus: "needs_action",
    detected: [{ label: "Schedule change detected" }],
    actionsDetected: 1,
    reviewStatus: "needs_review",
    important: true,
    archived: false,
    categories: ["emails", "events", "changed", "important"],
    content:
      "Hi parents,\n\nStarting this week, U10 practice moves to Wednesdays at 5:30 PM at Riverside Park (field 2). Sessions run 75 minutes. Registration payment of $85 is due September 9.\n\nSee you on the pitch,\nCoach Daniel Reyes",
    summary:
      "Soccer practice moved from Tuesday to Wednesday at 5:30 PM. Your calendar still shows the old Tuesday slot.",
    importantInfo: [
      "Practice length is 75 minutes",
      "Registration payment of $85 is due September 9",
      "Field 2 at Riverside Park",
    ],
    people: ["Coach Daniel Reyes", "Emma"],
    locations: ["Riverside Park"],
    deadlines: [{ label: "Pay soccer registration", value: "September 9, 2026" }],
    proposals: [
      {
        id: "prop-inb2-move",
        kicker: "Schedule change",
        title: "Move soccer practice to Wednesday",
        fields: [
          { label: "Previous", value: "Tuesday, 5:30 PM" },
          { label: "New", value: "Wednesday, 5:30 PM" },
          { label: "Location", value: "Riverside Park (field 2)" },
        ],
        suggestedReminder: "Wednesdays at 4:30 PM",
        confidence: "clear",
        status: "needs_review",
        sources: [soccerEmail, soccerPdf, soccerCalendar],
      },
      {
        id: "prop-inb2-pay",
        kicker: "Task",
        title: "Pay soccer registration",
        fields: [
          { label: "Task", value: "Pay $85 registration" },
          { label: "Deadline", value: "September 9, 2026" },
        ],
        confidence: "clear",
        status: "needs_review",
        sources: [soccerEmail],
      },
    ],
    sources: [soccerEmail, soccerPdf, soccerCalendar, soccerPastEvent],
  },
  {
    id: "inb-3",
    title: "Early release — Friday dismissal at 12:30 PM",
    preview: "Photographed newsletter: Friday Sep 11 dismissal moves from 3:00 PM to 12:30 PM.",
    sourceName: "Photo capture",
    sourceKind: "image",
    person: "You",
    receivedAt: "2026-09-03T18:02:00Z",
    receivedLabel: "Sep 3",
    aiStatus: "needs_action",
    detected: [{ label: "Schedule change detected" }, { label: "reminder", count: 1 }],
    actionsDetected: 2,
    reviewStatus: "needs_review",
    important: false,
    archived: false,
    categories: ["events", "changed"],
    content:
      "SCHOOL NEWSLETTER — WEEK OF SEPT 7\n\nReminder: Friday, September 11 is an early-release day. Dismissal at 12:30 PM. After-school clubs are cancelled.",
    summary: "Friday, September 11 is an early-release day — dismissal moves to 12:30 PM.",
    importantInfo: ["After-school clubs are cancelled that day"],
    people: ["Emma"],
    locations: ["Lincoln Elementary"],
    deadlines: [],
    proposals: [
      {
        id: "prop-inb3-dismissal",
        kicker: "Schedule change",
        title: "Friday dismissal moved earlier",
        fields: [
          { label: "Previous", value: "Friday dismissal — 3:00 PM" },
          { label: "New", value: "Friday dismissal — 12:30 PM" },
          { label: "Date", value: "September 11, 2026" },
        ],
        suggestedReminder: "September 11 at 11:30 AM",
        confidence: "clear",
        status: "needs_review",
        sources: [dismissalPhoto],
      },
    ],
    sources: [dismissalPhoto],
  },
  {
    id: "inb-4",
    title: "Dental appointment rescheduled",
    preview: "Riverside Dental moved Emma's cleaning from 2:00 PM to 4:00 PM on Sep 10.",
    sourceName: "Riverside Dental",
    sourceKind: "email",
    person: "Dr. Okafor's office",
    receivedAt: "2026-09-04T11:20:00Z",
    receivedLabel: "Sep 4",
    aiStatus: "needs_action",
    detected: [{ label: "Time change detected" }],
    actionsDetected: 1,
    reviewStatus: "needs_review",
    important: false,
    archived: false,
    categories: ["emails", "events", "changed"],
    content:
      "Appointment confirmed: Thursday, September 10 at 4:00 PM with Dr. Okafor. Please arrive 10 minutes early. Reply to this email to reschedule.",
    summary: "Emma's dental cleaning on September 10 moved from 2:00 PM to 4:00 PM.",
    importantInfo: ["Arrive 10 minutes early", "Bring insurance card"],
    people: ["Dr. Okafor", "Emma"],
    locations: ["Riverside Dental"],
    deadlines: [],
    proposals: [
      {
        id: "prop-inb4-time",
        kicker: "Time change",
        title: "Dental cleaning moved to 4:00 PM",
        fields: [
          { label: "Previous", value: "September 10 — 2:00 PM" },
          { label: "New", value: "September 10 — 4:00 PM" },
          { label: "Location", value: "Riverside Dental" },
        ],
        suggestedReminder: "September 10 at 3:00 PM",
        confidence: "clear",
        status: "needs_review",
        sources: [dentistEmail, dentistVoice],
      },
    ],
    sources: [dentistEmail, dentistVoice],
  },
  {
    id: "inb-5",
    title: "Registration form — after school art club",
    preview: "PDF form with two fields to complete and a signature.",
    sourceName: "Art Club",
    sourceKind: "pdf",
    person: "Mr. Idowu",
    receivedAt: "2026-09-01T09:00:00Z",
    receivedLabel: "Sep 1",
    aiStatus: "understood",
    detected: [{ label: "document", count: 1 }, { label: "task", count: 1 }],
    actionsDetected: 2,
    reviewStatus: "approved",
    important: false,
    archived: false,
    categories: ["documents", "tasks"],
    content:
      "AFTER SCHOOL ART CLUB — REGISTRATION\nStudent name: ____\nEmergency contact: ____\nParent signature: ____\nReturn by September 15.",
    summary: "Art club registration form needs completing and returning by September 15.",
    importantInfo: ["Emergency contact required", "Signature required"],
    people: ["Mr. Idowu"],
    locations: ["Lincoln Elementary — Room 12"],
    deadlines: [{ label: "Return art club form", value: "September 15, 2026" }],
    proposals: [
      {
        id: "prop-inb5-task",
        kicker: "Task",
        title: "Complete and return art club form",
        fields: [
          { label: "Task", value: "Complete art club registration" },
          { label: "Deadline", value: "September 15, 2026" },
        ],
        confidence: "clear",
        status: "approved",
        sources: [
          {
            id: "src-art-pdf",
            name: "Art_Club_Registration.pdf",
            type: "pdf",
            date: "Sep 1, 2026",
            excerpt: "Return by September 15. Parent signature required.",
            relation: "Form the task was created from",
            memoryId: "mem-5",
          },
        ],
      },
    ],
    sources: [
      {
        id: "src-art-pdf",
        name: "Art_Club_Registration.pdf",
        type: "pdf",
        date: "Sep 1, 2026",
        excerpt: "Return by September 15. Parent signature required.",
        relation: "Form the task was created from",
        memoryId: "mem-5",
      },
    ],
  },
  {
    id: "inb-6",
    title: "Voice note — groceries and swim kit",
    preview: "“Remember to buy shin guards and Emma's swim goggles before Saturday.”",
    sourceName: "Voice capture",
    sourceKind: "voice",
    person: "You",
    receivedAt: "2026-09-05T20:15:00Z",
    receivedLabel: "Sep 5",
    aiStatus: "understood",
    detected: [{ label: "task", count: 2 }],
    actionsDetected: 2,
    reviewStatus: "needs_review",
    important: false,
    archived: false,
    categories: ["tasks"],
    content: "“Remember to buy shin guards and Emma's swim goggles before Saturday.”",
    summary: "Two shopping tasks captured by voice, both needed before Saturday.",
    importantInfo: [],
    people: ["Emma"],
    locations: [],
    deadlines: [{ label: "Both items needed by", value: "Saturday, September 12" }],
    proposals: [
      {
        id: "prop-inb6-tasks",
        kicker: "Task",
        title: "Buy soccer shin guards and swim goggles",
        fields: [
          { label: "Task", value: "Buy shin guards + swim goggles" },
          { label: "Deadline", value: "September 12, 2026" },
        ],
        confidence: "clear",
        status: "needs_review",
        sources: [
          {
            id: "src-voice-groceries",
            name: "Voice note — Sep 5",
            type: "voice",
            date: "Sep 5, 2026",
            excerpt: "“…buy shin guards and Emma's swim goggles before Saturday.”",
            relation: "Transcript the tasks were extracted from",
          },
        ],
      },
    ],
    sources: [
      {
        id: "src-voice-groceries",
        name: "Voice note — Sep 5",
        type: "voice",
        date: "Sep 5, 2026",
        excerpt: "“…buy shin guards and Emma's swim goggles before Saturday.”",
        relation: "Transcript the tasks were extracted from",
      },
    ],
  },
  {
    id: "inb-7",
    title: "Class photo order form",
    preview: "Orders close September 20. Packages start at $18.",
    sourceName: "PhotoWorks",
    sourceKind: "document",
    person: "School office",
    receivedAt: "2026-08-30T10:30:00Z",
    receivedLabel: "Aug 30",
    aiStatus: "understood",
    detected: [{ label: "deadline", count: 1 }],
    actionsDetected: 1,
    reviewStatus: "dismissed",
    important: false,
    archived: true,
    categories: ["documents", "tasks"],
    content: "Class photo packages start at $18. Orders close September 20.",
    summary: "Optional class photo order, closes September 20.",
    importantInfo: ["Optional purchase"],
    people: [],
    locations: [],
    deadlines: [{ label: "Photo orders close", value: "September 20, 2026" }],
    proposals: [],
    sources: [
      {
        id: "src-photo-doc",
        name: "Class_Photos.pdf",
        type: "pdf",
        date: "Aug 30, 2026",
        excerpt: "Orders close September 20. Packages from $18.",
        relation: "Document the deadline came from",
      },
    ],
  },
];

export const mockChanges: ChangeItem[] = [
  {
    id: "chg-1",
    emoji: "⚽",
    category: "Soccer practice",
    title: "Practice moved to Wednesday",
    kind: "conflict",
    previous: "Tuesday, 5:30 PM",
    next: "Wednesday, 5:30 PM",
    detail: "Your calendar still shows Tuesday, so both entries currently disagree.",
    detectedLabel: "Detected today from Soccer Club email",
    status: "needs_review",
    sources: [soccerEmail, soccerCalendar, soccerPdf],
  },
  {
    id: "chg-2",
    emoji: "🏫",
    category: "School",
    title: "Friday dismissal is earlier",
    kind: "changed",
    previous: "Friday dismissal — 3:00 PM",
    next: "Friday dismissal — 12:30 PM",
    detail: "After-school clubs are cancelled on September 11.",
    detectedLabel: "Detected today from a photographed newsletter",
    status: "needs_review",
    sources: [dismissalPhoto],
  },
  {
    id: "chg-3",
    emoji: "🩺",
    category: "Appointment",
    title: "Dental cleaning rescheduled",
    kind: "changed",
    previous: "September 10 — 2:00 PM",
    next: "September 10 — 4:00 PM",
    detectedLabel: "Detected yesterday from Riverside Dental",
    status: "needs_review",
    sources: [dentistEmail, dentistVoice],
  },
  {
    id: "chg-4",
    emoji: "🎨",
    category: "Art club",
    title: "New registration deadline added",
    kind: "new",
    next: "Return form by September 15",
    detectedLabel: "Detected Sep 1 from Art_Club_Registration.pdf",
    status: "approved",
    sources: [
      {
        id: "src-art-pdf",
        name: "Art_Club_Registration.pdf",
        type: "pdf",
        date: "Sep 1, 2026",
        excerpt: "Return by September 15.",
        relation: "Source of the new deadline",
        memoryId: "mem-5",
      },
    ],
  },
  {
    id: "chg-5",
    emoji: "📸",
    category: "Class photos",
    title: "Optional photo order removed from your week",
    kind: "removed",
    previous: "Order class photos — Sep 20",
    detectedLabel: "You dismissed this item on Sep 2",
    status: "dismissed",
    sources: [
      {
        id: "src-photo-doc",
        name: "Class_Photos.pdf",
        type: "pdf",
        date: "Aug 30, 2026",
        excerpt: "Orders close September 20.",
        relation: "Source of the dismissed deadline",
      },
    ],
  },
];

export const mockClusters: SourceCluster[] = [
  {
    id: "cls-soccer",
    topic: "Soccer",
    emoji: "⚽",
    insight:
      "Your soccer practice appears in 3 sources. The newest schedule shows Wednesday at 5:30 PM. Your calendar still shows Tuesday at 5:30 PM.",
    conflict: true,
    conflictLabel: "Schedule conflict detected",
    sources: [soccerEmail, soccerPdf, soccerCalendar, soccerPastEvent],
  },
  {
    id: "cls-school",
    topic: "School — Lincoln Elementary",
    emoji: "🏫",
    insight:
      "The field trip, the permission slip and the early-release Friday all trace back to two school sources that agree with each other.",
    conflict: false,
    sources: [schoolEmail, schoolPdf, dismissalPhoto],
  },
  {
    id: "cls-health",
    topic: "Health & appointments",
    emoji: "🩺",
    insight:
      "A voice note and the clinic's confirmation email both describe September 10 at 4:00 PM, so Dayly is confident about the new time.",
    conflict: false,
    sources: [dentistVoice, dentistEmail],
  },
];

export const mockCalendar: CalendarEventDto[] = [
  { id: "cal-1", title: "Soccer practice", dateLabel: "Tue, Sep 8", timeLabel: "5:30 PM", location: "Riverside Park", changed: true },
  { id: "cal-2", title: "Dental cleaning — Emma", dateLabel: "Thu, Sep 10", timeLabel: "4:00 PM", location: "Riverside Dental", changed: true },
  { id: "cal-3", title: "Early release — dismissal", dateLabel: "Fri, Sep 11", timeLabel: "12:30 PM", location: "Lincoln Elementary", changed: true },
  { id: "cal-4", title: "Fall field trip", dateLabel: "Mon, Sep 14", timeLabel: "9:00 AM – 3:00 PM", location: "Washington Nature Center" },
];

export const mockAskSuggestions = [
  "When is Emma's next soccer practice?",
  "What do I need to do this week?",
  "Did anything change in the school schedule?",
  "What documents do I need to return?",
  "When is our next doctor's appointment?",
  "Who is Emma's soccer coach?",
  "Did I miss anything important?",
];

export const mockAnswers: Omit<AskAnswer, "id">[] = [
  {
    question: "When is Emma's next soccer practice?",
    answer:
      "Emma's next soccer practice is Wednesday, September 9 at 5:30 PM at Riverside Park. Heads up: your calendar still shows the old Tuesday slot.",
    bullets: [],
    sources: [soccerPdf, soccerCalendar, soccerEmail],
    cta: { label: "Review conflict", to: "/changes" },
  },
  {
    question: "What do I need to do this week?",
    answer: "You have 5 important items this week.",
    bullets: [
      "Return field trip permission slip — Sep 8",
      "Pay soccer registration — Sep 9",
      "Dental appointment — Sep 10",
      "Submit school form — Sep 11",
      "Buy soccer equipment — Sep 12",
    ],
    sources: [schoolPdf, soccerEmail, dentistEmail],
    cta: { label: "View tasks", to: "/today" },
  },
  {
    question: "Did anything change in the school schedule?",
    answer:
      "Yes — Friday, September 11 is now an early-release day with dismissal at 12:30 PM instead of 3:00 PM, and after-school clubs are cancelled.",
    bullets: [],
    sources: [dismissalPhoto],
    cta: { label: "See what changed", to: "/changes" },
  },
  {
    question: "What documents do I need to return?",
    answer: "Two documents are still waiting on you.",
    bullets: [
      "Field trip permission slip — due September 8",
      "Art club registration form — due September 15",
    ],
    sources: [schoolPdf],
    cta: { label: "Open Family Inbox", to: "/inbox" },
  },
  {
    question: "When is our next doctor's appointment?",
    answer:
      "Emma's dental cleaning with Dr. Okafor is Thursday, September 10 at 4:00 PM at Riverside Dental. Arrive 10 minutes early.",
    bullets: [],
    sources: [dentistEmail, dentistVoice],
  },
  {
    question: "Who is Emma's soccer coach?",
    answer:
      "Emma's U10 coach is Daniel Reyes. He signs the Soccer Club emails and leads Wednesday sessions at Riverside Park.",
    bullets: [],
    sources: [soccerEmail],
  },
  {
    question: "Did I miss anything important?",
    answer:
      "Nothing is overdue yet, but 4 items are waiting for your review and 1 schedule conflict is unresolved.",
    bullets: [
      "Soccer practice day conflict — calendar vs. new schedule",
      "Field trip permission slip is due September 8",
    ],
    sources: [soccerEmail, schoolEmail],
    cta: { label: "Open Family Inbox", to: "/inbox" },
  },
];
