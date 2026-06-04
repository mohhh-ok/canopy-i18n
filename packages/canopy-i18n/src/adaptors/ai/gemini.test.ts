import { describe, expect, it } from "vitest";
import { geminiAdapter } from "./gemini.js";

function fakeFetch(handler: (url: string, init?: RequestInit) => Response) {
  const requests: { url: string; init?: RequestInit }[] = [];
  const fetchFn = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    requests.push({ url, init });
    return handler(url, init);
  }) as typeof fetch;
  return { fetchFn, requests };
}

function generateContentResponse(text: string): Response {
  return new Response(
    JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }),
    { status: 200 },
  );
}

describe("geminiAdapter", () => {
  it("calls the generateContent API and parses the result", async () => {
    const { fetchFn, requests } = fakeFetch(() => generateContentResponse('["Hello"]'));
    const adapter = geminiAdapter({
      model: "test-model",
      apiKey: "AIza-test",
      fetch: fetchFn,
    });

    const result = await adapter.translate({ texts: ["こんにちは"], from: "ja", to: "en" });

    expect(result).toEqual(["Hello"]);
    expect(requests[0]?.url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/test-model:generateContent",
    );

    const headers = requests[0]?.init?.headers as Record<string, string>;
    expect(headers["x-goog-api-key"]).toBe("AIza-test");

    const body = JSON.parse(requests[0]?.init?.body as string);
    expect(body.contents[0].parts[0].text).toContain('from "ja" to "en"');
  });

  it("joins multiple response parts", async () => {
    const { fetchFn } = fakeFetch(
      () =>
        new Response(
          JSON.stringify({
            candidates: [{ content: { parts: [{ text: '["Hel' }, { text: 'lo"]' }] } }],
          }),
          { status: 200 },
        ),
    );
    const adapter = geminiAdapter({
      model: "test-model",
      apiKey: "AIza-test",
      fetch: fetchFn,
    });

    const result = await adapter.translate({ texts: ["a"], from: "ja", to: "en" });

    expect(result).toEqual(["Hello"]);
  });

  it("respects a custom baseURL", async () => {
    const { fetchFn, requests } = fakeFetch(() => generateContentResponse('["Hello"]'));
    const adapter = geminiAdapter({
      model: "test-model",
      apiKey: "AIza-test",
      baseURL: "http://localhost:8080/v1beta/",
      fetch: fetchFn,
    });

    await adapter.translate({ texts: ["a"], from: "ja", to: "en" });

    expect(requests[0]?.url).toBe(
      "http://localhost:8080/v1beta/models/test-model:generateContent",
    );
  });

  it("throws with status and body on API errors", async () => {
    const { fetchFn } = fakeFetch(() => new Response("quota exceeded", { status: 429 }));
    const adapter = geminiAdapter({
      model: "test-model",
      apiKey: "AIza-test",
      fetch: fetchFn,
    });

    await expect(
      adapter.translate({ texts: ["a"], from: "ja", to: "en" }),
    ).rejects.toThrow("Gemini API error 429: quota exceeded");
  });

  it("throws when the response has no text content", async () => {
    const { fetchFn } = fakeFetch(
      () => new Response(JSON.stringify({ candidates: [] }), { status: 200 }),
    );
    const adapter = geminiAdapter({
      model: "test-model",
      apiKey: "AIza-test",
      fetch: fetchFn,
    });

    await expect(
      adapter.translate({ texts: ["a"], from: "ja", to: "en" }),
    ).rejects.toThrow("no text content");
  });
});
