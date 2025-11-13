// src/pages/FeedbackPage.jsx
import React, { useEffect, useState } from "react";
import { Star, Calendar, Clock } from "lucide-react";
import { getFeedbacksForCoach } from "@/services/feedbackService";

const FeedbackPage = () => {
  const [currentPage, setCurrentPage] = useState(1); // UI page 1..
  const pageSize = 8; // 4 cols x 2 rows

  const [feedbacks, setFeedbacks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const renderStars = (rating) => (
    <div className="flex gap-1 justify-center mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatSlot = (startTime, endTime) => {
    if (!startTime && !endTime) return "";
    const parseHM = (t) => {
      if (!t) return "";
      const parts = t.split(":");
      if (parts.length >= 2)
        return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
      return t;
    };
    return `${parseHM(startTime)}${startTime && endTime ? " - " : ""}${parseHM(
      endTime
    )}`;
  };

  const loadPage = async (uiPage) => {
    setLoading(true);
    setError(null);
    try {
      const backendPage = Math.max(0, uiPage - 1);
      const data = await getFeedbacksForCoach(backendPage, pageSize);
      // debug: console.log("FEEDBACK API PAGE:", { backendPage, pageSize, data });

      const content = data?.content ?? [];
      setFeedbacks(content);
      setTotalPages(data?.totalPages ?? 0);
      setTotalElements(data?.totalElements ?? (content ? content.length : 0));
      setCurrentPage(uiPage);
    } catch (err) {
      console.error("fetch feedbacks error", err);
      setError("Không tải được feedback. Thử load lại.");
      setFeedbacks([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    loadPage(pageNumber);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* w-full để content bắt đầu từ trái; nếu sidebar fixed width (16rem) -> thêm md:pl-64 */}
      <div className="w-full flex-1 overflow-auto min-h-0 px-6 py-2">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Feedback</h1>
        </div>

        {loading && (
          <div className="py-8 text-center text-gray-500">
            Đang tải feedback...
          </div>
        )}
        {error && <div className="py-4 text-center text-red-500">{error}</div>}
        {!loading && feedbacks.length === 0 && (
          <div className="py-8 text-left text-gray-500">
            Chưa có feedback nào.
          </div>
        )}

        {/* GRID: 1 col mobile, 2 col sm, 4 col md+ -> 4 card/row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 items-start">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-[#00bd7e] flex flex-col h-full"
            >
              <div className="p-6 bg-gradient-to-br from-[#00bd7e]/5 to-[#00a76a]/5 text-center">
                <img
                  src={fb.avatarUrl || "/images/avatar-placeholder.png"}
                  alt={fb.memberName || "Member"}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg mx-auto mb-3 object-cover"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {fb.memberName ?? "—"}
                </h3>
                <p className="text-xs text-gray-500">{formatDate(fb.date)}</p>
              </div>

              <div className="px-6 pt-4">{renderStars(fb.rating)}</div>

              <div className="px-6 pb-4 flex-1">
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {fb.content}
                </p>
              </div>

              <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-[#00bd7e]/10 to-[#00a76a]/10 rounded-lg p-3 border border-[#00bd7e]/20">
                  <div className="flex items-center gap-2 text-xs text-[#00a76a] mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">
                      {formatDate(fb.appointmentDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#00a76a]">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">
                      {formatSlot(fb.startTime, fb.endTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 rounded-lg bg-white border-2 border-[#00bd7e] text-[#00a76a] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00bd7e] hover:text-white transition-colors"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => paginate(pg)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === pg
                      ? "bg-gradient-to-r from-[#00bd7e] to-[#00a76a] text-white"
                      : "bg-white border-2 border-[#00bd7e] text-[#00a76a] hover:bg-[#00bd7e] hover:text-white"
                  }`}
                >
                  {pg}
                </button>
              );
            })}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 rounded-lg bg-white border-2 border-[#00bd7e] text-[#00a76a] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00bd7e] hover:text-white transition-colors"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
