export const fileConfigs = {
  imdb: {
    // 1MB
    max_file_size: 1000000,
    allowed_type: ["text/csv"],
    allowed_ext: ".csv",
  },
};

export const imdbTypeNames = {
  movie: "Movie",
  tvMiniSeries: "TV Mini",
  tvSeries: "TV",
  video: "Video",
};

export const imdbListUrls = {
  fantasy: "/imdb-lists/best_fantasy_movies_of_all_time.csv",
  loner_movies: "/imdb-lists/loners.csv",
  top_movies: "/imdb-lists/top_100_movies_bucket_list.csv",
  top_horror: "/imdb-lists/top_horror.csv",
  top_scifi: "/imdb-lists/top_scifi.csv",
} as const;

type ImdbListGroup = {
  name: string;
  items: {
    label: string;
    id: keyof typeof imdbListUrls;
  }[];
};

export const imdbListGroups: ImdbListGroup[] = [
  {
    name: "Movies",
    items: [
      {
        label: "Fantasy",
        id: "fantasy",
      },
      {
        label: "Loner Movies",
        id: "loner_movies",
      },
      {
        label: "Top Movies",
        id: "top_movies",
      },
      {
        label: "Top Horror",
        id: "top_horror",
      },
      {
        label: "Top Sci-Fi",
        id: "top_scifi",
      },
    ],
  },
];
