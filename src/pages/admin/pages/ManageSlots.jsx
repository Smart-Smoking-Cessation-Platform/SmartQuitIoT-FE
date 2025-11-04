import { slotColumns as buildSlotsColumns } from "@/pages/admin/components/columns/slotColumns";
import AppBreadcrumb from "@/components/ui/app-breadcrumb";
import { DataTable } from "@/components/ui/tables/data-table";
import { getAllSlots } from "@/services/slotService";
import { useEffect, useState } from "react";

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchSlots = async () => {
    try {
      const response = await getAllSlots(currentPage, pageSize);
      setSlots(response.data?.data?.content);
      setTotalPages(response.data?.data?.page?.totalPages);
      setTotalElements(response.data?.data?.page?.totalElements);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch slots. Please try again.");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [currentPage, pageSize]);

  const cols = buildSlotsColumns({});

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div className="p-6 space-y-6">
        <AppBreadcrumb paths={["admin", "manage-slots"]} />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-800">
              Manage Slots
            </h1>
            <p className="text-gray-600 mt-1 dark:text-gray-400">
              Manage and review slots ({totalElements} slots)
            </p>
          </div>
        </div>

        <DataTable
          columns={cols}
          data={slots}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ManageSlots;
