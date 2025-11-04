import AppBreadcrumb from "@/components/ui/app-breadcrumb";
import { DataTable } from "@/components/ui/tables/data-table";
import React, { useEffect, useState } from "react";
import { achievementColumns as buildAchievementColumns } from "@/pages/admin/components/columns/achivementColumns";
import useDebounce from "@/hooks/useDebounce";
import SearchBar from "@/components/ui/search-bar";
import { toast } from "sonner";
import { getAllAchievements } from "@/services/achievementService";
import TableLoadingSkeleton from "@/components/loadings/TableLoadingSkeleton";

const ManageAchievements = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [achievements, setAchievements] = useState([]);
  const inputSearchDebounce = useDebounce(searchString, 300);
  const [isLoading, setIsLoading] = useState(false);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

  const cols = buildAchievementColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAchievements(
        currentPage,
        pageSize,
        inputSearchDebounce
      );
      setTotalPages(response.data?.page?.totalPages);
      setTotalElements(response.data?.page?.totalElements);
      setAchievements(response.data?.content);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch achievements. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [currentPage, inputSearchDebounce]);

  if (isLoading) return <TableLoadingSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <AppBreadcrumb paths={["admin", "manage-achievements"]} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-800">
            Manage Achievements
          </h1>
          <p className="text-gray-600 mt-1 dark:text-gray-400">
            Manage and review achievements ({totalElements} achievements)
          </p>
        </div>
      </div>
      <SearchBar
        placeholderText={"Search achievements by name or description"}
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <DataTable
        columns={cols}
        data={achievements}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ManageAchievements;
