// src/pages/Gallery.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection, getDocs, query, where, orderBy,
} from "firebase/firestore";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import GoalCard from "../components/3D/GoalCard";
import Button from "../components/ui/Button";
import { FaArrowLeft, FaTrophy, FaSpinner } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

const CATEGORY_EMOJIS = {
  career:    "💼",
  health:    "💪",
  wealth:    "💰",
  love:      "❤️",
  travel:    "✈️",
  personal:  "🌱",
  education: "📚",
  default:   "🎯",
};

export default function Gallery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | completed | active
  const galleryRef = useRef();

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    const fetch = async () => {
      try {
        const q = query(
          collection(db, "goals"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, navigate]);

  useEffect(() => {
    if (!loading && galleryRef.current) {
      gsap.fromTo(
        ".gallery-item",
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1, scale: 1, y: 0,
          stagger: 0.07, duration: 0.5, ease: "back.out(1.4)",
          scrollTrigger: { trigger: galleryRef.current, start: "top 85%" },
        }
      );
    }
  }, [loading, filter]);

  const filtered = goals.filter((g) =>
    filter === "all" ? true : filter === "completed" ? g.completed : !g.completed
  );

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="min-h-screen bg-[#0f0f1a] font-grotesk text-white">
      {/* Nav */}
      <div className="sticky top-0 z-40 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white/60 hover:text-white transition-colors p-2 -ml-2"
          >
            <FaArrowLeft />
          </button>
          <h1 className="font-semibold">Vision Gallery</h1>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Goals",    value: goals.length,  color: "text-white" },
            { label: "Achieved",       value: completedCount, color: "text-emerald-400" },
            { label: "In Progress",    value: goals.length - completedCount, color: "text-brand-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-white/40 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Achievement banner */}
        {completedCount > 0 && (
          <div className="mb-8 bg-gradient-to-r from-gold/10 to-amber-900/10 border border-gold/20 rounded-2xl px-5 py-4 flex items-center gap-3">
            <FaTrophy className="text-gold text-2xl flex-shrink-0" />
            <div>
              <p className="font-semibold text-gold text-sm">
                You've achieved {completedCount} goal{completedCount !== 1 ? "s" : ""}! 🎉
              </p>
              <p className="text-white/50 text-xs mt-0.5">
                Keep manifesting — every goal completed opens the next door.
              </p>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm capitalize transition-all border ${
                filter === f
                  ? "bg-brand-600 border-brand-500 text-white"
                  : "bg-white/5 border-white/10 text-white/60 hover:border-white/25"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <FaSpinner className="animate-spin text-brand-400 text-3xl" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-3">🖼️</div>
            <p>No goals here yet.</p>
            <Button className="mt-6" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div ref={galleryRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((goal) => (
              <div
                key={goal.id}
                className="gallery-item group relative bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-brand-500/30 transition-all duration-300 cursor-default"
                style={{ opacity: 0 }}
              >
                {goal.completed && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs z-10">
                    ✓
                  </div>
                )}

                <div className="flex justify-center mb-3 pointer-events-none">
                  <GoalCard goal={goal.title} category={goal.category} />
                </div>

                <div className="text-center">
                  <span className="text-lg">
                    {CATEGORY_EMOJIS[goal.category] || CATEGORY_EMOJIS.default}
                  </span>
                  <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-snug">
                    {goal.title}
                  </p>
                  <span className="text-xs text-white/30 capitalize">{goal.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
