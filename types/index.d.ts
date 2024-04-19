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
    firstName: string;
    lastName: string;
    photo: string;
  };
  
  declare type UpdateUserParams = {
    firstName: string;
    lastName: string;
    username: string;
    photo: string;
  };