"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white pt-24 pb-20 sm:pt-32 sm:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-neutral-100/80 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
          >
            Kaliteli Ürünler,
            <br />
            <span className="text-neutral-500">Kolay Sipariş</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-lg text-neutral-500 sm:text-xl"
          >
            Geniş ürün yelpazemizden seçiminizi yapın, güvenle sipariş verin.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
