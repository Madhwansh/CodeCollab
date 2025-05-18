// Header.jsx
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/authSlice";

const Header = () => {
  const { scrollY } = useScroll();
  const containerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollYSpring = useSpring(scrollY, {
    stiffness: 120,
    damping: 35,
    restDelta: 0.001,
  });

  const boxShadow = useTransform(
    scrollYSpring,
    (value) => `0 4px 20px -6px rgba(0, 0, 0, ${Math.min(value * 0.05, 0.4)})`
  );

  const tabHover = {
    scale: 1.05,
    transition: { duration: 0.3 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <motion.header
      ref={containerRef}
      style={{ boxShadow }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 
                 w-full max-w-4xl 
                 bg-white/10 backdrop-blur-xl 
                 border border-white/20 
                 rounded-full px-4 py-4 md:px-8 md:py-6"
    >
      <nav className="flex items-center justify-between">
        {/* Left navigation items - visible on desktop */}
        <div className="hidden md:flex space-x-10">
          <motion.button
            whileHover={tabHover}
            className="text-gray-100 text-lg font-medium hover:text-white transition-colors duration-300"
          >
            Home
          </motion.button>
          <motion.button
            whileHover={tabHover}
            className="text-gray-100 text-lg font-medium hover:text-white transition-colors duration-300"
            onClick={() => navigate("/collab")}
          >
            Collab
          </motion.button>
        </div>

        {/* Center logo */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-white text-xl font-bold items-center flex justify-center"
          >
            <motion.svg
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="w-12 h-auto"
              viewBox="0 0 49 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Logo"
              role="img"
            >
              <motion.path
                d="M37.3947 40C43.8275 39.8689 49 34.6073 49 28.1389C49 24.9931 47.7512 21.9762 45.5282 19.7518L25.7895 0V12.2771C25.7895 14.3303 26.6046 16.2995 28.0556 17.7514L32.6795 22.3784L32.6921 22.3907L40.4452 30.149C40.697 30.4009 40.697 30.8094 40.4452 31.0613C40.1935 31.3133 39.7852 31.3133 39.5335 31.0613L36.861 28.3871H12.139L9.46655 31.0613C9.21476 31.3133 8.80654 31.3133 8.55476 31.0613C8.30297 30.8094 8.30297 30.4009 8.55475 30.149L16.3079 22.3907L16.3205 22.3784L20.9444 17.7514C22.3954 16.2995 23.2105 14.3303 23.2105 12.2771V0L3.47175 19.7518C1.24882 21.9762 0 24.9931 0 28.1389C0 34.6073 5.17252 39.8689 11.6053 40H37.3947Z"
                fill="#FF0A0A"
                className="fill-current"
              ></motion.path>
            </motion.svg>
          </motion.div>
        </div>

        {/* Right navigation items */}
        <div className="flex items-center">
          {/* Desktop links */}
          <div className="hidden md:flex space-x-4">
            <motion.button
              whileHover={tabHover}
              className="text-gray-100 text-lg pr-1 font-medium hover:text-white transition-colors duration-300 "
            >
              Features
            </motion.button>

            {user ? (
              <motion.button
                onClick={handleLogout}
                className="flex items-center text-gray-100 text-lg font-medium transition-colors duration-300 pl-6 pr-4 border-2 border-transparent rounded-full py-2 px-2"
                animate={{
                  borderColor: ["#FF0000", "#00FF00", "#0000FF", "#FF0000"],
                  transition: {
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  },
                  cursor: "pointer",
                }}
              >
                <span className="mr-2">
                  {user.username || user.email || "Logout"}
                </span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => navigate("/login")}
                className="flex items-center text-gray-100 text-lg font-medium transition-colors duration-300 pl-6 pr-4 border-2 border-transparent rounded-full py-2 px-2"
                animate={{
                  borderColor: ["#FF0000", "#00FF00", "#0000FF", "#FF0000"],
                  transition: {
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  },
                  cursor: "pointer",
                }}
              >
                <span className="mr-2">Login</span>
              </motion.button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="text-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-4 flex flex-col items-center space-y-4 md:hidden"
          >
            <motion.button
              whileHover={tabHover}
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-100 text-lg font-medium hover:text-white transition-colors duration-300"
            >
              Home
            </motion.button>
            <motion.button
              whileHover={tabHover}
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-100 text-lg font-medium hover:text-white transition-colors duration-300"
            >
              Collab
            </motion.button>
            <motion.button
              whileHover={tabHover}
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-100 text-lg font-medium hover:text-white transition-colors duration-300"
            >
              About
            </motion.button>

            {user ? (
              <motion.button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center text-gray-100 text-lg font-medium hover:text-white transition-colors duration-300"
              >
                <span className="mr-2">Logout</span>
                <motion.span
                  initial={{ rotate: -15 }}
                  whileHover={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaArrowRight />
                </motion.span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="flex items-center text-gray-100 text-lg font-medium hover:text-white transition-colors duration-300"
              >
                <span className="mr-2">Login</span>
                <motion.span
                  initial={{ rotate: -15 }}
                  whileHover={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaArrowRight />
                </motion.span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
