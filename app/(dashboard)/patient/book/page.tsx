"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Video,
  Check,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

// ── Types ──

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  experience: number;
}

interface FormData {
  condition: string;
  intakeAnswers: Record<string, any>;
  consultationType: string;
  selectedDoctor: Doctor | null;
  consultationId: string;
}

// ── Data ──

const conditions = [
  { emoji: "\uD83C\uDF38", label: "PCOS / Hormones", value: "pcos" },
  { emoji: "\uD83E\uDE78", label: "Period Problems", value: "periods" },
  { emoji: "\uD83D\uDD25", label: "UTI / Infections", value: "uti" },
  { emoji: "\uD83D\uDCA7", label: "Unusual Discharge", value: "discharge" },
  { emoji: "\uD83D\uDE23", label: "Pelvic Pain", value: "pain" },
  { emoji: "\uD83E\uDD31", label: "Pregnancy Care", value: "pregnancy" },
  { emoji: "\uD83D\uDD2C", label: "Diagnostics Review", value: "diagnostics" },
  { emoji: "\u2753", label: "Other Concern", value: "other" },
];

const stepLabels = [
  "Choose Concern",
  "Symptoms",
  "Consultation Type",
  "Choose Doctor",
  "Payment",
  "Confirmed",
];

// ── Component ──

