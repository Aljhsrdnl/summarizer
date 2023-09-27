import { OpenAI } from "langchain/llms/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadQAMapReduceChain } from "langchain/chains";
import * as dotenv from "dotenv";
dotenv.config();

const llm = new OpenAI({
  temperature: 0.7,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 40,
  separators: ["\n\n", "\n", " ", ""],
});

const sampleInstructions =
  "create a summary of this text using legalese terms.";
const chain = loadQAMapReduceChain(llm);

async function summarizer(text: string, instructions: string) {
  const documentChunks = await textSplitter.createDocuments([text]);
  const result = await chain.call({
    question: instructions,
    input_documents: documentChunks,
  });
  return result;
}

export default summarizer;
