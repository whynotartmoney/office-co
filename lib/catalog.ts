export type Tier = "free" | "pro";

export type Tool = {
  slug: string;
  tier: Tier;
  name: { en: string; zh: string };
  blurb: { en: string; zh: string };
};

export const tools: readonly Tool[] = [
  {
    slug: "word-counter",
    tier: "free",
    name: { en: "Word counter", zh: "字数统计" },
    blurb: {
      en: "Words, characters, lines, and reading time.",
      zh: "词数、字符、行数与阅读时间。",
    },
  },
  {
    slug: "case-converter",
    tier: "free",
    name: { en: "Case converter", zh: "大小写转换" },
    blurb: {
      en: "UPPER, lower, Title, Sentence, snake, camel, and kebab.",
      zh: "大写、小写、标题、句首、蛇形、驼峰与短横线。",
    },
  },
  {
    slug: "uuid",
    tier: "free",
    name: { en: "UUID v4", zh: "UUID v4" },
    blurb: {
      en: "Generate 1–50 version-4 UUIDs and copy them.",
      zh: "生成 1–50 个 UUID v4，并可复制。",
    },
  },
  {
    slug: "timestamp",
    tier: "free",
    name: { en: "Timestamp", zh: "时间戳" },
    blurb: {
      en: "Unix time to local and UTC ISO, and back.",
      zh: "Unix 时间与本地 / UTC ISO 互转。",
    },
  },
  {
    slug: "percentage",
    tier: "free",
    name: { en: "Percentage", zh: "百分比" },
    blurb: {
      en: "Percent of a value, what percent, and percent change.",
      zh: "求占比、百分比与增减幅度。",
    },
  },
  {
    slug: "contrast",
    tier: "free",
    name: { en: "Color contrast", zh: "颜色对比度" },
    blurb: {
      en: "Two hex colors, scored for WCAG AA and AAA.",
      zh: "两种十六进制颜色，检测 WCAG AA / AAA。",
    },
  },
  {
    slug: "base64",
    tier: "free",
    name: { en: "Base64", zh: "Base64" },
    blurb: { en: "Encode and decode UTF-8 text.", zh: "编码与解码 UTF-8 文本。" },
  },
  {
    slug: "lorem",
    tier: "free",
    name: { en: "Lorem ipsum", zh: "占位文本" },
    blurb: {
      en: "Placeholder paragraphs or a set word count.",
      zh: "按段落或词数生成占位文本。",
    },
  },
  {
    slug: "json-yaml",
    tier: "pro",
    name: { en: "JSON / YAML", zh: "JSON / YAML" },
    blurb: {
      en: "Pretty-print, minify, validate, and convert.",
      zh: "美化、压缩、校验与互转。",
    },
  },
  {
    slug: "csv-json",
    tier: "pro",
    name: { en: "CSV ↔ JSON", zh: "CSV ↔ JSON" },
    blurb: {
      en: "Spreadsheets to JSON arrays, and back.",
      zh: "表格与 JSON 数组互转。",
    },
  },
  {
    slug: "regex",
    tier: "pro",
    name: { en: "Regex tester", zh: "正则测试" },
    blurb: {
      en: "Pattern, flags, matches, and replace.",
      zh: "模式、标志、匹配与替换。",
    },
  },
  {
    slug: "diff",
    tier: "pro",
    name: { en: "Text diff", zh: "文本对比" },
    blurb: {
      en: "Side-by-side or unified difference.",
      zh: "并排或统一格式的差异。",
    },
  },
  {
    slug: "qr",
    tier: "pro",
    name: { en: "QR code", zh: "二维码" },
    blurb: { en: "Text or a URL, downloaded as PNG.", zh: "文本或网址，下载 PNG。" },
  },
  {
    slug: "password",
    tier: "pro",
    name: { en: "Password", zh: "密码生成" },
    blurb: {
      en: "Length and character sets, generated locally.",
      zh: "选择长度与字符集，在本地生成。",
    },
  },
  {
    slug: "markdown",
    tier: "pro",
    name: { en: "Markdown", zh: "Markdown" },
    blurb: { en: "Live preview, and copy the HTML.", zh: "实时预览，并复制 HTML。" },
  },
  {
    slug: "units",
    tier: "pro",
    name: { en: "Unit converter", zh: "单位换算" },
    blurb: {
      en: "Length, weight, temperature, and area.",
      zh: "长度、重量、温度与面积。",
    },
  },
] as const;

const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));

export function getTool(slug: string): Tool | undefined {
  return bySlug.get(slug);
}

export function toolIndex(slug: string): number {
  return tools.findIndex((tool) => tool.slug === slug);
}
