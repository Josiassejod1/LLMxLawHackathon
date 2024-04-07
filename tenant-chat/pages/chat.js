"use client";
import React, { useEffect, useState } from "react";

export default function Chat() {
  const [chatWidget, setChatWidget] = useState(null);

  /* the rest of your code */

  useEffect(() => {
    const importAndCreateWidget = async () => {
      const { ReactChatbot } = await import("@vectara/react-chatbot");

      setChatWidget(
        <ReactChatbot
          customerId={process.env.CUSTOMER_ID}
          corpusId={[process.env.CORPUS_ID]}
          apiKey={process.env.API_KEY}
          title="My Chatbot"
          placeholder="Chat with your AI assistant"
          inputSize="large"
          isInitiallyOpen={true}
          enableStreaming={true}
        />
      );
    };

    importAndCreateWidget();
  }, []);

  return <div>{chatWidget}</div>;
}
