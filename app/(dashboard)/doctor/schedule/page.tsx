"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeSlots: string[] = [];
for (let h = 8; h <= 20; h++) {
  timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
  if (h < 20) timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
}

interface SlotState {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<Record<string, SlotState>>(() => {
    const initial: Record<string, SlotState> = {};
    days.forEach((d) => {
      initial[d] = { enabled: false, startTime: "09:00", endTime: "17:00" };
    });
    return initial;
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/doctor/schedule")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.slots?.length) {
          const updated = { ...schedule };
          json.slots.forEach((s: any) => {
            if (updated[s.day]) {
              updated[s.day] = {
                enabled: true,
                startTime: s.startTime || "09:00",
                endTime: s.endTime || "17:00",
              };
            }
          });
          setSchedule(updated);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const updateTime = (day: string, field: "startTime" | "endTime", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const availableSlots = days
      .filter((d) => schedule[d].enabled)
      .map((d) => ({
        day: d,
        startTime: schedule[d].startTime,
        endTime: schedule[d].endTime,
      }));

    try {
      const res = await fetch("/api/doctor/schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableSlots }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Schedule saved successfully");
      } else {
        toast.error("Failed to save schedule");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-[#3D3438] font-serif mb-6">
          My Availability Schedule
        </h2>

        <div className="space-y-4">
          {days.map((day) => {
            const slot = schedule[day];
            return (
              <div
                key={day}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  slot.enabled ? "border-purple-200 bg-purple-50/30" : "border-gray-200 bg-gray-50"
                }`}
              >
                <span className="w-24 text-sm font-medium text-[#3D3438]">{day}</span>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleDay(day)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                    slot.enabled ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      slot.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>

                {slot.enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      value={slot.startTime}
                      onChange={(e) => updateTime(day, "startTime", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <span className="text-gray-400 text-sm">to</span>
                    <select
                      value={slot.endTime}
                      onChange={(e) => updateTime(day, "endTime", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Unavailable</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#D97894] text-white rounded-full py-3 font-semibold mt-8 hover:bg-[#C45F7E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            "Save Schedule"
          )}
        </button>
      </div>
    </div>
  );
}
