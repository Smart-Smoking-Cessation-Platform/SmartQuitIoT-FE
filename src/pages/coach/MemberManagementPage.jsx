// src/pages/MemberManagementPage.jsx
import React, { useEffect, useState, useRef } from "react";
import MemberCard from "../../pages/coach/components/MemberCard";
import MemberDetailsModal from "../../pages/coach/components/MemberDetailsModal";
import { getMembersForCoach, getMemberById } from "@/services/memberService";
import { postMessage } from "@/services/conversationService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, User } from "lucide-react";
import Paginator from "@/components/ui/paginator";

export default function MemberManagementPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12); // 12 items per page
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedMember, setSelectedMember] = useState(null);
  const [detailsTab, setDetailsTab] = useState("metric"); // default tab
  const abortRef = useRef(null);

  useEffect(() => {
    loadList();
    return () => {
      const abortController = abortRef.current;
      if (abortController && abortController.abort) abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  async function loadList() {
    setLoading(true);
    setError(null);
    try {
      const resp = await getMembersForCoach({
        page,
        size,
      }); // axios response or raw array / Page
      const payload = resp && resp.data ? resp.data : resp;

      // Handle paginated response (Page object) or simple array
      let list = [];
      let pages = 0;
      let total = 0;

      if (Array.isArray(payload)) {
        // Simple array response
        list = payload;
        pages = 1;
        total = payload.length;
      } else if (payload?.content) {
        // Page object response (Spring Page format)
        list = payload.content || [];
        pages = payload.totalPages || 0;
        total = payload.totalElements || list.length;
      } else if (payload?.data?.content) {
        // Nested Page object in data
        list = payload.data.content || [];
        pages = payload.data.totalPages || 0;
        total = payload.data.totalElements || list.length;
      } else {
        // Fallback: try to extract list from various possible structures
        list = payload?.list || payload?.items || [];
      }

      const mapped = list.map(normalizeApiMemberToView);
      setMembers(mapped);
      setTotalPages(pages);
      setTotalElements(total);
    } catch (err) {
      console.error("Load members failed", err);
      // Extract error message from response if available
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load members list. Please check your connection or try again.";
      setError(errorMessage);
      setMembers([]); // clear
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }

  // normalizer: map API keys -> MemberCard expected
  function normalizeApiMemberToView(api) {
    const isUsedFreeTrial = api.isUsedFreeTrial ?? api.usedFreeTrial ?? false;

    // Handle metric - can be null from backend
    const metric =
      api.metric ||
      (api.streaks !== undefined ||
      api.smokeFreeDayPercentage !== undefined ||
      api.reductionPercentage !== undefined
        ? {
            streaks: api.streaks ?? 0,
            smokeFreeDayPercentage: api.smokeFreeDayPercentage ?? 0,
            reductionPercentage: api.reductionPercentage ?? 0,
          }
        : null);

    return {
      ...api,
      id: api.id,
      firstName: api.firstName,
      lastName: api.lastName,
      avatarUrl: api.avatarUrl,
      dob: api.dob,
      isUsedFreeTrial,
      metric,
      usedFreeTrial: isUsedFreeTrial,
    };
  }

  // khi bấm detail: fetch full member (GET /members/{id}) rồi mở modal
  async function handleOpenDetails(memberId, initialTab = "metric") {
    setDetailsTab(initialTab);
    setSelectedMember(null); // modal can show internal loader if needed
    try {
      const resp = await getMemberById(memberId);
      const payload = resp && resp.data ? resp.data : resp;
      setSelectedMember(normalizeApiMemberToView(payload));
    } catch (err) {
      console.error("Load member detail failed", err);
      // Extract error message from response if available
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load member details. Please try again.";
      setError(errorMessage);
      // keep selectedMember null so modal won't open with bad data
    }
  }

  // Handle memberId from query params (when navigating from FeedbackPage)
  useEffect(() => {
    const memberId = searchParams.get("memberId");
    if (memberId && !selectedMember) {
      handleOpenDetails(memberId, "metric");
      // Clear the query param after opening modal
      setSearchParams({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  // Mở inbox chat với member
  async function openInboxForMember(member) {
    try {
      // optional: show spinner / disable button
      const clientMessageId =
        crypto && crypto.randomUUID
          ? crypto.randomUUID()
          : `cmsg-${Date.now()}`;

      const payload = {
        targetMemberId: member.id,
        content: "Hello! I'd like to start a conversation.", // backend requires non-blank
        messageType: "TEXT",
        clientMessageId,
      };

      const resp = await postMessage(payload);
      // backend trả GlobalResponse => resp.data.data = MessageDTO
      const body = resp && resp.data ? resp.data : resp;
      const message = body && body.data ? body.data : body;
      const conversationId =
        message &&
        (message.conversationId || message.conversationId === 0
          ? message.conversationId
          : message.conversation_id);

      if (!conversationId) {
        console.warn("Could not get conversationId from response", message);
        // fallback: navigate inbox list page
        navigate("/coach/chat");
        return;
      }

      // navigate to chat with query param (FE will read and open/subscribe)
      navigate(`/coach/chat?conversationId=${conversationId}`);
    } catch (err) {
      console.error("Open inbox failed", err);
      // show toast or error UI
      alert("Failed to open inbox. Please check your connection or try again.");
    } finally {
      // optional: hide spinner
    }
  }
  return (
    <div className="px-10 min-h-screen scrollbar-hidden">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Member Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track your members' progress
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: size }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-6 rounded-2xl h-64 border border-gray-100"
            />
          ))
        ) : members.length ? (
          members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onOpenDetails={(tab = "metric") => handleOpenDetails(m.id, tab)}
              onOpenInbox={() => openInboxForMember(m)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  No members found
                </p>
                <p className="text-sm text-gray-500">
                  Members will appear here once they join.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-6">
          <Paginator
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              // Scroll to top when page changes
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      {/* Show total count if available */}
      {!loading && totalElements > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {members.length} of {totalElements} member
          {totalElements !== 1 ? "s" : ""}
        </div>
      )}

      <MemberDetailsModal
        member={selectedMember}
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        initialTab={detailsTab}
      />
    </div>
  );
}
