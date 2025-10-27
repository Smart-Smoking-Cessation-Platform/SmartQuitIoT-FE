import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../styles/CoachSchedulePage.module.css";

/**
 * Minimal calendar for Coach:
 * - show month view
 * - working day (green) vs off day (muted)
 * - default working hours 07:00 - 15:00 when day is working
 *
 * This version hides days from other months (renders empty cells).
 */

const ISO = (d) => d.toISOString().slice(0, 10);

// get first day shown on calendar (start from Sunday)
const monthGridStart = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
  return start;
};

const buildMonthGrid = (year, month) => {
  const start = monthGridStart(year, month);
  const grid = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    grid.push(d);
  }
  return grid;
};

const defaultWorkingForDate = (date) => {
  // default: Mon-Fri working, Sat/Sun off
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

const CoachSchedulePage = () => {
  const today = new Date();
  const todayIso = ISO(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // schedule: map iso -> { working: bool, start: "07:00", end: "15:00" }
  const [schedule, setSchedule] = useState(() => {
    const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const map = {};
    const grid = buildMonthGrid(start.getFullYear(), start.getMonth());
    grid.forEach((d) => {
      const iso = ISO(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
      map[iso] = {
        working: defaultWorkingForDate(d),
        start: "07:00",
        end: "15:00",
      };
    });
    return map;
  });

  // regenerate grid when viewDate changes (and ensure schedule contains those days)
  const monthGrid = useMemo(() => {
    const grid = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth());
    setSchedule((prev) => {
      const copy = { ...prev };
      grid.forEach((d) => {
        const iso = ISO(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
        if (!copy[iso]) {
          copy[iso] = {
            working: defaultWorkingForDate(d),
            start: "07:00",
            end: "15:00",
          };
        }
      });
      return copy;
    });
    return grid;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewDate]);

  const goPrev = () => {
    const n = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    setViewDate(n);
  };
  const goNext = () => {
    const n = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    setViewDate(n);
  };

  const toggleDay = (d) => {
    const iso = ISO(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    setSchedule((prev) => {
      const copy = { ...prev };
      const cur = copy[iso] || { working: false, start: "07:00", end: "15:00" };
      copy[iso] = {
        ...cur,
        working: !cur.working,
        start: cur.start || "07:00",
        end: cur.end || "15:00",
      };
      return copy;
    });
  };

  const isCurrentMonth = (d) => d.getMonth() === viewDate.getMonth();

  const monthLabel = `${viewDate.toLocaleString("vi-VN", {
    month: "long",
  })} ${viewDate.getFullYear()}`;

  // placeholder save
  const mockSaveSchedule = () => {
    const payload = {};
    Object.keys(schedule).forEach((iso) => {
      const info = schedule[iso];
      const dt = new Date(iso);
      if (dt.getMonth() === viewDate.getMonth()) {
        payload[iso] = info;
      }
    });
    console.log("payload to save:", payload);
    alert("Đã mock save. Check console (payload). Khi có API bạn gọi ở đây.");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Lịch làm việc (Calendar)</h1>
          <p className={styles.subtitle}>
            Click ngày để bật/tắt ngày làm. Mặc định giờ làm:{" "}
            <strong>07:00 - 15:00</strong>.
          </p>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.iconBtn}
            onClick={goPrev}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </button>
          <div className={styles.monthLabel}>{monthLabel}</div>
          <button
            className={styles.iconBtn}
            onClick={goNext}
            aria-label="Next month"
          >
            <ChevronRight />
          </button>
          <button className={styles.saveBtn} onClick={mockSaveSchedule}>
            Lưu
          </button>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekHead}>
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((w) => (
            <div key={w} className={styles.weekHeadItem}>
              {w}
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {monthGrid.map((d) => {
            const iso = ISO(
              new Date(d.getFullYear(), d.getMonth(), d.getDate())
            );
            const info = schedule[iso] || {
              working: defaultWorkingForDate(d),
              start: "07:00",
              end: "15:00",
            };
            const working = info.working;
            const outside = !isCurrentMonth(d);
            const isToday = iso === todayIso;

            // nếu là ngày của tháng khác → render ô trống (không hiển thị ngày/label)
            if (outside) {
              return (
                <div
                  key={iso}
                  className={`${styles.day} ${styles.outside} ${styles.dayEmpty}`}
                  aria-hidden="true"
                >
                  <div className={styles.dayTop} />
                  <div className={styles.dayBottom} />
                </div>
              );
            }

            return (
              <button
                key={iso}
                onClick={() => toggleDay(d)}
                className={`${styles.day} ${
                  working ? styles.working : styles.off
                } ${isToday ? styles.today : ""}`}
                aria-pressed={working}
                aria-label={`${d.toLocaleDateString()} ${
                  working ? "Làm (07:00-15:00)" : "Nghỉ"
                }`}
                aria-current={isToday ? "date" : undefined}
              >
                <div className={styles.dayTop}>
                  <span className={styles.dayNum}>{d.getDate()}</span>
                  {working && (
                    <span className={styles.badge}>
                      {info.start} - {info.end}
                    </span>
                  )}
                </div>

                <div className={styles.dayBottom}>
                  {working ? (
                    <div className={styles.dot} />
                  ) : (
                    <div className={styles.offLabel}>OFF</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatchWorking} /> Ngày làm (07:00 -
          15:00)
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatchOff} /> Ngày nghỉ
        </div>
      </div>
    </div>
  );
};

export default CoachSchedulePage;
