// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { gsap } from "gsap";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";
import { AI_MODELS, DEFAULT_MODEL } from "../config/models";
import { generateAffirmation, generateActionSteps } from "../services/ai.service";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import GoalCard from "../components/3D/GoalCard";
import {
  FaPlus, FaSignOutAlt, FaImages, FaRobot,
  FaTrash, FaCheck, FaSpinner, FaBars, FaTimes,
} from "react-icons/fa";

const CATEGORIES = ["career", "health", "wealth", "love", "travel", "personal", "education"];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add goal modal
  const [addOpen, setAddOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", category: "personal", description: "" });
  const [saving, setSaving] = useState(false);

  // AI panel
  const [aiOpen, setAiOpen] = useState(false);
  const [aiGoal, setAiGoal] = useState(null);
  const [aiResult, setAiResult] = useState("");
  const [aiMode, setAiMode] = useState("affirmation"); // affirmation | steps
  const [aiLoading, setAiLoading] = useState(false);

  const gridRef = useRef();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Fetch goals from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchGoals = async () => {
      try {
        const q = query(
          collection(db, "goals"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Failed to fetch goals:", e);
      } finally {
        setLoadingGoals(false);
      }
    };
    fetchGoals();
  }, [user]);

  // GSAP stagger on goals load
  useEffect(() => {
    if (!loadingGoals && goals.length && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [loadingGoals, goals.length]);

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return;
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, "goals"), {
        ...newGoal,
        uid: user.uid,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setGoals((prev) => [{ id: docRef.id, ...newGoal, completed: false }, ...prev]);
      setNewGoal({ title: "", category: "personal", description: "" });
      setAddOpen(false);
    } catch (e) {
      console.error("Failed to add goal:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "goals", id));
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  };

  const handleToggleComplete = async (id, current) => {
    try {
      await updateDoc(doc(db, "goals", id), { completed: !current });
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, completed: !current } : g))
      );
    } catch (e) {
      console.error("Failed to update:", e);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiGoal) return;
    setAiLoading(true);
    setAiResult("");
    try {
      const fn = aiMode === "affirmation" ? generateAffirmation : generateActionSteps;
      const { result } = await fn(aiGoal.title, selectedModel);
      setAiResult(result);
    } catch (e) {
      setAiResult("❌ " + (e.message || "AI request failed. Check your API setup."));
    } finally {
      setAiLoading(false);
    }
  };

  const openAI = (goal) => {
    setAiGoal(goal);
    setAiResult("");
    setAiOpen(true);
  };

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="min-h-screen bg-[#0f0f1a] font-grotesk text-white">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-glow flex items-center justify-center text-sm font-bold">
              V
            </div>
            <span className="font-semibold text-sm hidden sm:block">AI Vision Board</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Model Selector */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <FaRobot className="text-brand-400 text-sm" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-sm text-white/80 outline-none cursor-pointer"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#16172a] text-white">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="ghost" size="sm" icon={FaImages} onClick={() => navigate("/gallery")}>
              Gallery
            </Button>
            <Button variant="secondary" size="sm" icon={FaSignOutAlt} onClick={signOut}>
              Sign Out
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden text-white/70 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden mt-3 px-4 pb-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <FaRobot className="text-brand-400 text-sm" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-sm text-white/80 outline-none w-full"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#16172a] text-white">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="ghost" size="sm" icon={FaImages} onClick={() => { navigate("/gallery"); setMenuOpen(false); }}>
              Gallery
            </Button>
            <Button variant="secondary" size="sm" icon={FaSignOutAlt} onClick={signOut}>
              Sign Out
            </Button>
          </div>
        )}
      </nav>

      {/* ── MAIN ── */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Header row */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, {user?.displayName?.split(" ")[0] || "Friend"} 👋
            </h1>
            <p className="text-white/50 mt-1 text-sm">
              {goals.length} goals · {completedCount} completed
            </p>
          </div>
          <Button icon={FaPlus} onClick={() => setAddOpen(true)}>
            Add Goal
          </Button>
        </div>

        {/* Progress bar */}
        {goals.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>Progress</span>
              <span>{Math.round((completedCount / goals.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-glow rounded-full transition-all duration-700"
                style={{ width: `${(completedCount / goals.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Model info strip */}
        <div className="mb-6 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white/50 flex items-center gap-2">
          <FaRobot className="text-brand-400" />
          AI Model: <span className="text-brand-300 font-medium">
            {AI_MODELS.find((m) => m.id === selectedModel)?.name}
          </span>
          <span className="ml-auto hidden sm:block">
            {AI_MODELS.find((m) => m.id === selectedModel)?.description}
          </span>
        </div>

        {/* Goals grid */}
        {loadingGoals ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-brand-400 text-3xl" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-lg font-medium mb-2">No goals yet</p>
            <p className="text-sm mb-6">Add your first goal to get started on your vision board.</p>
            <Button onClick={() => setAddOpen(true)} icon={FaPlus}>Add your first goal</Button>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`
                  group relative bg-white/5 border rounded-2xl p-5 transition-all duration-300
                  hover:border-brand-500/40 hover:bg-white/8
                  ${goal.completed ? "border-emerald-500/30 opacity-70" : "border-white/10"}
                `}
              >
                {/* 3D card preview */}
                <div className="flex justify-center mb-4 pointer-events-none">
                  <GoalCard goal={goal.title} category={goal.category} />
                </div>

                <h3 className={`font-semibold text-sm mb-1 leading-snug ${goal.completed ? "line-through text-white/40" : ""}`}>
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className="text-white/40 text-xs mb-3 leading-relaxed line-clamp-2">
                    {goal.description}
                  </p>
                )}

                <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-xs mb-4 capitalize">
                  {goal.category}
                </span>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleToggleComplete(goal.id, goal.completed)}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg border transition-all ${
                      goal.completed
                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                        : "border-white/10 text-white/50 hover:border-emerald-500/40 hover:text-emerald-400"
                    }`}
                  >
                    <FaCheck className="text-xs" />
                    {goal.completed ? "Done" : "Mark done"}
                  </button>

                  <button
                    onClick={() => openAI(goal)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg border border-white/10 text-white/50 hover:border-brand-500/40 hover:text-brand-400 transition-all"
                  >
                    <FaRobot className="text-xs" />
                    AI Boost
                  </button>

                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-1.5 rounded-lg border border-white/10 text-white/30 hover:border-red-500/40 hover:text-red-400 transition-all"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── ADD GOAL MODAL ── */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Goal">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/60 mb-1 block">Goal Title *</label>
            <input
              type="text"
              placeholder="e.g. Launch my own business by 2026"
              value={newGoal.title}
              onChange={(e) => setNewGoal((p) => ({ ...p, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500/60 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewGoal((p) => ({ ...p, category: cat }))}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all border ${
                    newGoal.category === cat
                      ? "bg-brand-600 border-brand-500 text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="Describe your goal in more detail..."
              value={newGoal.description}
              onChange={(e) => setNewGoal((p) => ({ ...p, description: e.target.value }))}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand-500/60 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddGoal}
              loading={saving}
              disabled={!newGoal.title.trim()}
            >
              Add Goal
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── AI BOOST MODAL ── */}
      <Modal isOpen={aiOpen} onClose={() => setAiOpen(false)} title="AI Goal Boost" size="lg">
        {aiGoal && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl px-4 py-3 text-sm text-white/70 border border-white/10">
              🎯 <span className="text-white font-medium">{aiGoal.title}</span>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2">
              {[
                { key: "affirmation", label: "✨ Affirmation" },
                { key: "steps", label: "📋 Action Steps" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setAiMode(key); setAiResult(""); }}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                    aiMode === key
                      ? "bg-brand-600 border-brand-500 text-white"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Model in modal */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <FaRobot className="text-brand-400 text-xs" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-xs text-white/70 outline-none flex-1"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#16172a] text-white">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <Button className="w-full" onClick={handleAIGenerate} loading={aiLoading} icon={FaRobot}>
              {aiLoading ? "Generating..." : "Generate with AI"}
            </Button>

            {aiResult && (
              <div className="bg-gradient-to-br from-brand-900/30 to-purple-900/20 border border-brand-500/20 rounded-xl p-4 text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
                {aiResult}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
