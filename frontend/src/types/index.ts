export interface Movie {
  id: string;
  description: string;
  duration: number;
  genre: string;
  name: string;
  title?: string;
  poster: string;
  releaseDate: string;
}
export interface Theatre {
  id: string;
  name: string;
  address: string;
  showtimes?: Showtime[];
}

export interface Showtime {
  id: string;
  startTime: string;
}

export interface MovieWithTheatres extends Movie {
  theatres: Theatre[];
}
