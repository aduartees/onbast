import { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { TabbedCode } from "@/components/docs/tabbed-code";
import { Note } from "@/components/docs/note";

export const metadata: Metadata = {
  title: "Getting started with Speed Insights - ONBAST",
  description: "Learn how to enable Vercel Speed Insights on your project and monitor performance metrics.",
};

export default function SpeedInsightsGuide() {
  return (
    <main className="min-h-screen bg-neutral-950 text-slate-200">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Getting started with Speed Insights</h1>
          <p className="text-lg text-slate-400">
            This guide will help you get started with using Vercel Speed Insights on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.
          </p>
        </div>

        {/* Prerequisites Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Prerequisites</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Account and Project Setup</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-400">
                <li>A Vercel account. If you don't have one, you can <a href="https://vercel.com/signup" className="text-cyan-500 hover:text-cyan-400">sign up for free</a>.</li>
                <li>A Vercel project. If you don't have one, you can <a href="https://vercel.com/new" className="text-cyan-500 hover:text-cyan-400">create a new project</a>.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Install Vercel CLI</h3>
              <p className="text-slate-400 mb-3">The Vercel CLI is optional but recommended. You can install it using the following command:</p>
              <TabbedCode
                codes={[
                  { tab: "pnpm", code: "pnpm i vercel", language: "bash" },
                  { tab: "yarn", code: "yarn i vercel", language: "bash" },
                  { tab: "npm", code: "npm i vercel", language: "bash" },
                  { tab: "bun", code: "bun i vercel", language: "bash" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Enable Speed Insights */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Enable Speed Insights in Vercel</h2>
          <p className="text-slate-400 mb-4">
            On the <a href="/dashboard" className="text-cyan-500 hover:text-cyan-400">Vercel dashboard</a>, select your Project followed by the <strong>Speed Insights</strong> tab. You can also navigate there directly from your project settings. Then, select <strong>Enable</strong> from the dialog.
          </p>
          <Note type="note">
            Enabling Speed Insights will add new routes (scoped at <code className="bg-slate-800 px-2 py-1 rounded">/_vercel/speed-insights/*</code>) after your next deployment.
          </Note>
        </section>

        {/* Add Package */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Add @vercel/speed-insights to your project</h2>
          
          <p className="text-slate-400 mb-6">
            Using the package manager of your choice, add the <code className="bg-slate-800 px-2 py-1 rounded">@vercel/speed-insights</code> package to your project:
          </p>

          <TabbedCode
            codes={[
              { tab: "pnpm", code: "pnpm i @vercel/speed-insights", language: "bash" },
              { tab: "yarn", code: "yarn i @vercel/speed-insights", language: "bash" },
              { tab: "npm", code: "npm i @vercel/speed-insights", language: "bash" },
              { tab: "bun", code: "bun i @vercel/speed-insights", language: "bash" },
            ]}
            className="mb-6"
          />

          <Note type="info">
            When using the HTML implementation, there is no need to install the <code className="bg-slate-800 px-2 py-1 rounded">@vercel/speed-insights</code> package.
          </Note>
        </section>

        {/* Framework-specific Integration */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Integration by Framework</h2>

          {/* Next.js Pages Router */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">Next.js (Pages Router)</h3>
            <p className="text-slate-400 mb-4">
              The <code className="bg-slate-800 px-2 py-1 rounded">SpeedInsights</code> component is a wrapper around the tracking script, offering more seamless integration with Next.js.
            </p>
            <p className="text-slate-400 mb-4">Add the following component to your main app file:</p>

            <CodeBlock
              code={`import type { AppProps } from 'next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}

export default MyApp;`}
              language="typescript"
              filename="pages/_app.tsx"
              className="mb-4"
            />

            <CodeBlock
              code={`import { SpeedInsights } from "@vercel/speed-insights/next";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}

export default MyApp;`}
              language="javascript"
              filename="pages/_app.jsx"
              className="mb-6"
            />

            <p className="text-slate-400 mb-4">
              For versions of Next.js older than 13.5, import the <code className="bg-slate-800 px-2 py-1 rounded">&lt;SpeedInsights&gt;</code> component from <code className="bg-slate-800 px-2 py-1 rounded">@vercel/speed-insights/react</code>. Then pass it the pathname of the route:
            </p>

            <CodeBlock
              code={`import { SpeedInsights } from "@vercel/speed-insights/react";
import { useRouter } from "next/router";

export default function Layout() {
  const router = useRouter();

  return <SpeedInsights route={router.pathname} />;
}`}
              language="typescript"
              filename="pages/example-component.tsx"
              className="mb-4"
            />

            <CodeBlock
              code={`import { SpeedInsights } from "@vercel/speed-insights/react";
import { useRouter } from "next/router";

export default function Layout() {
  const router = useRouter();

  return <SpeedInsights route={router.pathname} />;
}`}
              language="javascript"
              filename="pages/example-component.jsx"
            />
          </div>

          {/* Next.js App Router */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">Next.js (App Router)</h3>
            <p className="text-slate-400 mb-4">
              The <code className="bg-slate-800 px-2 py-1 rounded">SpeedInsights</code> component is a wrapper around the tracking script, offering more seamless integration with Next.js.
            </p>
            <p className="text-slate-400 mb-4">Add the following component to the root layout:</p>

            <CodeBlock
              code={`import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}`}
              language="typescript"
              filename="app/layout.tsx"
              className="mb-4"
            />

            <CodeBlock
              code={`import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}`}
              language="javascript"
              filename="app/layout.jsx"
              className="mb-6"
            />

            <p className="text-slate-400 mb-4">
              For versions of Next.js older than 13.5, import the <code className="bg-slate-800 px-2 py-1 rounded">&lt;SpeedInsights&gt;</code> component from <code className="bg-slate-800 px-2 py-1 rounded">@vercel/speed-insights/react</code>.
            </p>
            <p className="text-slate-400 mb-4">Create a dedicated component to avoid opting out from SSR on the layout and pass the pathname of the route to the SpeedInsights component:</p>

            <CodeBlock
              code={`"use client";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { usePathname } from "next/navigation";

export function Insights() {
  const pathname = usePathname();

  return <SpeedInsights route={pathname} />;
}`}
              language="typescript"
              filename="app/insights.tsx"
              className="mb-4"
            />

            <CodeBlock
              code={`"use client";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { usePathname } from "next/navigation";

export function Insights() {
  const pathname = usePathname();

  return <SpeedInsights route={pathname} />;
}`}
              language="javascript"
              filename="app/insights.jsx"
              className="mb-6"
            />

            <p className="text-slate-400 mb-4">Then, import the <code className="bg-slate-800 px-2 py-1 rounded">Insights</code> component in your layout:</p>

            <CodeBlock
              code={`import type { ReactNode } from "react";
import { Insights } from "./insights";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Insights />
      </body>
    </html>
  );
}`}
              language="typescript"
              filename="app/layout.tsx"
              className="mb-4"
            />

            <CodeBlock
              code={`import { Insights } from "./insights";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Insights />
      </body>
    </html>
  );
}`}
              language="javascript"
              filename="app/layout.jsx"
            />
          </div>

          {/* Create React App */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">Create React App</h3>
            <p className="text-slate-400 mb-4">
              The <code className="bg-slate-800 px-2 py-1 rounded">SpeedInsights</code> component is a wrapper around the tracking script, offering more seamless integration with React.
            </p>
            <p className="text-slate-400 mb-4">Add the following component to the main app file:</p>

            <CodeBlock
              code={`import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <div>
      {/* ... */}
      <SpeedInsights />
    </div>
  );
}`}
              language="typescript"
              filename="App.tsx"
              className="mb-4"
            />

            <CodeBlock
              code={`import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  return (
    <div>
      {/* ... */}
      <SpeedInsights />
    </div>
  );
}`}
              language="javascript"
              filename="App.jsx"
            />
          </div>

          {/* Remix */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">Remix</h3>
            <p className="text-slate-400 mb-4">
              The <code className="bg-slate-800 px-2 py-1 rounded">SpeedInsights</code> component is a wrapper around the tracking script, offering a seamless integration with Remix.
            </p>
            <p className="text-slate-400 mb-4">Add the following component to your root file:</p>

            <CodeBlock
              code={`import { SpeedInsights } from '@vercel/speed-insights/remix';

export default function App() {
  return (
    <html lang="en">
      <body>
        {/* ... */}
        <SpeedInsights />
      </body>
    </html>
  );
}`}
              language="typescript"
              filename="app/root.tsx"
              className="mb-4"
            />

            <CodeBlock
              code={`import { SpeedInsights } from "@vercel/speed-insights/remix";

export default function App() {
  return (
    <html lang="en">
      <body>
        {/* ... */}
        <SpeedInsights />
      </body>
    </html>
  );
}`}
              language="javascript"
              filename="app/root.jsx"
            />
          </div>

          {/* SvelteKit */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">SvelteKit</h3>
            <p className="text-slate-400 mb-4">Add the following to your root layout file:</p>

            <CodeBlock
              code={`import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

injectSpeedInsights();`}
              language="typescript"
              filename="src/routes/+layout.ts"
              className="mb-4"
            />

            <CodeBlock
              code={`import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

injectSpeedInsights();`}
              language="javascript"
              filename="src/routes/+layout.js"
            />
          </div>

          {/* Vue */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">Vue</h3>
            <p className="text-slate-400 mb-4">
              The <code className="bg-slate-800 px-2 py-1 rounded">SpeedInsights</code> component is a wrapper around the tracking script, offering more seamless integration with Vue.
            </p>
            <p className="text-slate-400 mb-4">Add the following component to the main app template:</p>

            <CodeBlock
              code={`<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
</template>`}
              language="typescript"
              filename="src/App.vue"
              className="mb-4"
            />

            <CodeBlock
              code={`<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
</template>`}
              language="javascript"
              filename="src/App.vue"
            />
          </div>

          {/* Nuxt */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">Nuxt</h3>
            <p className="text-slate-400 mb-4">
              The <code className="bg-slate-800 px-2 py-1 rounded">SpeedInsights</code> component is a wrapper around the tracking script, offering more seamless integration with Nuxt.
            </p>
            <p className="text-slate-400 mb-4">Add the following component to the default layout:</p>

            <CodeBlock
              code={`<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
</template>`}
              language="typescript"
              filename="layouts/default.vue"
              className="mb-4"
            />

            <CodeBlock
              code={`<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
</template>`}
              language="javascript"
              filename="layouts/default.vue"
            />
          </div>

          {/* Astro */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-white">Astro</h3>
            <p className="text-slate-400 mb-4">
              Speed Insights is available for both static and SSR Astro apps.
            </p>
            <p className="text-slate-400 mb-4">
              To enable this feature, declare the <code className="bg-slate-800 px-2 py-1 rounded">&lt;SpeedInsights /&gt;</code> component from <code className="bg-slate-800 px-2 py-1 rounded">@vercel/speed-insights/astro</code> near the bottom of one of your layout components, such as <code className="bg-slate-800 px-2 py-1 rounded">BaseHead.astro</code>:
            </p>

            <CodeBlock
              code={`---
import SpeedInsights from '@vercel/speed-insights/astro';
const { title, description } = Astro.props;
---
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<SpeedInsights />`}
              language="typescript"
              filename="BaseHead.astro"
              className="mb-6"
            />

            <p className="text-slate-400 mb-4">
              Optionally, you can remove sensitive information from the URL by adding a <code className="bg-slate-800 px-2 py-1 rounded">speedInsightsBeforeSend</code> function to the global <code className="bg-slate-800 px-2 py-1 rounded">window</code> object. The <code className="bg-slate-800 px-2 py-1 rounded">&lt;SpeedInsights /&gt;</code> component will call this method before sending any data to Vercel:
            </p>

            <CodeBlock
              code={`---
import SpeedInsights from '@vercel/speed-insights/astro';
const { title, description } = Astro.props;
---
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<script is:inline>
  function speedInsightsBeforeSend(data){
    console.log("Speed Insights before send", data)
    return data;
  }
</script>
<SpeedInsights />`}
              language="typescript"
              filename="BaseHead.astro"
            />
          </div>

          {/* Other/Generic */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Other Frameworks</h3>
            <p className="text-slate-400 mb-4">
              Import the <code className="bg-slate-800 px-2 py-1 rounded">injectSpeedInsights</code> function from the package, which will add the tracking script to your app. This should only be called once in your app, and must run in the client.
            </p>
            <p className="text-slate-400 mb-4">Add the following code to your main app file:</p>

            <CodeBlock
              code={`import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();`}
              language="typescript"
              filename="main.ts"
              className="mb-4"
            />

            <CodeBlock
              code={`import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();`}
              language="javascript"
              filename="main.js"
            />
          </div>
        </section>

        {/* Deploy Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Deploy your app to Vercel</h2>
          <p className="text-slate-400 mb-4">
            You can deploy your app to Vercel's global CDN by running the following command from your terminal:
          </p>

          <CodeBlock
            code="vercel deploy"
            language="bash"
            filename="terminal"
            className="mb-6"
          />

          <p className="text-slate-400 mb-4">
            Alternatively, you can <a href="/docs/git#deploying-a-git-repository" className="text-cyan-500 hover:text-cyan-400">connect your project's git repository</a>, which will enable Vercel to deploy your latest pushes and merges to main.
          </p>
          <p className="text-slate-400 mb-4">
            Once your app is deployed, it's ready to begin tracking performance metrics.
          </p>

          <Note type="note">
            If everything is set up correctly, you should be able to find the <code className="bg-slate-800 px-2 py-1 rounded">/_vercel/speed-insights/script.js</code> script inside the body tag of your page.
          </Note>
        </section>

        {/* View Data Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">View your data in the dashboard</h2>
          <p className="text-slate-400 mb-4">
            Once your app is deployed, and users have visited your site, you can view the data in the dashboard.
          </p>
          <p className="text-slate-400 mb-4">
            To do so, go to your <a href="/dashboard" className="text-cyan-500 hover:text-cyan-400">dashboard</a>, select your project, and click the <strong>Speed Insights</strong> tab.
          </p>
          <p className="text-slate-400 mb-6">
            After a few days of visitors, you'll be able to start exploring your metrics. For more information on how to use Speed Insights, see the official documentation.
          </p>

          <p className="text-slate-400">
            Learn more about how Vercel supports <a href="/docs/speed-insights/privacy-policy" className="text-cyan-500 hover:text-cyan-400">privacy and data compliance standards</a> with Vercel Speed Insights.
          </p>
        </section>

        {/* Next Steps */}
        <section className="border-t border-slate-800 pt-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Next steps</h2>
          <p className="text-slate-400 mb-4">Now that you have Vercel Speed Insights set up, you can explore the following topics to learn more:</p>
          
          <ul className="space-y-3 text-slate-400">
            <li>
              <a href="#" className="text-cyan-500 hover:text-cyan-400">Learn how to use the @vercel/speed-insights package</a>
            </li>
            <li>
              <a href="#" className="text-cyan-500 hover:text-cyan-400">Learn about metrics</a>
            </li>
            <li>
              <a href="#" className="text-cyan-500 hover:text-cyan-400">Read about privacy and compliance</a>
            </li>
            <li>
              <a href="#" className="text-cyan-500 hover:text-cyan-400">Explore pricing</a>
            </li>
            <li>
              <a href="#" className="text-cyan-500 hover:text-cyan-400">Troubleshooting</a>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
