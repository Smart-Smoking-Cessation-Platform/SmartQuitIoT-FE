// src/pages/coach/CoachAppointmentsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Loader2,
} from "lucide-react";
import styles from "../../styles/CoachAppointmentsPage.module.css";
import api from "@/api/appointments";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

/**
 * CoachAppointmentsPage (API integrated + details modal)
 * - Shows 7-day window (weekStart). Clicking a date not yet loaded calls API for that date.
 * - Robust handling for different backend shapes (GlobalResponse / AxiosResponse / direct array)
 */

// helpers
const todayIso = () => new Date().toISOString().slice(0, 10);
const addDaysIso = (iso, days) => {
  const dt = new Date(iso);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
};

// normalize various response shapes into an array
const toArray = (maybe) => {
  if (!maybe) return [];
  // already array
  if (Array.isArray(maybe)) return maybe;
  // GlobalResponse unwrapped: { data: [...] } or AxiosResponse: { data: { data: [...] } }
  if (Array.isArray(maybe.data)) return maybe.data;
  if (Array.isArray(maybe?.data?.data)) return maybe.data.data;
  // some APIs return { items: [...] } or { results: [...] }
  if (Array.isArray(maybe.items)) return maybe.items;
  if (Array.isArray(maybe.results)) return maybe.results;
  return [];
};

// map backend AppointmentResponse -> UI shape
const mapBackendToUI = (a) => {
  const startTime = a.startTime
    ? String(a.startTime).slice(0, 5)
    : a.startTimeStr?.slice(0, 5) || "";
  const endTime = a.endTime
    ? String(a.endTime).slice(0, 5)
    : a.endTimeStr?.slice(0, 5) || "";
  const duration =
    startTime && endTime
      ? (() => {
          try {
            const [sh, sm] = startTime.split(":").map(Number);
            const [eh, em] = endTime.split(":").map(Number);
            let minutes = eh * 60 + em - (sh * 60 + sm);
            if (minutes <= 0) minutes = 30;
            return `${minutes} min`;
          } catch (e) {
            return "30 min";
          }
        })()
      : "30 min";

  return {
    id: a.appointmentId ?? a.id ?? 0,
    time: startTime || a.time || "",
    date: a.date || a.appointmentDate || "",
    member: a.memberName || a.member || "Guest",
    status: a.runtimeStatus || a.status || "PENDING",
    duration,
    type: a.type || "",
    raw: a,
  };
};

const getStatusLabel = (status) => {
  const map = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return map[status] || status;
};

