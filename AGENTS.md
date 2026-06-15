# Homa (هما) — Agent Guide

Smart Online Meeting Management Platform.

---

## Project Overview

| Key         | Value                                                  |
| ----------- | ------------------------------------------------------ |
| **Name**    | `home_web` — Homa (هما)                                |
| **Version** | 0.1.0                                                  |
| **Stack**   | Next.js 16.1 · React 19.2 · TypeScript 5 · Tailwind v4 |
| **UI**      | shadcn/ui (new-york style) · Radix UI · Lucide Icons   |
| **State**   | TanStack Query v5 · TanStack Table v8                  |
| **HTTP**    | Axios · Orval v8 (codegen from OpenAPI)                |
| **Forms**   | React Hook Form v7 · Zod v4                            |
| **Auth**    | JWT (jose) · httpOnly cookies · next-themes            |
| **Lang**    | Persian (fa) · RTL · Vazir font                        |
| **PM**      | pnpm (with workspace)                                  |

---

## Project Tree

```
homa_web/
├── .agents/
│   └── skills/
│       ├── next-best-practices/       # Next.js 16 conventions
│       ├── orval/                     # Orval codegen guides
│       ├── shadcn/                    # shadcn/ui CLI & rules
│       └── tailwind-design-system/    # Tailwind v4 tokens
│
├── app/                               # Next.js App Router
│   ├── (auth)/                        # Unauthenticated route group
│   │   ├── layout.tsx                 # Auth shell (header + footer)
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   └── not-found.tsx
│   ├── (main)/                        # Authenticated route group
│   │   ├── layout.tsx                 # Main shell (header + footer)
│   │   ├── meets/page.tsx
│   │   ├── room/[roomId]/page.tsx
│   │   └── not-found.tsx
│   ├── layout.tsx                     # Root layout (RTL, lang=fa, Vazir)
│   ├── page.tsx                       # Splash — redirects based on auth
│   ├── providers.tsx                  # React Query + Tooltip + Toaster
│   ├── fonts.ts                       # Local Vazir font config
│   ├── globals.css                    # Tailwind v4 + theme vars
│   └── not-found.tsx
│
├── components/
│   ├── icons/                         # Inline SVG icon components
│   │   ├── CopyLinkIcon.tsx
│   │   ├── GithubIcon.tsx
│   │   ├── GoogleIcon.tsx
│   │   └── UserIcon.tsx
│   ├── layout/                        # App shell components
│   │   ├── AuthFooter.tsx
│   │   ├── AuthHeader.tsx
│   │   ├── mainFooter.tsx
│   │   ├── MainHeader.tsx
│   │   └── MainHeaderProfile.tsx
│   ├── pages/                         # Feature-specific components
│   │   ├── auth/                      # Login/sign-up feature
│   │   │   ├── LoginForm.tsx          #   Container (logic)
│   │   │   ├── LoginFormView.tsx      #   Presentational
│   │   │   ├── useLoginForm.ts        #   Form hook
│   │   │   ├── LoginInfoPanel.tsx
│   │   │   ├── SignUpform.tsx
│   │   │   ├── SignUpFormView.tsx
│   │   │   ├── SignUpPanelInfo.tsx
│   │   │   ├── AuthWithAnotherMethod.tsx
│   │   │   └── useSignUpForm.ts
│   │   ├── meets/                     # Meet listing feature
│   │   │   ├── CreateMeetModal.tsx
│   │   │   ├── CreateMeetModalView.tsx
│   │   │   ├── MeetTable.tsx
│   │   │   ├── MeetTableAction.tsx
│   │   │   └── useCreateMeetForm.ts
│   │   ├── not-found/
│   │   │   └── AppNotFoundView.tsx
│   │   └── room/                      # Video room feature
│   │       ├── Chat.tsx
│   │       ├── ChatForm.tsx
│   │       ├── ParticipantsList.tsx
│   │       ├── RoomControls.tsx
│   │       ├── RoomControlsOptions.tsx
│   │       ├── RoomControlsTooltip.tsx
│   │       ├── RoomHeader.tsx
│   │       ├── RoomMainSection.tsx
│   │       └── VideoTitleItem.tsx
│   └── ui/                            # shadcn/ui primitives + custom
│       ├── AppModal.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── FormInputField.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── pagination.tsx
│       ├── SmartPagination.tsx
│       ├── SmartTable.tsx
│       ├── SmartTooltip.tsx
│       ├── sonner.tsx
│       ├── table.tsx
│       └── tooltip.tsx
│
├── lib/
│   ├── action/                        # Server Actions
│   │   ├── auth.ts                    #   Auth actions (login, sign-up)
│   │   ├── meets.ts                   #   Meet actions (create)
│   │   └── wrapper.ts                 #   ActionResult<T> helpers
│   ├── api/                           # HTTP client layer
│   │   ├── client.ts                  #   Axios instance (interceptors, error toast)
│   │   ├── current-user.ts            #   Fetch current user from API
│   │   ├── server-request-options.ts  #   Server-side auth headers
│   │   └── session.ts                 #   Cookie JWT session + refresh
│   ├── constants/
│   │   ├── auth.ts                    #   Persian auth info texts
│   │   └── message.ts                 #   Persian HTTP messages
│   ├── generated/                     # Orval auto-generated (tags-split)
│   │   ├── endpoints/                 #   Raw API call fns
│   │   │   ├── auth/
│   │   │   ├── default/
│   │   │   ├── meets/
│   │   │   ├── roles/
│   │   │   └── users/
│   │   ├── services/                  #   Non-hook service wrappers
│   │   │   ├── auth.ts, meets.ts, ...
│   │   ├── hooks/                     #   TanStack Query hooks
│   │   │   ├── auth.ts, meets.ts, ...
│   │   │   └── useServerAction.ts
│   │   └── types/
│   │       ├── model/                 #   Schema types
│   │       └── operations/            #   Query param types
│   ├── helpers/
│   │   └── date.ts
│   ├── hooks/                         # App-level hooks
│   │   ├── useChat.ts
│   │   ├── useClipboard.ts
│   │   └── useRoom.ts
│   ├── providers/
│   │   └── react-query-provider.tsx
│   ├── query/                         # Query client config
│   │   ├── get-query-client.ts
│   │   ├── prefetch.ts                #   Server prefetch + dehydrate
│   │   └── query-client.ts            #   makeQueryClient factory
│   ├── utils.ts                       # cn() — clsx + tailwind-merge
│   └── validation/                    # Zod v4 schemas
│       ├── create-meet.validation.ts
│       ├── login.validation.ts
│       └── sign-up.validation.ts
│
├── public/
│   └── images/
│       ├── avatar-user.svg
│       ├── fonts/vazir/               # Vazir woff2 files
│       ├── login-demo.avif
│       └── register-demo.avif
│
├── scripts/
│   └── generate-orval-layered-exports.mjs  # Post-codegen reorg
│
├── next.config.ts
├── orval.config.ts                    # OpenAPI → React Query codegen
├── tsconfig.json                      # @/* → ./
├── pnpm-workspace.yaml
└── components.json                    # shadcn config
```

