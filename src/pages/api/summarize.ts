import summarizer from "@/utils/summarizer";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { text, instruction } = req.body;

  const result = await summarizer(text, instruction);
  res.json({ message: "successfully summarized", summary: result.text });
}
