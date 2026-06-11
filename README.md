# Televix 📺

Philippine TV electronic program guide (EPG) — schedules, livestreams, and show info for all major free and cable channels.

**Live at:** _coming soon_

---

## Stack

- **Frontend / hosting:** Next.js 15 + Vercel
- **Database / auth:** Supabase (PostgreSQL + RLS)
- **Media:** Cloudinary (channel banners, show posters)
- **Livestreams:** YouTube embed per channel

---

## Project structure

```
televix/
├── app/
│   ├── page.tsx              # Main EPG viewer
│   ├── layout.tsx
│   ├── globals.css
│   └── admin/                # Admin panel (protected route)
│       ├── page.tsx          # Admin dashboard
│       ├── channels/         # Manage channels
│       ├── shows/            # Manage shows
│       └── schedules/        # Manage schedules
├── components/
│   ├── epg/                  # EPG-specific components
│   │   ├── ChannelPicker.tsx
│   │   ├── Timeline.tsx
│   │   └── ShowPanel.tsx
│   ├── admin/                # Admin panel components
│   └── ui/                   # Shared UI primitives
├── lib/
│   └── supabase.ts           # Supabase clients + data helpers
├── types/
│   └── database.ts           # TypeScript types from schema
└── supabase/
    └── migrations/
        └── 0001_initial_schema.sql
```

---

## Roadmap

- [x] Phase 0 — Design & schema
- [ ] Phase 1 — Fandom wiki scraper for seed data
- [ ] Phase 2 — Admin panel (Supabase Auth, schedule/banner management)
- [ ] Phase 3 — tv5.com.ph schedule scraper
- [ ] Phase 4 — Public REST API + XMLTV feed export

---

## Getting started (local dev)

```bash
# 1. Clone and install
git clone https://github.com/your-username/televix.git
cd televix
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in your Supabase and Cloudinary credentials

# 3. Set up the database
# Go to Supabase Dashboard > SQL Editor
# Paste and run: supabase/migrations/0001_initial_schema.sql

# 4. Run dev server
npm run dev
```

---

## Admin access

The `/admin` route is protected by Supabase Auth. To grant admin access to a user:

```sql
INSERT INTO admin_users (id, email)
VALUES ('<supabase-auth-uid>', 'your@email.com');
```

---

## Contributing

Schedule data is maintained manually via the admin panel. If you notice an incorrect or outdated schedule, please open an issue.

---

## License

MIT
