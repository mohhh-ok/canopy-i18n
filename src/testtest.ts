import { createI18n } from "./chainBuilder.js";

const a = createI18n(["ja", "en"] as const);
const b = a
  .add({
    abc: { ja: "abc", en: "abc" },
    bb: (ctx: { aa: string }) => ({ ja: `${ctx.aa}aa`, en: `${ctx.aa}bb` }),
  });
const c = b.build("en");
const e = { ...c.abc, toString: () => "aaa" };

const d = b.add({
  aaa: { ja: "aaa", en: "aaa" },
  bbb: { ja: "bbb", en: "bbb" },
});

const f = b.add({
  aaa: (ctx: { a: string }) => ({ ja: `${ctx.a}aaa`, en: `${ctx.a}aaa` }),
  bbb: (ctx: { a: string }) => ({ ja: `${ctx.a}aaa`, en: `${ctx.a}aaa` }),
});

console.log(c.bb({ aa: "name" }));
console.log(`${c.bb({ aa: "name" })}`);
console.log("aaa" + c.bb({ aa: "name" }));
console.log(`${c.bb({ aa: "name" })}`);
console.log(`${c.abc()}`);
