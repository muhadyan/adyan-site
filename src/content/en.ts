import type { Copy } from "./types";

export const en: Copy = {
  meta: {
    title: "Custom POS, Inventory, Bookkeeping & ERP Systems | Adyan Rohutomo",
    description:
      "I build the systems that run your business: POS, inventory, bookkeeping, invoicing, up to ERP. Former VP of Business Support, 4 years as a software engineer (including Tokopedia).",
  },
  nav: { skip: "Skip to content", langLabel: "Choose language", contact: "Chat on WhatsApp" },
  wa: { message: "Hi Adyan, I found adyan.admos.id. I’d like to talk about building a system for my business." },
  hero: {
    title: "Still running your business on spreadsheets, receipts and chats? I’ll build you the system.",
    lede: "Warehouse stock, POS, bookkeeping, project tracking, company websites, up to ERP. Tidy, works from a phone, and the reports run themselves.",
    proof:
      "Before becoming a software engineer, I spent 5+ years in Finance. Last as VP of Business Support, leading the Finance, HR and GA teams. So I know these workflows from the user's side.",
    cta: "Free consultation on WhatsApp",
    ctaNote: "Just tell me about it. Free, no commitment.",
    receipt: {
      heading: "Order slip",
      number: "No. 0001",
      to: "For: your business",
      lines: [
        "Sales recorded automatically",
        "Real-time stock + barcode labels",
        "Invoices, returns, voids",
        "Automatic financial reports",
        "Project tracking + client updates",
        "Company / catalog website",
      ],
      totalLabel: "Total",
      total: "Fits your budget",
      stamp: "Ready to build",
      thanks: "Thank you. Keep this slip.",
    },
  },
  needs: {
    title: "Your problem, the system, the proof",
    intro: "These are the needs I hear most often. I have already built every row.",
    columns: { need: "When you say", build: "I build", proof: "Done before at" },
    rows: [
      {
        need: "Sales still go on paper receipts",
        build: "A web POS. Every sale is recorded, receipts and invoices print, voids and returns leave a trail.",
        proof: "Admos Laris",
      },
      {
        need: "Warehouse stock never matches",
        build: "Real-time stock, barcode or QR labels, goods in and out, low-stock reminders.",
        proof: "Admos Laris",
      },
      {
        need: "Financial reports take all of month-end",
        build: "Automatic bookkeeping. Journal, profit and loss, balance sheet and cash flow straight from transactions.",
        proof: "Admos Accounting",
      },
      {
        need: "Orders from chats are a mess",
        build: "WhatsApp and DM orders made tidy. AI reads the address, shipping rates are compared, waybills are tracked.",
        proof: "RingkasAja",
      },
      {
        need: "One system for Finance, HR and GA",
        build: "An ERP that follows how your office works. Finance, people, assets and approvals in one place.",
        proof: "5+ years leading Finance, HR, GA",
      },
      {
        need: "Clients keep asking about project progress",
        build: "A project tracker. Status per stage, automatic client updates, full history.",
        proof: "11 systems for 11 clients",
      },
      {
        need: "A company or catalog website",
        build: "A fast website that is easy to update and easy to find on Google.",
        proof: "The site you are reading",
      },
      {
        need: "The old system is slow or keeps failing",
        build: "Audits, bug fixes and rebuilds under the hood without stopping what already runs.",
        proof: "Search Array, 5x faster",
      },
    ],
  },
  products: {
    title: "Products I built myself",
    intro: "I designed, built and run these three products myself, from zero to live.",
    visit: "Open the site",
    statusLabel: "Status",
    stackLabel: "Built with",
    items: [
      {
        slug: "admos-accounting",
        name: "Admos Accounting",
        tagline: "Simple bookkeeping for Indonesian small businesses",
        summary:
          "Journal, chart of accounts, assets and financial reports in one place. Snap a receipt, AI drafts the journal entry, you approve it.",
        points: [
          "5 automatic reports: profit and loss, balance sheet, cash flow, general ledger, trial balance",
          "Subscriptions paid by QRIS and 14 other methods (Duitku)",
          "600+ automated tests keep the numbers right",
        ],
        status: "Live and taking payments",
        stack: ["Go", "PostgreSQL", "Next.js", "AI"],
      },
      {
        slug: "admos-laris",
        name: "Admos Laris",
        tagline: "A till for fashion stalls at exhibitions and bazaars",
        summary:
          "A QR label for every variant, scan with a phone camera, pay by QRIS or cash, receipt for the buyer. Keeps selling when the venue signal drops.",
        points: [
          "A second screen faces the buyer and updates live",
          "Balances kept as a ledger that cannot be silently edited",
          "AI reads buyer addresses to price shipping",
        ],
        status: "Pre-launch, piloting with the first merchant",
        stack: ["Go", "PostgreSQL", "Next.js PWA", "QRIS"],
      },
      {
        slug: "ringkasaja",
        name: "RingkasAja",
        tagline: "From chat to waybill in 30 seconds",
        summary:
          "Paste an order chat, AI reads the address, compares shipping rates, books the courier and tracks the parcel. Buyer money never passes through the system.",
        points: [
          "16 order states, each one tested",
          "A wallet with double-entry bookkeeping",
          "Connected to WhatsApp, couriers and payments",
        ],
        status: "Invite-only beta",
        stack: ["Go", "PostgreSQL", "Next.js", "WhatsApp API"],
      },
    ],
  },
  clients: {
    title: "Clients and employers",
    intro:
      "For businesses, I handle the whole system, front to back. At tech companies, my part was the backend: the servers, databases and integrations behind the screen.",
    visit: "View the site",
    featured: [
      {
        slug: "ummu-alfatih",
        name: "Ummu Alfatih",
        role: "Online shop and business systems",
        period: "2025 to now",
        summary:
          "A Muslim womenswear brand from Yogyakarta. I set up their online shop, their books run on Admos Accounting, and their bazaar stand is piloting Admos Laris.",
        figures: [
          { value: "3", label: "systems: online shop, books, bazaar till" },
          { value: "2025 →", label: "still running today" },
        ],
      },
      {
        slug: "search-array",
        name: "Search Array",
        role: "Senior Backend Engineer, Sera Creative Studio",
        period: "2025 to now",
        summary:
          "A Japanese trading-card platform with 46K users and 20M requests a month. I rewrote its backend from Laravel to Go.",
        figures: [
          { value: "−80%", label: "response time" },
          { value: "−99%", label: "server errors" },
          { value: "−75%", label: "server cost" },
        ],
      },
      {
        slug: "tokopedia",
        name: "Tokopedia",
        role: "Software Engineer, Backend (Promotion)",
        period: "2023 to 2025",
        summary: "Joined Tokopedia's promotion system with TikTok Shop, including free-shipping vouchers.",
        figures: [
          { value: "+11%", label: "GMV" },
          { value: "+9.6%", label: "GMV per visitor" },
          { value: "+11.3%", label: "promo page to order" },
        ],
      },
      {
        slug: "katalis",
        name: "Katalis AI",
        role: "Founding Backend Engineer",
        period: "2023 to 2025",
        summary: "Built the backend from scratch for an AI app that helps companies improve their marketing content.",
        figures: [
          { value: "0 → 1", label: "backend from scratch" },
          { value: "CI/CD", label: "automatic deploys" },
        ],
      },
      {
        slug: "wateriq",
        name: "WaterIQ",
        role: "Backend Initiator, Solarchapter",
        period: "2023",
        summary: "An IoT system that monitors clean water in rural Indonesian villages. I built its backend from the start.",
        figures: [
          { value: "0 → 1", label: "backend from scratch" },
          { value: "IoT", label: "scheduled sensor data" },
        ],
      },
    ],
    othersTitle: "Also built backend for",
    others: [
      { name: "Lion Parcel", note: "via Refactory, 2022" },
      { name: "Lemonilo", note: "via Refactory, 2022" },
      { name: "Jaklingko", note: "via Refactory, 2022" },
      { name: "Work Life and Beyond", note: "HR app, 2023" },
    ],
  },
  why: {
    title: "I used to be the one using these systems",
    story: [
      "Before writing code, I spent 5+ years in Finance. I grew into Finance Manager, then VP of Business Support leading the Finance, HR and General Affairs teams.",
      "So when you say “the stock never matches” or “the reports are always late”, I know the feeling. I sat in that chair.",
      "Now, after 4 years as a software engineer at Tokopedia and for 11 clients, I build the systems I wish I had back then.",
    ],
    figures: [
      { value: "5+", label: "years in Finance, HR, GA" },
      { value: "4", label: "years as a software engineer" },
      { value: "11", label: "systems for 11 clients" },
      { value: "99.9%", label: "server uptime" },
    ],
    photoAlt: "Photo of Adyan Rohutomo",
  },
  process: {
    title: "How it works",
    steps: [
      {
        title: "Talk first",
        body: "Walk me through your business on WhatsApp or a call. I help you sort what needs building and what an existing app already does.",
      },
      {
        title: "Plan",
        body: "You get a feature list, sample screens, a schedule and a clear price before any work starts.",
      },
      {
        title: "Build",
        body: "Every week there is a demo you can try yourself. Your feedback goes straight in.",
      },
      {
        title: "Launch and care",
        body: "The system goes live, your team learns to use it, and I keep helping when something comes up.",
      },
    ],
  },
  faq: {
    title: "Common questions",
    items: [
      {
        q: "What does it cost?",
        a: "It depends on features and scale. After we talk you get a price per feature, so you can start with what matters most.",
      },
      {
        q: "How long until I can use it?",
        a: "A small system like POS or inventory can be in use within weeks. Bigger systems like ERP ship in stages, and each stage is usable right away.",
      },
      {
        q: "Who maintains it afterwards?",
        a: "I can keep maintaining it. We agree on the terms up front, so there are no surprise costs.",
      },
    ],
  },
  footer: {
    title: "Tell me what you need",
    body: "Send a WhatsApp message. Start with the part that gives you the biggest headache.",
    cta: "Chat on WhatsApp",
    email: "Or email",
    cv: "Download CV (PDF)",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
};
