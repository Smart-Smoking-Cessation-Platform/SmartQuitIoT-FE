// src/pages/coach/components/MetricView.jsx
import React from "react";

/**
 * MetricView: show grid of important metrics:
 * - top summary (streaks, smokeFree%, reduction)
 * - iot metrics (steps, hr, spo2, sleep)
 * - avg / current mental metrics
 *
 * Accepts:
 *  - metric: object or null
 *  - loading: boolean
 */

function StatCard({ label, value, small }) {
  return (
    <div className="bg-white p-3 rounded-md shadow-sm min-h-[56px]">
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`text-lg font-semibold ${
          small ? "text-indigo-600" : "text-black"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export default function MetricView({ metric, loading = false }) {
  if (loading) return <SkeletonGrid />;
  if (!metric) return <div className="text-gray-500">No metrics available</div>;

  // safe access & formatting
  const fmtNum = (v) =>
    v === null || v === undefined ? "-" : typeof v === "number" ? v : v;

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quick summary</h3>
          <div className="text-sm text-gray-500">
            Updated:{" "}
            {metric.updatedAt
              ? new Date(metric.updatedAt).toLocaleString()
              : "-"}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Streaks" value={`${fmtNum(metric.streaks)} 🔥`} />
          <StatCard
            label="Smoke-free %"
            value={`${fmtNum(metric.smokeFreeDayPercentage ?? 0)}%`}
          />
          <StatCard
            label="Reduction"
            value={`${fmtNum(metric.reductionPercentage ?? 0)}%`}
          />
          <StatCard
            label="Money saved (est)"
            value={`$${(metric.moneySaved ?? 0).toFixed(2)}`}
          />
        </div>
      </section>

      <section>
        <h4 className="font-medium mb-2">IoT / health</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Steps (today)"
            value={fmtNum(metric.steps ?? 0)}
            small
          />
          <StatCard
            label="Heart rate"
            value={`${fmtNum(metric.heartRate ?? "-")} bpm`}
            small
          />
          <StatCard
            label="SpO2"
            value={`${fmtNum(metric.spo2 ?? "-")}%`}
            small
          />
          <StatCard
            label="Sleep (h)"
            value={(metric.sleepDuration ?? 0).toFixed(1)}
            small
          />
        </div>
      </section>

      <section>
        <h4 className="font-medium mb-2">Mood & craving</h4>
        <div className="grid gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <StatCard
              label="Avg craving"
              value={fmtNum(metric.avgCravingLevel ?? "-")}
            />
            <StatCard label="Avg mood" value={fmtNum(metric.avgMood ?? "-")} />
            <StatCard
              label="Avg anxiety"
              value={fmtNum(metric.avgAnxiety ?? "-")}
            />
            <StatCard
              label="Avg confident"
              value={fmtNum(metric.avgConfidentLevel ?? "-")}
            />
          </div>

          <div className="mt-2 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600 mb-2">
              Current (self-reported)
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-xs text-gray-500">Craving</div>
                <div className="font-semibold">
                  {fmtNum(metric.currentCravingLevel ?? "-")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Mood</div>
                <div className="font-semibold">
                  {fmtNum(metric.currentMoodLevel ?? "-")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Confidence</div>
                <div className="font-semibold">
                  {fmtNum(metric.currentConfidenceLevel ?? "-")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Anxiety</div>
                <div className="font-semibold">
                  {fmtNum(metric.currentAnxietyLevel ?? "-")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
