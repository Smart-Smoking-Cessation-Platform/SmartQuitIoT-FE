// src/pages/CommunityPosts.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Share2,
  Heart,
} from "lucide-react";
import postService from "@/services/postService";
import commentService from "@/services/commentService";

/* ----------------------
   Helpers (date parsing + relative)
   ---------------------- */
const parseDateFlexible = (v) => {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v)) return v;
  try {
    let s = String(v).trim();
    s = s.replace(/\.(\d{3})\d+/, ".$1"); // trim microseconds -> ms
    let d = new Date(s);
    if (isNaN(d)) {
      d = new Date(s + "Z");
      if (isNaN(d)) return null;
    }
    return d;
  } catch (e) {
    return null;
  }
};

const formatDateRelative = (input) => {
  const d = parseDateFlexible(input);
  if (!d) return "";
  const now = new Date();
  const toMidnight = (x) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diffDays = Math.round(
    (toMidnight(now) - toMidnight(d)) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} ngày trước`;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/* ----------------------
   Parse content: support plain text or Quill delta JSON
   If delta: produce array of blocks { type: 'p'|'li'|'h3'|'img', content }
   ---------------------- */
const parsePostContent = (raw) => {
  if (!raw) return [];
  if (typeof raw !== "string") raw = String(raw);

  const s = raw.trim();
  if (s.startsWith("[")) {
    try {
      const ops = JSON.parse(s);
      const blocks = [];
      let paragraphBuffer = "";
      ops.forEach((op) => {
        if (typeof op.insert === "string") {
          paragraphBuffer += op.insert;
        } else if (op.insert && op.insert.image) {
          if (paragraphBuffer.trim()) {
            paragraphBuffer.split("\n").forEach((line) => {
              if (line.trim()) blocks.push({ type: "p", content: line });
            });
            paragraphBuffer = "";
          }
          blocks.push({ type: "img", content: op.insert.image });
        }
        if (op.attributes && op.attributes.header) {
          if (paragraphBuffer.trim()) {
            paragraphBuffer.split("\n").forEach((line) => {
              if (line.trim()) blocks.push({ type: "p", content: line });
            });
            paragraphBuffer = "";
          }
          blocks.push({ type: "h3", content: op.insert });
        }
      });
      if (paragraphBuffer.trim()) {
        paragraphBuffer.split("\n").forEach((line) => {
          if (line.trim()) blocks.push({ type: "p", content: line });
        });
      }
      return blocks;
    } catch (e) {
      return s.split("\n").map((p) => ({ type: "p", content: p }));
    }
  }

  return s.split("\n").map((p) => ({ type: "p", content: p }));
};

/* ----------------------
   Small UI helpers for content rendering
   ---------------------- */
const RenderBlocks = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;
  return blocks.map((b, i) => {
    if (b.type === "h3")
      return (
        <h3 key={i} className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
          {String(b.content).trim()}
        </h3>
      );
    if (b.type === "img")
      return (
        <div key={i} className="my-6 flex justify-center">
          <img
            src={b.content}
            alt={`media-${i}`}
            className="w-full max-w-[900px] rounded-lg object-cover"
            style={{ maxHeight: "520px" }}
          />
        </div>
      );
    if (b.type === "li")
      return (
        <li key={i} className="ml-6 text-gray-700">
          {b.content}
        </li>
      );
    return (
      <p key={i} className="text-gray-700 leading-relaxed mb-4">
        {b.content}
      </p>
    );
  });
};

/* ----------------------
   Comment small components (kept simple + nicer spacing)
   ---------------------- */
const CommentForm = ({
  avatarUrl,
  placeholder = "Viết bình luận...",
  onSubmit,
  submitting,
}) => {
  const [value, setValue] = useState("");
  return (
    <div className="flex gap-4 items-start">
      <img
        src={
          avatarUrl ||
          "https://ui-avatars.com/api/?background=333&color=fff&name=Admin"
        }
        alt="Admin"
        className="w-12 h-12 rounded-full"
      />
      <div className="flex-1">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full rounded-lg border-gray-200 shadow-sm p-3 focus:ring-2 focus:ring-emerald-200 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={async () => {
              const t = value.trim();
              if (!t || submitting) return;
              await onSubmit(t);
              setValue("");
            }}
            disabled={submitting || value.trim() === ""}
            className={`px-4 py-2 rounded-md font-medium ${
              submitting
                ? "bg-emerald-200 text-white"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {submitting ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({ c, onReply }) => {
  return (
    <div className="flex gap-3 py-4">
      <img
        src={
          c.account?.avatarUrl ||
          c.avatarUrl ||
          "https://ui-avatars.com/api/?background=00D09E&color=fff&name=U"
        }
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">
            {c.account?.firstName || c.account?.username}
          </div>
          <div className="text-xs text-gray-400">
            {formatDateRelative(c.createdAt)}
          </div>
        </div>
        <div className="text-gray-700 mt-1">{c.content}</div>
        <div className="text-xs text-gray-500 mt-2">
          <button
            className="hover:underline mr-3"
            onClick={() => onReply && onReply(c.id)}
          >
            Trả lời
          </button>
        </div>
        {c.replies && c.replies.length > 0 && (
          <div className="mt-3 ml-12 border-l pl-4 space-y-3">
            {c.replies.map((r) => (
              <CommentItem key={r.id} c={r} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------------------
   Main CommunityPosts (list + improved detail image handling)
   --------------------------- */
const CommunityPosts = () => {
  // LIST state (same as before; we keep it minimal)
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  // DETAIL state
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // comment state
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replySubmitting, setReplySubmitting] = useState(false);

  // NEW: showComments toggle + ref for smooth scroll
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef(null);

  const totalPages = useMemo(() => {
    if (!totalCount) return 1;
    return Math.max(1, Math.ceil(totalCount / perPage));
  }, [totalCount, perPage]);

  /* fetch list */
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const list = await postService.getPosts();
      setPosts(Array.isArray(list) ? list : []);
      setTotalCount(Array.isArray(list) ? list.length : 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const visiblePosts = useMemo(() => {
    if (!posts) return [];
    const start = (page - 1) * perPage;
    return posts.slice(start, start + perPage);
  }, [posts, page, perPage]);

  /* load detail */
  const loadPostDetail = async (postId) => {
    setLoadingDetail(true);
    setShowComments(false); // reset comments visibility on open
    try {
      const detail = await postService.getPostDetail(postId);
      let comments = [];
      try {
        comments = await commentService.getCommentsByPostId(postId);
      } catch (e) {
        comments = detail?.comments ?? [];
      }
      setSelectedPost({ ...(detail || {}), comments });
      // small delay to let layout paint before potential scroll
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } catch (e) {
      console.error("loadPostDetail", e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBack = () => {
    setSelectedPost(null);
    setReplyingTo(null);
    setShowComments(false);
  };

  /* comments create */
  const createComment = async (postId, content, parentId = null) => {
    if (!content || content.trim() === "") return null;
    setCommentSubmitting(true);
    try {
      const payload = { content };
      if (parentId) payload.parentId = parentId;
      const created = await commentService.createComment(postId, payload);
      setSelectedPost((prev) => {
        if (!prev) return prev;
        const copy = { ...prev };
        if (!parentId) copy.comments = [created, ...(copy.comments || [])];
        else {
          const insertReply = (list = []) =>
            list.map((c) => {
              if (c.id === parentId) {
                const replies = c.replies ? [...c.replies, created] : [created];
                return { ...c, replies };
              }
              if (c.replies && c.replies.length)
                return { ...c, replies: insertReply(c.replies) };
              return c;
            });
          copy.comments = insertReply(copy.comments || []);
        }
        return copy;
      });
      return created;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setCommentSubmitting(false);
    }
  };

  /* reply */
  const onReplyClick = (id) =>
    setReplyingTo((prev) => (prev === id ? null : id));
  const onSubmitReply = async (text, parentId) => {
    if (!selectedPost) return;
    setReplySubmitting(true);
    await createComment(selectedPost.id, text, parentId);
    setReplyingTo(null);
    setReplySubmitting(false);
  };

  /* Utility: open post detail on click */
  const handleOpenPost = (id) => loadPostDetail(id);

  // NEW: when showComments flips to true, scroll to comments section
  useEffect(() => {
    if (showComments && commentsRef.current) {
      commentsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showComments]);

  /* ----------------------
     RENDER
     ---------------------- */

  // LIST VIEW (simple grid)
  if (!selectedPost) {
    return (
      <div className="min-h-[90vh] bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            SmartQuit Community
          </h1>
          <p className="text-gray-600 mb-6">
            Share and learn experiences from others on their journey to quit
            smoking.
          </p>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {visiblePosts.map((p) => (
              <article
                key={p.id}
                onClick={() => handleOpenPost(p.id)}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition flex flex-col h-full"
              >
                <div className="h-40 overflow-hidden rounded-t-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MessageSquare className="w-12 h-12 text-white/80" />
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <img
                        src={p.account?.avatarUrl}
                        alt="a"
                        className="w-7 h-7 rounded-full"
                      />
                      <div className="text-sm font-medium">
                        {p.account?.firstName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDateRelative(p.createdAt)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* pagination */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded border disabled:opacity-40"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const idx = i + 1;
              return (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={`px-3 py-2 rounded ${
                    idx === page ? "bg-emerald-600 text-white" : "border"
                  }`}
                >
                  {idx}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded border disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DETAIL VIEW (improved image handling; related removed)
  const blocks = parsePostContent(selectedPost.content);
  const mediaList = Array.isArray(selectedPost.media) ? selectedPost.media : [];
  const commentsCount = selectedPost.comments?.length || 0;

  // helper to pick cover image (media -> thumbnail -> first image block)
  const firstMedia = mediaList.length > 0 ? mediaList[0].mediaUrl : null;
  const firstImgFromBlocks = blocks.find((b) => b.type === "img")?.content;
  const coverImage =
    firstMedia || selectedPost.thumbnail || firstImgFromBlocks || null;

  return (
    <div className="min-h-[90vh] bg-white">
      <div className="max-w-8xl mx-auto px-12  grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* main column */}
        <div className="lg:col-span-2">
          {/* cover */}
          {/* cover */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            {/* responsive height: mobile -> medium -> large */}
            <div
              className="w-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500
               h-64 md:h-80 lg:h-[420px] transition-all duration-200"
            >
              {coverImage ? (
                // full fill the container; no inline maxHeight to let container define final height
                <img
                  src={coverImage}
                  alt="cover"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="px-6 text-white">
                  <MessageSquare className="w-16 h-16 text-white/90" />
                </div>
              )}
            </div>

            {/* subtle overlay to keep text readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

            {/* Back button top-left (always visible on cover) */}
            <button
              onClick={handleBack}
              aria-label="Quay lại"
              className="absolute left-4 top-4 z-40 bg-white/90 hover:bg-white rounded-md p-2 shadow-sm flex items-center gap-2 text-sm"
              style={{ backdropFilter: "saturate(120%) blur(4px)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>

            {/* title + meta bottom-left */}
            <div className="absolute left-6 bottom-6 text-white">
              <h1 className="text-3xl font-bold">{selectedPost.title}</h1>
              <div className="mt-1 text-sm opacity-90">
                @{selectedPost.account?.username} ·{" "}
                {formatDateRelative(selectedPost.createdAt)}
              </div>
            </div>

            {/* action buttons bottom-right + comment toggle */}
            <div className="absolute right-6 bottom-6 flex gap-3 z-30 items-center">
              <button
                onClick={() => setShowComments((s) => !s)}
                className="hidden sm:inline-flex items-center gap-2 bg-white/90 text-gray-800 px-3 py-2 rounded-md shadow-sm hover:bg-white"
              >
                {showComments
                  ? "Ẩn bình luận"
                  : `Xem bình luận (${commentsCount})`}
              </button>

              <button className="bg-white/10 backdrop-blur rounded-full p-2 hover:bg-white/20">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button className="bg-white/10 backdrop-blur rounded-full p-2 hover:bg-white/20">
                <Heart className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* media gallery small: if more images beyond cover collage, present them nicely */}
          {mediaList.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {mediaList.slice(1, 7).map((m, idx) => (
                <img
                  key={idx}
                  src={m.mediaUrl}
                  alt={`m${idx}`}
                  className="w-full h-28 object-cover rounded-lg shadow-sm"
                />
              ))}
            </div>
          )}

          {/* content: show article full */}
          <article className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <div className="prose max-w-none">
              <RenderBlocks blocks={blocks} />
            </div>
          </article>

          {/* COMMENTS: only render when user toggles */}
          <section ref={commentsRef} className="mt-8">
            {showComments ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Bình luận ({commentsCount})
                  </h3>
                  <div className="text-sm text-gray-500">
                    {commentsCount > 0
                      ? `${commentsCount} bình luận`
                      : "Be the first to comment"}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <CommentForm
                    avatarUrl={selectedPost.account?.avatarUrl}
                    onSubmit={(t) => createComment(selectedPost.id, t, null)}
                    submitting={commentSubmitting}
                  />
                  <div className="mt-6 space-y-4">
                    {selectedPost.comments &&
                    selectedPost.comments.length > 0 ? (
                      selectedPost.comments.map((c) => (
                        <div key={c.id} className="border-b pb-4">
                          <CommentItem
                            c={c}
                            onReply={(id) => onReplyClick(id)}
                          />
                          {replyingTo === c.id && (
                            <div className="mt-3 ml-12">
                              <CommentForm
                                avatarUrl={selectedPost.account?.avatarUrl}
                                onSubmit={(t) => onSubmitReply(t, c.id)}
                                submitting={replySubmitting}
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        Chưa có bình luận nào. Hãy là người đầu tiên!
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6 flex items-center justify-center">
                <button
                  onClick={() => setShowComments(true)}
                  className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Xem bình luận ({commentsCount})
                </button>
              </div>
            )}
          </section>
        </div>

        {/* right sidebar: related removed, keep meta only */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* meta */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="text-sm text-gray-500">Thông tin</div>
              <div className="mt-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Ngày đăng</span>
                  <span className="text-gray-500">
                    {new Date(
                      parseDateFlexible(selectedPost.createdAt)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-700">Bình luận</span>
                  <span className="text-gray-500">{commentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* bottom fixed back removed (we keep top-left button) */}
    </div>
  );
};

export default CommunityPosts;
