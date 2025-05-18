import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionModal from "../components/editor/OptionModal";

// HoverCard component remains unchanged
const HoverCard = ({
  title,
  glowColor,
  hoverTextColor,
  onHoverStart,
  onHoverEnd,
  onClick,
}) => {
  const cardRef = useRef(null);
  const ROTATION_RANGE = 25;
  const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { damping: 20, stiffness: 200 });
  const ySpring = useSpring(y, { damping: 20, stiffness: 200 });

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    onHoverEnd();
  };

  const handleMouseEnter = () => {
    onHoverStart();
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
        transform,
        boxShadow: `0 15px 30px ${glowColor}80`,
      }}
      className="relative w-80 h-80 cursor-pointer rounded-2xl bg-gradient-to-br from-black/90 to-[#0a0a0a] group"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-800/30 to-transparent p-px">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black/60 to-[#0a0a0a]" />
      </div>

      <div
        style={{ transform: "translateZ(40px)" }}
        className="absolute inset-4 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-black z-10"
      >
        <motion.h2
          className={`text-5xl font-bold transition-colors duration-300 ${hoverTextColor}`}
          style={{ textShadow: `0 0 20px ${glowColor}80` }}
        >
          {title}
        </motion.h2>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`radial-gradient(
            500px circle at ${x}px ${y}px,
            ${glowColor}20,
            transparent 80%
          )`,
        }}
      />
    </motion.div>
  );
};

const drawerVariants = {
  hiddenLeft: { x: -300 },
  visibleLeft: { x: 0, transition: { type: "spring", stiffness: 120 } },
  hiddenRight: { x: 300 },
  visibleRight: { x: 0, transition: { type: "spring", stiffness: 120 } },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const Collab = () => {
  const [active, setActive] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLocalClick = () => {
    navigate("/local/edit");
  };

  const handleCollabClick = () => {
    setShowModal(true);
  };

  const handleJoin = () => {
    setShowModal(false);
    navigate("/collab/join");
  };

  const handleCreate = () => {
    const roomKey = crypto.randomUUID();
    setShowModal(false);
    navigate(`/collab/edit/${roomKey}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000] to-[#000] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden bg-noise">
      <h1 className="text-6xl md:text-5xl font-bold mb-20 uppercase">
        Choose your mode
      </h1>

      <div className="absolute left-1/2 h-3/4 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent hidden md:block" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 z-10">
        <HoverCard
          title="Local"
          glowColor="#ff0022"
          hoverTextColor="text-red-400"
          onHoverStart={() => setActive("local")}
          onHoverEnd={() => setActive(null)}
          onClick={handleLocalClick}
        />
        <HoverCard
          title="Collab"
          glowColor="#00ff88"
          hoverTextColor="text-emerald-400"
          onHoverStart={() => setActive("collab")}
          onHoverEnd={() => setActive(null)}
          onClick={handleCollabClick}
        />
      </div>

      {active === "local" && (
        <motion.div
          initial="hiddenLeft"
          animate="visibleLeft"
          exit="hiddenLeft"
          variants={drawerVariants}
          className="fixed top-0 left-0 w-80 h-full bg-white/10 backdrop-blur-lg border-r border-white/20 p-8 text-white z-20"
        >
          <h2 className="text-2xl font-semibold mb-6">Local Mode</h2>
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.li variants={itemVariants} className="pl-4 list-disc">
              <strong>Built-in compiler:</strong> Rapid local code execution and
              testing.
            </motion.li>
            <motion.li variants={itemVariants} className="pl-4 list-disc">
              <strong>Co-op coding:</strong> Team up on the same machine with
              real-time sync.
            </motion.li>
            <motion.li variants={itemVariants} className="pl-4 list-disc">
              <strong>Zero setup:</strong> No room keys or extra configuration.
            </motion.li>
            <motion.li variants={itemVariants} className="pl-4 list-disc">
              <strong>Offline sessions:</strong> Perfect for in-person
              workshops.
            </motion.li>
          </motion.ul>
        </motion.div>
      )}

      {active === "collab" && (
        <motion.div
          initial="hiddenRight"
          animate="visibleRight"
          exit="hiddenRight"
          variants={drawerVariants}
          className="fixed top-0 right-0 w-80 h-full bg-white/10 backdrop-blur-lg border-l border-white/20 p-8 text-white z-20"
        >
          <h2 className="text-2xl font-semibold mb-6">Collab Mode</h2>
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.li variants={itemVariants} className="pl-4 list-disc">
              <strong>Multiplayer:</strong> Code together from anywhere.
            </motion.li>
            <motion.li variants={itemVariants} className="pl-4 list-disc">
              <strong>Live preview:</strong> Instant updates for all users.
            </motion.li>
            <motion.li variants={itemVariants} className="pl-4 list-disc">
              <strong>Integrated chat:</strong> Communicate without leaving the
              editor.
            </motion.li>
            <motion.li variants={itemVariants} className="pl-4 list-disc">
              <strong>Robust pipeline:</strong> Optimized for team workflows.
            </motion.li>
          </motion.ul>
        </motion.div>
      )}

      {showModal && (
        <OptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onJoin={handleJoin}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default Collab;
