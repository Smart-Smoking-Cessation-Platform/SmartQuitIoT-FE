import React, { useMemo } from "react";
import { Calendar, Trash, X, CalendarX } from "lucide-react";
import styles from "../../../styles/SchedulePage.module.css";
import { formatDisplay } from "./utils";

export default function MasterScheduleTable({
  masterSchedule,
  coaches,
  handleUpdateDay,
  removeDate,
  loadingSchedule,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) {
  if (loadingSchedule)
    return (
      <div className={styles.emptyMaster}>
        <Calendar className={styles.iconHuge} />
        <p className={styles.emptyTitle}>Đang tải lịch...</p>
      </div>
    );

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const years = Array.from(
    { length: 3 },
    (_, i) => new Date().getFullYear() - 1 + i
  );

  // ✅ Lọc các ngày trong tháng được chọn có coach làm việc
  const filteredDays = useMemo(() => {
    return masterSchedule.filter((m) => {
      const date = new Date(m.date);
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() + 1 === selectedMonth &&
        m.coachIds?.length > 0
      );
    });
  }, [masterSchedule, selectedMonth, selectedYear]);

  return (
    <div className={styles.masterCard}>
      {/* Header */}
      <div className={styles.masterHeader}>
        <div className={styles.masterLeft}>
          <Calendar className={styles.iconWhite} />
          <div>
            <h3 className={styles.masterTitle}>Lịch Làm Việc</h3>
            <p className={styles.masterSubtitle}>
              Tháng {selectedMonth} / {selectedYear}
            </p>
          </div>
        </div>

        {/* Bộ chọn tháng / năm */}
        <div className={styles.monthPicker}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className={styles.monthSelect}
          >
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={styles.yearSelect}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Không có coach nào trong tháng */}
      {filteredDays.length === 0 ? (
        <div className={styles.emptyMaster}>
          <CalendarX className={styles.iconHuge} />
          <p className={styles.emptyTitle}>
            Không có coach làm việc trong tháng này
          </p>
          <p className={styles.emptySub}>
            Thử chọn tháng khác hoặc thêm lịch mới cho coach.
          </p>
        </div>
      ) : (
        /* Table */
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Coaches</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredDays.map((row) => (
                <tr key={row.date} className={styles.tableRow}>
                  {/* Ngày */}
                  <td className={styles.tdDate}>
                    <div className={styles.rowDate}>
                      <Calendar className={styles.iconAccent} />
                      <span className={styles.dateText}>
                        {formatDisplay(row.date)}
                      </span>
                    </div>
                  </td>

                  {/* Coaches */}
                  <td className={styles.tdCoaches}>
                    <div className={styles.coachChips}>
                      {row.coachIds.map((cid) => {
                        const coach = coaches.find((c) => c.id === cid);
                        return (
                          <div key={cid} className={styles.coachChip}>
                            <span className={styles.coachChipText}>
                              {coach?.name || `ID ${cid}`}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateDay(row.date, [], [cid])
                              }
                              className={styles.removeCoachBtn}
                              title="Xóa coach khỏi ngày"
                            >
                              <X className={styles.iconTinyRed} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className={styles.tdActions}>
                    <button
                      onClick={() => removeDate(row.date)}
                      className={styles.removeDateBtn}
                    >
                      <Trash className={styles.iconSmall} />
                      Xóa ngày
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
