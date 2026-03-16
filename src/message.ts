import type { Template } from "./types.js";
import { isTemplateFunction } from "./types.js";

export type LocalizedMessage<Ls extends readonly string[], C> = C extends void
  ? (() => string) & { __brand: "I18nMessage" }
  : ((ctx: C) => string) & { __brand: "I18nTemplateMessage" };

export function isI18nMessage(x: unknown): x is I18nMessage<any, any> {
  return x instanceof I18nMessage;
}

export class I18nMessage<Ls extends readonly string[], C> {
  public readonly locales: Ls;
  private _locale: Ls[number];
  private _data!: Record<Ls[number], Template<C>>;

  constructor(locales: Ls, locale: Ls[number]) {
    this.locales = locales;
    this._locale = locale;
  }

  get locale(): Ls[number] {
    return this._locale;
  }

  setLocale(locale: Ls[number]) {
    this._locale = locale;
    return this;
  }

  get data(): Record<Ls[number], Template<C>> {
    return this._data;
  }

  setData(data: Record<Ls[number], Template<C>>) {
    this._data = data;
    return this;
  }

  private render(ctx?: C): string {
    const v = this._data[this._locale];
    if (isTemplateFunction<C>(v)) {
      return v(ctx as C);
    }
    return v as string;
  }

  toFunction(): LocalizedMessage<Ls, C> {
    const self = this;
    const fn = ((ctx?: C) => self.render(ctx)) as LocalizedMessage<Ls, C>;
    return fn;
  }
}
