import ActionMenu from "@/components/ui/action-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Monitor, User, UserCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export const memberColumns = (handlers) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "member",
    header: "Member",
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

      if (g === "MALE") {
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <User className="w-4 h-4 text-blue-700" />
            </div>
          </div>
        );
      }

      if (g === "FEMALE") {
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100">
              <User className="w-4 h-4 text-pink-700" />
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <UserCircle className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-sm text-gray-500">—</span>
        </div>
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
    id: "accountType",
    header: "Type",
    accessorFn: (row) => row?.account?.accountType ?? "",
    cell: ({ getValue }) => {
      const accountType = getValue();
      switch (accountType) {
        case "SYSTEM":
          return <Monitor className="w-4 h-4 text-gray-500" />;
        case "GOOGLE":
          return <FcGoogle className="w-4 h-4 text-gray-500" />;
        case "FACEBOOK":
          return <Badge variant="primary">Facebook</Badge>;
        default:
          return <span className="text-muted-foreground">—</span>;
      }
    },
  },
  {
    id: "createdAt",
    header: "Created At",
    accessorFn: (row) => row?.account?.createdAt ?? "",
    cell: ({ getValue }) => {
      const createdAt = getValue();
      return (
        <Badge>
          {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
        </Badge>
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
