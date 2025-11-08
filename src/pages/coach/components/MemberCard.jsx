// src/pages/coach/components/MemberCard.jsx
import React from "react";
import { MessageSquare, TrendingUp, Flame } from "lucide-react";

function ageFromDob(dob) {
  if (!dob) return "-";
  const b = new Date(dob);
  const diff = new Date() - b;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function MemberCard({ member, onOpenDetails, onOpenInbox }) {
  const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();
  const age = ageFromDob(member.dob);
  const smokeFreePct = member.metric?.smokeFreeDayPercentage ?? 0;
  const reductionPct = member.metric?.reductionPercentage ?? 0;
  const streaks = member.metric?.streaks ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header với gradient subtle */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
        <div className="flex items-start gap-4">
          {/* Avatar với ring effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-sm opacity-30"></div>
            <img
              src={member.avatarUrl}
              alt={fullName}
              className="relative w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate">
              {fullName || "—"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{age} tuổi</span>
              <span className="text-gray-300">•</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  member.isUsedFreeTrial
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {member.isUsedFreeTrial ? "Dùng thử" : "Thành viên"}
              </span>
            </div>
          </div>

          {/* Streak badge */}
          {streaks > 0 && (
            <div className="flex flex-col items-center bg-white rounded-xl px-3 py-2 shadow-sm">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame size={18} fill="currentColor" />
                <span className="font-bold text-lg">{streaks}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">ngày</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {/* Smoke-free metric */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <span className="text-lg">🚭</span>
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  Không hút
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {smokeFreePct}
                <span className="text-lg text-emerald-600">%</span>
              </div>
            </div>
          </div>

          {/* Reduction metric */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                  <TrendingUp size={16} className="text-teal-600" />
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  Giảm thiểu
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {reductionPct}
                <span className="text-lg text-teal-600">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onOpenInbox}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-sm hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
          >
            <MessageSquare size={18} />
            <span>Tin nhắn</span>
          </button>

          <button
            onClick={() => onOpenDetails("metric")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-sm hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span>Chi tiết</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// export default MemberCard for other modules to import
export default MemberCard;
