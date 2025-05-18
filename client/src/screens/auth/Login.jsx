// src/screens/auth/Login.jsx
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Image as DreiImage } from "@react-three/drei";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import bg from "../../assets/bg.jpg";
import { API_URL } from "../../utils/config";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../components/common/Logo";
import { loginUser } from "../../redux/slices/authSlice";

const TerminalBackground = () => (
  <Canvas className="fixed inset-0 -z-10 opacity-30">
    <ambientLight intensity={0.5} />
    <DreiImage url={bg} scale={[16, 9]} position={[0, 0, -2]} />
  </Canvas>
);

export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [output, setOutput] = useState([
    "Welcome. Please enter your credentials to login.",
  ]);
  const [localLoading, setLocalLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const addOutput = (text) => setOutput((prev) => [...prev, text]);

  const resetTerminal = () => {
    setTimeout(() => {
      setStep(1);
      setEmail("");
      setPassword("");
      setConfirmation("");
      setOutput(["Welcome. Please enter your credentials to login."]);
      setLocalLoading(false);
    }, 2000);
  };

  const handleLogin = async () => {
    addOutput("Authenticating...");
    setLocalLoading(true);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      addOutput("✔ Login successful!");
      // brief pause before redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      addOutput(`✖ ${err}`);
      resetTerminal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localLoading) return;
    if (step === 1) {
      addOutput(`→ Email: ${email}`);
      setStep(2);
    } else if (step === 2) {
      addOutput(`→ Password: [hidden]`);
      setStep(3);
    } else if (step === 3) {
      if (confirmation.trim().toLowerCase() === "y") {
        handleLogin();
      } else {
        addOutput("✖ Aborted. Resetting...");
        resetTerminal();
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black font-mono">
      <TerminalBackground />

      <div className="relative z-10 flex flex-col items-center p-4 space-y-6">
        <button onClick={() => navigate("/")}>
          <Logo className="absolute top-4 left-4" />
        </button>
        {/* Terminal panel */}
        <div className="w-full max-w-3xl bg-black/90 backdrop-blur-lg border-2 border-green-500/40 rounded-xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8 text-green-400">
            <div className="flex space-x-3">
              <div className="w-5 h-5 rounded-full bg-red-500" />
              <div className="w-5 h-5 rounded-full bg-yellow-500" />
              <div className="w-5 h-5 rounded-full bg-green-500" />
            </div>
            <span className="text-lg">login-term v1.0.0</span>
          </div>

          <div className="mb-6 overflow-hidden space-y-3 terminal-scrollbar">
            {output.map((line, i) => (
              <div key={i} className="text-green-300 text-lg animate-fadeIn">
                {line}
              </div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center mt-4">
              <span className="text-green-500 mr-3 text-2xl">{">>"}</span>
              {step === 1 && (
                <input
                  autoFocus
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="bg-transparent outline-none text-green-300 text-lg w-full caret-green-500 placeholder-green-500/70 py-2"
                  required
                />
              )}
              {step === 2 && (
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent outline-none text-green-300 text-lg w-full caret-green-500 placeholder-green-500/70 py-2"
                  required
                  minLength={8}
                />
              )}
              {step === 3 && (
                <input
                  autoFocus
                  type="text"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="y/n"
                  className="bg-transparent outline-none text-green-300 text-lg w-20 caret-green-500 placeholder-green-500/70 py-2"
                  required
                />
              )}
            </form>
          </div>

          <div className="border-t border-green-500/40 pt-6 text-green-500/80 text-xl font-semibold">
            {step === 1 && "Enter your email address"}
            {step === 2 && "Enter your password (min 8 characters)"}
            {step === 3 && "Confirm submission (y/n)"}
          </div>
        </div>

        {/* Google sign-in section */}
        <div className="w-full max-w-3xl text-center">
          <hr className="google-hr" />
          <button
            type="button"
            className="google-btn mt-4"
            onClick={() =>
              (window.location.href = `${API_URL}/api/auth/google`)
            }
          >
            <FcGoogle className="mr-2" size={24} />
            <span className="text-lg">Sign in with Google</span>
          </button>
          <div className="mt-4 text-green-300">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-500 underline">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
