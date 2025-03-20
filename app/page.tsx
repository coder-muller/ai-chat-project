'use client'

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Home() {

  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = userMessage;

  const formatText = (text: string) => {
    let formattedText = text.split('**').map((part, index) =>
      index % 2 === 1 ? `<strong>${part}</strong>` : part
    ).join('');

    formattedText = formattedText.replace(/\n/g, '<br />');
    formattedText = formattedText.replace(/\[object Object\]/g, '');
    return formattedText;
  };

  async function getChatResponse(event: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!prompt) {
      return;
    }

    if (isThinking) {
      return;
    }

    setUserMessage("");

    setIsThinking(true);
    setChatResponse("");
    const result = await model.generateContent(prompt);

    setIsThinking(false);

    if (result) {
      setChatResponse(result.response.text());
    }
  }

  return (
    <>
      <div className="w-screen h-screen flex itens-center justify-center flex-col">
        <div className="flex grow-1 px-16 py-6 overflow-y-auto">
          {!chatResponse && !isThinking && (
            <div className="text-4xl font-bold flex items-center justify-center w-full">
              Pergunte ao Chat
            </div>
          )}
          {chatResponse && (
            <div className="bg-gray-800 p-4 rounded-lg h-full w-full overflow-y-auto">
              <p
                className="text-md font-normal text-justify text-gray-200"
                dangerouslySetInnerHTML={{ __html: formatText(chatResponse) }}
              />
            </div>
          )}
        </div>
        <div className="w-full flex items-center justify-center gap-2 px-20 py-4">
          <form onSubmit={getChatResponse} className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Digite sua pergunta..."
              className="w-full border-2 border-gray-600 bg-gray-800 text-white h-12 px-5 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-36"
              type="submit"
              disabled={isThinking}
            >
              {isThinking ? "Pensando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
