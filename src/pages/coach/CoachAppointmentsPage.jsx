import React, { useState } from "react";
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

const CoachAppointmentsPage = () => {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("2025-10-28");
  const [viewMode, setViewMode] = useState("day"); // "day" or "week"

  // Mock data - sau này fetch từ API
  const allAppointments = [
    {
      id: 1,
      time: "10:00",
      date: "2025-10-28",
      member: "Nguyễn Văn A",
      status: "PENDING",
      duration: "60 phút",
      type: "Personal Training",
    },
    {
      id: 2,
      time: "11:30",
      date: "2025-10-28",
      member: "Trần Thị B",
      status: "IN_PROGRESS",
      duration: "45 phút",
      type: "Nutrition Consultation",
    },
    {
      id: 3,
      time: "14:00",
      date: "2025-10-28",
      member: "Lê Văn C",
      status: "COMPLETED",
      duration: "60 phút",
      type: "Personal Training",
    },
    {
      id: 4,
      time: "16:00",
      date: "2025-10-28",
      member: "Phạm Thị D",
      status: "CANCELLED",
      duration: "30 phút",
      type: "Follow-up",
    },
    {
      id: 5,
      time: "09:00",
      date: "2025-10-27",
      member: "Hoàng Văn E",
      status: "COMPLETED",
      duration: "60 phút",
      type: "Personal Training",
    },
    {
      id: 6,
      time: "15:00",
      date: "2025-10-27",
      member: "Đặng Thị F",
      status: "COMPLETED",
      duration: "45 phút",
      type: "Yoga Session",
    },
    {
      id: 7,
      time: "10:00",
      date: "2025-10-29",
      member: "Vũ Văn G",
      status: "PENDING",
      duration: "60 phút",
      type: "Personal Training",
    },
    {
      id: 8,
      time: "14:30",
      date: "2025-10-29",
      member: "Bùi Thị H",
      status: "PENDING",
      duration: "30 phút",
      type: "Consultation",
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: "Chờ bắt đầu",
        icon: Clock,
        bgClass: styles.badgePendingBg,
        textClass: styles.badgePendingText,
        borderClass: styles.badgePendingBorder,
      },
      IN_PROGRESS: {
        label: "Đang diễn ra",
        icon: Video,
        bgClass: styles.badgeActiveBg,
        textClass: styles.badgeActiveText,
        borderClass: styles.badgeActiveBorder,
      },
      COMPLETED: {
        label: "Hoàn thành",
        icon: CheckCircle,
        bgClass: styles.badgeCompletedBg,
        textClass: styles.badgeCompletedText,
        borderClass: styles.badgeCompletedBorder,
      },
      CANCELLED: {
        label: "Đã hủy",
        icon: XCircle,
        bgClass: styles.badgeCancelledBg,
        textClass: styles.badgeCancelledText,
        borderClass: styles.badgeCancelledBorder,
      },
    };
    return configs[status] || configs.PENDING;
  };

  // Group appointments by date
  const appointmentsByDate = allAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) {
      acc[apt.date] = [];
    }
    acc[apt.date].push(apt);
    return acc;
  }, {});

  // Sort appointments within each date by time
  Object.keys(appointmentsByDate).forEach((date) => {
    appointmentsByDate[date].sort((a, b) => a.time.localeCompare(b.time));
  });

  // Get sorted dates
  const sortedDates = Object.keys(appointmentsByDate).sort();

  // Filter appointments for selected date
  const todayAppointments = (appointmentsByDate[selectedDate] || []).filter(
    (a) => filterStatus === "ALL" || a.status === filterStatus
  );

  // Navigation functions
  const goToPreviousDay = () => {
    const currentIndex = sortedDates.indexOf(selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(sortedDates[currentIndex - 1]);
    }
  };

  const goToNextDay = () => {
    const currentIndex = sortedDates.indexOf(selectedDate);
    if (currentIndex < sortedDates.length - 1) {
      setSelectedDate(sortedDates[currentIndex + 1]);
    }
  };

  const goToToday = () => {
    const today = "2025-10-28"; // Mock today
    setSelectedDate(today);
  };

  // Calculate stats for selected date
  const dayStats = {
    total: todayAppointments.length,
    pending: todayAppointments.filter((a) => a.status === "PENDING").length,
    inProgress: todayAppointments.filter((a) => a.status === "IN_PROGRESS")
      .length,
    completed: todayAppointments.filter((a) => a.status === "COMPLETED").length,
  };

  // Format date display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
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
          <h1 className={styles.title}>Quản lý Lịch Hẹn</h1>
          <p className={styles.subtitle}>
            Theo dõi và quản lý các cuộc hẹn với học viên của bạn
          </p>
        </div>
      </div>

      {/* Date Navigation & Calendar */}
      <div className={`${styles.card} ${styles.mb6}`}>
        <div className={styles.dateNavRow}>
          {/* Date Selector */}
          <div className={styles.dateSelector}>
            <button
              onClick={goToPreviousDay}
              disabled={sortedDates.indexOf(selectedDate) === 0}
              className={styles.iconButton}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className={styles.centerDate}>
              <div className={styles.currentDay}>
                {currentDateInfo.dayOfWeek}, {currentDateInfo.day} Tháng{" "}
                {currentDateInfo.month}
              </div>
              <div className={styles.currentYear}>{currentDateInfo.year}</div>
            </div>

            <button
              onClick={goToNextDay}
              disabled={
                sortedDates.indexOf(selectedDate) === sortedDates.length - 1
              }
              className={styles.iconButton}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <button
              onClick={goToToday}
              className={`${styles.btnPrimary} ${styles.btnSmall}`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Hôm nay</span>
            </button>
          </div>
        </div>

        {/* Week View - Mini Calendar */}
        <div className={styles.weekGrid}>
          {sortedDates.slice(0, 7).map((date) => {
            const dateInfo = formatDate(date);
            const dayAppointments = appointmentsByDate[date] || [];
            const isSelected = date === selectedDate;
            const isToday = date === "2025-10-28"; // Mock today

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
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
                  <div
                    className={`${styles.dateCount} ${
                      isSelected ? styles.primaryText : ""
                    }`}
                  >
                    {dayAppointments.length} buổi
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards for Selected Day */}
      <div className={styles.statsGrid}>
        <div className={`${styles.card}`}>
          <div className={styles.statsRow}>
            <div>
              <p className={styles.statsLabel}>Tổng buổi hôm nay</p>
              <p className={styles.statsValue}>{dayStats.total}</p>
            </div>
            <Calendar className={styles.statsIcon} />
          </div>
        </div>

        <div className={`${styles.card} ${styles.borderWarning}`}>
          <div className={styles.statsRow}>
            <div>
              <p className={styles.statsLabelWarning}>Chờ xác nhận</p>
              <p className={styles.statsValueWarning}>{dayStats.pending}</p>
            </div>
            <AlertCircle className={styles.statsIconWarning} />
          </div>
        </div>

        <div className={`${styles.card} ${styles.borderActive}`}>
          <div className={styles.statsRow}>
            <div>
              <p className={styles.statsLabelActive}>Đang diễn ra</p>
              <p className={styles.statsValueActive}>{dayStats.inProgress}</p>
            </div>
            <Video className={styles.statsIconActive} />
          </div>
        </div>

        <div className={`${styles.card} ${styles.borderCompleted}`}>
          <div className={styles.statsRow}>
            <div>
              <p className={styles.statsLabelCompleted}>Hoàn thành</p>
              <p className={styles.statsValueCompleted}>{dayStats.completed}</p>
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
            <span className={styles.filterTitle}>Lọc theo trạng thái:</span>
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
                    {status === "ALL" ? "Tất cả" : getStatusLabel(status)}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className={`${styles.card}`}>
        <h2 className={styles.timelineTitle}>
          <Clock className="w-5 h-5" />
          <span className={styles.timelineTitleText}>
            Lịch trình {currentDateInfo.dayOfWeek}, {currentDateInfo.day}/
            {currentDateInfo.month}
          </span>
        </h2>

        {todayAppointments.length === 0 ? (
          <div className={styles.emptyWrap}>
            <Calendar className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>
              Không có lịch hẹn nào trong ngày này
            </p>
            <p className={styles.emptySub}>
              Chọn ngày khác hoặc thay đổi bộ lọc
            </p>
          </div>
        ) : (
          <div className={styles.timelineList}>
            {todayAppointments.map((appointment, index) => {
              const statusConfig = getStatusConfig(appointment.status);
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
                        <button className={styles.btnGhost}>Chi tiết</button>

                        {appointment.status === "PENDING" && (
                          <>
                            <button
                              className={`${styles.btnPrimary} ${styles.btnSmall} ${styles.actionStart}`}
                            >
                              <Video className="w-4 h-4" />
                              <span>Bắt đầu</span>
                            </button>
                            <button
                              className={`${styles.btnDanger} ${styles.btnSmall}`}
                            >
                              Hủy
                            </button>
                          </>
                        )}

                        {appointment.status === "IN_PROGRESS" && (
                          <button
                            className={`${styles.btnPrimary} ${styles.btnSmall}`}
                          >
                            <Video className="w-4 h-4" />
                            <span>Tham gia</span>
                          </button>
                        )}

                        {appointment.status === "COMPLETED" && (
                          <button className={`${styles.btnDisabled}`} disabled>
                            Đã hoàn thành
                          </button>
                        )}

                        {appointment.status === "CANCELLED" && (
                          <button className={`${styles.btnDisabled}`} disabled>
                            Đã hủy
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
    </div>
  );
};

// helper to map status display label for filter buttons
function getStatusLabel(status) {
  const map = {
    PENDING: "Chờ",
    IN_PROGRESS: "Đang diễn ra",
    COMPLETED: "Hoàn",
    CANCELLED: "Hủy",
  };
  return map[status] || status;
}

export default CoachAppointmentsPage;
