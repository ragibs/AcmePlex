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

export interface TheatreWithMovies {
  id: string;
  name: string;
  address: string;
  movies: MovieWithShowtimes[];
}

export interface MovieWithShowtimes {
  id: string;
  title: string;
  poster: string;
  genre: string;
  duration: string;
  showtimes: Showtime[];
}

export interface Seat {
  id: number;
  seatNumber: string;
  booked: boolean;
}

export interface SeatsResponse {
  booked: Seat[];
  available: Seat[];
}

export interface PaymentInfo {
  cardHolder: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
}

export interface ReservationResponse {
  movieName: string;
  moviePoster: string;
  theatreName: string;
  showTime: string;
  userEmail: string;
  reservationID: number;
  reservationValue: number;
  reservationStatus: string;
  eligibleRefundValue: number;
  seatName: string[];
}
