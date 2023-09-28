import exportAsImage from "@/utils/downloadImage";
import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import Head from "next/head";
import summarizer from "@/utils/summarizer";
import Link from "next/link";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

type AppState = {
  lawyer: boolean;
  jack: boolean;
  kid: boolean;
  emoji: boolean;
};

type AppAction =
  | { type: "lawyer" }
  | { type: "jack" }
  | { type: "kid" }
  | { type: "emoji" };

export default function Home() {
  const [file, setFile] = useState<File | null>();
  const [text, setText] = useState<string | null>();
  const [summary, setSummary] = useState<string | null>();
  const [instruction, setInstruction] = useState<string>(
    "Create a summary of this text."
  );
  function reducer(state: AppState, action: AppAction) {
    switch (action.type) {
      case "lawyer": {
        return { lawyer: true, jack: false, kid: false, emoji: false };
      }
      case "jack": {
        return { lawyer: false, jack: true, kid: false, emoji: false };
      }
      case "kid": {
        return { lawyer: false, jack: false, kid: true, emoji: false };
      }
      case "emoji": {
        return { lawyer: false, jack: false, kid: false, emoji: true };
      }
    }
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentInstruction, dispatch] = useReducer(reducer, {
    lawyer: false,
    jack: false,
    kid: false,
    emoji: false,
  });

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0]);
  }
  async function handleSummarizeClick(file: File) {
    //read the content of file
    setIsLoading(true);
    const text = await file?.text();
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text, instruction: instruction }),
    })
      .then((response) => response.json())
      .then((text) => {
        setIsLoading(false);
        setSummary(text.summary);
        // console.log(text.summary);
      });
    // const fileReader = new FileReader();
    // fileReader.readAsText(file);
    // fileReader.onload = async () => {
    //   setIsLoading(true);
    //   const fileContent = convertToString(fileReader.result);
    //   console.log(fileContent);
    //   setText(fileContent);
    //   // create a function on Text Splitting, and Summarization

    //   const result = await summarizer(fileContent, instruction);
    //   setIsLoading(false);
    //   setSummary(result.text);
    // };
  }

  function handleChangeInstruction(e: React.MouseEvent<HTMLButtonElement>) {
    setInstruction(e.currentTarget.value);
    let name = e.currentTarget.name;
    if (name === "jack") {
      dispatch({ type: "jack" });
    } else if (name === "emoji") {
      dispatch({ type: "emoji" });
    } else if (name === "kid") {
      dispatch({ type: "kid" });
    } else if (name === "lawyer") {
      dispatch({ type: "lawyer" });
    }
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
    <div className=" custom-bg ">
      <Head>
        <title>txt.sum</title>
      </Head>
      <div className="max-w-7xl mx-auto px-[2rem] lg:px-[4rem] w-full h-full ">
        <div className="relative">
          <Image
            src="/assets/shape-1.png"
            width={130}
            height={130}
            alt="geometric shape"
            className="absolute lg:top-20 top-12 -left-8 lg:left-0 animate-pulse"
          />
          <Image
            src="/assets/shape-2.png"
            width={100}
            height={100}
            alt="geometric shape"
            className="absolute lg:top-[12em] lg:right-4 top-[20em] -right-4 animate-pulse"
          />
        </div>
        <div className="w-full h-full">
          <div className="bg-white py-[1rem] px-[2rem] rounded-br-3xl rounded-bl-3xl shadow shadow-gray-200 sticky">
            <h3 className="text-gray-900 font-bold text-xl drop-shadow-[1px_1px_5px_rgba(122,58,255,0.75)]">
              {" "}
              txt.sum
            </h3>
          </div>
          <h3 className="text-[2em] md:text-[3em] lg:text-[4em] text-gray-900 font-semibold my-24 text-center">
            <span className="py-2 bg-[#eef75c]/70">Summarize</span> with{" "}
            <span className="py-2 hover:bg-[#7a3aff]/50">Precision,</span>{" "}
            Powered by{" "}
            <span className="py-2 bg-[#f17441]/30">AI Perfection</span>.
          </h3>
          <div className="flex flex-col gap-y-8 lg:flex-row lg:gap-x-8">
            {/* Set the tone */}
            <div className="w-full lg:w-1/3 bg-[#f17441] rounded-[2rem] p-[2rem]">
              <div className="flex items-center gap-x-2 mb-6">
                <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-[#eef75c] flex items-center justify-center ">
                  <p className="text-xl lg:text-2xl font-semibold text-[#f17441]">
                    1
                  </p>
                </div>
                <h4 className="text-[#eef75c] text-xl lg:text-2xl font-semibold">
                  Set the tone
                </h4>
              </div>
              <div className="">
                <button
                  name="lawyer"
                  value="Pretend to be a lawyer. Create a summary of this text using legal terms."
                  // className="border-2 border-white text-white px-6 py-1 rounded-full hover:text-[#f17441] hover:bg-[#eef75c] hover:border-[#eef75c] active:scale-95 transition-all ease-in-out focus:bg-[#7a3aff] focus:border-[#7a3aff] focus:text-white text-left mb-2"
                  className={twMerge(
                    "border-2 border-white text-white px-6 py-1 rounded-full hover:text-[#f17441] hover:bg-[#eef75c] hover:border-[#eef75c] active:scale-95 transition-all ease-in-out text-left mb-2 focus:bg-[#7a3aff] focus:border-[#7a3aff] focus:text-white",
                    currentInstruction.lawyer &&
                      "bg-[#7a3aff] border-[#7a3aff] text-white"
                  )}
                  onClick={handleChangeInstruction}
                >
                  Lawyer
                </button>
                <button
                  name="jack"
                  value="Pretend to be Captain Jack Sparrow. Create a summary of this text using Captain Jack Sparrow's tone."
                  // className="border-2 border-white text-white px-6 py-1 rounded-full hover:text-[#f17441] hover:bg-[#eef75c] hover:border-[#eef75c] active:scale-95 transition-all ease-in-out focus:bg-[#7a3aff] focus:border-[#7a3aff] focus:text-white text-left mb-2"
                  className={twMerge(
                    "border-2 border-white text-white px-6 py-1 rounded-full hover:text-[#f17441] hover:bg-[#eef75c] hover:border-[#eef75c] active:scale-95 transition-all ease-in-out text-left mb-2 focus:bg-[#7a3aff] focus:border-[#7a3aff] focus:text-white",
                    currentInstruction.jack &&
                      "bg-[#7a3aff] border-[#7a3aff] text-white"
                  )}
                  onClick={handleChangeInstruction}
                >
                  Captain Jack Sparrow
                </button>
                <button
                  name="kid"
                  value="Create a summary of this text understandable by a 5-year old"
                  // className="border-2 border-white text-white px-6 py-1 rounded-full hover:text-[#f17441] hover:bg-[#eef75c] hover:border-[#eef75c] active:scale-95 transition-all ease-in-out focus:bg-[#7a3aff] focus:border-[#7a3aff] focus:text-white text-left mb-2"
                  className={twMerge(
                    "border-2 border-white text-white px-6 py-1 rounded-full hover:text-[#f17441] hover:bg-[#eef75c] hover:border-[#eef75c] active:scale-95 transition-all ease-in-out text-left mb-2 focus:bg-[#7a3aff] focus:border-[#7a3aff] focus:text-white",
                    currentInstruction.kid &&
                      "bg-[#7a3aff] border-[#7a3aff] text-white"
                  )}
                  onClick={handleChangeInstruction}
                >
                  5 year-old kid.
                </button>
                <button
                  name="emoji"
                  value="Create a summary of this text and add emojis at the end of the output."
                  // className="border-2 border-white text-white px-6 py-1 rounded-full hover:text-[#f17441] hover:bg-[#eef75c] hover:border-[#eef75c] active:scale-95 transition-all ease-in-out focus:bg-[#7a3aff] focus:border-[#7a3aff] focus:text-white text-left"
                  className={twMerge(
                    "border-2 border-white text-white px-6 py-1 rounded-full hover:text-[#f17441] hover:bg-[#eef75c] hover:border-[#eef75c] active:scale-95 transition-all ease-in-out text-left mb-2 focus:bg-[#7a3aff] focus:border-[#7a3aff] focus:text-white",
                    currentInstruction.emoji &&
                      "bg-[#7a3aff] border-[#7a3aff] text-white"
                  )}
                  onClick={handleChangeInstruction}
                >
                  Add emojis at the end.
                </button>
              </div>
            </div>
            {/* Upload txt file */}
            <div className="w-full lg:w-2/3 bg-white rounded-[2rem] p-[2rem] border-2 border-[#7a3aff] bg-[#7a3aff]/30 lg:bg-[#7a3aff]/20">
              <div className="flex items-center gap-x-2">
                <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-[#7a3aff] flex items-center justify-center">
                  <p className="text-xl lg:text-2xl font-semibold text-white">
                    2
                  </p>
                </div>
                <h4 className="text-[#7a3aff] text-xl lg:text-2xl font-semibold">
                  Upload your .txt file
                </h4>
              </div>
              <div className="w-full flex flex-col lg:flex-row gap-x-2">
                <label
                  htmlFor="inputFile"
                  className="group cursor-pointer  rounded-full border-white border-2  bg-white flex items-center w-full my-6 py-2 px-4"
                >
                  <span className="text-slate-500 group-hover:text-[#f17441] flex-grow">
                    {!file ? "Upload a .txt file" : file.name}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".txt"
                    id="inputFile"
                    onChange={handleFileChange}
                  />

                  <button
                    className=" rounded-full text-white bg-[#7a3aff]  disabled:bg-[#7a3aff] disabled:cursor-not-allowed px-4 py-2"
                    onClick={() => handleSummarizeClick(file!)}
                    disabled={file ? false : true}
                  >
                    {isLoading ? "Loading.." : "Summarize"}
                  </button>
                </label>
              </div>
            </div>
          </div>
          {/* <p>Upload a .txt file and generate a summary.</p> */}

          {summary && (
            <section>
              <div className="bg-white p-12 rounded-[2rem] mt-8 relative w-full mx-auto">
                <p className="text-center font-bold text-gray-900 text-3xl mb-8 bg-[#7a3aff]/10 py-2 w-fit">
                  Summary
                </p>
                <p className="text-gray-800 ">{summary}</p>
                <div
                  className="absolute right-6 top-6 cursor-pointer hover:bg-gray-100 p-1 rounded"
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
            </section>
          )}
        </div>
        <footer className="bg-white mt-16 py-8 text-center rounded-tl-3xl rounded-tr-3xl">
          A personal project of{" "}
          <Link href="alejah.vercel.app" className="bg-[#7a3aff]/20 py-1">
            Alejah
          </Link>
        </footer>
      </div>
    </div>
  );
}
