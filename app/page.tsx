'use client'

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Home() {

  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyAno6ZrbgKBpR86wpdUlF8dypM0kICPXB4")
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = userMessage;

  const formatText = (text: string) => {
    // Substituir ** por <strong> para negrito
    let formattedText = text.split('**').map((part, index) =>
      index % 2 === 1 ? `<strong>${part}</strong>` : part
    ).join('');

    // Substituir quebras de linha (\n) por <br />
    formattedText = formattedText.replace(/\n/g, '<br />');

    // Remover qualquer instância de [object Object] no texto
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

  return (
    <>
      <div className="h-screen w-screen flex flex-col items-center justify-between bg-gray-900 text-white p-4">

        <div className="w-full max-w-2xl flex flex-col gap-4">
          <h1 className="text-3xl font-semibold text-center">Pergunte ao Chat!</h1>

          <form onSubmit={getChatResponse} className="flex gap-2">
            <input
              type="text"
              placeholder="Digite sua pergunta..."
              className="w-full border-2 border-gray-600 bg-gray-800 text-white h-12 px-5 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              type="submit"
              disabled={isThinking}
            >
              {isThinking ? "Pensando..." : "Enviar"}
            </button>
          </form>

          {/* Container para a resposta com rolagem */}
          {chatResponse && (
            <div className="bg-gray-800 p-4 rounded-lg h-[75vh] overflow-y-auto">
              <p
                className="text-md font-normal text-gray-200"
                dangerouslySetInnerHTML={{ __html: formatText(chatResponse) }}
              />
            </div>
          )}
        </div>

      </div>
    </>
  );
}
