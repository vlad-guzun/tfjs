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

  declare type User_with_interests_location_reason = {
    clerkId: string,
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    photo: string,
    interests: string,
    location: string,
    reasonForJoining: string,
    following?: string[],
    feedback?: {
      recipient: string,
      sentiment: number
    }[],
    text_posts?: {
      title: string,
      description: string,
    }[],
    video_posts?:{
      title: string,
      url: string,
    }[],
  }