"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export type PatientReviewState = {
  stars: number;
  comment?: string;
  anonymous: boolean;
  submittedAt: string;
};

type Props = {
  consultationId: string;
  patientReview?: PatientReviewState | null;
  onSaved: (review: PatientReviewState) => void;
};

function normalizeReview(pr: {
  stars: number;
  comment?: string;
  anonymous?: boolean;
  submittedAt?: string;
}): PatientReviewState {
  return {
    stars: pr.stars,
    comment: pr.comment,
    anonymous: pr.anonymous !== false,
    submittedAt: pr.submittedAt || new Date().toISOString(),
  };
}

export default function ConsultationReviewPanel({
  consultationId,
  patientReview: initialReview,
  onSaved,
}: Props) {
  const [completedReview, setCompletedReview] = useState<PatientReviewState | null>(() =>
    initialReview?.stars ? normalizeReview(initialReview) : null
  );
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialReview?.stars) {
      setCompletedReview((prev) => prev ?? normalizeReview(initialReview));
    }
  }, [initialReview]);

  if (completedReview) {
    return (
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900">
        <p className="font-semibold text-emerald-950">Thank you for your feedback</p>
        <p className="mt-1 text-emerald-800">
          You rated this visit{" "}
          <span className="text-amber-600 tracking-wide">
            {"★".repeat(completedReview.stars)}
            {"☆".repeat(5 - completedReview.stars)}
          </span>
          {completedReview.anonymous ? (
            <span className="block mt-1 text-xs text-emerald-700/90">
              Posted anonymously on the public reviews page (no display name).
            </span>
          ) : (
            <span className="block mt-1 text-xs text-emerald-700/90">
              Shown as a verified patient on our public reviews page (we never publish
              your phone or clinical details).
            </span>
          )}
        </p>
      </div>
    );
  }

  const submit = async () => {
    if (stars < 1 || stars > 5) {
      setError("Tap the stars to choose a rating from 1 to 5.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/consultation/${consultationId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, comment: comment.trim(), anonymous }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Could not submit. Please try again.");
        return;
      }
      const pr = json.patientReview as {
        stars: number;
        comment?: string;
        anonymous: boolean;
        submittedAt: string | Date;
      };
      const normalized: PatientReviewState = {
        stars: pr.stars,
        comment: pr.comment,
        anonymous: pr.anonymous !== false,
        submittedAt:
          typeof pr.submittedAt === "string"
            ? pr.submittedAt
            : new Date(pr.submittedAt).toISOString(),
      };
      setCompletedReview(normalized);
      onSaved(normalized);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-4">
      <h3 className="text-sm font-bold text-[#3D3438]">Rate this consultation</h3>
      <p className="mt-1 text-xs text-gray-600 leading-relaxed">
        When your visit is complete, your feedback helps us improve—and optional
        comments can appear on our public reviews page. Medical notes stay private;
        this is only about your experience on DearGynac.
      </p>

      <div className="mt-3 flex items-center gap-1" role="group" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setStars(n)}
            className={`text-2xl leading-none p-0.5 rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#D97894] focus:ring-offset-1 ${
              n <= stars ? "text-amber-500" : "text-gray-300"
            }`}
            aria-pressed={n <= stars}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-xs text-gray-500">{stars > 0 ? `${stars} / 5` : "Required"}</span>
      </div>

      <label className="mt-3 block text-xs font-medium text-gray-700">
        Short comment (optional, max 500 characters)
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#3D3438] focus:border-[#D97894] focus:ring-2 focus:ring-[#D97894]/30 outline-none resize-y"
          placeholder="What stood out about booking, the call, or follow-up?"
        />
      </label>

      <label className="mt-3 flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mt-1 rounded border-gray-300 text-[#D97894] focus:ring-[#D97894]"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          <strong className="text-[#3D3438]">Post anonymously</strong> — your display name
          will not be shown next to this review on the marketing site. We still store the
          review against your account for support and fraud prevention.
        </span>
      </label>

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={submit}
        disabled={saving || stars < 1}
        className="mt-4 w-full rounded-full bg-[#D97894] py-2.5 text-sm font-semibold text-white hover:bg-[#C45F7E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {saving ? "Submitting…" : "Submit review"}
      </button>
    </div>
  );
}
