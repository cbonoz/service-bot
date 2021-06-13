import React, { useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import CSVReader from "react-csv-reader";

import { getCount, postData } from "../api";
import Search from "./Search";

export default function Home() {
  const [chatReady, setChatReady] = useState(false);

  const init = async () => {
    try {
      const { data } = await getCount();
      console.log("count", data.count);
      setChatReady(data.count && data.count > 0);
    } catch (e) {
      console.error("err", e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const onLoaded = async (data, fileInfo) => {
    console.log("send", data, fileInfo);
    try {
      const result = await postData(data);
      setChatReady(true);
    } catch (e) {
      alert(e);
      console.error("error sending data", e);
    }

    setChatReady(true);
  };

  if (!chatReady) {
    return (
      <div>
        <h1>ServiceBot</h1>
        <p>To get started, upload a question and answer csv below.</p>
        <CSVReader onFileLoaded={onLoaded} parserOptions={{ header: true }} />
      </div>
    );
  }

  return (
    <div>
      <ChatBot
        steps={[
          {
            id: "1",
            message: "What can I help you with?",
            trigger: "search",
          },
          {
            id: "search",
            user: true,
            trigger: "3",
          },
          {
            id: "3",
            component: <Search />,
            waitAction: true,
            trigger: "1",
          },
        ]}
      />
    </div>
  );
}
