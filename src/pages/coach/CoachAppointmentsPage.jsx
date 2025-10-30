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

  // Join handler — requests join token then navigate to meeting route
  const handleJoin = async (appointment) => {
    try {
      setLoading(true);
      const tokenResp = await api.requestJoinToken(appointment.id);
      // tokenResp should be an object { channel, token, uid, expiresAt, ttlSeconds }
      navigate(`/meeting/${appointment.id}`, {
        state: { tokenData: tokenResp, appointment },
      });
    } catch (e) {
      console.error("join token error", e);
      setError(e?.message || "Failed to request join token");
    } finally {
      setLoading(false);
    }
  };
  // Start handler — for coach to start the session (same flow as join)
  const handleStart = async (appointment) => {
    try {
      setLoading(true);
      // optional: if backend needs "start" API to mark IN_PROGRESS, call it here
      // await api.startAppointment(appointment.id);

      const tokenResp = await api.requestJoinToken(appointment.id);
      // navigate to meeting route (we use state so MeetingPage can reuse token)
      navigate(`/meeting/${appointment.id}`, {
        state: { tokenData: tokenResp, appointment },
      });

      // locally update status so UI reflects In Progress (optimistic)
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id ? { ...a, status: "IN_PROGRESS" } : a
        )
      );
    } catch (e) {
      console.error("start token error", e);
      setError(e?.message || "Failed to request start token");
    } finally {
      setLoading(false);
    }
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
      <div className={styles.headerWrap}>
        <div>
          <h1 className={styles.title}>Appointments</h1>
          <p className={styles.subtitle}>
            Track and manage your upcoming sessions
          </p>
        </div>
      </div>

      {/* Date Navigation & Calendar */}
      <div className={`${styles.card} ${styles.mb6}`}>
        <div className={styles.dateNavRow}>
          <div className={styles.dateSelector}>
            <button
              onClick={() => setSelectedDate(addDaysIso(selectedDate, -1))}
              className={styles.iconButton}
            >
              <ChevronLeft />
            </button>

            <div className={styles.centerDate}>
              <div className={styles.currentDay}>
                {currentDateInfo.dayOfWeek}, {currentDateInfo.day} /{" "}
                {currentDateInfo.month}
              </div>
              <div className={styles.currentYear}>{currentDateInfo.year}</div>
            </div>

            <button
              onClick={() => setSelectedDate(addDaysIso(selectedDate, 1))}
              className={styles.iconButton}
            >
              <ChevronRight />
            </button>
          </div>

          <div className={styles.quickActions}>
            <button
              onClick={() => {
                setSelectedDate(todayIso());
                setWeekStart(todayIso());
              }}
              className={`${styles.btnPrimary} ${styles.btnSmall}`}
            >
              <CalendarDays className="w-4 h-4" /> <span>Today</span>
            </button>
          </div>
        </div>

        {/* Week view */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
          <button className={styles.iconButton} onClick={() => shiftWeek(-7)}>
            <ChevronLeft />
          </button>
          <div className={styles.weekGrid} style={{ flex: 1 }}>
            {weekDates.map((date) => {
              const dateInfo = formatDate(date);
              const isSelected = date === selectedDate;
              const isToday = date === todayIso();
              return (
                <button
                  key={date}
                  onClick={() => handleSelectDate(date)}
                  className={`${styles.dateButton} ${
                    isSelected ? styles.dateButtonSelected : ""
                  }`}
                >
                  <div className={styles.dateInner}>
                    <div
                      className={`${styles.dateWeek} ${
                        isSelected ? styles.primaryText : ""
                      }`}
                    >
                      {dateInfo.dayOfWeek}
                    </div>
                    <div
                      className={`${styles.dateNumber} ${
                        isSelected ? styles.primaryText : ""
                      } ${isToday ? styles.underline : ""}`}
                    >
                      {dateInfo.day}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <button className={styles.iconButton} onClick={() => shiftWeek(7)}>
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={`${styles.card}`}>
          <div className={styles.statsRow}>
            <div>
              <p className={styles.statsLabel}>Total today</p>
              <p className={styles.statsValue}>{todayAppointments.length}</p>
            </div>
            <Calendar className={styles.statsIcon} />
          </div>
        </div>

        <div className={`${styles.card} ${styles.borderWarning}`}>
          <div className={styles.statsRow}>
            <div>
              <p className={styles.statsLabelWarning}>Pending</p>
              <p className={styles.statsValueWarning}>
                {todayAppointments.filter((a) => a.status === "PENDING").length}
              </p>
            </div>
            <AlertCircle className={styles.statsIconWarning} />
          </div>
        </div>

        <div className={`${styles.card} ${styles.borderActive}`}>
          <div className={styles.statsRow}>
            <div>
              <p className={styles.statsLabelActive}>Active</p>
              <p className={styles.statsValueActive}>
                {
                  todayAppointments.filter((a) => a.status === "IN_PROGRESS")
                    .length
                }
              </p>
            </div>
            <Video className={styles.statsIconActive} />
          </div>
        </div>

        <div className={`${styles.card} ${styles.borderCompleted}`}>
          <div className={styles.statsRow}>
            <div>
              <p className={styles.statsLabelCompleted}>Completed</p>
              <p className={styles.statsValueCompleted}>
                {
                  todayAppointments.filter((a) => a.status === "COMPLETED")
                    .length
                }
              </p>
            </div>
            <CheckCircle className={styles.statsIconCompleted} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${styles.card} ${styles.mb6}`}>
        <div className={styles.filterRow}>
          <div className={styles.filterLabel}>
            <Filter className={styles.filterIcon} />
            <span className={styles.filterTitle}>Filter by status</span>
          </div>
          <div className={styles.filterButtons}>
            {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
              (status) => {
                const active = filterStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`${styles.filterBtn} ${
                      active ? styles.filterBtnActive : ""
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
        <h2 className={styles.timelineTitle}>
          <Clock className="w-5 h-5" />
          <span className={styles.timelineTitleText}>
            Schedule {currentDateInfo.dayOfWeek}, {currentDateInfo.day}/
            {currentDateInfo.month}
          </span>
        </h2>

        {loading ? (
          <div style={{ padding: 24 }}>Loading...</div>
        ) : error ? (
          <div style={{ padding: 24, color: "red" }}>
            Error: {String(error)}
          </div>
        ) : todayAppointments.length === 0 ? (
          <div className={styles.emptyWrap}>
            <Calendar className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No appointments</p>
            <p className={styles.emptySub}>
              Pick another date or change filter
            </p>
          </div>
        ) : (
          <div className={styles.timelineList}>
            {todayAppointments.map((appointment, index) => {
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
                <div key={appointment.id} className={styles.timelineItem}>
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
                          className={styles.btnGhost}
                          onClick={() => openDetails(appointment)}
                        >
                          Details
                        </button>

                        {appointment.status === "PENDING" && (
                          <>
                            <button
                              className={`${styles.btnPrimary} ${styles.btnSmall} ${styles.actionStart}`}
                              onClick={() => handleStart(appointment)}
                            >
                              <Video className="w-4 h-4" /> <span>Start</span>
                            </button>
                            <button
                              className={`${styles.btnDanger} ${styles.btnSmall}`}
                              onClick={() => openDetails(appointment)}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {appointment.status === "IN_PROGRESS" && (
                          <button
                            className={`${styles.btnPrimary} ${styles.btnSmall}`}
                            onClick={() => handleJoin(appointment)}
                          >
                            <Video className="w-4 h-4" />
                            <span>Join</span>
                          </button>
                        )}

                        {appointment.status === "COMPLETED" && (
                          <button className={styles.btnDisabled} disabled>
                            Completed
                          </button>
                        )}
                        {appointment.status === "CANCELLED" && (
                          <button className={styles.btnDisabled} disabled>
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
