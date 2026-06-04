import { describe, expect, it } from "vitest";
import { openAIAdapter } from "./openai.js";

function fakeFetch(handler: (url: string, init?: RequestInit) => Response) {
  const requests: { url: string; init?: RequestInit }[] = [];
  const fetchFn = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    requests.push({ url, init });
    return handler(url, init);
  }) as typeof fetch;
  return { fetchFn, requests };
}

function chatResponse(content: string): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
    status: 200,
  });
}

describe("openAIAdapter", () => {
  it("calls the Chat Completions API and parses the result", async () => {
    const { fetchFn, requests } = fakeFetch(() => chatResponse('["Hello"]'));
    const adapter = openAIAdapter({ model: "test-model", apiKey: "sk-test", fetch: fetchFn });

    const result = await adapter.translate({ texts: ["こんにちは"], from: "ja", to: "en" });

    expect(result).toEqual(["Hello"]);
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe("https://api.openai.com/v1/chat/completions");

    const init = requests[0]?.init;
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer sk-test");
    const body = JSON.parse(init?.body as string);
    expect(body.model).toBe("test-model");
    expect(body.messages[0].content).toContain('from "ja" to "en"');
    expect(body.messages[0].content).toContain('["こんにちは"]');
  });

  it("respects a custom baseURL (OpenAI-compatible APIs)", async () => {
    const { fetchFn, requests } = fakeFetch(() => chatResponse('["Hello"]'));
    const adapter = openAIAdapter({
      model: "local-model",
      apiKey: "sk-test",
      baseURL: "http://localhost:11434/v1/",
      fetch: fetchFn,
    });

    await adapter.translate({ texts: ["a"], from: "ja", to: "en" });

    expect(requests[0]?.url).toBe("http://localhost:11434/v1/chat/completions");
  });

  it("passes instructions into the prompt", async () => {
    const { fetchFn, requests } = fakeFetch(() => chatResponse('["Hello"]'));
    const adapter = openAIAdapter({
      model: "test-model",
      apiKey: "sk-test",
      instructions: "Keep it casual.",
      fetch: fetchFn,
    });

    await adapter.translate({ texts: ["a"], from: "ja", to: "en" });

    const body = JSON.parse(requests[0]?.init?.body as string);
    expect(body.messages[0].content).toContain("Keep it casual.");
  });

  it("throws with status and body on API errors", async () => {
    const { fetchFn } = fakeFetch(() => new Response("rate limited", { status: 429 }));
    const adapter = openAIAdapter({ model: "test-model", apiKey: "sk-test", fetch: fetchFn });

    await expect(
      adapter.translate({ texts: ["a"], from: "ja", to: "en" }),
    ).rejects.toThrow("OpenAI API error 429: rate limited");
  });

  it("throws when the response has no message content", async () => {
    const { fetchFn } = fakeFetch(
      () => new Response(JSON.stringify({ choices: [] }), { status: 200 }),
    );
    const adapter = openAIAdapter({ model: "test-model", apiKey: "sk-test", fetch: fetchFn });

    await expect(
      adapter.translate({ texts: ["a"], from: "ja", to: "en" }),
    ).rejects.toThrow("no message content");
  });
});
