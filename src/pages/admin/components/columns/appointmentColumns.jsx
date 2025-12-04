import ActionMenu from "@/components/ui/action-menu";
import { useNavigate } from "react-router-dom";

export const appointmentColumns = (handlers) => [
  {
    accessorKey: "appointmentId",
    header: "ID",
  },
  {
    accessorKey: "coachName",
    header: "Coach Name",
    accessorFn: (row) => row.coachName ?? "",
    cell: ({ row, getValue }) => {
      const name = getValue();
      const nav = useNavigate();
      return (
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => nav(`/admin/manage-coaches/${row.original.coachId}`)}
        >
          <span className="font-medium">{name || "—"}</span>
          <span className="text-xs text-muted-foreground">
            Coach ID: {row.original.coachId}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "memberName",
    header: "Member Name",
    accessorFn: (row) => row.memberName ?? "",
    cell: ({ row, getValue }) => {
      const name = getValue();
      const nav = useNavigate();
      return (
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => nav(`/admin/manage-members/${row.original.memberId}`)}
        >
          <span className="font-medium">{name || "—"}</span>
          <span className="text-xs text-muted-foreground">
            Member ID: {row.original.memberId}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "endTime",
    header: "End Time",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        onEdit={handlers?.onEdit}
        editMessage="View Detail"
      />
    ),
    size: 48, // optional
    enableHiding: false,
  },
];
