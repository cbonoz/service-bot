import React, { useEffect, useState } from "react";
import { postResponse } from "../api";
import ChatBot, { Loading } from "react-simple-chatbot";

export default function Search({ steps, triggerNextStep }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState();

  const searchResult = async () => {
    // https://lucasbassetti.com.br/react-simple-chatbot/#/docs/wikipedia
    const query = steps.search.value;
    if (query) {
      try {
        const { data } = await postResponse(query);
        setResult(data);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    searchResult();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        result.answer || "I couldn't find anything around that"
      )}
      {!loading && (
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {<button onClick={triggerNextStep}>Search Again</button>}
        </div>
      )}
    </div>
  );
}
