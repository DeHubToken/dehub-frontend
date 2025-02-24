import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Crown, Gift, Heart, Music, PartyPopper, Flower, Sparkles, Sword } from "lucide-react";

const EMOJIS: any = {
  ROSE: <Flower className="h-8 w-8 text-rose-500" />,
  HEART: <Heart className="h-8 w-8 text-red-500" />,
  CHOCOLATE: <Gift className="h-8 w-8 text-amber-700" />,
  FLOWERS: <PartyPopper className="h-8 w-8 text-pink-500" />,
  CROWN: <Crown className="h-8 w-8 text-yellow-500" />,
  MAGIC_RING: <Sparkles className="h-8 w-8 text-purple-500" />
};

const TipAnimation = ({ amount }: { amount: number }) => {
  const [animationState, setAnimationState] = useState({
    showEmoji: null as string | null,
    showParty: false,
    showGold: false,
    showSpartans: false,
    showMusic: false
  });

  useEffect(() => {
    const triggerAnimations = async () => {
      // Reset state first
      setAnimationState({
        showEmoji: null,
        showParty: false,
        showGold: false,
        showSpartans: false,
        showMusic: false
      });

      // Determine animations based on amount
      if (amount >= 1000000) {
        setAnimationState({
          showEmoji: "MAGIC_RING",
          showParty: true,
          showGold: true,
          showSpartans: false,
          showMusic: true
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          10000
        );
      } else if (amount >= 750000) {
        setAnimationState({
          showEmoji: "CROWN",
          showParty: false,
          showGold: true,
          showSpartans: false,
          showMusic: false
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          10000
        );
      } else if (amount >= 500000) {
        setAnimationState({
          showEmoji: "CROWN",
          showParty: false,
          showGold: true,
          showSpartans: false,
          showMusic: false
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          5000
        );
      } else if (amount >= 300000) {
        setAnimationState({
          showEmoji: "FLOWERS",
          showParty: true,
          showGold: false,
          showSpartans: false,
          showMusic: false
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          3000
        );
      } else if (amount >= 200000) {
        setAnimationState({
          showEmoji: "MAGIC_RING",
          showParty: false,
          showGold: false,
          showSpartans: true,
          showMusic: false
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          3000
        );
      } else if (amount >= 50000) {
        setAnimationState({
          showEmoji: "FLOWERS",
          showParty: false,
          showGold: false,
          showSpartans: false,
          showMusic: false
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          3000
        );
      } else if (amount >= 25000) {
        setAnimationState({
          showEmoji: "CHOCOLATE",
          showParty: false,
          showGold: false,
          showSpartans: false,
          showMusic: false
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          3000
        );
      } else if (amount >= 10000) {
        setAnimationState({
          showEmoji: "HEART",
          showParty: false,
          showGold: false,
          showSpartans: false,
          showMusic: false
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          3000
        );
      } else if (amount >= 1000) {
        setAnimationState({
          showEmoji: "ROSE",
          showParty: false,
          showGold: false,
          showSpartans: false,
          showMusic: false
        });
        setTimeout(
          () =>
            setAnimationState({
              showEmoji: null,
              showParty: false,
              showGold: false,
              showSpartans: false,
              showMusic: false
            }),
          3000
        );
      }
    };

    triggerAnimations();
  }, [amount]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {/* Emoji Display */}
        {animationState.showEmoji && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {EMOJIS[animationState.showEmoji]}
          </motion.div>
        )}

        {/* Gold Screen Effect */}
        {animationState.showGold && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-yellow-500/30"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`coin-${i}`}
                className="absolute h-6 w-6 rounded-full bg-yellow-400"
                initial={{ top: -20, left: `${Math.random() * 100}%` }}
                animate={{
                  top: "120vh",
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Party Effect */}
        {animationState.showParty && (
          <motion.div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute h-3 w-3"
                style={{
                  background: `hsl(${Math.random() * 360}, 80%, 50%)`
                }}
                initial={{
                  top: "-10%",
                  left: `${Math.random() * 100}%`,
                  rotate: 0
                }}
                animate={{
                  top: "110%",
                  rotate: 360,
                  x: Math.random() * 200 - 100
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Spartans Effect */}
        {animationState.showSpartans && (
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
          >
            <div className="flex justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`spartan-${i}`}
                  className="mx-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800"
                >
                    sword
                  <Sword className="h-8 w-8 text-white" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Music Effect */}
        {animationState.showMusic && (
          <motion.div
            className="absolute right-4 top-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            music
            <Music className="h-8 w-8 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TipAnimation;
