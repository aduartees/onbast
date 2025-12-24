import Image from "next/image";
import { PortableText } from "next-sanity";
import type { TypedObject } from "@portabletext/types";

type LegalPortableImage = {
  _type: "image";
  url?: string;
  alt?: string;
};

export type LegalPageContent = {
  title?: string;
  updatedAt?: string;
  content?: TypedObject[];
};

export const LegalPage = ({ title, updatedAt, content }: LegalPageContent) => {
  const components = {
    types: {
      image: ({ value }: { value: LegalPortableImage }) => {
        if (!value?.url) return null;

        return (
          <figure className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/40">
            <Image
              src={value.url}
              alt={value.alt || ""}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full object-cover"
            />
          </figure>
        );
      },
    },
    marks: {
      link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => {
        const href = value?.href;
        const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
        return (
          <a
            href={href}
            rel={isExternal ? "noopener noreferrer" : undefined}
            target={isExternal ? "_blank" : undefined}
            className="text-indigo-300 underline underline-offset-4 hover:text-indigo-200"
          >
            {children}
          </a>
        );
      },
    },
    block: {
      h1: ({ children }: { children: React.ReactNode }) => (
        <h1 className="scroll-mt-28 text-3xl font-semibold tracking-tight text-white md:text-5xl">{children}</h1>
      ),
      h2: ({ children }: { children: React.ReactNode }) => (
        <h2 className="scroll-mt-28 text-xl font-semibold tracking-tight text-white md:text-2xl">{children}</h2>
      ),
      h3: ({ children }: { children: React.ReactNode }) => (
        <h3 className="scroll-mt-28 text-lg font-semibold tracking-tight text-white md:text-xl">{children}</h3>
      ),
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-base leading-relaxed text-neutral-300 md:text-lg">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <ul className="list-disc space-y-2 pl-6 text-neutral-300">{children}</ul>
      ),
      number: ({ children }: { children: React.ReactNode }) => (
        <ol className="list-decimal space-y-2 pl-6 text-neutral-300">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
      number: ({ children }: { children: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
    },
  };

  const parsedUpdatedAt = updatedAt ? new Date(updatedAt) : null;
  const dateText = parsedUpdatedAt && !Number.isNaN(parsedUpdatedAt.getTime())
    ? new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(parsedUpdatedAt)
    : null;

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white pt-24">
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
          {dateText && (
            <time dateTime={updatedAt} className="block text-sm text-neutral-400">
              {dateText}
            </time>
          )}
        </header>

        <article className="mt-10 space-y-6 rounded-3xl border border-white/5 bg-neutral-950/30 p-6 md:p-10">
          <PortableText value={Array.isArray(content) ? content : []} components={components as any} />
        </article>
      </section>
    </main>
  );
};
