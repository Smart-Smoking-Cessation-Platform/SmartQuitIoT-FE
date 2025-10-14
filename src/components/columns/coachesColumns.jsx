import ActionMenu from "@/components/ui/action-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const coachesColumns = (handlers) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "coach",
    header: "Coach",
    accessorFn: (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
    cell: ({ row, getValue }) => {
      const name = getValue();
      const avatar = row.original.avatarUrl;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{name || "—"}</span>
            <span className="text-xs text-muted-foreground">
              ID: {row.original.id}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "gender",
    header: "Gender",
    accessorFn: (row) => row.gender ?? "",
    cell: ({ getValue }) => {
      const g = (getValue() || "").toString().toUpperCase();
      const style =
        g === "MALE"
          ? "bg-blue-100 text-blue-700"
          : g === "FEMALE"
          ? "bg-pink-100 text-pink-700"
          : "bg-gray-100 text-gray-700";
      return (
        <Badge className={`px-2 py-0.5 text-xs font-medium ${style}`}>
          {g || "—"}
        </Badge>
      );
    },
  },
  {
    id: "email",
    header: "Email",
    accessorFn: (row) => row?.account?.email ?? "",
    cell: ({ getValue }) => {
      const email = getValue();
      return email ? (
        <span className="inline-flex items-center gap-1 text-gray-600 hover:underline">
          {email}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "username",
    header: "Username",
    accessorFn: (row) => row?.account?.username ?? "",
  },

  // Role (nested)
  {
    id: "role",
    header: "Role",
    accessorFn: (row) => row?.account?.role ?? "",
    cell: ({ getValue }) => {
      const role = getValue();
      return (
        <Badge variant="secondary" className="uppercase">
          {role || "—"}
        </Badge>
      );
    },
  },
  {
    id: "experience",
    header: "Experience",
    accessorFn: (row) => row.experienceYears ?? 0,
    cell: ({ getValue }) => <span>{getValue()} yrs</span>,
  },

  // Rating (avg + count)
  {
    id: "rating",
    header: "Rating",
    accessorFn: (row) => ({
      avg: row.ratingAvg ?? 0,
      count: row.ratingCount ?? 0,
    }),
    cell: ({ getValue }) => {
      const { avg, count } = getValue();
      return (
        <span className="tabular-nums">
          {avg?.toFixed?.(1) ?? "0.0"}{" "}
          <span className="text-muted-foreground">({count})</span>
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ActionMenu
        row={row}
        onEdit={handlers?.onEdit}
        onDelete={handlers?.onDelete}
      />
    ),
    size: 48, // optional
    enableHiding: false,
  },
];
