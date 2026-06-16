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

## AGENTS.md — LiveKit React Integration Guide

> **IMPORTANT:** This project uses **LiveKit** as the real-time meeting infrastructure. Any page or feature that requires audio/video conferencing, screen sharing, participant management, meeting rooms, chat, or real-time communication **must use LiveKit React Components** instead of creating custom WebRTC implementations.

### Official Documentation

Primary reference:

- [LiveKit React Components Documentation](https://docs.livekit.io/reference/components/react/?utm_source=chatgpt.com)

Before implementing any meeting-related functionality, always review the official documentation and prefer official LiveKit components over custom implementations.

---

# LiveKit Infrastructure

## LiveKit Server

The project includes a self-hosted LiveKit server.

Default server URL:

```env
NEXT_PUBLIC_LIVEKIT_URL=http://localhost:7880
```

Docker service:

```yaml
livekit:
  ports:
    - "7880:7880"
```

The frontend must connect to this server when joining rooms.

Example:

```tsx
<LiveKitRoom
  token={token}
  serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
  connect
>
  ...
</LiveKitRoom>
```

---

# Meeting Authentication

## Token Endpoint

Meeting access tokens must always be requested from the backend.

Generated Orval API endpoint:

```http
POST /meets/{meet_hash}/token
```

Example flow:

```ts
const token = await meetsApi.meetsTokenCreate(meetHash);
```

or via generated React Query hooks:

```ts
const mutation = useMeetsTokenCreate();

mutation.mutate({
  meetHash,
});
```

### Rules

- Never generate LiveKit tokens on the frontend.
- Never hardcode tokens.
- Always obtain a fresh token from:

```http
POST /meets/{meet_hash}/token
```

- Use the generated Orval client whenever available.
- Respect the existing API layer patterns already used in the project.

---

# Required Packages

Install and use official LiveKit packages:

```bash
pnpm add livekit-client
pnpm add @livekit/components-react
```

or

```bash
npm install livekit-client @livekit/components-react
```

Do not introduce alternative WebRTC libraries unless explicitly requested.

---

# Recommended Room Architecture

For meeting pages use:

```tsx
<LiveKitRoom>
  <VideoConference />
  <RoomAudioRenderer />
</LiveKitRoom>
```

Minimal example:

```tsx
<LiveKitRoom video audio connect token={token} serverUrl={serverUrl}>
  <VideoConference />
  <RoomAudioRenderer />
</LiveKitRoom>
```

This should be considered the default implementation.

---

# Core Components

## LiveKitRoom

Primary room provider.

Responsibilities:

- Room connection
- Participant lifecycle
- Media publishing
- Reconnection handling
- Event management

Example:

```tsx
<LiveKitRoom token={token} serverUrl={serverUrl} connect>
  {children}
</LiveKitRoom>
```

---

## VideoConference

Preferred full-featured meeting UI.

Includes:

- Participant grid
- Active speaker handling
- Responsive layouts
- Media management
- Room controls integration

Example:

```tsx
<VideoConference />
```

Use whenever a complete meeting experience is required.

---

## RoomAudioRenderer

Required for remote audio playback.

Example:

```tsx
<RoomAudioRenderer />
```

Always include it inside meeting rooms.

---

## ControlBar

Provides built-in meeting controls.

Features:

- Mute / unmute microphone
- Camera on/off
- Screen sharing
- Leave room

Example:

```tsx
<ControlBar />
```

---

## Chat

Built-in room chat.

Example:

```tsx
<Chat />
```

Use when room messaging is required.

---

## ParticipantTile

Displays a participant.

Features:

- Video stream
- Audio status
- Speaking indicators
- Connection state

Example:

```tsx
<ParticipantTile participant={participant} />
```

---

## GridLayout

Participant grid layout.

Example:

```tsx
<GridLayout tracks={tracks}>
  <ParticipantTile />
</GridLayout>
```

Use for custom room UIs.

---

# Meeting Features

The meeting implementation should support:

### Audio

- Mute microphone
- Unmute microphone
- Device switching
- Permission handling

### Video

- Camera enable
- Camera disable
- Camera switching
- Video quality management

### Screen Sharing

- Start screen share
- Stop screen share
- Screen share participant highlighting

### Chat

- Real-time messaging
- Participant communication

### Participants

- Join room
- Leave room
- Participant count
- Active speaker detection

### Reconnection

- Network recovery
- Automatic reconnect support

### Device Management

- Microphone selection
- Camera selection
- Speaker selection

---

# Moderator Features

Some meetings may require moderator capabilities.

Potential moderator actions:

### Remove Participant

Using LiveKit Room APIs:

```ts
room.remoteParticipants;
```

and backend moderation endpoints when available.

### Mute Participant

Moderators may mute participants through LiveKit APIs.

### Role-Based Controls

Implement permission-based UI:

```ts
isModerator;
isHost;
isParticipant;
```

Examples:

```tsx
{
  isModerator && <RemoveParticipantButton />;
}
```

Never expose moderator actions to normal participants.

---

# Room Page Standards

Every room page should:

### Before Join

1. Load room information.
2. Request LiveKit token.
3. Show loading state.
4. Handle API errors.

### During Meeting

1. Connect to LiveKit.
2. Render conference UI.
3. Render audio.
4. Handle reconnection.
5. Handle participant changes.

### After Leave

1. Disconnect room.
2. Clear local state.
3. Navigate away if required.

---

# Next.js 16 Guidelines

Meeting pages must be implemented as Client Components.

Example:

```tsx
"use client";
```

Reasons:

- Camera access
- Microphone access
- Browser APIs
- LiveKit client requirements

Avoid SSR for LiveKit room components.

Use dynamic imports if necessary:

```tsx
dynamic(() => import("./MeetingRoom"), {
  ssr: false,
});
```

---

# AI Agent Implementation Rules

Whenever a task mentions:

- meeting
- conference
- room
- video call
- audio call
- webinar
- screen sharing
- participants
- video chat

The agent must:

1. Use LiveKit.
2. Read this AGENTS.md section.
3. Use official LiveKit React Components.
4. Request tokens via:

```http
POST /meets/{meet_hash}/token
```

5. Use the generated Orval API client.
6. Connect to:

```env
NEXT_PUBLIC_LIVEKIT_URL
```

7. Prefer:

```tsx
<VideoConference />
```

8. Include:

```tsx
<RoomAudioRenderer />
```

9. Support microphone, camera, screen sharing, and participant management.
10. Follow existing project architecture and coding standards.

---

# Preferred Full Meeting Template

```tsx
<LiveKitRoom
  token={token}
  serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
  connect
  video
  audio
>
  <VideoConference />
  <RoomAudioRenderer />
</LiveKitRoom>
```

This template should be the default starting point for any meeting-related page.

---

# Meeting Lobby & PreJoin Pattern

To prevent the well-known "Element not part of the array: camera_placeholder" bug and ensure a smooth user experience, **every LiveKit room must implement a Lobby (PreJoin) step** before rendering the `<LiveKitRoom>` component.

### Rules for Lobby Implementation:

1.  **State Management**: Maintain a state (e.g., `preJoinChoices`) to hold the user's hardware selections (camera/mic).
2.  **UI Layout**: Use a split-screen or card-based layout using `shadcn/ui`.
    - Left/Top side: `<PreJoin>` component for camera preview and device selection.
    - Right/Bottom side: Meeting details, title, and a list of currently active participants.
3.  **Conditional Rendering**: The `<LiveKitRoom>` must NOT be mounted until the user successfully submits their `PreJoin` choices.
4.  Pass `video={preJoinChoices.videoEnabled}` and `audio={preJoinChoices.audioEnabled}` to `<LiveKitRoom>`.

---

# Meeting Role-Based Access Control (RBAC) & Moderation

Inside the meeting, capabilities differ drastically between the **Creator (Host)** and standard **Users**.

### Rules for Meeting RBAC:

1.  **Identify Roles**: Use the generated hook `useGetMeetByHashMeetsMeetHashGet` to fetch the meeting details. Compare `meetData.creator_id` with the current authenticated user's ID (fetched via `useGetCurrentUser` or similar session state).
2.  **Boolean Flags**: Derive a clean boolean flag: `const isCreator = currentUser?.id === meetData?.creator_id`.
3.  **UI Capabilities**:
    - If `isCreator` is true, render moderation controls (Kick Participant, Mute Participant, Force Mute All) inside the participant list or custom control bar.
    - If false, hide all administrative controls.
4.  **LiveKit Permissions**: Ensure that UI-level moderation controls call the appropriate LiveKit SDK methods (e.g., `room.remoteParticipants.forEach(p => p.audioTrack?.setMuted(true))`) or trigger specific backend moderation endpoints.
