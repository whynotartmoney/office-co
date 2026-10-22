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
    name: { en: "Word counter", zh: "字數統計" },
    blurb: {
      en: "Words, characters, lines, and reading time.",
      zh: "詞數、字元、行數與閱讀時間。",
    },
  },
  {
    slug: "case-converter",
    tier: "free",
    name: { en: "Case converter", zh: "大小寫轉換" },
    blurb: {
      en: "UPPER, lower, Title, Sentence, snake, camel, and kebab.",
      zh: "大寫、小寫、標題、句首、蛇形、駝峰與短橫線。",
    },
  },
  {
    slug: "uuid",
    tier: "free",
    name: { en: "UUID v4", zh: "UUID v4" },
    blurb: {
      en: "Generate 1–50 version-4 UUIDs and copy them.",
      zh: "產生 1–50 個 UUID v4，並可複製。",
    },
  },
  {
    slug: "timestamp",
    tier: "free",
    name: { en: "Timestamp", zh: "時間戳" },
    blurb: {
      en: "Unix time to local and UTC ISO, and back.",
      zh: "Unix 時間與本機 / UTC ISO 互轉。",
    },
  },
  {
    slug: "percentage",
    tier: "free",
    name: { en: "Percentage", zh: "百分比" },
    blurb: {
      en: "Percent of a value, what percent, and percent change.",
      zh: "求佔比、百分比與增減幅度。",
    },
  },
  {
    slug: "contrast",
    tier: "free",
    name: { en: "Color contrast", zh: "顏色對比度" },
    blurb: {
      en: "Two hex colors, scored for WCAG AA and AAA.",
      zh: "兩種十六進位顏色，檢測 WCAG AA / AAA。",
    },
  },
  {
    slug: "base64",
    tier: "free",
    name: { en: "Base64", zh: "Base64" },
    blurb: { en: "Encode and decode UTF-8 text.", zh: "編碼與解碼 UTF-8 文字。" },
  },
  {
    slug: "lorem",
    tier: "free",
    name: { en: "Lorem ipsum", zh: "佔位文字" },
    blurb: {
      en: "Placeholder paragraphs or a set word count.",
      zh: "按段落或詞數產生佔位文字。",
    },
  },
  {
    slug: "cn-amount",
    tier: "free",
    name: { en: "Chinese amount", zh: "大寫金額" },
    blurb: {
      en: "Numbers to Traditional Chinese invoice amounts.",
      zh: "阿拉伯數字轉為繁體支票大寫金額。",
    },
  },
  {
    slug: "text-search",
    tier: "free",
    name: { en: "Text search", zh: "文字搜尋" },
    blurb: {
      en: "Highlight every match in a long paste, in a color you pick.",
      zh: "在長文字裡高亮全部相符，並可自選顏色。",
    },
  },
  {
    slug: "json-yaml",
    tier: "pro",
    name: { en: "JSON / YAML", zh: "JSON / YAML" },
    blurb: {
      en: "Pretty-print, minify, validate, and convert.",
      zh: "美化、壓縮、驗證與互轉。",
    },
  },
  {
    slug: "csv-json",
    tier: "pro",
    name: { en: "CSV ↔ JSON", zh: "CSV ↔ JSON" },
    blurb: {
      en: "Spreadsheets to JSON arrays, and back.",
      zh: "表格與 JSON 陣列互轉。",
    },
  },
  {
    slug: "regex",
    tier: "pro",
    name: { en: "Regex tester", zh: "正則測試" },
    blurb: {
      en: "Pattern, flags, matches, and replace.",
      zh: "模式、旗標、相符與替換。",
    },
  },
  {
    slug: "diff",
    tier: "pro",
    name: { en: "Text diff", zh: "文字差異" },
    blurb: {
      en: "Side-by-side or unified difference.",
      zh: "並排或統一格式的差異。",
    },
  },
  {
    slug: "qr",
    tier: "pro",
    name: { en: "QR code", zh: "QR 碼" },
    blurb: { en: "Text or a URL, downloaded as PNG.", zh: "文字或網址，下載 PNG。" },
  },
  {
    slug: "password",
    tier: "pro",
    name: { en: "Password", zh: "密碼產生" },
    blurb: {
      en: "Length and character sets, generated locally.",
      zh: "選擇長度與字元集，在本機產生。",
    },
  },
  {
    slug: "markdown",
    tier: "pro",
    name: { en: "Markdown", zh: "Markdown" },
    blurb: { en: "Live preview, and copy the HTML.", zh: "即時預覽，並複製 HTML。" },
  },
  {
    slug: "units",
    tier: "pro",
    name: { en: "Unit converter", zh: "單位換算" },
    blurb: {
      en: "Length, weight, temperature, and area.",
      zh: "長度、重量、溫度與面積。",
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
