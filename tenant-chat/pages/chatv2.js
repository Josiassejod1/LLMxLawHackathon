import React, { useState } from "react";
import axios from "axios";
import download from "downloadjs";
import Groq from "groq-sdk";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function Chatv2() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const [messageHistory, setMessageHistory] = useState([]); // [ { message: "Hello", isUser: true }, { message: "Hi", isUser: false }
  async function createPdf(text) {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 30;
    page.drawText(text, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    });

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");
  }

  const prompt =
    "You are an California Tenant Law Expert. Using the contexts below, answer the query Make sure to give a well-structed response. Use clear speech that is understandable";

  async function getGroqChatCompletion() {
    const groq = new Groq({
      dangerouslyAllowBrowser: true,
      apiKey: process.env.REACT_APP_GROK,
    });
    let userPrompt = [];
    if (inputText != "create pdf") {
      userPrompt = [
        ...messageHistory,
        {
          role: "assistant",
          content: `${prompt}`,
        },
      ];
    } else {
      userPrompt = [
        ...messageHistory,
        {
          role: "assistant",
          content: `${prompt}. Generate a pdf that I can share with a landlord`,
        },
      ];
    }

    return await groq.chat.completions
      .create({
        messages: userPrompt,
        model: "mixtral-8x7b-32768",
      })
      .then((response) => {
        setResponse(response.choices[0].message.content);
        setMessageHistory((prevHistory) => [
          ...prevHistory,
          {
            role: "system",
            content: response.choices[0].message.content,
          },
        ]);
        return response.choices[0].message.content;
      })
      .then((data) => {
        if (inputText === "create pdf") {
          createPdf(data);
        }
        setInputText("");
      })
      .catch((error) => {
        console.log(error);
        setInputText("");
      });
  }

  function queryVectara() {
    let data = JSON.stringify({
      query: [
        {
          query: inputText,
          start: 0,
          numResults: 10,
          contextConfig: {
            sentences_before: 3,
            sentences_after: 3,
            start_tag: "<b>",
            end_tag: "</b>",
          },
          corpusKey: [
            {
              corpus_id: 3,
            },
          ],
          summary: [
            {
              max_summarized_results: 10,
              response_lang: "en",
            },
          ],
        },
      ],
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.vectara.io/v1/query",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": process.env.REACT_API_KEY,
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        setResponse(response.data.responseSet[0].response[0].text);
        setMessageHistory((prevHistory) => [
          ...prevHistory,
          {
            role: "assistant",
            content: JSON.stringify(
              JSON.stringify(response.data.responseSet[0].response[0].text)
            ),
          },
        ]);
      })
      .then(() => {
        getGroqChatCompletion();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div style={{ height: "400px", overflowY: "auto" }}>
        {messageHistory.map(
          (history, index) =>
            history.role !== "assistant" && (
              <div key={index}>
                <strong>{history.role}</strong>
                <p>{history.content}</p>
              </div>
            )
        )}
      </div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        onClick={async () => {
          setMessageHistory((prevHistory) => [
            ...prevHistory,
            {
              role: "user",
              content: inputText,
            },
          ]);

          await queryVectara();
        }}
      >
        Send
      </button>
    </div>
  );
}
