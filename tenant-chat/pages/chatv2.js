import React, { useState } from "react";
import axios from "axios";
import download from "downloadjs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function Chatv2() {
  const [inputText, setInputText] = useState("");
  const [response, lastReponse] = useState("");
  const [messageHistory, setMessageHistory] = useState([]); // [ { message: "Hello", isUser: true }, { message: "Hi", isUser: false }
  async function createPdf() {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 30;
    page.drawText(response, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    });

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "pdf-lib_creation_example.pdf", "application/pdf");
  }
  function queryVectara(query) {
    let data = JSON.stringify({
      query: [
        {
          query: query,
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
        "x-api-key": "zwt_luhStWcjxv0h6RqcgR0ulvzDwLlRg2xWqaBooQ",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        console.log(
          JSON.stringify(response.data.responseSet[0].response[0].text)
        );
        lastReponse(response.data.responseSet[0].response[0].text);
        setMessageHistory((prevHistory) => [
          ...prevHistory,
          {
            role: "system",
            response: JSON.stringify(
              JSON.stringify(response.data.responseSet[0].response[0].text)
            ),
          },
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div style={{ height: "400px", overflowY: "auto" }}>
        {messageHistory.map((history, index) => (
          <div key={index}>
            <strong>{history.role}</strong>
            <p>{history.response}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        onClick={() => {
          queryVectara(inputText);
          setMessageHistory((prevHistory) => [
            ...prevHistory,
            {
              role: "user",
              response: inputText,
            },
          ]);
          if (inputText === "create pdf") {
            createPdf();
          }
          setInputText("");
        }}
      >
        Send
      </button>
      {/* <iframe id="pdf" style={{ width: "100%", height: "500px" }} /> */}
    </div>
  );
}
