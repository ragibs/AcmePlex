import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Send, X, Check } from "lucide-react";

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [notifyRegistered, setNotifyRegistered] = useState(false);
  const [notifyAll, setNotifyAll] = useState(false);

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
    console.log("Logging in with:", email, password);
    setIsLoggedIn(true);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Broadcasting:",
      broadcastMessage,
      "Notify registered:",
      notifyRegistered,
      "Notify all:",
      notifyAll
    );
  };

  const handleToggle = (type: "registered" | "all") => {
    if (type === "registered") {
      setNotifyRegistered(true);
      setNotifyAll(false);
    } else {
      setNotifyRegistered(false);
      setNotifyAll(true);
    }
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
              <h1 className="text-4xl font-light">Broadcast News</h1>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={handleBroadcast}
              className="bg-gray-800 rounded-lg p-8 shadow-lg"
            >
              <div className="mb-6">
                <label
                  htmlFor="broadcastMessage"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="broadcastMessage"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div className="space-y-2 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={notifyRegistered}
                      onChange={() => handleToggle("registered")}
                      className="sr-only"
                    />
                    <span
                      className={`w-5 h-5 inline-block mr-2 rounded border ${
                        notifyRegistered
                          ? "bg-primary-500 border-primary-500"
                          : "border-gray-400"
                      } flex-shrink-0`}
                    >
                      {notifyRegistered && (
                        <Check size={20} className="text-white" />
                      )}
                    </span>
                    <span>Notify Registered Users</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={notifyAll}
                      onChange={() => handleToggle("all")}
                      className="sr-only"
                    />
                    <span
                      className={`w-5 h-5 inline-block mr-2 rounded border ${
                        notifyAll
                          ? "bg-primary-500 border-primary-500"
                          : "border-gray-400"
                      } flex-shrink-0`}
                    >
                      {notifyAll && <Check size={20} className="text-white" />}
                    </span>
                    <span>Notify All Users</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center"
                >
                  Send
                  <Send className="ml-2" size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
