import React, { createContext, useState, useContext, ReactNode } from "react";

interface AppState {
  moviename: string;
  poster: string;
  duration: string;
  theatre: string;
  date: string;
  showtime: string;
  showtimeId: string;
  genre: string;
  seats: string[];
  seatIds: string[];
  totalprice: number;
}

interface AppContextType {
  state: AppState;
  updateState: (key: keyof AppState, value: any) => void;
  clearState: () => void;
  clearKey: (key: keyof AppState) => void;
}

export const MovieContext = React.createContext<AppContextType | null>(null);

const initialState: AppState = {
  moviename: "",
  poster: "",
  duration: "",
  theatre: "",
  date: "",
  showtime: "",
  showtimeId: "",
  genre: "",
  seats: [],
  seatIds: [],
  totalprice: 0,
};

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = React.useState<AppState>(initialState);

  const updateState = (key: keyof AppState, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const clearState = () => {
    setState(initialState);
  };

  const clearKey = (key: keyof AppState) => {
    setState((prevState) => ({
      ...prevState,
      [key]: initialState[key],
    }));
  };

  return (
    <MovieContext.Provider value={{ state, updateState, clearState, clearKey }}>
      {children}
    </MovieContext.Provider>
  );
};

export default AppProvider;

export const useMovieContext = (): AppContextType => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