export default function CoachAppointmentsPage() {
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [weekStart, setWeekStart] = useState(todayIso());
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]); // flattened list of mapped appointments
  const [error, setError] = useState(null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAppointment, setModalAppointment] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  // ------------- 2) ADDED: helpers & handler for complete logic -------------
  // place these near handleJoin / handleStart (same scope)
  const parseLocalDateTime = (dateStr, timeStr) => {
    // dateStr: "yyyy-MM-dd", timeStr: "HH:mm" or "HH:mm:ss"
    try {
      const [y, m, d] = (dateStr || "").split("-").map((n) => parseInt(n, 10));
      const [hh, mm] = (timeStr || "00:00")
        .split(":")
        .map((n) => parseInt(n, 10));
      if (!y || !m || !d || isNaN(hh) || isNaN(mm)) return null;
      return new Date(y, m - 1, d, hh, mm, 0, 0); // local time
    } catch (e) {
      return null;
    }
  };

  const MINUTES_AFTER_START_TO_ALLOW_COMPLETE = 10; // kiểm tra có sau 10' kể từ slot bắt đầu cha

  const canComplete = (appointment) => {
    if (!appointment || appointment.status !== "IN_PROGRESS") return false;
    // appointment.time is "HH:mm", appointment.date is "yyyy-MM-dd"
    const startDt = parseLocalDateTime(appointment.date, appointment.time);
    if (!startDt) return false;
    const allowAt = new Date(
      startDt.getTime() + MINUTES_AFTER_START_TO_ALLOW_COMPLETE * 60 * 1000
    );
    const now = new Date();
    return now >= allowAt;
  };

  const handleComplete = async (appointment) => {
    if (!window.confirm("Are you sure that complete this session? ")) return;
    try {
      setCompletingId(appointment.id);
      await api.completeAppointmentByCoach(appointment.id);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id ? { ...a, status: "COMPLETED" } : a
        )
      );
      // feedback
      alert("Marked as completed ✅");
    } catch (err) {
      console.error("complete error", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to complete appointment";
      setError(msg);
      alert("Error: " + msg);
    } finally {
      setCompletingId(null);
    }
  };

  // Join handler — requests join token then navigate to meeting route
  const handleJoin = async (appointment) => {
    try {
      setLoading(true);
      setError(null);
      const tokenResp = await api.requestJoinToken(appointment.id);
      // tokenResp should be an object { channel, token, uid, expiresAt, ttlSeconds }
      // Use setTimeout to ensure navigation happens after state updates
      setTimeout(() => {
        navigate(`/meeting/${appointment.id}`, {
          state: { tokenData: tokenResp, appointment },
          replace: false,
        });
      }, 0);
    } catch (e) {
      console.error("join token error", e);
      setError(e?.message || "Failed to request join token");
      setLoading(false);
    }
    // Note: Don't set loading to false here as we're navigating away
  };
  
  // Start handler — for coach to start the session (same flow as join)
  const handleStart = async (appointment) => {
    try {
      setLoading(true);
      setError(null);
      // optional: if backend needs "start" API to mark IN_PROGRESS, call it here
      // await api.startAppointment(appointment.id);

      const tokenResp = await api.requestJoinToken(appointment.id);
      
      // locally update status so UI reflects In Progress (optimistic)
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id ? { ...a, status: "IN_PROGRESS" } : a
        )
      );

      // Use setTimeout to ensure navigation happens after state updates
      setTimeout(() => {
        navigate(`/meeting/${appointment.id}`, {
          state: { tokenData: tokenResp, appointment },
          replace: false,
        });
      }, 0);
    } catch (e) {
      console.error("start token error", e);
      setError(e?.message || "Failed to request start token");
      setLoading(false);
    }
    // Note: Don't set loading to false here as we're navigating away
  };

  // initial load: upcoming appointments from today
  useEffect(() => {
    let mounted = true;
    const fetchUpcoming = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await api.getUpcomingAppointments({
          fromDate: todayIso(),
          page: 0,
          size: 200,
        });
        const rawList = toArray(resp);
        const mapped = rawList.map(mapBackendToUI);
        mapped.sort((x, y) =>
          x.date === y.date
            ? x.time.localeCompare(y.time)
            : x.date.localeCompare(y.date)
        );
        if (!mounted) return;
        setAppointments(mapped);

        const dates = [...new Set(mapped.map((a) => a.date))];
        setSelectedDate(
          dates.includes(todayIso()) ? todayIso() : dates[0] || todayIso()
        );
      } catch (e) {
        console.error("fetch upcoming error", e);
        if (!mounted) return;
        setError(e.message || "Failed to load appointments");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUpcoming();
    return () => {
      mounted = false;
    };
  }, []);

  // grouped map + sortedDates
  const { appointmentsByDate, sortedDates } = useMemo(() => {
    const map = {};
    appointments.forEach((apt) => {
      if (!map[apt.date]) map[apt.date] = [];
      map[apt.date].push(apt);
    });
    Object.keys(map).forEach((d) =>
      map[d].sort((a, b) => a.time.localeCompare(b.time))
    );
    const dates = Object.keys(map).sort();
    return { appointmentsByDate: map, sortedDates: dates };
  }, [appointments]);

  const todayAppointments = (appointmentsByDate[selectedDate] || []).filter(
    (a) => filterStatus === "ALL" || a.status === filterStatus
  );

  // when user clicks a date — fetch if missing
  const handleSelectDate = async (date) => {
    setSelectedDate(date);
    if (appointmentsByDate[date] && appointmentsByDate[date].length > 0) return;

    try {
      setLoading(true);
      setError(null);
      const resp = await api.listCoachAppointments({
        date,
        page: 0,
        size: 200,
      });
      
      const rawList = toArray(resp);
      const mapped = rawList.map(mapBackendToUI);
      setAppointments((prev) => {
        const filtered = prev.filter((a) => a.date !== date);
        const combined = [...filtered, ...mapped];
        combined.sort((x, y) =>
          x.date === y.date
            ? x.time.localeCompare(y.time)
            : x.date.localeCompare(y.date)
        );
        return combined;
      });
    } catch (e) {
      console.error("fetch date error", e);
      setError(e.message || "Failed to load date");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (appointment) => {
    setModalAppointment(appointment);
    setModalOpen(true);
  };

  const handleCanceled = (appointmentId) => {
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
    const remainForDate = (appointmentsByDate[selectedDate] || []).filter(
      (a) => a.id !== appointmentId
    );
    if (remainForDate.length === 0) {
      const dates = sortedDates.filter((d) => d !== selectedDate);
      setSelectedDate(dates[0] || todayIso());
    }
  };

  // week navigation
  const shiftWeek = (days) => setWeekStart((prev) => addDaysIso(prev, days));
  const weekDates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) arr.push(addDaysIso(weekStart, i));
    return arr;
  }, [weekStart]);

  // header format
  const formatDate = (dateStr) => {
    if (!dateStr) return { dayOfWeek: "-", day: "-", month: "-", year: "-" };
    const date = new Date(dateStr);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      dayOfWeek: days[date.getDay()],
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  };
  const currentDateInfo = formatDate(selectedDate);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Appointments</h1>
        <p className="text-sm text-gray-600">
          Track and manage your upcoming sessions
        </p>
      </div>

      {/* Date Navigation & Calendar - Compact */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          {/* Week navigation arrows */}
          <button
            onClick={() => shiftWeek(-7)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          {/* Week dates */}
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {weekDates.map((date) => {
              const dateInfo = formatDate(date);
              const isSelected = date === selectedDate;
              const isToday = date === todayIso();
              return (
                <button
                  key={date}
                  onClick={() => handleSelectDate(date)}
                  className={`flex flex-col items-center justify-center min-w-[48px] px-2 py-1.5 rounded-lg transition-all ${
                    isSelected
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? "text-white/90" : "text-gray-500"
                    }`}
                  >
                    {dateInfo.dayOfWeek.slice(0, 3)}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      isToday && !isSelected ? "underline" : ""
                    }`}
                  >
                    {dateInfo.day}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next week arrow */}
          <button
            onClick={() => shiftWeek(7)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>

          {/* Today button */}
          <button
            onClick={() => {
              setSelectedDate(todayIso());
              setWeekStart(todayIso());
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">Total today</p>
              <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-700 font-medium mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-700">
                {todayAppointments.filter((a) => a.status === "PENDING").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-700 font-medium mb-1">Active</p>
              <p className="text-2xl font-bold text-blue-700">
                {
                  todayAppointments.filter((a) => a.status === "IN_PROGRESS")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl p-5 border-2 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-medium mb-1">Completed</p>
              <p className="text-2xl font-bold text-emerald-700">
                {
                  todayAppointments.filter((a) => a.status === "COMPLETED")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
              (status) => {
                const active = filterStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    {status === "ALL" ? "All" : getStatusLabel(status)}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className={`${styles.card}`}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Schedule {currentDateInfo.dayOfWeek}, {currentDateInfo.day}/{currentDateInfo.month}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-red-600 font-medium mb-2">Error loading appointments</p>
            <p className="text-sm text-gray-600">{String(error)}</p>
          </div>
        ) : todayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-1">No appointments</p>
            <p className="text-sm text-gray-500 text-center">
              Pick another date or change filter to see appointments
            </p>
          </div>
        ) : (
          <div className={styles.timelineList}>
            {todayAppointments.map((appointment, index) => {
              // Ensure unique key for each appointment
              const appointmentKey = `appointment-${appointment.id}-${appointment.date}-${appointment.time}`;
              const configs = {
                PENDING: {
                  label: "Pending",
                  icon: Clock,
                  bgClass: styles.badgePendingBg,
                  textClass: styles.badgePendingText,
                  borderClass: styles.badgePendingBorder,
                },
                IN_PROGRESS: {
                  label: "In progress",
                  icon: Video,
                  bgClass: styles.badgeActiveBg,
                  textClass: styles.badgeActiveText,
                  borderClass: styles.badgeActiveBorder,
                },
                COMPLETED: {
                  label: "Completed",
                  icon: CheckCircle,
                  bgClass: styles.badgeCompletedBg,
                  textClass: styles.badgeCompletedText,
                  borderClass: styles.badgeCompletedBorder,
                },
                CANCELLED: {
                  label: "Cancelled",
                  icon: XCircle,
                  bgClass: styles.badgeCancelledBg,
                  textClass: styles.badgeCancelledText,
                  borderClass: styles.badgeCancelledBorder,
                },
              };
              const statusConfig =
                configs[appointment.status] || configs.PENDING;
              const StatusIcon = statusConfig.icon;

              return (
                <div key={appointmentKey} className={styles.timelineItem}>
                  {index < todayAppointments.length - 1 && (
                    <div className={styles.timelineLine} />
                  )}
                  <div className={styles.timeWrap}>
                    <div className={styles.timeBadge}>{appointment.time}</div>
                  </div>
                  <div className={styles.dotWrap}>
                    <div className={styles.timelineDot} />
                  </div>
                  <div className={styles.appCard}>
                    <div className={styles.appRow}>
                      <div className={styles.appLeft}>
                        <div className={styles.topRow}>
                          <div
                            className={`${styles.statusBadge} ${statusConfig.bgClass} ${statusConfig.borderClass}`}
                          >
                            <StatusIcon
                              className={`${statusConfig.textClass} ${styles.statusIcon}`}
                            />
                            <span
                              className={`${statusConfig.textClass} ${styles.statusText}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                          <span className={styles.appType}>
                            {appointment.type}
                          </span>
                        </div>

                        <div className={styles.metaRow}>
                          <div className={styles.metaItem}>
                            <User className={styles.metaIcon} />
                            <span className={styles.metaText}>
                              {appointment.member}
                            </span>
                          </div>
                          <div className={styles.metaItem}>
                            <Clock className={styles.metaIcon} />
                            <span className={styles.metaText}>
                              {appointment.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.appActions}>
                        <button
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-colors"
                          onClick={() => openDetails(appointment)}
                        >
                          Details
                        </button>

                        {/* Only show Cancel button for PENDING status */}
                        {appointment.status === "PENDING" && (
                          <button
                            className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-sm hover:shadow"
                            onClick={() => openDetails(appointment)}
                          >
                            Cancel
                          </button>
                        )}

                        {/* IN_PROGRESS: Show Join and Complete buttons only */}
                        {appointment.status === "IN_PROGRESS" && (
                          <div className="flex gap-2 items-center">
                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow"
                              onClick={() => handleJoin(appointment)}
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Video className="w-4 h-4" />
                              )}
                              <span>Join</span>
                            </button>

                            {/* Complete button (only visible when canComplete) */}
                            {canComplete(appointment) ? (
                              completingId === appointment.id ? (
                                <button
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  disabled
                                >
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Completing...</span>
                                </button>
                              ) : (
                                <button
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-sm hover:shadow"
                                  onClick={() => handleComplete(appointment)}
                                  title="Mark session completed (available after 10 minutes from start)"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Complete</span>
                                </button>
                              )
                            ) : (
                              <button
                                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
                                disabled
                                title="Available after 10 minutes from start"
                              >
                                <span>Complete</span>
                              </button>
                            )}
                          </div>
                        )}

                        {appointment.status === "COMPLETED" && (
                          <button 
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium cursor-not-allowed"
                            disabled
                          >
                            Completed
                          </button>
                        )}
                        {appointment.status === "CANCELLED" && (
                          <button 
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-sm font-medium cursor-not-allowed"
                            disabled
                          >
                            Cancelled
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <AppointmentDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        appointmentBrief={modalAppointment}
        onCanceled={(id) => handleCanceled(id)}
      />
    </div>
  );
}
