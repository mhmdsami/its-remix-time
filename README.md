# It's Remix Time!

## Getting started with this project
- [Fork](https://github.com/mhmdsami/its-remix-time/fork) this repository
- Clone `starter-code` branch from the forked repository 
```bash
git clone -b starter-code https://github.com/<your-username>/its-remix-time.git
```
- Install dependencies
```bash
pnpm install
```
- Prisma setup
Make sure to include `.env` file in the root directory with `DATABASE_URL` before running the following command.
```bash
pnpm prisma db push
```
- Seed the database
```bash
pnpm prisma db seed
```
- Start the development server
```bash
pnpm dev
```

# Remix Overview
## File Conventions
### `entry.client`
Entry point for the browser, Remix handles hydration but itself, but if this file exists it takes the precedence.

### `entry.server`
Renders the markup and generates the response, again Remix handles the HTTP response by itself , but if this file exists it takes the precedence.

### `remix.config.js`
Contains build and developement configuration options. Exports an object.

```js
// remix.config.js
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app", // path to app directory
  assetsBuildDirectory: "public/build", // path to browser build (static hosting)
  ignoredRouteFiles: ["**/.*"], // files to be ignored within app/routes
  publicPath: "/build/", // path where browser will use to find static
  serverBuildPath: "build/index.js", // path to the server build
  tailwind: true, // to support tailwind functions and directives
};
```

### `root`
The root route of the application. This file is used to render the layout of the application. It uses `<Outlet />` component to render the routes. Contains everything Remix need to build a page.
```tsx
import stylesheet from "~/styles/globals.css";
import { Navbar } from "~/components";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <title>It's Remix Time!</title>
      </head>
      <body>
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

### Route File Naming (V2)
#### Basic Routes
Any file in the `app/routes` directory that ends with `.tsx` or `.jsx` is considered a route. The file name is used as the route path. 
For example, `app/routes/dashboard.tsx` will be rendered at `/dashboard`. Except for `_index.tsx`, which is rendered at `/`.

#### Dot Delimiters
Adding a `.` to a route filename will create `/` in the URL. This creates a nested route.
For example, `app/routes/dashboard.add.tsx` will be rendered at `/dashboard/add`.

#### Dynamic Segments
Dynamic segments in a route are prefixed with `$`. 
For example, `app/routes/dashboard.$user.tsx` will be rendered at `/dashboard/:user`.

#### Nested URLs without Layout Nesting
It is done by adding a trailing underscore (`_`) in the route filename

#### Nexted Layouts without Nested URLs
It is done by prefixing an underscore (`_`) in the route filename

#### Optional Segments
Wrapping a route segment in parentheses will make the segment optional.
For example, `app/routes/($lang).dashboard.tsx` will be rendered at `/dashboard` and `/en/dashboard` and `/fr/dashboard`.

#### Splat Routes
While dynamic segments match a single path segment (the stuff between two / in a URL), a splat route will match the rest of a URL, including the slashes.
For example, `app/routes/dashboard.$.tsx` will be rendered at `/dashboard`, `/dashboard/add/user`, `/dashboard/add/participant`, `/dashboard/add/user/new`, etc.

#### Escaping Special Characters
Special characters in a route filename can be escaped by enclosing them with `[]`.

## Route Module API
### links
Defines which `<link>` elements to be added to a route
```ts
// root.tsx
import stylesheet from "~/styles/globals.css";
import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
```

### meta
`meta` is used to add metadata HTML tags to a route
```tsx
// dashboard.tsx
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Dashboard | It's Remix Time!" },
    { name: "description", content: "Dashboard for It's Remix Time!" },
  ];
};
```
```tsx
// dashboard.add.tsx
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Add Participant | It's Remix Time!" },
    {
      name: "description",
      content: "Add a participant to the It's Remix Time!",
    },
  ];
};
//
```

### action
`action` is a server-only function that handles mutations and other actions i.e. it runs when a non-GET request is made to a route (POST, PUT, PATCH, DELETE). Actions have the same API as loaders, the only difference is when they are called. `actions` can return data to the route, which can be accessed using `useActionData()`.
```tsx
// dashboard.add.tsx
import { addParticipant } from "~/utils/participants";
import { requireUserId } from "~/utils/session";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const email = form.get("email");

  if (typeof name !== "string" || typeof email !== "string") {
    return {
      formError: "Form not submitted correctly.",
    };
  }

  await addParticipant({ name, email }, userId);
  return null;
};
```

### loader
`loader` is a server-only function that runs when a GET request is made to a route. It is used to fetch data pass it to the route component, which can be access using `useLoaderData()`.
```tsx
// dashboard.add.tsx
import { requireUserId } from "~/utils/session";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUserId(request);

  return json({ user });
};
```

## Components
### Meta
`<Meta />` renders the `<meta>` elements defined in the `meta` function of the root and the route modules.

### Links
`<Links />` renders the `<link>` elements defined in the `links` function of the root and the route modules.

### Scripts
`<Scripts />` renders the client runtime of your app. If `<Scripts/>` component is not rendered, the app will still work like a traditional web app without JavaScript, relying solely on HTML and browser behaviors.

### Link
`<Link>` is used to navigate between routes. It is similar to `<a>` tag, without a reload. It also supports prefetching of routes.
```tsx 
import { Link } from "@remix-run/react";

