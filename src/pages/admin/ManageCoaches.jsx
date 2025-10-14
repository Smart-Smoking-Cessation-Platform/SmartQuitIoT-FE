import { coachesColumns as buildCoachesColumns } from "@/components/columns/coachesColumns";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import { DataTable } from "@/components/ui/tables/data-table";
import useDebounce from "@/hooks/useDebounce";
import { getAllPagedCoaches } from "@/services/coachService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ManageCoaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("ASC");
  const [searchString, setSearchString] = useState("");
  const inputSearchDebounce = useDebounce(searchString, 300);

  const fetchCoaches = async () => {
    try {
      const response = await getAllPagedCoaches(
        currentPage,
        pageSize,
        inputSearchDebounce,
        sortBy
      );
      setCoaches(response.data?.data?.content);
      setTotalPages(response.data?.data?.page?.totalPages);
      setTotalElements(response.data?.data?.page?.totalElements);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch coaches. Please try again.");
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [currentPage, inputSearchDebounce, sortBy]);

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

  const cols = buildCoachesColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-800">
            Manage Coaches
          </h1>
          <p className="text-gray-600 mt-1 dark:text-gray-400">
            Manage and review coaches ({totalElements} coaches)
          </p>
        </div>
        <div className="">
          <Button>Add Coach</Button>
        </div>
      </div>
      <SearchBar
        searchString={searchString}
        setSearchString={setSearchString}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <DataTable
        columns={cols}
        data={coaches}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ManageCoaches;
