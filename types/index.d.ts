declare type movie_type = {
    title: string,
    plot: string,
    cast: string[],
}

declare type movie_with_embedding = {
    title: string;
    plot: string;
    cast: string[];
    embedding: number[];
  }