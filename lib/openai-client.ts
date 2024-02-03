import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY env variable is not set");
}

function getOpenAIClient() {
  return new OpenAIClient(
    process.env.OPENAI_END_Point!,
    new AzureKeyCredential(apiKey!)
  );
}

export default getOpenAIClient;
