import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tools } from "./catalog.ts";
import { gradeContrast, parseHex } from "./contrast.ts";
import { jsonToYaml, prettyJson, yamlToJson } from "./convert.ts";
import { csvToJson, jsonToCsv, parseCsv } from "./csv.ts";
import { hasChanges, sideBySide } from "./diffview.ts";
import { copy, zh } from "./i18n.ts";
import { loremParagraphs, loremWords } from "./lorem.ts";
import { generatePassword } from "./password.ts";
import { adjustByPercent, percentChange, percentOf, whatPercent } from "./percent.ts";
import { isValidProPayload } from "./pro.ts";
import { isProValue, nextTheme } from "./storage.ts";
import { runRegex } from "./regex.ts";
import { decodeBase64, encodeBase64, textStats, toCamel, toKebab, toSentence, toSnake, toTitle } from "./text.ts";
import { formatOffset, interpretUnix, parseIso } from "./time.ts";
import { convertUnits } from "./units.ts";

describe("catalog", () => {
  it("has eight free and eight pro tools with unique slugs", () => {
    assert.equal(tools.length, 16);
    assert.equal(tools.filter((tool) => tool.tier === "free").length, 8);
    assert.equal(tools.filter((tool) => tool.tier === "pro").length, 8);
    assert.equal(new Set(tools.map((tool) => tool.slug)).size, 16);
  });
});

describe("copy", () => {
  it("translates every English string", () => {
    for (const key of Object.keys(copy.en)) {
      assert.equal(typeof zh[key as keyof typeof zh], "string");
      assert.ok(zh[key as keyof typeof zh].length > 0);
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
    assert.equal(nextTheme("white"), "silver");
    assert.equal(nextTheme("silver"), "black");
    assert.equal(nextTheme("black"), "white");
    assert.equal(nextTheme(null), "black");
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
