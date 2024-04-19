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

  declare type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
    photo: string;
    firstName: string;
    lastName: string;
}

declare type UpdateUserParams = {
    username: string;
    photo: string;
    firstName: string;
    lastName: string;
}