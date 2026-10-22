import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chineseAmount } from "./amount.ts";
import { tools } from "./catalog.ts";
import { highlightSpans, matchCount } from "./highlight.ts";
import { gradeContrast, parseHex } from "./contrast.ts";
import { jsonToYaml, prettyJson, yamlToJson } from "./convert.ts";
import { csvToJson, jsonToCsv, parseCsv } from "./csv.ts";
import { hasChanges, sideBySide } from "./diffview.ts";
import { copy, zh } from "./i18n.ts";
import { loremParagraphs, loremWords } from "./lorem.ts";
import { generatePassword } from "./password.ts";
import { adjustByPercent, percentChange, percentOf, whatPercent } from "./percent.ts";
import { isValidProPayload } from "./pro.ts";
import { DEFAULT_THEME, isProValue, nextTheme } from "./storage.ts";
import { runRegex } from "./regex.ts";
import { decodeBase64, encodeBase64, textStats, toCamel, toKebab, toSentence, toSnake, toTitle } from "./text.ts";
import { formatOffset, interpretUnix, parseIso } from "./time.ts";
import { convertUnits } from "./units.ts";

describe("catalog", () => {
  it("has ten free and eight pro tools with unique slugs", () => {
    assert.equal(tools.length, 18);
    assert.equal(tools.filter((tool) => tool.tier === "free").length, 10);
    assert.equal(tools.filter((tool) => tool.tier === "pro").length, 8);
    assert.equal(new Set(tools.map((tool) => tool.slug)).size, 18);
    assert.equal(tools.find((tool) => tool.slug === "cn-amount")?.tier, "free");
    assert.equal(tools.find((tool) => tool.slug === "text-search")?.tier, "free");
  });
});

const SIMPLIFIED_ONLY =
  "门关页专费设备开继软权输览请换题语锁这钥账证发许复错词计贴统标驼现读无几变减两颜压须组运结编显后并网载画长选种预温摄华亩顷码国时来对还说东车马鱼飞龙万与云仅们优伪会体个为过还经动样书贝见车鸟页风齐专业华从众产亿伞伟传伤伦伪余佣侧侨币师广庆应弃张录怀总恶户执扩扫扬护报担拥拦择挤挥损摆旧旷暂术杀杂条杰栋栏树样桥梦检楼荣欢欧壳汇汉汤沟沪泪油泽洁洒浅浆测济浓涂消涉涨液淀深混添渔渗渣湿滤滥滩灭灯灵灾点热烧烦照熊爱爷尔墙牍牵牺状犹狈独狭狮狱猎猪猫献环玛玮珑珠琼璃电畅疗疮疯疼病症痒痛刚钟铁银错镇镜闪闭问间队阳阴际陆陈险随隐隶难雏雾鸡驱驶驻验骑麦黄齐齿龟丝丢两丰临为丽举义乌乐乔习乡书买乱争于亏亚亲仆仇仑价众伙伟伤伫佣俭倾佥侠侣侦侧侨侬俨俩俪债倾偻伪伞伦伫体佣侠";

describe("copy", () => {
  it("translates every English string", () => {
    for (const key of Object.keys(copy.en)) {
      assert.equal(typeof zh[key as keyof typeof zh], "string");
      assert.ok(zh[key as keyof typeof zh].length > 0);
    }
  });

  it("keeps Chinese UI copy in Traditional Chinese", () => {
    const ui = [
      ...Object.values(zh),
      ...tools.flatMap((tool) => [tool.name.zh, tool.blurb.zh]),
    ].join("");
    for (const char of SIMPLIFIED_ONLY) {
      assert.equal(ui.includes(char), false, `simplified character ${char}`);
    }
  });
});

describe("pro flag", () => {
  it("accepts only a real unlock value and a strict valid payload", () => {
    assert.equal(isProValue("1"), true);
    assert.equal(isProValue("true"), true);
    assert.equal(isProValue(null), false);
    assert.equal(isProValue(""), false);
    assert.equal(isProValue("0"), false);
    assert.equal(isProValue("false"), false);
    assert.equal(isValidProPayload({ valid: true }), true);
    assert.equal(isValidProPayload({ valid: false }), false);
    assert.equal(isValidProPayload({ valid: "true" }), false);
    assert.equal(isValidProPayload(null), false);
    assert.equal(DEFAULT_THEME, "white");
    assert.equal(nextTheme("white"), "silver");
    assert.equal(nextTheme("silver"), "black");
    assert.equal(nextTheme("black"), "white");
    assert.equal(nextTheme(null), "silver");
  });
});

describe("text", () => {
  it("counts words, CJK characters, lines, and reading time", () => {
    const stats = textStats("hello world\n世界");
    assert.equal(stats.words, 4);
    assert.equal(stats.lines, 2);
    assert.ok(stats.chars > stats.charsNoSpace);
    assert.equal(textStats("").lines, 0);
  });

  it("converts case", () => {
    assert.equal(toTitle("hello world"), "Hello World");
    assert.equal(toSentence("hello. world"), "Hello. World");
    assert.equal(toSnake("helloWorld"), "hello_world");
    assert.equal(toCamel("hello world"), "helloWorld");
    assert.equal(toKebab("Hello World"), "hello-world");
  });

  it("round-trips UTF-8 base64", () => {
    assert.equal(encodeBase64("hello"), "aGVsbG8=");
    assert.equal(decodeBase64("aGVsbG8="), "hello");
    assert.equal(decodeBase64(encodeBase64("你好")), "你好");
    assert.throws(() => decodeBase64("@@@"));
  });
});

