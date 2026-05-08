export type Template<C> = string | ((ctx: C) => string);

export function isTemplateFunction<C>(
  t: Template<C>,
): t is (ctx: C) => string {
  return typeof t === "function";
}
