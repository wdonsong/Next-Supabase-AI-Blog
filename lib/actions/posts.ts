"use server";
import getOpenAIClient from "@/lib/openai-client";
import { Completions } from "@azure/openai";

interface GeneratePostParams {
  title: string;
}

export async function createPostAction(formData: FormData) {
  const title = formData.get("title") as string;
  const { text } = await generatePostContent({ title });

  return {
    text,
  };
}

async function generatePostContent(params: GeneratePostParams) {
  const client = getOpenAIClient();
  const content = getCreatePostPrompt(params);

  const response = await client.getCompletions("gpt-35-turbo", [content], {
    maxTokens: 500,
  });

  const usage = response.usage?.totalTokens ?? 0;
  const text = getResponseContent(response);

  return {
    text,
    usage,
  };
}

function getCreatePostPrompt(params: GeneratePostParams) {
  return `
    Write a blog post under 500 words whose title is "${params.title}".
  `;
}

function getResponseContent(response: Completions) {
  return (response.choices ?? []).reduce(
    (acc: string, choice: { text: string }) => {
      return acc + (choice.text ?? "");
    },
    ""
  );
}
