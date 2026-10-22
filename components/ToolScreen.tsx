"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useLayoutEffect, type ComponentType, type ReactNode } from "react";
import { useApp } from "@/components/Providers";
import { Bi, Tx } from "@/components/Tx";
import { getTool, toolIndex } from "@/lib/catalog";
import { writeLastTool } from "@/lib/storage";

function Pending() {
  return <div className="tool-pending" aria-busy="true" />;
}

const views: Record<string, ComponentType> = {
  "word-counter": dynamic(() => import("@/components/tools/WordCounter"), { loading: Pending }),
  "case-converter": dynamic(() => import("@/components/tools/CaseConverter"), { loading: Pending }),
  uuid: dynamic(() => import("@/components/tools/UuidTool"), { loading: Pending }),
  timestamp: dynamic(() => import("@/components/tools/TimestampTool"), { loading: Pending }),
  percentage: dynamic(() => import("@/components/tools/PercentageTool"), { loading: Pending }),
  contrast: dynamic(() => import("@/components/tools/ContrastTool"), { loading: Pending }),
  base64: dynamic(() => import("@/components/tools/Base64Tool"), { loading: Pending }),
  lorem: dynamic(() => import("@/components/tools/LoremTool"), { loading: Pending }),
  "cn-amount": dynamic(() => import("@/components/tools/CnAmountTool"), { loading: Pending }),
  "text-search": dynamic(() => import("@/components/tools/TextSearchTool"), { loading: Pending }),
  "json-yaml": dynamic(() => import("@/components/tools/JsonYamlTool"), { loading: Pending }),
  "csv-json": dynamic(() => import("@/components/tools/CsvJsonTool"), { loading: Pending }),
  regex: dynamic(() => import("@/components/tools/RegexTool"), { loading: Pending }),
  diff: dynamic(() => import("@/components/tools/DiffTool"), { loading: Pending }),
  qr: dynamic(() => import("@/components/tools/QrTool"), { loading: Pending }),
  password: dynamic(() => import("@/components/tools/PasswordTool"), { loading: Pending }),
  markdown: dynamic(() => import("@/components/tools/MarkdownTool"), { loading: Pending }),
  units: dynamic(() => import("@/components/tools/UnitsTool"), { loading: Pending }),
};

class ToolBoundary extends Component<{ resetKey: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidUpdate(previous: { resetKey: string }) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="msg bad" role="alert">
          <Tx id="tool.crash" />
        </p>
      );
    }
    return this.props.children;
  }
}

export function ToolScreen({ slug }: { slug: string }) {
  const tool = getTool(slug);
  const { pro, ready } = useApp();

  useLayoutEffect(() => {
    if (tool) writeLastTool(tool.slug);
  }, [tool]);

  if (!tool) return null;
  const View = views[tool.slug];
  const locked = tool.tier === "pro" && ready && !pro;

  return (
    <article className="page">
      <header className="tool-head">
        <Link href="/" className="back">
          <Tx id="back" />
        </Link>
        <p className="card-index">{String(toolIndex(tool.slug) + 1).padStart(2, "0")}</p>
        <h1 className="tool-name">
          <Bi en={tool.name.en} zh={tool.name.zh} />
        </h1>
        <p className="lede">
          <Bi en={tool.blurb.en} zh={tool.blurb.zh} />
        </p>
        {tool.tier === "pro" ? (
          <span className="badge pro">Pro</span>
        ) : (
          <span className="badge">
            <Tx id="free" />
          </span>
        )}
      </header>
      {tool.tier === "pro" && !ready ? (
        <Pending />
      ) : locked ? (
        <div className="lock-plate">
          <span className="badge pro">Pro</span>
          <h2>
            <Tx id="locked.title" />
          </h2>
          <p>
            <Tx id="locked.body" />
          </p>
          <Link href="/pro" className="btn">
            <Tx id="locked.cta" />
          </Link>
        </div>
      ) : (
        <ToolBoundary resetKey={tool.slug}>
          <View />
        </ToolBoundary>
      )}
    </article>
  );
}
