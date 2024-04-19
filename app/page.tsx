"use client";
require("@tensorflow/tfjs");
import { useEffect } from "react";
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { movies } from "../lib/data/movies";
import { SignedIn, UserButton } from "@clerk/nextjs";



export default function Home() {
  // useEffect(() => {
  //   async function embedMovies() {
  //     try {
  //       const model = await use.load();

  //       // Embed the plot for each movie
  //         await Promise.all(movies.map(async (movie: movie_type) => {
  //         const embeddings = await model.embed([movie.plot]);
  //         const embeddedMovie: movie_with_embedding = {
  //           title: movie.title,
  //           plot: movie.plot,
  //           cast: movie.cast,
  //           embedding: Array.from(embeddings.arraySync()[0])
  //         };
  //         return embeddedMovie;
  //       })) 
  //           .then(((embeddedMovies: movie_with_embedding[]) => {
  //             fetch("/api",{
  //               method: "POST",
  //               body: JSON.stringify(embeddedMovies)
  //             })
  //           }));

  //     } catch (error) {
  //       console.error("Error embedding movies:", error);
  //     }
  //   }

  //   embedMovies();
    
  // }, []);

  return (
   <SignedIn>
    <UserButton />
   </SignedIn>
  );
}
