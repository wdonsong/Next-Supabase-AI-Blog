import { use } from "react";

import { fetchPostByUid } from "@/lib/queries/posts";
import getSupabaseServerComponentClient from "@/lib/supabase/server-component-client";

interface PostPageParams {
  params: {
    id: string;
  };
}

function PostPage({ params }: PostPageParams) {
  const post = use(loadPost(params.id));

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto pb-16">
      <h1 className="text-2xl font-semibold">{post.title}</h1>

      <h2 className="text-lg font-medium">{post.description}</h2>

      <div className="whitespace-break-spaces">{post.content}</div>
    </div>
  );
}

async function loadPost(id: string) {
  const client = getSupabaseServerComponentClient();
  const { data, error } = await fetchPostByUid(client, id);

  if (error) {
    throw error;
  }

  return data;
}

export default PostPage;
