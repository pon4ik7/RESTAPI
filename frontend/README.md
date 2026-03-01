# LearnNet Web Client

Production-ready frontend for a learning social network using Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui-style components + TanStack React Query.

## Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui-compatible component setup (`components.json` + reusable primitives)
- TanStack React Query
- Zod
- ESLint + Prettier

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCKS=false
```

Defaults:

- `NEXT_PUBLIC_API_BASE_URL`: `http://localhost:8080`
- `NEXT_PUBLIC_USE_MOCKS`: `false`

## Auth storage strategy

This frontend uses token-based auth with localStorage:

- `accessToken` and `refreshToken` are stored in localStorage.
- Every authenticated request sends `Authorization: Bearer <accessToken>`.
- On `401`, client calls `POST /api/auth/refresh`, stores new tokens, and retries once.

Note:
- `httpOnly` cookies cannot be set directly by a pure frontend app. If you later migrate auth to secure cookies from backend, the API layer is centralized in `src/lib/api/client.ts` and easy to adapt.

## Mock mode

Enable full in-memory mock backend:

```env
NEXT_PUBLIC_USE_MOCKS=true
```

When enabled:

- API calls are routed to `src/lib/mocks/mock-api.ts`.
- UI remains fully navigable (auth, feed, profile, likes, comments, follow, bookmarks, notifications, search).
- Data resets on browser refresh (in-memory).

## Missing endpoint fallback

If backend returns `404`, UI renders a banner:

- "Backend endpoint not implemented yet."

This is wired through `ApiError` (`src/lib/api/errors.ts`) and `isEndpointMissing` checks in pages/components.

## Routes

- `/login`
- `/register`
- `/feed`
- `/post/[id]`
- `/profile/[username]`
- `/settings`
- `/notifications`
- `/search`

Protected routes:

- `/feed`
- `/settings`
- `/notifications`

Unauthenticated users are redirected to `/login`.

## API endpoints used

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/me`

### Users

- `GET /api/users/:username`
- `PATCH /api/me`
- `POST /api/users/:username/follow`
- `DELETE /api/users/:username/follow`

### Feed & Posts

- `GET /api/feed?cursor=&limit=`
- `POST /api/posts`
- `GET /api/posts/:id`
- `DELETE /api/posts/:id`

### Engagement

- `POST /api/posts/:id/like`
- `DELETE /api/posts/:id/like`
- `POST /api/posts/:id/bookmark`
- `DELETE /api/posts/:id/bookmark`

### Comments

- `GET /api/posts/:id/comments?cursor=&limit=`
- `POST /api/posts/:id/comments`

### Search

- `GET /api/search?q=...`

### Notifications

- `GET /api/notifications?cursor=&limit=`
- `POST /api/notifications/:id/read`

Additional assumption for profile posts:

- `GET /api/users/:username/posts?cursor=&limit=`

If this endpoint is not available yet, profile page still works and shows fallback behavior.

## Folder structure

```text
frontend/
  src/
    app/
      (auth)/login
      (auth)/register
      (main)/feed
      (main)/post/[id]
      (main)/profile/[username]
      (main)/settings
      (main)/notifications
      (main)/search
    components/
      ui/
      layout/
      auth/
      feed/
      posts/
      profile/
      common/
    providers/
      auth-provider.tsx
      query-provider.tsx
      app-providers.tsx
    lib/
      api/
      mocks/
      constants/
      utils/
    hooks/
    types/
```

## Key implementation notes

- React Query handles caching, infinite pagination, and mutation invalidation.
- Cursor pagination normalization helper is in `src/lib/api/pagination.ts`.
- Zod schemas define and validate all core entities in `src/types/models.ts`.
- API client is centralized in `src/lib/api/client.ts`.
- Navbar and route protection are implemented in `(main)` layout and auth provider.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
```
