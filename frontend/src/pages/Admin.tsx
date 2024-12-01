"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  X,
  Film,
  Calendar,
  Clock,
  Tag,
  Check,
  Home,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api/apiConfig";

const movieSchema = z.object({
  name: z.string().min(1, "Movie name is required"),
  poster: z.string().url("Invalid URL for poster"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  releaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  duration: z.string().min(1, "Duration must be at least 1 minute"),
  genre: z.string().min(1, "Genre is required"),
});

type MovieFormData = z.infer<typeof movieSchema>;

export default function AdminPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [movieAdded, setMovieAdded] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      name: "",
      poster: "",
      description: "",
      releaseDate: "",
      duration: "",
      genre: "",
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email === process.env.REACT_APP_ADMIN_EMAIL &&
      password === process.env.REACT_APP_ADMIN_PASSWORD
    ) {
      setIsLoggedIn(true);
    } else {
      console.log("Incorrect email or password");
    }
  };

  const onSubmit = async (data: MovieFormData) => {
    const payload = {
      ...data,
      exclusiveEndDate: "2024-12-01T19:00:00",
      exclusive: true,
    };
    try {
      const response = await api.post("/movie/add", payload);
      if (response.status === 200) {
        console.log("Movie added successfully");
        setMovieAdded(true);
      } else {
        console.error("Failed to add movie");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const resetForm = () => {
    reset();
    setMovieAdded(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-md">
        {!isLoggedIn ? (
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-light mb-8 text-center">
              Admin Login
            </h1>
            <form
              onSubmit={handleLogin}
              className="bg-gray-800 rounded-lg p-8 shadow-lg"
            >
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                    required
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                    required
                  />
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                Login
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-light">Admin Dashboard</h1>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-8">
              {movieAdded ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-8 shadow-lg text-center"
                >
                  <Check size={48} className="text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-light mb-6">
                    Movie Added Successfully
                  </h2>
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={resetForm}
                      className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                    >
                      <Plus size={20} className="mr-2" />
                      Add Another Movie
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                    >
                      <Home size={20} className="mr-2" />
                      Return to Home
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="bg-gray-800 rounded-lg p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-light mb-6">Add New Movie</h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Movie Name
                      </label>
                      <div className="relative">
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              id="name"
                              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                            />
                          )}
                        />
                        <Film
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="poster"
                        className="block text-sm font-medium mb-2"
                      >
                        Poster URL
                      </label>
                      <Controller
                        name="poster"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            id="poster"
                            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        )}
                      />
                      {errors.poster && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.poster.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-2"
                      >
                        Description
                      </label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            id="description"
                            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={3}
                          />
                        )}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="releaseDate"
                        className="block text-sm font-medium mb-2"
                      >
                        Release Date
                      </label>
                      <div className="relative">
                        <Controller
                          name="releaseDate"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="date"
                              id="releaseDate"
                              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                            />
                          )}
                        />
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errors.releaseDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.releaseDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="duration"
                        className="block text-sm font-medium mb-2"
                      >
                        Duration (minutes)
                      </label>
                      <div className="relative">
                        <Controller
                          name="duration"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              id="duration"
                              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                            />
                          )}
                        />
                        <Clock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errors.duration && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.duration.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="genre"
                        className="block text-sm font-medium mb-2"
                      >
                        Genre
                      </label>
                      <div className="relative">
                        <Controller
                          name="genre"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              id="genre"
                              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                            />
                          )}
                        />
                        <Tag
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errors.genre && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.genre.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-6 w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    Add Movie
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
