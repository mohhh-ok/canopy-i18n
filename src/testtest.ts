import { createI18n } from "./chainBuilder.js";

const a = createI18n(["ja", "en"] as const);
const b = a
  .add({ abc: { ja: "abc", en: "abc" } })
  .addTemplates<{ aa: string }>()({
    bb: ({ aa }) => ({ ja: `${aa}aa`, en: `${aa}bb` }),
  });
const c = b.build("en");
const e = { ...c.abc, toString: () => "aaa" };

const d = b.add({
  aaa: { ja: "aaa", en: "aaa" },
  bbb: { ja: "bbb", en: "bbb" },
});

const f = b.addTemplates<{ a: string }>()({
  aaa: ({ a }) => ({ ja: `${a}aaa`, en: `${a}aaa` }),
  bbb: ({ a }) => ({ ja: `${a}aaa`, en: `${a}aaa` }),
});

console.log(c.bb({ aa: "name" }));
console.log(`${c.bb({ aa: "name" })}`);
console.log("aaa" + c.bb({ aa: "name" }));
console.log(`${c.bb({ aa: "name" })}`);
console.log(`${c.abc()}`);
