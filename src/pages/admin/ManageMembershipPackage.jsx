import { membershipPackageColumns as buildMembershipPackageColumns } from "@/components/columns/membershipPackageColumns";
import { DataTable } from "@/components/ui/tables/data-table";
import { getAllMembershipPackages } from "@/services/membershipPackage";
import { useEffect, useState } from "react";

const ManageMembershipPackage = () => {
  const [packages, setPackages] = useState([]);

  const fetchMembershipPackages = async () => {
    try {
      const response = await getAllMembershipPackages();
      console.log(response.data?.data);
      setPackages(response.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch membership packages. Please try again.");
    }
  };

  const handleEdit = (row) => {
    const values = row.original; // your row data
    // open edit modal, navigate, etc.
    console.log("Edit:", values);
  };

  const handleDelete = (row) => {
    const { id } = row.original;
    // call API then refresh table
    console.log("Delete id:", id);
  };

  const cols = buildMembershipPackageColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  useEffect(() => {
    fetchMembershipPackages();
  }, []);
  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-800">
              Manage Membership Packages
            </h1>
            <p className="text-gray-600 mt-1 dark:text-gray-400">
              Manage and review membership packages ({packages.length} packages)
            </p>
          </div>
        </div>
        {/* Table component goes here, using `cols` and `packages` as data */}
        <DataTable columns={cols} data={packages} />
      </div>
    </div>
  );
};

export default ManageMembershipPackage;
