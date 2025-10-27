// src/pages/coach/CoachPage.jsx
import React from "react";

const CoachPage = () => {
  // tạm mock data; replace by API later
  const stats = [
    { title: "Appointments today", value: 5 },
    { title: "Pending requests", value: 2 },
    { title: "Completed this week", value: 12 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.title} className="p-4 bg-card rounded-md border">
            <div className="text-sm text-muted-foreground">{s.title}</div>
            <div className="text-2xl font-semibold mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card rounded-md border">
          <h3 className="font-medium mb-2">Upcoming appointments</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>10:00 — Nguyễn Văn A — Member A</li>
            <li>11:30 — Trần Thị B — Member B</li>
            <li>14:00 — Phạm C — Member C</li>
          </ul>
        </div>

        <div className="p-4 bg-card rounded-md border">
          <h3 className="font-medium mb-2">Quick actions</h3>
          <div className="flex flex-col gap-2">
            <button className="btn">Open today schedule</button>
            <button className="btn">View appointment requests</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoachPage;
