import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ToolScreen } from "@/components/ToolScreen";
import { getTool, tools } from "@/lib/catalog";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: "office-co" };
  return {
    title: tool.name.en,
    description: tool.blurb.en,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getTool(slug)) notFound();
  return (
    <Suspense fallback={<div className="tool-pending" aria-busy="true" />}>
      <ToolScreen slug={slug} />
    </Suspense>
  );
}
