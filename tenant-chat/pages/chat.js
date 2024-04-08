"use client";

import React, { useEffect, useState } from "react";

export default function Chat() {
  const [chatWidget, setChatWidget] = useState(null);

  useEffect(() => {
    const importAndCreateWidget = async () => {
      const { ReactChatbot } = await import("@vectara/react-chatbot");
      setChatWidget(
        <ReactChatbot
          customerId="2531807925"
          corpusIds={["3"]}
          apiKey="zwt_luhStWcjxv0h6RqcgR0ulvzDwLlRg2xWqaBooQ"
          title="Vectara Docs Chatbot"
          placeholder='"Tell Me About My Rights"'
          inputSize="large"
          emptyStateDisplay={"Nothing Loaded Yet"}
          enableStreaming={false}
          isInitiallyOpen={true}
        />
      );
    };

    importAndCreateWidget();
  }, []);

  return <div>{chatWidget}</div>;
}
