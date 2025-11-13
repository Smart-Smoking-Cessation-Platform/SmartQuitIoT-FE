// src/pages/coach/AppointmentDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Video, XCircle, Loader2 } from "lucide-react";
import api from "@/api/appointments";
import styles from "../../styles/AppointmentDetailsModal.module.css";

/**
 * Props:
 * - open (bool)
 * - onClose()
 * - appointmentBrief: { id, date, time, member, raw } (optional)
 * - onCanceled(appointmentId)
 */
export default function AppointmentDetailsModal({
  open,
  onClose,
  appointmentBrief,
  onCanceled,
}) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [doingStart, setDoingStart] = useState(false);
  const [doingCancel, setDoingCancel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!appointmentBrief?.id) {
          throw new Error("No appointment id provided");
        }
        const resp = await api.getAppointmentDetailForCoach(
          appointmentBrief.id
        );
        // If your api returns GlobalResponse, unwrap accordingly:
        // const dto = resp?.data?.data ?? resp?.data ?? resp;
        const dto = resp?.data?.data ?? resp?.data ?? resp;
        if (!mounted) return;
        setDetail(dto);
      } catch (e) {
        console.error("detail fetch error", e);
        if (!mounted) return;
        setError(e.message || "Failed to load appointment detail");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (appointmentBrief?.raw && appointmentBrief.raw.memberName) {
      setDetail(appointmentBrief.raw);
      fetchDetail(); // optional: fetch fresh
    } else {
      fetchDetail();
    }
    return () => {
      mounted = false;
    };
  }, [open, appointmentBrief]);

  if (!open) return null;

  const startMeeting = async () => {
    if (!detail || !detail.appointmentId) return;
    setDoingStart(true);
    try {
      const resp = await api.requestJoinToken(detail.appointmentId);
      const tokenData = resp?.data ?? resp; // unwrap if needed
      navigate(`/meeting/${detail.appointmentId}`, {
        state: { tokenData, appointment: detail },
      });
    } catch (e) {
      console.error("request join token error", e);
      setError(e?.message || "Unable to obtain join token");
    } finally {
      setDoingStart(false);
    }
  };

  const cancelAppointment = async () => {
    if (!detail || !detail.appointmentId) return;
    if (!window.confirm("Confirm cancel appointment?")) return;
    setDoingCancel(true);
    try {
      await api.cancelAppointmentByCoach(detail.appointmentId);
      if (onCanceled) onCanceled(detail.appointmentId);
      onClose();
    } catch (e) {
      console.error("cancel error", e);
      setError(e?.message || "Cancel failed");
    } finally {
      setDoingCancel(false);
    }
  };

  const renderBody = () => {
    if (loading)
      return (
        <div style={{ padding: 20 }}>
          Loading... <Loader2 className="w-4 h-4 inline" />
        </div>
      );
    if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
    if (!detail) return <div style={{ padding: 20 }}>No detail</div>;

    const normalizeTime = (t) => (t ? String(t).slice(0, 5) : "-");
    const start = normalizeTime(detail.startTime);
    const end = normalizeTime(detail.endTime);
    return (
      <div className={styles.detailInner}>
        <h3>Appointment #{detail.appointmentId}</h3>

        <div className={styles.row}>
          <Calendar /> <strong>Date:</strong> <span>{detail.date}</span>
        </div>
        <div className={styles.row}>
          <Clock /> <strong>Time:</strong>{" "}
          <span>
            {start} - {end}
          </span>
        </div>
        <div className={styles.row}>
          <User /> <strong>Member:</strong>{" "}
          <span>{detail.memberName || detail.member || "N/A"}</span>
        </div>
        <div className={styles.row}>
          <strong>Channel:</strong> <span>{detail.channelName}</span>
        </div>
        <div className={styles.row}>
          <strong>Runtime status:</strong> <span>{detail.runtimeStatus}</span>
        </div>

        {detail.joinWindowStart && detail.joinWindowEnd && (
          <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
            Join window: {new Date(detail.joinWindowStart).toLocaleString()} —{" "}
            {new Date(detail.joinWindowEnd).toLocaleString()}
          </div>
        )}

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          {/* <button
            disabled={doingStart}
            onClick={startMeeting}
            className={styles.btnPrimary}
          >
            {doingStart ? (
              "Starting..."
            ) : (
              <>
                {" "}
                <Video className="inline w-4 h-4" /> Start
              </>
            )}
          </button> */}

          <button
            disabled={doingCancel}
            onClick={cancelAppointment}
            className={styles.btnDanger}
          >
            {doingCancel ? (
              "Canceling..."
            ) : (
              <>
                {" "}
                <XCircle className="inline w-4 h-4" /> Cancel
              </>
            )}
          </button>

          <button onClick={onClose} className={styles.btnGhost}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>{renderBody()}</div>
    </div>
  );
}