---

## Architecture & Conventions

### Route Groups

```
(app)
├── (auth)    → Unauthenticated — login, sign-up
├── (main)    → Authenticated — meets, room/[roomId]
└── root      → Redirect engine + providers
```

- `(auth)/layout.tsx` — redirects to `/meets` if already authenticated.
- `(main)/layout.tsx` — redirects to `/login` if unauthenticated (`requireAuthenticated()`).
- `app/page.tsx` — server-side `redirect()` based on `isAuthenticated()` cookie check.

### Component Pattern: View / Logic Separation

Feature components follow a **Container/Presentational** split where non-trivial logic exists:

```
pages/auth/
├── LoginForm.tsx          # Container — orchestrates hook + view
├── useLoginForm.ts        # Hook — form logic (react-hook-form + zod)
├── LoginFormView.tsx      # View — pure JSX presentation
```

- **Container** (`LoginForm.tsx`) — imports the hook, passes props to the View, handles submission.
- **Hook** (`useLoginForm.ts`) — form state + validation via `react-hook-form` + Zod resolver.
- **View** (`LoginFormView.tsx`) — pure presentational component, no business logic.

### Component Categories

| Directory            | Purpose                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `components/ui/`     | shadcn primitives + custom composite UI (SmartTable, SmartPagination, FormInputField, AppModal) |
| `components/layout/` | App shell — headers, footers, profile dropdown                                                  |
| `components/pages/`  | Feature-specific — nested by domain (auth, meets, room)                                         |
| `components/icons/`  | Custom inline SVG icon components                                                               |

### API Layer

```
OpenAPI Spec ──► Orval ──► lib/generated/
                              ├── endpoints/    (raw fetch calls)
                              ├── services/     (non-hook wrappers)
                              ├── hooks/        (TanStack Query hooks)
                              └── types/         (model + operations)
                              └── index.ts       (barrel exports)
```

- **Custom Axios client**: `lib/api/client.ts` — handles base URL, interceptors, error toasting, `FormData` transforms.
- **Server-side**: `lib/api/server-request-options.ts` — attaches auth cookies for SSR prefetching.
- **Server Actions**: `lib/action/` — wraps common mutations with `ActionResult<T>` ([data, error]) pattern.
- **Prefetching**: `lib/query/prefetch.ts` — `prefetchAndDehydrate()` for server-to-client query hydration.

### Auth Flow

```
Cookie (access_token) ──► session.ts
  ├── isAuthenticated()          — cookie present check
  ├── requireAuthenticated()     — redirect if missing (for layouts)
  ├── redirectIfAuthenticated()  — redirect if present (for auth pages)
  ├── refreshSessionFromServer() — auto-refresh before expiry
  └── getAuthToken()             — extract raw token for Server Actions
```