<Link to="/dashboard" prefetch="viewport">Dashboard</Link>
```

### Outlet
Used in parent route to render their child route. This enables nested UI.
```tsx
// dashboard.tsx
export default function Dashboard() {
  const participants = useLoaderData<typeof loader>();

  return (
    <div className="min-h-[75vh] flex flex-col justify-around mt-10 gap-3">
      <Outlet />
      {/* Renders the child route i.e <DashboardAdd /> is rendered here in /dashboard/add */}
      <Display participants={participants} />
    </div>
  );
}

// dashboard.home.tsx
export default function DashboardAdd() {
  const actionData = useActionData<ActionData | undefined>();

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-center">Add Participant</h1>
      {/* Participants Add Form */}
    </div>
  );
}
```

### Form
`<Form>` makes sure that after submission, all the loaders on the page will be reloaded. Even if JavaScript is disabled, the form and `action` will still work. 
```tsx 
// some-route.add.tsx
import { Form } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  // load some data here, loader will be reloaded after form submission
};

export const action: ActionFunction = async ({ request }) => {
  // do some action here
};

export default function SomeRoute() {
  return (
    <Form action="/some-route/add" method="post">
      {/* Form Inputs */}
    </Form>
  );
}
```

## Hooks
Remix provides a lot of hooks which can me used in the route modules/components

> ℹ️ This list does not include all the hooks. Remix provides several other hooks have a look into them too!

### `useActionData`
Returns the JSON parsed data from the route action function. Returns `undefined` if there hasn't been any submission.
```tsx
// signin.tsx
export default function SignIn() {
  let actionData = useActionData<ActionData | undefined>();

  return (
    <div className="flex flex-col gap-3 min-h-[75vh] items-center justify-center">
      <Form
        method="post"
        className="flex flex-col gap-3 items-center justify-center"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        {/* Form Inputs */}
        <div id="form-error-message">
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData?.formError}
            </p>
          ) : null}
        </div>
      </Form>
    </div>
  );
}
```

### `useLoaderData`
Returns the JSON parsed data from the route loader function.
```tsx
// dashboard.tsx
export const loader: LoaderFunction = async ({
  request,
}): Promise<Participant[]> => {
  const userId = await requireUserId(request);

  return await getParticipants(userId);
};

export default function Dashboard() {
  const participants = useLoaderData<typeof loader>();

  return (
    <div className="min-h-[75vh] flex flex-col justify-around mt-10 gap-3">
      <Outlet />
      <Display participants={participants} />
    </div>
  );
}
```

### `useParams`
Returns an object of the dynamic params from the current URL
```tsx
// blog.$slug.tsx
export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((post) => post.slug === slug);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

### `useOutletContext`
To access the context passed to `<Outlet />`
```tsx
// root.tsx
export default function App() {
  const { user } = useLoaderData();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Meta />
      <Links />
      <Scripts />
      <Outlet {{ user }} />
    </div>
  );
}

// some-other-route.tsx
import type { OutletContextType } from "~/types";

export default function SomeOtherRoute() {
  const { user: { name } } = useOutletContext<OutletContextType>();

  return (
    <div>
      <h1>Logged in as {name}!</h1>
    </div>
  );
}
```

## Utilities
### Cookies
Provides a logical, reusable container for cookie metadata. Often times used with sessions.
```tsx
// creating a cookie
import { createCookie } from "@remix-run/node";
import { isCookie } from "@remix-run/server-runtime";

export const cookie = createCookie("user-prefs", {
  maxAge: 604_800, // one week
});

// cookie.parse()
// Extracts and returns the value of this cookie in a given Cookie header.
cookie.parse(request.headers.get("Cookie"));

// cookie.serialize()
// Serializes a value and combines it with this cookie's options to create a Set-Cookie header
new Response("...", {
  headers: {
    "Set-Cookie": await cookie.serialize({
      darkTheme: true,
    }),
  },
});
```

### Sessions
Sessions allow the server to identify the request coming from the same client. Remix sessions are managed per-route basis in `action` and `loader` methods using a session storage.
```ts
// session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "remix_session", // session name
      secure: true, // only send cookies over https
      secrets: ["s3cre1"], // used to sign the cookie
      sameSite: "lax", // cookie is not sent on cross-site requests
      path: "/", // this path must exist in the URL 
      maxAge: 60 * 60 * 24 * 30, // seconds until cookie expiration: 30 days
      httpOnly: true, // does not allow client-side JS to access the cookie 
    },
  });

// commiting the session
export async function createUserSession(userId: string, redirectTo: string) {
  let session = await getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

// accessing the session
const session = await getSession(request.headers.get("Cookie"));

// destroying the session
export async function logout(request: Request) {
  let session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
```

### redirect
Helper to send 30x responses (redirections)
```ts
// protected-route.ts
import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const userSession = await getUserSession();

  if (!userSession) {
    // using redirect
    return redirect("/login", 302);

    // instead of sending a response with 301 status
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  }

  return json({ ok: true });
  
  export default function ProtectedRoute() {
    return (
      {/* Markup */}
    )
  };
};
```

### json
Helper to create `application/json` responses.

```tsx
// some-route.ts
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  // using json()
  return json({ any: "thing" });

  // instead of sending a response with "Content-Type": "application/json; charset=utf-8"
  return new Response(JSON.stringify({ any: "thing" }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export default function SomeRoute() {
  return (
    {/* Markup */}
  )
};
```
