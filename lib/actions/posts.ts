"use server";
import getOpenAIClient from "@/lib/openai-client";
import { ChatCompletions } from "@azure/openai";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import getSupabaseServerActionClient from "@/lib/supabase/action-client";
import { insertPost, updatePost } from "@/lib/mutations/posts";

interface GeneratePostParams {
  title: string;
}

export async function createPostAction(formData: FormData) {
  const title = formData.get("title") as string;
  const { text: content } = await generatePostContent({ title });
  // log the content to see the result!
  console.log(content);
  const client = getSupabaseServerActionClient();
  const { data, error } = await client.auth.getUser();
  if (error) {
    throw error;
  }

  const insertResult = await insertPost(client, {
    title,
    content,
    user_id: data.user.id,
  });

  const uuid = insertResult?.uuid;

  revalidatePath(`/dashboard`, "page");

  // redirect to the post page.
  // NB: it will return a 404 error since we haven't implemented the post page yet
  return redirect(`/dashboard/${uuid}`);
}

async function generatePostContent(params: GeneratePostParams) {
  const client = getOpenAIClient();
  const content = getCreatePostPrompt(params);

  // const response = await client.getCompletions("gpt-35-turbo", [content], {
  //   maxTokens: 500,
  // });

  const response = await client.getChatCompletions("gpt-35-turbo", content, {
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
  return [
    {
      content: ` Write a blog post under 500 words whose title is "${params.title}".`,
      role: "user" as const,
    },
  ];
}

function getResponseContent(response: ChatCompletions) {
  return (response.choices ?? []).reduce((acc: string, choice) => {
    return acc + (choice.message?.content ?? "");
  }, "");
}

export async function updatePostAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | undefined;
  const content = formData.get("content") as string;
  const uid = formData.get("uid") as string;

  const client = getSupabaseServerActionClient();

  await updatePost(client, {
    title,
    content,
    description,
    uid,
  });

  const postPath = `/dashboard/${uid}`;

  revalidatePath(postPath, "page");

  return redirect(postPath);
}