- Access token stored in httpOnly cookie named `access_token`.
- Refreshed transparently via `refreshSessionFromServer()`.
- JWT verification done server-side (jose library available).

### Forms & Validation

- **Schema**: Zod v4 in `lib/validation/*.validation.ts`.
- **Resolver**: `@hookform/resolvers` with Zod adapter.
- **Components**: `FormInputField` wraps shadcn `input` + `label` + error message.
- **Pattern**: Hook owns the form → View renders fields → Container calls mutation.

### Orval Configuration

- **Mode**: `tags-split` — one subfolder per OpenAPI tag (auth, meets, roles, users, default).
- **Client**: `react-query` — generates `useQuery` / `useMutation` / `useSuspenseQuery` hooks.
- **Mutator**: Custom `axiosInstance` from `lib/api/client.ts`.
- **Post-gen**: `scripts/generate-orval-layered-exports.mjs` reorganizes flat output into `endpoints/`, `services/`, `hooks/`, `types/`.

### Naming Conventions

| Entity             | Convention       | Example                           |
| ------------------ | ---------------- | --------------------------------- |
| Components         | PascalCase       | `LoginFormView.tsx`               |
| Hooks              | `use*` camelCase | `useLoginForm.ts`                 |
| Utils/helpers      | camelCase        | `cn()`, `formatDate()`            |
| Validation schemas | kebab-case       | `create-meet.validation.ts`       |
| Pages              | `page.tsx`       | Always exactly `page.tsx`         |
| Layouts            | `layout.tsx`     | Always exactly `layout.tsx`       |
| Server Actions     | camelCase        | `loginAction`, `createMeetAction` |
| API endpoint fns   | camelCase        | `getMeets()`, `createMeet()`      |

### Coding Guidelines

1. **No comments** in production code unless absolutely necessary.
2. **No emojis** in code or commits unless explicitly requested.
3. **Minimize token output** — be concise, avoid preamble/summary.
4. **Mimic existing patterns** — check neighboring files before creating new ones.
5. **No new files unless required** — prefer editing existing ones.
6. **Always lint**: `pnpm lint` before finishing a task.
7. **Never commit unless asked.**
8. **Use `@/*` path alias** — e.g. `import { cn } from "@/lib/utils"`.
9. **Files are kebab-case** for non-component files, PascalCase for components.
10. **No barrel re-exports in components** — import directly from file path.

---

UI Patterns & Role-Based Access Control (RBAC)

When implementing features that fetch collections of data (e.g., list views, paginated GET requests, or filtered tables), the following strict rules apply:

    Table Presentation: Always use the shadcn/ui Table component (or the custom SmartTable wrapper) to render list data. Avoid using custom grids unless explicitly requested.

    Pagination Integration: For endpoints returning standardized pagination metadata (i.e., total, current_page, pages, is_next, is_prev, size), you MUST implement the SmartPagination component. Map these specific response fields directly to the pagination controls.(use the shadcn/ui pagination)

    **Dynamic Query Filters:** If a GET collection endpoint accepts search or filtering query parameters, you MUST render corresponding filter inputs (e.g., search fields, select dropdowns, toggles) directly above the table. These inputs must be synchronized with the URL state or component state, automatically triggering a TanStack Query refetch with the updated parameters whenever a user interacts with them

    Action Menus (Three-Dot): Every data table must include an "Actions" column containing a shadcn DropdownMenu triggered by a three-dot (ellipsis) icon.

    Strict RBAC for Actions: The options rendered inside the Action Menu depend strictly on the user's current role:

        SuperAdmin, admin, or host: Must have full access -> Render [View, Edit, Delete].

        user: Restricted access -> Render [View] only.

    Role Source of Truth: The user's role MUST be read exclusively from the getMe query hook/state. Never infer the user's role from local storage, URL parameters, or other unrelated endpoints

---

## Development Commands

| Command           | Purpose                                 |
| ----------------- | --------------------------------------- |
| `pnpm dev`        | Start dev server (localhost:3000)       |
| `pnpm build`      | Production build                        |
| `pnpm start`      | Start production server                 |
| `pnpm lint`       | ESLint (flat config)                    |
| `pnpm orval`      | Regenerate API client from OpenAPI      |
| `pnpm orval:sync` | Regenerate + run post-gen export script |

---

## Agent Instructions

This document serves as the single source of truth for AI agents working on this codebase. Before making changes:

1. Read this file to understand conventions.
2. Explore the specific area of the codebase you're modifying.
3. Follow the established patterns — especially View/Logic separation, Orval usage, and the `ActionResult` pattern.
4. Run `pnpm lint` after any changes.
5. Do not add explanatory comments to code.
6. Do not create documentation files unless explicitly asked.
