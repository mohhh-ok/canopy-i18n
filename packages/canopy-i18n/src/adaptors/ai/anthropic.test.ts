import { describe, expect, it } from "vitest";
import { anthropicAdapter } from "./anthropic.js";

function fakeFetch(handler: (url: string, init?: RequestInit) => Response) {
  const requests: { url: string; init?: RequestInit }[] = [];
  const fetchFn = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    requests.push({ url, init });
    return handler(url, init);
  }) as typeof fetch;
  return { fetchFn, requests };
}

function messagesResponse(text: string): Response {
  return new Response(JSON.stringify({ content: [{ type: "text", text }] }), {
    status: 200,
  });
}

describe("anthropicAdapter", () => {
  it("calls the Messages API and parses the result", async () => {
    const { fetchFn, requests } = fakeFetch(() => messagesResponse('["Hello"]'));
    const adapter = anthropicAdapter({
      model: "test-model",
      apiKey: "sk-ant-test",
      fetch: fetchFn,
    });

    const result = await adapter.translate({ texts: ["こんにちは"], from: "ja", to: "en" });

    expect(result).toEqual(["Hello"]);
    expect(requests[0]?.url).toBe("https://api.anthropic.com/v1/messages");

    const headers = requests[0]?.init?.headers as Record<string, string>;
    expect(headers["x-api-key"]).toBe("sk-ant-test");
    expect(headers["anthropic-version"]).toBe("2023-06-01");

    const body = JSON.parse(requests[0]?.init?.body as string);
    expect(body.model).toBe("test-model");
    expect(body.max_tokens).toBe(8192);
    expect(body.messages[0].content).toContain('from "ja" to "en"');
  });

  it("respects maxTokens and baseURL", async () => {
    const { fetchFn, requests } = fakeFetch(() => messagesResponse('["Hello"]'));
    const adapter = anthropicAdapter({
      model: "test-model",
      apiKey: "sk-ant-test",
      maxTokens: 1024,
      baseURL: "http://localhost:8080/v1/",
      fetch: fetchFn,
    });

    await adapter.translate({ texts: ["a"], from: "ja", to: "en" });

    expect(requests[0]?.url).toBe("http://localhost:8080/v1/messages");
    expect(JSON.parse(requests[0]?.init?.body as string).max_tokens).toBe(1024);
  });

  it("throws with status and body on API errors", async () => {
    const { fetchFn } = fakeFetch(() => new Response("overloaded", { status: 529 }));
    const adapter = anthropicAdapter({
      model: "test-model",
      apiKey: "sk-ant-test",
      fetch: fetchFn,
    });

    await expect(
      adapter.translate({ texts: ["a"], from: "ja", to: "en" }),
    ).rejects.toThrow("Anthropic API error 529: overloaded");
  });

  it("throws when the response has no text content", async () => {
    const { fetchFn } = fakeFetch(
      () => new Response(JSON.stringify({ content: [] }), { status: 200 }),
    );
    const adapter = anthropicAdapter({
      model: "test-model",
      apiKey: "sk-ant-test",
      fetch: fetchFn,
    });

    await expect(
      adapter.translate({ texts: ["a"], from: "ja", to: "en" }),
    ).rejects.toThrow("no text content");
  });
});
