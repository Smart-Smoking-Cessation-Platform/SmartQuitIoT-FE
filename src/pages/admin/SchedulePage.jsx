import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash,
  Calendar,
  Users,
  Check,
  X,
} from "lucide-react";
import styles from "../../styles/SchedulePage.module.css";
import { getAllCoaches, assignSchedules } from "../../services/scheduleService";

/* ---------- helpers ---------- */
const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const toISODate = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const formatDisplay = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/* ---------- Calendar utils ---------- */
function getMonthGrid(year, month) {
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/* ---------- Main component ---------- */
export default function SchedulePage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1..12
  const [selectedDates, setSelectedDates] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [coachSearch, setCoachSearch] = useState("");
  const [selectedCoachIds, setSelectedCoachIds] = useState([]);
  const [masterSchedule, setMasterSchedule] = useState([
    // optional initial seed; you can keep empty []
    // { date: "2025-10-10", coachIds: [1, 2] },
  ]);

  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const weeks = useMemo(() => getMonthGrid(year, month), [year, month]);
  const monthLabel = useMemo(
    () =>
      new Date(year, month - 1).toLocaleString("vi-VN", {
        month: "long",
        year: "numeric",
      }),
    [year, month]
  );

  useEffect(() => {
    let mounted = true;
    const fetchCoaches = async () => {
      setLoadingCoaches(true);
      try {
        const res = await getAllCoaches();
        if (res?.data?.success) {
          const data = res.data.data || [];
          const mapped = data.map((c) => ({
            id: c.id,
            name:
              `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
              `Coach ${c.id}`,
            avatar:
              c.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${c.firstName || ""} ${c.lastName || ""}`
              )}&background=random`,
          }));
          if (mounted) setCoaches(mapped);
        } else {
          console.error("Coaches API unexpected response:", res);
          if (mounted)
            alert("Không load được danh sách coach (server trả về lỗi).");
        }
      } catch (err) {
        console.error("Failed to load coaches:", err);
        if (mounted) alert("Không thể kết nối server để lấy danh sách coach.");
      } finally {
        if (mounted) setLoadingCoaches(false);
      }
    };

    fetchCoaches();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleCoaches = useMemo(() => {
    const q = coachSearch.trim().toLowerCase();
    return q
      ? coaches.filter((c) => c.name.toLowerCase().includes(q))
      : coaches;
  }, [coaches, coachSearch]);

  const toggleDate = (y, m, d) => {
    const iso = toISODate(y, m, d);
    setSelectedDates((prev) =>
      prev.includes(iso) ? prev.filter((x) => x !== iso) : [...prev, iso].sort()
    );
  };

  const clearSelectedDates = () => setSelectedDates([]);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const toggleCoach = (id) =>
    setSelectedCoachIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectAllVisible = () => {
    const ids = visibleCoaches.map((c) => c.id);
    setSelectedCoachIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const clearCoaches = () => setSelectedCoachIds([]);

  // handle assign -> call API
  const handleAssign = async () => {
    if (!selectedDates.length) return alert("Chọn ít nhất 1 ngày làm việc.");
    if (!selectedCoachIds.length) return alert("Chọn ít nhất 1 coach.");

    if (
      !confirm(
        `Gán ${selectedCoachIds.length} coach cho ${selectedDates.length} ngày?`
      )
    )
      return;

    setAssigning(true);
    try {
      const body = {
        dates: selectedDates,
        coachIds: selectedCoachIds,
      };
      const res = await assignSchedules(body);
      if (res?.data?.success) {
        alert("✅ Gán lịch thành công!");

        // Merge server result into local masterSchedule optimistically.
        // Server response may be count or updated records; here we merge locally:
        setMasterSchedule((prev) => {
          const map = {};
          prev.forEach((r) => (map[r.date] = new Set(r.coachIds)));
          selectedDates.forEach((d) => {
            if (!map[d]) map[d] = new Set();
            selectedCoachIds.forEach((cid) => map[d].add(cid));
          });
          const out = Object.keys(map)
            .sort()
            .map((date) => ({
              date,
              coachIds: Array.from(map[date]).sort((a, b) => a - b),
            }));
          return out;
        });

        // clear selections
        setSelectedDates([]);
        setSelectedCoachIds([]);
      } else {
        console.error("Assign API returned failure:", res);
        alert("Gán lịch thất bại (server trả về lỗi).");
      }
    } catch (err) {
      console.error("Assign request failed:", err);
      alert("Lỗi kết nối hoặc server khi gán lịch.");
    } finally {
      setAssigning(false);
    }
  };

  const removeCoachFromDate = (date, cid) => {
    // NOTE: optionally call API to remove - currently local only
    setMasterSchedule((prev) =>
      prev
        .map((r) =>
          r.date === date
            ? { ...r, coachIds: r.coachIds.filter((x) => x !== cid) }
            : r
        )
        .filter((r) => r.coachIds.length > 0)
    );
  };

  const removeDate = (date) => {
    if (!confirm(`Xóa ngày ${formatDisplay(date)} khỏi master schedule?`))
      return;
    // NOTE: optionally call API to delete - currently local only
    setMasterSchedule((prev) => prev.filter((r) => r.date !== date));
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.iconWrap}>
            <Calendar className={styles.iconWhite} />
          </div>
          <div>
            <h1 className={styles.title}>Manage Schedule</h1>
            <p className={styles.subtitle}>Quản lý lịch làm việc của coaches</p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Calendar Section */}
        <div className={styles.colLeft}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.monthNav}>
                <button
                  className={styles.iconBtn}
                  onClick={prevMonth}
                  aria-label="Tháng trước"
                >
                  <ChevronLeft className={styles.iconWhite} />
                </button>
                <div className={styles.monthLabel}>{monthLabel}</div>
                <button
                  className={styles.iconBtn}
                  onClick={nextMonth}
                  aria-label="Tháng sau"
                >
                  <ChevronRight className={styles.iconWhite} />
                </button>
              </div>

              <div className={styles.headerActions}>
                <button
                  className={styles.btnGhost}
                  onClick={() => {
                    const rows = getMonthGrid(year, month);
                    const isoList = [];
                    rows.forEach((week) =>
                      week.forEach((cell) => {
                        if (!cell) return;
                        const d = cell.day;
                        const dt = new Date(year, month - 1, d);
                        const dow = dt.getDay();
                        if (dow >= 1 && dow <= 5)
                          isoList.push(toISODate(year, month, d));
                      })
                    );
                    setSelectedDates((prev) =>
                      Array.from(new Set([...prev, ...isoList])).sort()
                    );
                  }}
                >
                  Chọn T2-T6
                </button>
                <button
                  className={styles.btnGhostLight}
                  onClick={clearSelectedDates}
                >
                  Xóa chọn
                </button>
              </div>
            </div>

            {selectedDates.length > 0 && (
              <div className={styles.selectedInfo}>
                <Check className={styles.iconSmall} />
                <span>Đã chọn {selectedDates.length} ngày</span>
              </div>
            )}

            <div className={styles.calendarBody}>
              <div className={styles.weekHeader}>
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                  <div key={day} className={styles.weekDay}>
                    {day}
                  </div>
                ))}
              </div>

              <div className={styles.calendarGrid}>
                {weeks.flatMap((week, wi) =>
                  week.map((cell, ci) => {
                    if (!cell) {
                      return (
                        <div
                          key={`empty-${wi}-${ci}`}
                          className={styles.emptyCell}
                        />
                      );
                    }
                    const d = cell.day;
                    const iso = toISODate(year, month, d);
                    const selected = selectedDates.includes(iso);
                    const hasAssigned = masterSchedule.some(
                      (r) => r.date === iso
                    );
                    const scheduleEntry = masterSchedule.find(
                      (r) => r.date === iso
                    );

                    const cellClass = selected
                      ? styles.daySelected
                      : hasAssigned
                      ? styles.dayAssigned
                      : styles.day;

                    return (
                      <button
                        key={iso}
                        onClick={() => toggleDate(year, month, d)}
                        className={cellClass}
                      >
                        <div className={styles.dayInner}>
                          <div className={styles.dayNumber}>{d}</div>
                          {hasAssigned && !selected && (
                            <div className={styles.assignedBadge}>
                              <Users className={styles.iconTiny} />
                              <span className={styles.assignedCount}>
                                {scheduleEntry?.coachIds.length}
                              </span>
                            </div>
                          )}
                          {selected && <Check className={styles.iconCheck} />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coach Selection Panel */}
        <div className={styles.colRight}>
          <div className={styles.card}>
            <div className={styles.coachHeader}>
              <div className={styles.coachTitle}>
                <Users className={styles.iconMuted} />
                <div className={styles.coachTitleTextWrap}>
                  <h3 className={styles.coachTitleText}>Chọn Coaches</h3>
                  <p className={styles.coachSubtitle}>Multi-select</p>
                </div>
              </div>
              <div className={styles.coachCount}>
                <span className={styles.coachCountBig}>
                  {selectedCoachIds.length}{" "}
                </span>
                <span className={styles.coachCountLabel}>đã chọn</span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <input
                placeholder="🔍 Tìm kiếm coach..."
                value={coachSearch}
                onChange={(e) => setCoachSearch(e.target.value)}
                className={styles.searchInput}
              />

              <div className={styles.coachList}>
                {loadingCoaches ? (
                  <div style={{ padding: 12 }}>Đang tải coaches...</div>
                ) : visibleCoaches.length === 0 ? (
                  <div style={{ padding: 12 }}>Không có coach phù hợp.</div>
                ) : (
                  visibleCoaches.map((c) => {
                    const checked = selectedCoachIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`${styles.coachItem} ${
                          checked ? styles.coachItemSelected : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCoach(c.id)}
                          className={styles.checkbox}
                        />
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className={styles.avatar}
                        />
                        <div className={styles.coachInfo}>
                          <div className={styles.coachName}>{c.name}</div>
                          <div className={styles.coachId}>Coach ID: {c.id}</div>
                        </div>
                        {checked && (
                          <Check className={styles.iconCheckSelected} />
                        )}
                      </label>
                    );
                  })
                )}
              </div>

              <div className={styles.coachActions}>
                <button
                  onClick={selectAllVisible}
                  className={styles.btnOutline}
                >
                  Chọn tất cả
                </button>
                <button
                  onClick={clearCoaches}
                  className={styles.btnGhostOutline}
                >
                  Xóa chọn
                </button>
              </div>

              <button
                onClick={handleAssign}
                disabled={
                  !selectedDates.length || !selectedCoachIds.length || assigning
                }
                className={styles.assignButton}
              >
                {assigning
                  ? "Đang gán..."
                  : `Gán ${selectedCoachIds.length} coach cho ${selectedDates.length} ngày`}
              </button>

              <p className={styles.note}>
                💡 Mỗi ngày là 1 full working day (8 giờ)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Master Schedule Table */}
      <div className={styles.masterCard}>
        <div className={styles.masterHeader}>
          <div className={styles.masterLeft}>
            <Calendar className={styles.iconMuted} />
            <div>
              <h3 className={styles.masterTitle}>Lịch Đã Gán</h3>
              <p className={styles.masterSubtitle}>
                {masterSchedule.length} ngày đã được phân công
              </p>
            </div>
          </div>
        </div>

        {masterSchedule.length === 0 ? (
          <div className={styles.emptyMaster}>
            <Calendar className={styles.iconHuge} />
            <p className={styles.emptyTitle}>Chưa có ngày nào được gán coach</p>
            <p className={styles.emptySub}>
              Chọn ngày và coach ở trên để bắt đầu
            </p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Coaches Đã Gán</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {masterSchedule.map((row) => (
                  <tr key={row.date} className={styles.tableRow}>
                    <td className={styles.tdDate}>
                      <div className={styles.rowDate}>
                        <Calendar className={styles.iconAccent} />
                        <span className={styles.dateText}>
                          {formatDisplay(row.date)}
                        </span>
                      </div>
                    </td>
                    <td className={styles.tdCoaches}>
                      <div className={styles.coachChips}>
                        {row.coachIds.map((cid) => {
                          const coach = coaches.find((c) => c.id === cid) || {
                            name: `ID ${cid}`,
                          };
                          return (
                            <div key={cid} className={styles.coachChip}>
                              <span className={styles.coachChipText}>
                                {coach.name}
                              </span>
                              <button
                                onClick={() =>
                                  removeCoachFromDate(row.date, cid)
                                }
                                className={styles.removeCoachBtn}
                              >
                                <X className={styles.iconTinyRed} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className={styles.tdActions}>
                      <button
                        onClick={() => removeDate(row.date)}
                        className={styles.removeDateBtn}
                      >
                        <Trash className={styles.iconSmall} /> Xóa ngày
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
