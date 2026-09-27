
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

// ============================================================
// Hero Images
// ============================================================

const heroImages = [
  {
    src: "/assats/hero/image.png",
    alt: "FMCG distribution products",
  },
  {
    src: "/assats/hero/hero-1.jpg",
    alt: "FMCG warehouse",
  },
  {
    src: "/assats/hero/hero-3.jpg",
    alt: "Product distribution",
  },
  {
    src: "/assats/hero/hero-4.jpg",
    alt: "FMCG products",
  },
  {
    src: "/assats/hero/hero-5.jpg",
    alt: "FMCG distribution service",
  },
];

// ============================================================
// Constants
// ============================================================

const SLIDE_DURATION = 4000;

// ============================================================
// Component
// ============================================================

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // ==========================================================
  // Auto Slider
  // ==========================================================

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === heroImages.length - 1 ? 0 : current + 1
      );
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isPaused]);

  // ==========================================================
  // Slider Controls
  // ==========================================================

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? heroImages.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === heroImages.length - 1 ? 0 : current + 1
    );
  };

  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <section
      className="relative min-h-[650px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="FMCG distribution hero section"
    >
      {/* ======================================================
          Background Images
      ====================================================== */}

      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === activeIndex
                ? "opacity-100 scale-105"
                : "opacity-0 scale-100"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* ======================================================
          Dark Overlay
      ====================================================== */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

      {/* Mobile Overlay - Slightly Darker */}
      <div className="absolute inset-0 bg-black/10 md:bg-transparent" />

      {/* ======================================================
          Hero Content
      ====================================================== */}

      <div className="relative z-10 flex min-h-[650px] md:min-h-[600px] lg:min-h-[700px] items-center">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-[600px]">

            {/* ------------------------------------------------
                Badge
            ------------------------------------------------ */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <span>Trusted FMCG Distribution Partner</span>
            </div>

            {/* ------------------------------------------------
                Heading
            ------------------------------------------------ */}

            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[64px]">
              Quality Products,
              <br />
              <span className="text-white">
                Reliable Distribution.
              </span>
            </h1>

            {/* ------------------------------------------------
                Description
            ------------------------------------------------ */}

            <p className="mt-6 max-w-[550px] text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              We provide quality FMCG products with reliable
              distribution service, competitive pricing and
              efficient delivery for retailers.
            </p>

            {/* ------------------------------------------------
                CTA Buttons
            ------------------------------------------------ */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              {/* Primary CTA */}

              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30"
              >
                <span>Explore Products</span>

                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Secondary CTA */}

              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              >
                Shopkeeper Login
              </Link>
            </div>

            {/* ------------------------------------------------
                Business Highlights
            ------------------------------------------------ */}

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Quality Products</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Competitive Pricing</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Reliable Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          Previous Button
      ====================================================== */}

      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous slide"
        className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 lg:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* ======================================================
          Next Button
      ====================================================== */}

      <button
        type="button"
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 lg:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ======================================================
          Slider Indicators
      ====================================================== */}

      <div
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
        role="tablist"
        aria-label="Hero slides"
      >
        {heroImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* ======================================================
          Pause / Play Accessibility Indicator
      ====================================================== */}

      <button
        type="button"
        onClick={() => setIsPaused((prev) => !prev)}
        aria-label={isPaused ? "Play hero slider" : "Pause hero slider"}
        className="absolute bottom-6 right-5 z-20 hidden rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md transition hover:bg-black/30 sm:block"
      >
        {isPaused ? "Play" : "Pause"}
      </button>
    </section>
  );
};

export default HeroSection;
