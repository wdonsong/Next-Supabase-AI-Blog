import getOpenAIClient from "@/lib/openai-client";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const client = getOpenAIClient();
  const messages = getPromptMessages(prompt);
  // Ask Azure OpenAI for a streaming chat completion given the prompt
  // console.log(messages);
  const response = await client.streamChatCompletions("gpt-35-turbo", messages);

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

function getPromptMessages(topic: string) {
  return [
    {
      content: `Given the topic "${topic}", return a list of possible titles for a blog post. Separate each title with a new line.`,
      role: "user" as const,
    },
  ];
}
