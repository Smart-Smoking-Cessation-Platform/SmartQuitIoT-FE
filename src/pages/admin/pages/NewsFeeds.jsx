// src/pages/admin/pages/NewsFeeds.jsx
import React, { useEffect, useState, useContext } from "react";
import newsService from "@/services/newsService";
import NewsFeedList from "../components/form/NewsFeedList";
import NewsFeedForm from "../components/form/NewsFeedForm";
import NewsFeedDetailModal from "../components/modals/NewsFeedDetailModal";
import ToastContext from "@/context/ToastContext";

/**
 * Map backend DTO -> UI model
 * Keep this function defined BEFORE the component so fetchFeeds can use it.
 */
const mapNewsDTOtoUI = (n = {}) => {
  const firstMedia =
    Array.isArray(n.media) && n.media.length > 0 ? n.media[0] : null;

  return {
    id: n.id,
    title: n.title,
    content: n.content,
    status: (n.status || "").toLowerCase(),
    createdAt: n.createdAt,
    updatedAt: n.updatedAt || n.createdAt,
    thumbnailUrl: n.thumbnailUrl || null,
    mediaUrl: firstMedia ? firstMedia.mediaUrl : null,
    mediaType: firstMedia ? firstMedia.mediaType || "IMAGE" : "IMAGE",
    raw: n,
  };
};

const NewsFeeds = () => {
  const toast = useContext(ToastContext); // expects toast.success / toast.error etc.
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // detail modal state
  const [detailId, setDetailId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const showSuccess = (msg) => {
    if (toast && typeof toast.success === "function") toast.success(msg);
    else window.alert(msg);
  };
  const showError = (msg) => {
    if (toast && typeof toast.error === "function") toast.error(msg);
    else window.alert(msg);
  };
  const showInfo = (msg) => {
    if (toast && typeof toast.info === "function") toast.info(msg);
    else window.alert(msg);
  };

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const list = await newsService.getAll();
      // newsService.getAll() should return array or wrapped object; handle both
      const arrRaw = Array.isArray(list)
        ? list
        : list?.data || list?.result || [];
      const arr = Array.isArray(arrRaw) ? arrRaw.map(mapNewsDTOtoUI) : [];
      setFeeds(arr);
    } catch (e) {
      console.error("fetchFeeds error", e);
      setFeeds([]);
      showError("Failed to load news list. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateOrUpdate = async (payload) => {
    setSubmitting(true);
    try {
      const createPayload = {
        title: payload.title,
        content: payload.content,
        thumbnailUrl: payload.thumbnailUrl || null,
        mediaUrls: payload.mediaUrl ? [payload.mediaUrl] : [],
      };

      if (payload.id) {
        const updated = await newsService.updateNews(payload.id, createPayload);
        const ui = mapNewsDTOtoUI(updated);
        setFeeds((prev) => prev.map((f) => (f.id === ui.id ? ui : f)));
        showSuccess("Update successful");
      } else {
        const created = await newsService.createNews(createPayload);
        const ui = mapNewsDTOtoUI(created);
        setFeeds((prev) => [ui, ...(prev || [])]);
        showSuccess("Create successful");
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("create/update error", err);
      showError("Error saving news. See console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (feed) => {
    setEditing(feed);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feed?"
    );
    if (!confirmed) return;

    try {
      await newsService.deleteNews(id);
      setFeeds((prev) => prev.filter((f) => f.id !== id));
      showSuccess("Deleted");
    } catch (err) {
      console.error("delete error", err);
      showError("Delete failed. See console.");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage News Feeds
            </h1>
            <p className="text-gray-600 mt-1">
              Create, edit, delete and upload media (Cloudinary)
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setEditing(null);
              }}
              className="flex items-center gap-2 bg-[#00bd7e] hover:bg-[#00a56f] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create News Feed
            </button>
          )}
        </div>

        {showForm && (
          <NewsFeedForm
            key={editing?.id || "new"}
            initial={editing}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSubmit={handleCreateOrUpdate}
            submitting={submitting}
          />
        )}

        {!showForm && (
          <NewsFeedList
            feeds={feeds}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpen={(id) => {
              setDetailId(id);
              setDetailOpen(true);
            }}
          />
        )}
      </div>

      {/* Detail modal */}
      {detailOpen && (
        <NewsFeedDetailModal
          feedId={detailId}
          initialFeed={feeds.find((f) => f.id === detailId) || null}
          onClose={() => {
            setDetailOpen(false);
            setDetailId(null);
          }}
        />
      )}
    </div>
  );
};

export default NewsFeeds;
