"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

function StarSVG({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-6 h-6 transition-transform ${
        filled ? "fill-yellow-400" : "fill-gray-600"
      }`}
    >
      <path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 16.8 6.1 20l1.2-6.5-4.8-4.6 6.6-.9L12 2z" />
    </svg>
  );
}

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Categories from translations
  const categories: string[] = t.raw("categories");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(ratings).length !== categories.length) {
      alert(t("allCategoriesAlert"));
      return;
    }

    if (loading) return;

    setLoading(true);

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ratings,
        comments,
      }),
    });

    setLoading(false);
    setSuccess(true);
    setRatings({});
    setComments("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold font-title">{t("title")}</h2>

      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-sm text-gray-300 mb-2">{cat}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRatings({ ...ratings, [cat]: n })}
                className="hover:scale-110 transition"
              >
                <StarSVG filled={(ratings[cat] || 0) >= n} />
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <p className="text-sm text-gray-300 mb-2">{t("commentsLabel")}</p>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full h-28 bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-white/30"
          placeholder={t("commentsPlaceholder")}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-green-400 text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? t("sending") : t("submit")}
      </button>

      {success && (
        <p className="text-sm text-green-400 text-center">{t("successMsg")}</p>
      )}

      <p className="text-xs text-gray-500 text-center">{t("confidential")}</p>
    </motion.form>
  );
}
