"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import StreamTitlesForm from "./StreamTitlesForm";
import { createPostAction } from "@/lib/actions/posts";

function CreatePostForm() {
  const [title, setTitle] = useState("");

  if (title) {
    return (
      <form action={createPostAction}>
        <input type="hidden" name="title" value={title} />

        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <div>You are creating the following post:</div>

            <div className="p-4 border rounded-xl text-sm">{title}</div>
          </div>

          <div className="flex space-x-2">
            <Button
              className="flex space-x-2.5 items-center"
              variant={"ghost"}
              onClick={() => setTitle("")}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Go Back</span>
            </Button>

            <SubmitButton />
          </div>
        </div>
      </form>
    );
  }

  return <StreamTitlesForm setTitle={setTitle} />;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return <Button disabled={true}>Creating article...</Button>;
  }

  return (
    <Button className="flex space-x-2 items-center">
      <span>Create Article</span>

      <ArrowRightIcon className="w-4 h-4" />
    </Button>
  );
}

export default CreatePostForm;
