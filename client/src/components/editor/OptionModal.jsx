// src/components/OptionModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export default function OptionModal({ isOpen, onClose, onJoin, onCreate }) {
  return (
    <AnimatePresence>
      {isOpen && (
        // Backdrop
        <motion.div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          {/* Prevent click propagation */}
          <motion.div
            className="bg-[#111] rounded-2xl p-8 max-w-md w-full text-white"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              Collaboration Hub
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Join Room */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onJoin}
                className="cursor-pointer p-6 bg-gradient-to-br from-[#0f0] to-[#0a0]/50 rounded-lg border border-green-500/50 text-center"
              >
                <h3 className="text-xl font-semibold mb-2">Join a Room</h3>
                <p className="text-sm opacity-80">
                  Enter an existing room key to collaborate in real-time.
                </p>
              </motion.div>

              {/* Create Room */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreate}
                className="cursor-pointer p-6 bg-gradient-to-br from-[#00f] to-[#005]/50 rounded-lg border border-blue-500/50 text-center"
              >
                <h3 className="text-xl font-semibold mb-2">Create a Room</h3>
                <p className="text-sm opacity-80">
                  Generate a new collaboration room and invite friends.
                </p>
              </motion.div>
            </div>
            <button
              onClick={onClose}
              className="mt-8 w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg transition"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