describe("contrast", () => {
  it("scores black on white as AAA", () => {
    const grade = gradeContrast(parseHex("#000")!, parseHex("#fff")!);
    assert.ok(grade.ratio > 20);
    assert.equal(grade.aaaNormal, true);
    assert.equal(parseHex("nope"), null);
  });
});

describe("time and percent", () => {
  it("detects seconds versus milliseconds and formats offsets", () => {
    assert.equal(interpretUnix("1700000000", "auto")?.unit, "s");
    assert.equal(interpretUnix("1700000000000", "auto")?.unit, "ms");
    assert.equal(interpretUnix("1700000000", "s")?.ms, 1_700_000_000_000);
    assert.equal(parseIso("2026-01-01T00:00:00Z"), Date.UTC(2026, 0, 1));
    assert.equal(formatOffset(Date.UTC(2026, 0, 1, 0, 0, 0), 60), "2026-01-01T01:00:00+01:00");
  });

  it("calculates percentages", () => {
    assert.equal(percentOf(20, 50), 10);
    assert.equal(whatPercent(10, 50), 20);
    assert.equal(percentChange(40, 50), 25);
    assert.equal(adjustByPercent(80, 10, "add"), 88);
    assert.equal(whatPercent(1, 0), null);
  });
});

describe("documents", () => {
  it("converts csv, json, and yaml", () => {
    const rows = parseCsv('name,city\nAda,"New York, NY"');
    assert.deepEqual(rows[1], ["Ada", "New York, NY"]);
    const json = csvToJson("name,city\nAda,Lisbon");
    assert.deepEqual(json, [{ name: "Ada", city: "Lisbon" }]);
    assert.equal(jsonToCsv('[{"name":"Ada","city":"Lisbon"}]'), "name,city\nAda,Lisbon");
    assert.throws(() => jsonToCsv('{"name":"Ada"}'));
    const yaml = jsonToYaml('{"desk":"office-co"}');
    assert.match(yaml, /desk: office-co/);
    assert.equal(prettyJson(yamlToJson(yaml)), '{\n  "desk": "office-co"\n}');
  });

  it("diffs and tests regular expressions", () => {
    const rows = sideBySide("a\nb", "a\nc");
    assert.equal(hasChanges(rows), true);
    assert.equal(rows.some((row) => row.left === "b" && row.right === "c"), true);
    const result = runRegex("a+", "g", "baaac", "X");
    assert.equal(result.matches.length, 1);
    assert.equal(result.replaced, "bXc");
    assert.throws(() => runRegex("", "", "a", ""));
  });
});

function amountText(input: string): string {
  const result = chineseAmount(input);
  assert.equal(result.ok, true);
  if (!result.ok) return "";
  return result.text;
}

describe("chinese amount", () => {
  it("writes invoice uppercase, including the sample 12345.67", () => {
    assert.equal(amountText("12345.67"), "壹萬貳仟叁佰肆拾伍元陸角柒分");
    assert.equal(amountText("12,345.67"), "壹萬貳仟叁佰肆拾伍元陸角柒分");
    assert.equal(amountText("0"), "零元整");
    assert.equal(amountText("10"), "壹拾元整");
    assert.equal(amountText("101"), "壹佰零壹元整");
    assert.equal(amountText("1001"), "壹仟零壹元整");
    assert.equal(amountText("1010"), "壹仟零壹拾元整");
    assert.equal(amountText("10001"), "壹萬零壹元整");
    assert.equal(amountText("100001000"), "壹億零壹仟元整");
    assert.equal(amountText("1.5"), "壹元伍角整");
    assert.equal(amountText("1.05"), "壹元零伍分");
    assert.equal(amountText("0.05"), "零元零伍分");
    assert.equal(amountText("-8"), "負捌元整");
    assert.equal(chineseAmount("").ok, false);
    assert.equal(chineseAmount("12.345").ok, false);
    assert.equal(chineseAmount("nope").ok, false);
    assert.equal(chineseAmount(`1${"0".repeat(16)}`).ok, false);
  });
});

describe("text search", () => {
  it("highlights every match and can stay case sensitive", () => {
    const loose = highlightSpans("Aa aa AA", "aa", false);
    assert.equal(matchCount(loose), 3);
    assert.deepEqual(
      loose.filter((span) => span.match).map((span) => span.text),
      ["Aa", "aa", "AA"],
    );
    const strict = highlightSpans("Aa aa AA", "aa", true);
    assert.equal(matchCount(strict), 1);
    assert.equal(highlightSpans("a.b", ".", false).some((span) => span.match && span.text === "."), true);
    assert.equal(matchCount(highlightSpans("desk", "", false)), 0);
  });
});

describe("units, lorem, password", () => {
  it("converts static units, not currency", () => {
    assert.equal(convertUnits("length", 1, "km", "m"), 1000);
    assert.equal(convertUnits("weight", 1, "kg", "g"), 1000);
    assert.equal(convertUnits("temp", 0, "C", "F"), 32);
    assert.equal(convertUnits("temp", 0, "C", "K"), 273.15);
    assert.equal(convertUnits("area", 1, "m2", "cm2"), 10000);
  });

  it("builds lorem and passwords from the selected sets", () => {
    assert.equal(loremWords(5).replace(/[.]/g, "").split(/\s+/).length, 5);
    assert.equal(loremParagraphs(2).split("\n\n").length, 2);
    const password = generatePassword(12, { upper: true, lower: true, digits: true, symbols: false });
    assert.equal(password.length, 12);
    assert.match(password, /[A-Z]/);
    assert.match(password, /[a-z]/);
    assert.match(password, /[0-9]/);
    assert.doesNotMatch(password, /[^A-Za-z0-9]/);
  });
});
