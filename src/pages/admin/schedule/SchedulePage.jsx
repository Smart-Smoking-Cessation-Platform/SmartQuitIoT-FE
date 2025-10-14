import React, { useEffect, useMemo, useState } from "react";
import styles from "../../../styles/SchedulePage.module.css";
import {
  getAllCoaches,
  assignSchedules,
  getMonthlySchedules,
  updateScheduleByDate,
} from "../../../services/scheduleService";
import useToast from "../../../hooks/useToast";
import useConfirm from "../../../hooks/useConfirm";
import CalendarSection from "./CalendarSection";
import CoachSelector from "./CoachSelector";
import MasterScheduleTable from "./MasterScheduleTable";

export default function SchedulePage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDates, setSelectedDates] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [coachSearch, setCoachSearch] = useState("");
  const [selectedCoachIds, setSelectedCoachIds] = useState([]);
  const [masterSchedule, setMasterSchedule] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const toast = useToast();
  const confirm = useConfirm();

  const visibleCoaches = useMemo(() => {
    const q = coachSearch.trim().toLowerCase();
    return q
      ? coaches.filter((c) => c.name.toLowerCase().includes(q))
      : coaches;
  }, [coaches, coachSearch]);

  /* -------- FETCH COACHES -------- */
  useEffect(() => {
    const fetchCoaches = async () => {
      setLoadingCoaches(true);
      try {
        const res = await getAllCoaches();
        if (res?.data?.success) {
          const data = res.data.data || [];
          setCoaches(
            data.map((c) => ({
              id: c.id,
              name:
                `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
                `Coach ${c.id}`,
              avatar:
                c.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  `${c.firstName || ""} ${c.lastName || ""}`
                )}&background=random`,
            }))
          );
        } else toast.error("Không load được danh sách coach.");
      } catch {
        toast.error("Không thể kết nối server để lấy danh sách coach.");
      } finally {
        setLoadingCoaches(false);
      }
    };
    fetchCoaches();
  }, [toast]);

  /* -------- FETCH SCHEDULE -------- */
  const fetchSchedules = async () => {
    setLoadingSchedule(true);
    try {
      const res = await getMonthlySchedules(year, month);
      if (res?.data?.success) {
        const data = (res.data.data || []).map((d) => ({
          date: d.date,
          coachIds: d.coachIds || d.coaches?.map((c) => c.id) || [],
        }));
        setMasterSchedule(data);
      } else toast.error("Không thể lấy lịch làm việc tháng này.");
    } catch {
      toast.error("Lỗi khi lấy lịch từ server.");
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [year, month]);

  /* -------- LOGIC -------- */
  const toggleDate = (y, m, d) => {
    const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;
    setSelectedDates((prev) =>
      prev.includes(iso) ? prev.filter((x) => x !== iso) : [...prev, iso].sort()
    );
  };
  const clearSelectedDates = () => setSelectedDates([]);
  const toggleCoach = (id) =>
    setSelectedCoachIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const selectAllVisible = () =>
    setSelectedCoachIds(visibleCoaches.map((c) => c.id));
  const clearCoaches = () => setSelectedCoachIds([]);

  const handleAssign = async () => {
    if (!selectedDates.length || !selectedCoachIds.length)
      return toast.error("Chọn ngày và coach trước khi gán.");

    const ok = await confirm({
      title: "Xác nhận gán lịch",
      message: `Gán ${selectedCoachIds.length} coach cho ${selectedDates.length} ngày?`,
      okText: "Gán",
    });
    if (!ok) return;

    setAssigning(true);
    try {
      const res = await assignSchedules({
        dates: selectedDates,
        coachIds: selectedCoachIds,
      });
      if (res?.data?.success) {
        toast.success("Gán lịch thành công!");
        await fetchSchedules();
        setSelectedDates([]);
        setSelectedCoachIds([]);
      } else toast.error("Gán lịch thất bại.");
    } catch {
      toast.error("Lỗi khi gửi yêu cầu gán lịch.");
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateDay = async (
    date,
    addCoachIds = [],
    removeCoachIds = []
  ) => {
    const ok = await confirm({
      title: "Cập nhật lịch",
      message: `Cập nhật lịch ngày ${date}?`,
      okText: "Cập nhật",
    });
    if (!ok) return;

    try {
      const res = await updateScheduleByDate(date, {
        addCoachIds,
        removeCoachIds,
      });
      if (res?.data?.success) {
        toast.success("Đã cập nhật lịch!");
        await fetchSchedules();
      } else toast.error("Cập nhật thất bại.");
    } catch {
      toast.error("Lỗi kết nối server khi cập nhật.");
    }
  };

  const removeDate = async (date) => {
    setMasterSchedule((prev) => prev.filter((r) => r.date !== date));
  };

  /* -------- RENDER -------- */
  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <div className={styles.colLeft}>
          <CalendarSection
            year={year}
            month={month}
            setYear={setYear}
            setMonth={setMonth}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            toggleDate={toggleDate}
            clearSelectedDates={clearSelectedDates}
            masterSchedule={masterSchedule}
          />
        </div>

        <div className={styles.colRight}>
          <CoachSelector
            coaches={coaches}
            visibleCoaches={visibleCoaches}
            loadingCoaches={loadingCoaches}
            coachSearch={coachSearch}
            setCoachSearch={setCoachSearch}
            selectedCoachIds={selectedCoachIds}
            toggleCoach={toggleCoach}
            selectAllVisible={selectAllVisible}
            clearCoaches={clearCoaches}
            assigning={assigning}
            handleAssign={handleAssign}
            selectedDates={selectedDates}
          />
        </div>
      </div>

      <MasterScheduleTable
        masterSchedule={masterSchedule}
        coaches={coaches}
        handleUpdateDay={handleUpdateDay}
        removeDate={removeDate}
        loadingSchedule={loadingSchedule}
        selectedMonth={month}
        setSelectedMonth={setMonth}
        selectedYear={year}
        setSelectedYear={setYear}
      />
    </div>
  );
}
