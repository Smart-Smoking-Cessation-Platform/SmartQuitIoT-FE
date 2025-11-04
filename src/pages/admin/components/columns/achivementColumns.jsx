import ActionMenu from "@/components/ui/action-menu";
import { Badge } from "@/components/ui/badge";

export const achievementColumns = (handlers) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => row.name ?? "",
    cell: ({ getValue }) => {
      const name = getValue();
      return name ? (
        <span className="inline-flex items-center gap-1 text-gray-600 hover:underline">
          {name}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "typ",
    header: "Type",
    accessorFn: (row) => row.type ?? "",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={`px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700`}
        >
          {getValue() || "—"}
        </Badge>
      );
    },
  },
  {
    id: "description",
    header: "Description",
    accessorFn: (row) => row.description ?? "",
    cell: ({ getValue }) => {
      const description = getValue();
      return description ? (
        <span className="inline-flex items-center gap-1 text-gray-600 hover:underline">
          {description}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "icon",
    header: "Icon",
    accessorFn: (row) => row.icon ?? 0,
    cell: ({ getValue }) => (
      <img src={getValue()} alt="Achievement Icon" className="h-8 w-8" />
    ),
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
