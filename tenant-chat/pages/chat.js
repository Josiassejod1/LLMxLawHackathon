import { ReactChatbot } from "@vectara/react-chatbot";

export default function Chat() {
  return (
    <div>
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
    </div>
  );
}
