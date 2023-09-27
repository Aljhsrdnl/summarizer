import exportAsImage from "@/utils/downloadImage";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Head from "next/head";
import summarizer from "@/utils/summarizer";

export default function Home() {
  const [file, setFile] = useState<File | null>();
  const [text, setText] = useState<string | null>();
  const [summary, setSummary] = useState<string | null>();
  const [instruction, setInstruction] = useState<string>(
    "Create a summary of this text."
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0]);
  }
  function handleSummarizeClick(file: File) {
    //read the content of file
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = async () => {
      setIsLoading(true);
      const fileContent = convertToString(fileReader.result);
      console.log(fileContent);
      setText(fileContent);
      // create a function on Text Splitting, and Summarization

      const result = await summarizer(fileContent, instruction);
      setIsLoading(false);
      setSummary(result.text);
    };
  }

  function convertToString(input: string | ArrayBuffer | null): string {
    // Check if the input is null
    if (input === null) {
      return ""; // Return empty string or any default value you want
    }

    // Check if the input is already a string
    if (typeof input === "string") {
      return input; // No conversion needed, return the input as is
    } else {
      console.log("NO RESULT FOUND");
    }

    // Convert ArrayBuffer to string using appropriate encoding (e.g., UTF-8)
    const uint8Array = new Uint8Array(input!);
    const decoder = new TextDecoder("utf-8");
    const convertedString = decoder.decode(uint8Array);

    return convertedString;
  }

  function handleChangeInstruction(e: React.MouseEvent<HTMLButtonElement>) {
    setInstruction(e.currentTarget.value);
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary!);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
  return (
    <div className="flex justify-center  px-[2rem] lg:px-[8rem] pt-[2rem] pb-[4rem] w-full h-full  bg-gradient-to-r from-sky-200 to-purple-200">
      <Head>
        <title>.txt Summarizer</title>
      </Head>
      <div className="w-full h-full">
        <h3 className="text-purple-700 font-bold text-3xl mb-8"> txt.sum</h3>
        <h3 className="text-[5em] text-gray-800 font-bold leading-tight my-16">
          Summarize with Precision, Powered by AI Perfection.
        </h3>
        {/* <p>Upload a .txt file and generate a summary.</p> */}
        <section className="w-full flex gap-x-2">
          {/* <input
            type="file"
            accept=".txt"
            className="border border-gray-300 p-2 flex-grow rounded"
            onChange={handleFileChange}
          /> */}
          <label
            htmlFor="inputFile"
            className="group cursor-pointer  rounded bg-white flex items-center w-8/12 my-6 py-2 px-4"
          >
            <span className="text-slate-500 group-hover:text-sky-500 flex-grow">
              {!file ? "Upload a .txt file" : file.name}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".txt"
              id="inputFile"
              onChange={handleFileChange}
            />
            <div className="w-[8em] h-full bg-gradient-to-r from-sky-300 to-purple-300 flex items-center justify-center rounded-full py-1 shadow-purple-300 shadow">
              <button
                className="bg-gradient-to-r from-sky-400 to-purple-500 rounded-full text-white px-4 disabled:bg-gray-300 disabled:cursor-not-allowed h-[2.7em] w-[7em]"
                onClick={() => handleSummarizeClick(file!)}
                disabled={file ? false : true}
              >
                {isLoading ? "Loading.." : "Summarize"}
              </button>
            </div>
          </label>
        </section>
        <h4 className="text-purple-700 text-2xl font-semibold">
          Set the tone.
        </h4>

        <div className="flex gap-x-4 my-2">
          <button
            value="Pretend to be a lawyer. Create a summary of this text using legal terms."
            className="border border-indigo-700 text-gray-600 px-6 py-1 rounded-full hover:text-indigo-700 hover:bg-indigo-50 active:scale-95 transition-all ease-in-out focus:bg-indigo-700 focus:text-white"
            onClick={handleChangeInstruction}
          >
            Lawyer
          </button>
          <button
            value="Pretend to be Captain Jack Sparrow. Create a summary of this text using Captain Jack Sparrow's tone."
            className="border border-indigo-700 text-gray-600 px-6 py-1 rounded-full hover:text-indigo-700 hover:bg-indigo-50 active:scale-95 transition-all ease-in-out focus:bg-indigo-700 focus:text-white"
            onClick={handleChangeInstruction}
          >
            Captain Jack Sparrow
          </button>
          <button
            value="Create a summary of this text understandable by a 5-year old"
            className="border border-indigo-700 text-gray-600 px-6 py-1 rounded-full hover:text-indigo-700 hover:bg-indigo-50 active:scale-95 transition-all ease-in-out focus:bg-indigo-700 focus:text-white"
            onClick={handleChangeInstruction}
          >
            Summarize for a 5 year-old kid.
          </button>
          <button
            value="Create a summary of this text and add emojis at the end of the output."
            className="border border-indigo-700 text-gray-600 px-6 py-1 rounded-full hover:text-indigo-700 hover:bg-indigo-50 active:scale-95 transition-all ease-in-out focus:bg-indigo-700 focus:text-white"
            onClick={handleChangeInstruction}
          >
            Add emojis at the end.
          </button>
        </div>
        {summary && (
          <div className="bg-white shadow shadow-purple-400 p-8 rounded-2xl mt-8 relative">
            <p className="text-purple-800 ">{summary}</p>
            <div
              className="absolute right-2 top-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
              onClick={() => {
                copySummary();
                alert("Copied");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#9CA3AF"
              >
                <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
