// src/pages/Home.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import Room from "../components/3D/Room";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";
import { FaGoogle, FaStar, FaBolt, FaBullseye } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

const FEATURES = [
  {
    icon: FaStar,
    title: "AI-Powered Goals",
    desc: "Let AI transform your rough ideas into vivid, actionable goal statements with affirmations.",
  },
  {
    icon: FaBolt,
    title: "3D Immersive Space",
    desc: "Visualize your goals in a stunning interactive 3D environment that keeps you motivated.",
  },
  {
    icon: FaBullseye,
    title: "Track Progress",
    desc: "Mark milestones, update your board, and watch your vision become reality step by step.",
  },
];

export default function Home() {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const heroRef    = useRef();
  const headingRef = useRef();
  const subRef     = useRef();
  const ctaRef     = useRef();
  const featRef    = useRef();

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading, navigate]);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(headingRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 }
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(ctaRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6 },
        "-=0.4"
      );

      // Feature cards scroll reveal
      gsap.fromTo(
        ".feat-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featRef.current,
            start: "top 80%",
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleParticlesInit = async (engine) => {
    const { loadSlim } = await import("tsparticles-slim");
    await loadSlim(engine);
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (e) {
      console.error("Sign in failed", e);
    }
  };

  return (
    <div ref={heroRef} className="min-h-screen bg-[#0f0f1a] font-grotesk text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">

        {/* Particles bg — disabled on mobile for perf */}
        {!isMobile && (
          <Particles
            id="hero-particles"
            className="absolute inset-0 z-0"
            init={handleParticlesInit}
            options={{
              fullScreen: false,
              background: { color: { value: "transparent" } },
              fpsLimit: 60,
              particles: {
                number: { value: 40 },
                color: { value: ["#4a63f8", "#7c3aed", "#f59e0b"] },
                opacity: { value: { min: 0.1, max: 0.4 } },
                size: { value: { min: 1, max: 3 } },
                move: { enable: true, speed: 0.6, outModes: { default: "out" } },
                links: {
                  enable: true,
                  color: "#4a63f8",
                  distance: 140,
                  opacity: 0.15,
                  width: 1,
                },
              },
            }}
          />
        )}

        {/* 3D Room */}
        <div className="absolute inset-0 z-0 opacity-70">
          <Room />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-6">
            ✨ Your goals. Visualized in 3D. Powered by AI.
          </div>

          <h1
            ref={headingRef}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ opacity: 0 }}
          >
            Build Your{" "}
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-gold bg-clip-text text-transparent">
              Vision Board
            </span>
            {" "}in 3D
          </h1>

          <p
            ref={subRef}
            className="text-lg sm:text-xl text-white/60 mb-8 max-w-xl mx-auto leading-relaxed"
            style={{ opacity: 0 }}
          >
            Manifest your dreams with AI-generated affirmations and an immersive
            3D space that keeps your goals front and center.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 justify-center" style={{ opacity: 0 }}>
            <Button
              size="lg"
              icon={FaGoogle}
              onClick={handleSignIn}
              loading={loading}
              className="animate-pulse-glow"
            >
              Sign in with Google
            </Button>
            <Button variant="secondary" size="lg" onClick={() => featRef.current?.scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </Button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-xs animate-bounce">
          <span>Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featRef} className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Everything you need to{" "}
            <span className="text-brand-400">manifest faster</span>
          </h2>
          <p className="text-white/50 text-center mb-14 max-w-xl mx-auto">
            Combine the power of AI with the science of visualization to turn
            your goals into reality.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="feat-card bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-brand-500/40 hover:bg-white/8 transition-all duration-300"
                style={{ opacity: 0 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-glow flex items-center justify-center mb-4">
                  <f.icon className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="relative z-10 py-20 px-4 text-center">
        <div className="max-w-xl mx-auto bg-gradient-to-b from-brand-900/40 to-[#0f0f1a] border border-brand-800/30 rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-4">Ready to start manifesting?</h2>
          <p className="text-white/50 mb-8">Join thousands using AI Vision Board 3D to achieve their goals.</p>
          <Button size="lg" icon={FaGoogle} onClick={handleSignIn} loading={loading}>
            Get started free
          </Button>
        </div>
      </section>
    </div>
  );
}
