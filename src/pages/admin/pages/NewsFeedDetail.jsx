// src/pages/admin/pages/NewsFeedDetail.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Video, Image as ImgIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import newsService from "@/services/newsService";

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const getStatusColor = (status) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "PUBLISH":
    case "PUBLISHED":
      return "bg-green-50 text-green-700 border-green-200";
    case "DRAFT":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "DELETED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusText = (status) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "PUBLISH":
    case "PUBLISHED":
      return "Published";
    case "DRAFT":
      return "Draft";
    case "DELETED":
      return "Deleted";
    default:
      return status;
  }
};

const NewsFeedDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsService.getNews(id);
        const dto = res?.data || res?.result || res || null;
        setFeed(dto);
      } catch (err) {
        console.error("Failed to load news detail", err);
        setError("Failed to load news details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeed();
    }
  }, [id]);

  const media =
    Array.isArray(feed?.media) && feed.media.length > 0 ? feed.media[0] : null;
  const thumbnail = feed?.thumbnailUrl || (media ? media.mediaUrl : null);
  const mediaType = media?.mediaType || (thumbnail ? "IMAGE" : null);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#00bd7e] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/admin/news-feeds")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to News Feeds</span>
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error || "News not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Back button */}
        <button
          onClick={() => navigate("/admin/news-feeds")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to News Feeds</span>
        </button>

        {/* Main content card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900 flex-1">
                {feed.title}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border flex-shrink-0 ${getStatusColor(
                  feed.status
                )}`}
              >
                {getStatusText(feed.status)}
              </span>
            </div>
          </div>

          {/* Meta information */}
          <div className="px-8 py-4 bg-gray-50 border-b">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} className="text-gray-400" />
                <span className="font-medium">{formatDate(feed.createdAt)}</span>
              </div>
              {feed?.account?.firstName || feed?.account?.username ? (
                <div className="flex items-center gap-2">
                  <img
                    src={
                      feed.account?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${
                        feed.account?.firstName || "Admin"
                      }`
                    }
                    alt="Author"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-700">
                      {feed.account.firstName || feed.account.username}
                    </p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm text-gray-600 font-medium">A</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Admin</p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail / Media */}
          {thumbnail ? (
            <div className="px-8 py-6">
              <div className="rounded-lg overflow-hidden bg-gray-100">
                {mediaType === "VIDEO" ? (
                  <video
                    src={thumbnail}
                    controls
                    className="w-full max-h-[500px] object-contain"
                  />
                ) : (
                  <img
                    src={thumbnail}
                    alt={feed.title}
                    className="w-full max-h-[500px] object-contain"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="px-8 py-6">
              <div className="flex items-center justify-center gap-3 text-gray-400 bg-gray-50 rounded-lg py-12">
                <ImgIcon size={24} />
                <span>No thumbnail available</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-8 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {feed.content || (
                  <span className="text-gray-400 italic">No content available</span>
                )}
              </div>
            </div>
          </div>

          {/* Additional media if any */}
          {feed?.media && feed.media.length > 1 && (
            <div className="px-8 py-6 border-t">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Media
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {feed.media.slice(1).map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden bg-gray-100"
                  >
                    {m.mediaType === "VIDEO" ? (
                      <video
                        src={m.mediaUrl}
                        controls
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <img
                        src={m.mediaUrl}
                        alt={`Media ${idx + 2}`}
                        className="w-full h-48 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFeedDetail;
