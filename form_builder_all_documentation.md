### Form Builder – Condensed Requirements

**Purpose**
Internal web app to let staff design, publish, and manage bespoke data-collection forms that overcome Google Forms/Jotform limits (repeatable blocks, DB-driven dropdowns, image uploads).

---

#### 1 | Must-Have Capabilities (MVP)

| Area             | Essentials                                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Inputs**       | • All common field types (text, number, date/time, email, URL, file, static dropdown, check-/radio)<br>• Image upload (Supabase Storage)<br>• **Repeating section** – one-level nesting<br>• **Dynamic dropdown** – options pulled from DB |
| **Builder UX**   | Splash page with hero image + “ Create Form ” ⇢ drag-and-drop editor. Sidebars: element palette (L) & properties/settings (R). Fully responsive.                                                                                           |
| **Branding**     | Logo, colors, fonts per form.                                                                                                                                                                                                              |
| **Validation**   | Client & server; required, formats, ranges.                                                                                                                                                                                                |
| **Auth / Roles** | OAuth (Google et al.) + RBAC (creator, viewer, admin) via Supabase RLS.                                                                                                                                                                    |
| **Submissions**  | Secure write to PostgreSQL; view, filter, sort, edit/delete, export (CSV/Excel); e-mail notifications; form close/archive.                                                                                                                 |
| **Performance**  | Load ≤2 s; submit ≤3 s; dashboard queries ≤5 s for \~200 monthly submissions.                                                                                                                                                              |
| **Security**     | HTTPS, at-rest encryption, XSS/SQLi safeguards, file-scan hooks.                                                                                                                                                                           |

---

#### 2 | Nice-to-Have (post-MVP)

* Cascading dropdowns
* Branching/skip logic
* Public forms & workflow automations
* Deeper analytics / custom reports
* External system integrations (CRM/ERP)

---

#### 3 | Tech Stack

| Layer           | Choice                                                   | Rationale                                     |
| --------------- | -------------------------------------------------------- | --------------------------------------------- |
| **Frontend**    | **Next.js** + TypeScript                                 | SSR/CSR flexibility, React familiarity        |
| Styling         | Tailwind CSS + Headless UI                               | Fast theming & responsive layout              |
| Form state      | React Hook Form + Zod                                    | High-performance, schema-based validation     |
| Drag/drop       | React DND                                                | Intuitive editor interactions                 |
| Tables / charts | TanStack Table, Recharts/Chart.js                        | Filters, dashboards                           |
| **Backend**     | **Supabase** (PostgreSQL, Auth, Storage, Edge Functions) | Managed DB, RLS, file store, serverless logic |
| Deploy          | Vercel                                                   | One-click CI/CD, edge runtime                 |

---

#### 4 | Key Data Tables

* `users`, `roles`, `user_roles`
* `forms` (status, branding, version)
* `form_elements` (type, validation JSONB, repeat flag)
* `form_submissions` + denormalized `submission_data`
* `submission_responses` (one row per answer)
* `repeated_section_instances`
* `dropdown_sources` / `dropdown_options`
* `uploaded_files`

All PKs are UUIDs; JSONB used for flexible configs; RLS enforces data ownership.

---

#### 5 | Primary User Flows

1. **Login** → OAuth handshake → Forms Dashboard.
2. **Create Form** → drag elements, set branding/validation → Save / Publish (link generated).
3. **Submit Form** (internal user) → live validation → DB write → confirmation.
4. **Manage Responses** → dashboard table with filter/sort, detail view, edit/delete, export.
5. **Archive/Close** → form status change stops new entries.

---

#### 6 | Non-Functional

* **Scalable:** Supabase infra handles growth without re-architecture.
* **Maintainable:** Typed code, ESLint/Prettier, modular folders.
* **Accessible:** WCAG 2.1 AA colors, keyboard nav, ARIA labels.
* **Usable:** Mobile-first layouts, 44 × 44 px touch targets, toast feedback.

---

This trimmed spec keeps every critical requirement while shedding narrative and duplication.
