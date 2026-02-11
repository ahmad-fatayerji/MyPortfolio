"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Glowing 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-8"
      >
        <span className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter gradient-text select-none">
          404
        </span>
        <div
          className="absolute inset-0 blur-3xl opacity-20 -z-10"
          style={{
            background:
              "linear-gradient(135deg, hsl(262 83% 58%), hsl(190 95% 50%))",
          }}
        />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <Link href="/" className="btn-gradient gap-2">
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold border border-border bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
