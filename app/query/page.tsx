"use client";
require("@tensorflow/tfjs");
import { useEffect } from "react";
import * as use from "@tensorflow-models/universal-sentence-encoder";

const Query = () => {
  useEffect(() => {
    async function embedSentence() {
      try {
        const model = await use.load();
        const sentence = "something with Matrices";
        const embeddings = await model.embed([sentence]);
        const finalEmbedding = Array.from(embeddings.arraySync()[0]);
        const queryString = finalEmbedding.join(",");
        const response = await fetch(`/api/query?embedding=${queryString}`);
        const similar_docs = await response.json();
        console.log(similar_docs);
      } catch (error) {
        console.error("Error embedding sentence:", error);
      }
    }

    embedSentence();
  }, []);

  return <div></div>;
};

export default Query;
