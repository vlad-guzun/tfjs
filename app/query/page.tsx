"use client";
require("@tensorflow/tfjs");

import { useEffect } from "react";
import * as use from '@tensorflow-models/universal-sentence-encoder';

const Query = () => {
  useEffect(() => {
    async function embedSentence() {
      try {
        const model = await use.load();
        const sentence = "epic historical drama";
        const embeddings = await model.embed([sentence]);
        const finalEmbeding = Array.from(embeddings.arraySync()[0]);
        fetch("/api/query", {
          method: "POST",
          body: JSON.stringify(finalEmbeding),
        });
      } catch (error) {
        console.error("Error embedding sentence:", error);
      }
    }

    embedSentence();
  }, []);

  return <div></div>;
};

export default Query;