export default function BookConsultation() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    condition: "",
    intakeAnswers: {},
    consultationType: "async",
    selectedDoctor: null,
    consultationId: "",
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  // Fetch doctors when reaching step 4
  useEffect(() => {
    if (currentStep === 4 && doctors.length === 0) {
      setDoctorsLoading(true);
      fetch("/api/doctors")
        .then((r) => r.json())
        .then((data) => setDoctors(Array.isArray(data) ? data : []))
        .catch(() => {})
        .finally(() => setDoctorsLoading(false));
    }
  }, [currentStep, doctors.length]);

  const canNext = () => {
    switch (currentStep) {
      case 1:
        return !!formData.condition;
      case 2:
        return true;
      case 3:
        return !!formData.consultationType;
      case 4:
        return !!formData.selectedDoctor;
      default:
        return true;
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/consultation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: formData.condition,
          intakeForm: formData.intakeAnswers,
          doctorId: formData.selectedDoctor?._id,
          type: formData.consultationType,
          amount: 149,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFormData((p) => ({ ...p, consultationId: json.consultationId }));
        router.refresh();
        setCurrentStep(6);
      }
    } catch {
      // error silently
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      {currentStep < 6 && (
        <div className="flex items-center justify-between mb-10">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const done = currentStep > stepNum;
            const active = currentStep === stepNum;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      done
                        ? "bg-green-500 text-white"
                        : active
                        ? "bg-[#C2185B] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {done ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span
                    className={`text-xs mt-1.5 hidden sm:block ${
                      active ? "text-[#C2185B] font-semibold" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      done ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step 1: Choose Concern */}
      {currentStep === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-[#1A0A12] font-serif">
            What brings you here today?
          </h2>
          <p className="text-gray-500 mt-2">
            Select the concern that best describes your situation.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {conditions.map((c) => (
              <button
                key={c.value}
                onClick={() =>
                  setFormData((p) => ({ ...p, condition: c.value }))
                }
                className={`rounded-2xl p-6 border-2 text-center transition-all ${
                  formData.condition === c.value
                    ? "border-[#C2185B] bg-rose-50"
                    : "border-gray-200 hover:border-rose-200"
                }`}
              >
                <div className="text-3xl mb-2">{c.emoji}</div>
                <div className="text-sm font-semibold text-[#1A0A12]">
                  {c.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Symptoms / Intake */}
      {currentStep === 2 && <IntakeStep formData={formData} setFormData={setFormData} />}

      {/* Step 3: Consultation Type */}
      {currentStep === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-[#1A0A12] font-serif">
            How would you like to consult?
          </h2>
          <p className="text-gray-500 mt-2">
            Choose your preferred consultation mode.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {/* Async */}
            <button
              onClick={() =>
                setFormData((p) => ({ ...p, consultationType: "async" }))
              }
              className={`rounded-2xl p-6 border-2 text-left transition-all ${
                formData.consultationType === "async"
                  ? "border-[#C2185B] bg-rose-50"
                  : "border-gray-200 hover:border-rose-200"
              }`}
            >
              <MessageCircle className="w-8 h-8 text-[#C2185B]" />
              <h3 className="font-bold text-[#1A0A12] mt-3">Async Chat</h3>
              <p className="text-[#C2185B] font-semibold text-sm mt-1">
                &#8377;149 per session
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Written response within 15 minutes
              </p>
              <ul className="mt-3 space-y-1">
                {["Private & secure", "Written prescription", "24hr follow-up"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </button>
            {/* Video — disabled */}
            <div className="rounded-2xl p-6 border-2 border-gray-200 opacity-60 cursor-not-allowed">
              <Video className="w-8 h-8 text-gray-400" />
              <h3 className="font-bold text-gray-400 mt-3">
                Video Consultation
              </h3>
              <span className="inline-block mt-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
              <p className="text-gray-400 text-sm mt-2">
                Face-to-face video call with your doctor
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Choose Doctor */}
      {currentStep === 4 && (
        <div>
          <h2 className="text-2xl font-bold text-[#1A0A12] font-serif">
            Choose your specialist
          </h2>
          <p className="text-gray-500 mt-2">
            Select a doctor for your consultation.
          </p>
          {doctorsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No doctors available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {doctors.map((doc) => (
                <button
                  key={doc._id}
                  onClick={() =>
                    setFormData((p) => ({ ...p, selectedDoctor: doc }))
                  }
                  className={`rounded-xl p-5 border-2 text-left transition-all ${
                    formData.selectedDoctor?._id === doc._id
                      ? "border-[#C2185B] bg-rose-50/30"
                      : "border-gray-200 hover:border-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#C2185B] flex items-center justify-center text-white font-semibold">
                      {doc.name
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A0A12]">{doc.name}</h3>
                      <span className="text-xs bg-rose-100 text-[#C2185B] px-2 py-0.5 rounded-full font-medium">
                        {doc.specialty || "Gynecologist"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="text-[#D4A017]">
                      &#9733; {doc.rating || "4.9"}
                    </span>
                    <span>{doc.experience || "10"}+ yrs exp</span>
                  </div>
                  {doc.bio && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {doc.bio}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 5: Payment (Dummy) */}
      {currentStep === 5 && (
        <div>
          <h2 className="text-2xl font-bold text-[#1A0A12] font-serif">
            Complete your booking
          </h2>

          {/* Summary */}
          <div className="bg-rose-50 rounded-xl p-6 border border-rose-100 mt-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Condition</span>
                <span className="font-semibold text-[#1A0A12]">
                  {conditions.find((c) => c.value === formData.condition)
                    ?.label || formData.condition}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor</span>
                <span className="font-semibold text-[#1A0A12]">
                  {formData.selectedDoctor?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold text-[#1A0A12]">
                  Async Chat
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold text-[#1A0A12]">
                  &#8377;149
                </span>
              </div>
              <div className="border-t border-rose-200 pt-3 flex justify-between">
                <span className="font-bold text-[#1A0A12]">Total</span>
                <span className="font-bold text-[#C2185B] text-lg">
                  &#8377;149
                </span>
              </div>
            </div>
          </div>

          {/* Dummy payment banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
            <p className="font-semibold text-amber-800 text-sm">
              Payment Gateway Coming Soon
            </p>
            <p className="text-sm text-amber-700 mt-1">
              We are integrating Razorpay. For now, click below to simulate a
              successful payment and proceed with your consultation booking.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-[#C2185B] text-white rounded-full py-4 font-semibold text-base hover:bg-[#880E4F] transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Simulate Payment &amp; Book Consultation
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Real payment integration coming soon. No charges applied.
          </p>
        </div>
      )}

      {/* Step 6: Confirmed */}
      {currentStep === 6 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce-once">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A0A12] font-serif">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mt-2">
            Your consultation has been booked successfully!
          </p>
          <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block mt-4 font-mono text-sm text-gray-600">
            ID: {formData.consultationId}
          </div>
          <p className="text-gray-500 text-sm mt-4">
            {formData.selectedDoctor?.name} will respond within 15 minutes
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <button
              onClick={() =>
                router.push(
                  `/patient/consultation/${formData.consultationId}`
                )
              }
              className="bg-[#C2185B] text-white rounded-full px-8 py-3 font-semibold hover:bg-[#880E4F] transition-colors"
            >
              View Consultation &rarr;
            </button>
            <button
              onClick={() => router.push("/patient")}
              className="border-2 border-[#C2185B] text-[#C2185B] rounded-full px-8 py-3 font-semibold hover:bg-rose-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      {currentStep >= 1 && currentStep <= 5 && (
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {currentStep < 5 && (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 bg-[#C2185B] text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[#880E4F] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Intake Step Component ──

function IntakeStep({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const answers = formData.intakeAnswers;
  const update = (key: string, value: any) => {
    setFormData((p) => ({
      ...p,
      intakeAnswers: { ...p.intakeAnswers, [key]: value },
    }));
  };
  const toggleCheckbox = (key: string, value: string) => {
    const current: string[] = answers[key] || [];
    const next = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    update(key, next);
  };

  const renderSelect = (
    key: string,
    label: string,
    options: string[]
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <select
        value={answers[key] || ""}
        onChange={(e) => update(key, e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none bg-white"
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  const renderCheckboxes = (key: string, label: string, options: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = (answers[key] || []).includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => toggleCheckbox(key, o)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                checked
                  ? "bg-[#C2185B] text-white border-[#C2185B]"
                  : "border-gray-300 text-gray-600 hover:border-rose-300"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderTextarea = (key: string, label: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <textarea
        value={answers[key] || ""}
        onChange={(e) => update(key, e.target.value)}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none resize-none"
        placeholder="Type here..."
      />
    </div>
  );

  const renderSlider = (key: string, label: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}:{" "}
        <span className="text-[#C2185B] font-bold">
          {answers[key] || 5}
        </span>
        /10
      </label>
      <input
        type="range"
        min={1}
        max={10}
        value={answers[key] || 5}
        onChange={(e) => update(key, parseInt(e.target.value))}
        className="w-full accent-[#C2185B]"
      />
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A0A12] font-serif">
        Help us understand your concern
      </h2>
      <p className="text-gray-500 mt-2">
        Answer a few questions so we can route you to the right specialist.
      </p>

      <div className="space-y-6 mt-8">
        {formData.condition === "pcos" && (
          <>
            {renderSelect("duration", "How long have you been experiencing symptoms?", [
              "Less than 3 months",
              "3-12 months",
              "More than 1 year",
            ])}
            {renderCheckboxes("symptoms", "Which symptoms are present?", [
              "Irregular periods",
              "Weight gain",
              "Hair loss",
              "Acne",
              "Facial hair",
            ])}
            {renderSelect("diagnosed", "Have you been previously diagnosed?", [
              "Yes",
              "No",
              "Not sure",
            ])}
            {renderTextarea("medications", "Current medications (if any)")}
          </>
        )}

        {formData.condition === "periods" && (
          <>
            {renderSelect("pattern", "What is your period pattern?", [
              "Irregular",
              "Painful",
              "Heavy",
              "Missed",
              "Spotting",
            ])}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                How many days does your period last?
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={answers.days || ""}
                onChange={(e) => update("days", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
                placeholder="e.g. 5"
              />
            </div>
            {renderSlider("painLevel", "Pain level")}
            {renderCheckboxes("associated", "Associated symptoms", [
              "Nausea",
              "Headache",
              "Mood changes",
              "Bloating",
            ])}
          </>
        )}

        {formData.condition === "pregnancy" && (
          <>
            {renderSelect("stage", "What stage are you at?", [
              "Trying to conceive",
              "Currently pregnant",
              "Postpartum",
            ])}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last menstrual period
              </label>
              <input
                type="date"
                value={answers.lmp || ""}
                onChange={(e) => update("lmp", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
              />
            </div>
            {renderTextarea("complications", "Any complications?")}
          </>
        )}

        {!["pcos", "periods", "pregnancy"].includes(formData.condition) && (
          <>
            {renderSelect("duration", "How long have you had this?", [
              "Less than 1 week",
              "1-4 weeks",
              "1-3 months",
              "More than 3 months",
            ])}
            {renderSlider("severity", "Severity")}
            {renderTextarea("description", "Describe your symptoms")}
            {renderTextarea("medications", "Current medications (if any)")}
          </>
        )}
      </div>
    </div>
  );
}
