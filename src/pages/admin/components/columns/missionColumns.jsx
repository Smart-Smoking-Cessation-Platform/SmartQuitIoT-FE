import ActionMenu from "@/components/ui/action-menu";
import { Badge } from "@/components/ui/badge";

export const missionsColumns = (handlers) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "code",
    header: "Code",
    accessorFn: (row) => row.code ?? "",
    cell: ({ getValue }) => {
      const code = getValue();
      return <span className="font-medium">{code}</span>;
    },
  },
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => row.name ?? "",
    cell: ({ getValue }) => {
      const name = getValue();
      return <span className="text-gray-600">{name}</span>;
    },
  },
  {
    id: "phase",
    header: "Phase",
    accessorFn: (row) => row.phase ?? "",
    cell: ({ getValue }) => {
      const phase = getValue();
      var className = "";
      if (phase === "PREPARATION") {
        className =
          "border border-blue-300 rounded-full px-4 text-sm text-blue-700 py-0.5";
      } else if (phase === "ONSET") {
        className =
          "border border-green-300 rounded-full px-4 text-sm text-green-700 py-0.5";
      } else if (phase === "PEAK_CRAVING") {
        className =
          "border border-gray-300 rounded-full px-4 text-sm text-gray-700 py-0.5";
      } else if (phase === "SUBSIDING") {
        className =
          "border border-purple-300 rounded-full px-4 text-sm text-purple-700 py-0.5";
      } else if (phase === "MAINTENANCE") {
        className =
          "border border-yellow-300 rounded-full px-4 text-sm text-yellow-700 py-0.5";
      }

      return <span className={className}>{phase}</span>;
    },
  },
  {
    id: "exp",
    header: "EXP",
    accessorFn: (row) => row.exp ?? "",
    cell: ({ getValue }) => {
      const exp = getValue();
      return <Badge>{exp}</Badge>;
    },
  },
  {
    id: "type",
    header: "Type",
    accessorFn: (row) => row.missionType?.name ?? "",
    cell: ({ getValue }) => {
      const type = getValue();
      return <span className="text-gray-600">{type}</span>;
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
