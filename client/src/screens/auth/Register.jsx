import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/config";
import axios from "axios";

const TerminalBackground = () => (
  <div className="fixed inset-0 -z-10 bg-black/95">
    {/* Animated grid background */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#0f03,transparent)] animate-pulse" />
      <div className="absolute inset-0 bg-noise opacity-10" />
    </div>
  </div>
);

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { name, email, phone, password },
        { withCredentials: true }
      );
      console.log(response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TerminalBackground />
      <div className="relative min-h-screen bg-black font-mono">
        <div className="relative z-10 flex flex-col items-center p-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl bg-black/70 backdrop-blur-lg border-2 border-green-500/40 rounded-xl shadow-2xl p-8"
          >
            <div className="flex justify-between items-center mb-6 text-green-400">
              <div className="flex space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-500" />
                <div className="w-5 h-5 rounded-full bg-yellow-500" />
                <div className="w-5 h-5 rounded-full bg-green-500" />
              </div>
              <span className="text-lg">register-term v1.0.0</span>
            </div>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={inputVariants} className="flex flex-col">
                <label className="text-green-300 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-transparent outline-none border-b border-green-500 text-green-300 placeholder-green-500/70 py-2"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} className="flex flex-col">
                <label className="text-green-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="bg-transparent outline-none border-b border-green-500 text-green-300 placeholder-green-500/70 py-2"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} className="flex flex-col">
                <label className="text-green-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="123-456-7890"
                  className="bg-transparent outline-none border-b border-green-500 text-green-300 placeholder-green-500/70 py-2"
                  required
                />
              </motion.div>

              <motion.div variants={inputVariants} className="flex flex-col">
                <label className="text-green-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent outline-none border-b border-green-500 text-green-300 placeholder-green-500/70 py-2"
                  minLength={8}
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full mt-4 py-2 border border-green-500 rounded-lg text-green-300 hover:bg-green-500/10 transition"
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </motion.form>

            <div className="mt-6 text-center">
              <hr className="google-hr" />
              <motion.button
                type="button"
                className="google-btn mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  (window.location.href = `${API_URL}/api/auth/google`)
                }
              >
                <FcGoogle className="mr-2" size={24} />
                <span className="text-lg">Sign up with Google</span>
              </motion.button>

              <motion.p
                className="mt-4 text-green-500 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Already have an account?{" "}
                <Link to="/login" className="text-green-300 hover:underline">
                  Sign in
                </Link>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
