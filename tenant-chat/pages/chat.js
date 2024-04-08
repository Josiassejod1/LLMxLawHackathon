"use client";

import React, { useEffect, useState } from "react";

export default function Chat() {
  const [chatWidget, setChatWidget] = useState(null);

  useEffect(() => {
    const importAndCreateWidget = async () => {
      const { ReactChatbot } = await import("@vectara/react-chatbot");
      setChatWidget(
        <ReactChatbot
          customerId={process.env.REACT_APP_CUSTOMER_ID}
          corpusIds={[process.env.REACT_APP_CORPUS_ID]}
          apiKey={process.env.REACT_API_KEY}
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
