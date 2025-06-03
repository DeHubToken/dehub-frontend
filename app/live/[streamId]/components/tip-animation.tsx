import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  PartyPopper,
  ShieldPlus,
  BellRing,
  Crown,
  Flower2,
  Gift,
  Heart
} from "lucide-react";

// Map of gift tier minimums to their corresponding icons and colors
const GIFT_ICONS = {
  1000000: { icon: Trophy, color: "text-indigo-500" },
  750000: { icon: Star, color: "text-yellow-500" },
  500000: { icon: Star, color: "text-amber-500" },
  300000: { icon: PartyPopper, color: "text-pink-400" },
  200000: { icon: ShieldPlus, color: "text-red-700" },
  100000: { icon: BellRing, color: "text-purple-500" },
  50000: { icon: Crown, color: "text-yellow-500" },
  25000: { icon: Flower2, color: "text-rose-400" },
  10000: { icon: Gift, color: "text-amber-700" },
  1000: { icon: Heart, color: "text-red-500" }
};

const TipAnimation = ({ amount }: {amount: number}) => {
  const [showIcon, setShowIcon] = useState(false);
  const [iconConfig, setIconConfig] = useState(null);

  useEffect(() => {
    const tiers = Object.keys(GIFT_ICONS)
      .map(Number)
      .sort((a, b) => b - a);
    
    const applicableTier = tiers.find(tier => amount >= tier);

    if (applicableTier) {
      setIconConfig(GIFT_ICONS[applicableTier]);
      setShowIcon(true);

      // Hide the icon after a few seconds
      const timer = setTimeout(() => {
        setShowIcon(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [amount]);

  if (!showIcon || !iconConfig) {
    return null;
  }

  const IconComponent = iconConfig.icon;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <AnimatePresence>
        {showIcon && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center justify-center"
          >
            <IconComponent className={`h-24 w-24 ${iconConfig.color}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TipAnimation;