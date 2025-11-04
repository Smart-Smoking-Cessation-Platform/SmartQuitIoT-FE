import AppBreadcrumb from "@/components/ui/app-breadcrumb";
import { getAllMission } from "@/services/missionService";
import { CloudLightning } from "lucide-react";
import React, { useEffect, useState } from "react";
import { missionsColumns as buildMissionColumns } from "@/pages/admin/components/columns/missionColumns";
import { DataTable } from "@/components/ui/tables/data-table";

const ManageMissions = () => {
  const [missions, setMissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchMissions = async (page, size) => {
    try {
      const response = await getAllMission(page, size);
      setMissions(response.data?.content);
      setTotalPages(response.data?.page?.totalPages);
      setTotalElements(response.data?.page?.totalElements);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMissions(currentPage, pageSize);
  }, [currentPage, pageSize]);

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

  const cols = buildMissionColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 space-y-6">
      <AppBreadcrumb paths={["admin", "manage-missions"]} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-800">
            Manage Missions
          </h1>
          <p className="text-gray-600 mt-1 dark:text-gray-400">
            Manage and review missions ({totalElements} missions)
          </p>
        </div>
      </div>
      <DataTable
        columns={cols}
        data={missions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ManageMissions;
