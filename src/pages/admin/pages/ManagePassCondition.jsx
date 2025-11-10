import AppBreadcrumb from "@/components/ui/app-breadcrumb";
import {
  getAllSystemPhaseConditions,
  updateSystemPhaseCondition,
} from "@/services/systemPhaseConditionService";
import React, { useEffect, useState } from "react";
import { passConditionColumns as buildPassConditionColumns } from "@/pages/admin/components/columns/passConditionColumns";
import { DataTable } from "@/components/ui/tables/data-table";
import TableLoadingSkeleton from "@/components/loadings/TableLoadingSkeleton";
import EditPassConditionModal from "@/pages/admin/components/modals/EditPassConditionModal";
import useToast from "@/hooks/useToast";

const ManagePassCondition = () => {
  const [passConditions, setPassConditions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { addToast } = useToast();

  const fetchPassConditions = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSystemPhaseConditions();
      setPassConditions(response.data);
    } catch (error) {
      console.log("Error fetching pass conditions:", error);
      addToast("Failed to fetch pass conditions", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassConditions();
  }, []);

  const handleEdit = (row) => {
    const values = row.original;
    setSelectedCondition(values);
    setIsEditModalOpen(true);
  };

  const handleSaveCondition = async (updatedCondition) => {
    console.log("=== START SAVE CONDITION ===");
    console.log("Updated Condition:", JSON.stringify(updatedCondition, null, 2));
    console.log("Condition ID:", updatedCondition.id);
    console.log("Condition Object to send:", {
      condition: updatedCondition.condition,
    });
    
    try {
      console.log("Calling API updateSystemPhaseCondition...");
      const response = await updateSystemPhaseCondition(updatedCondition.id, {
        condition: updatedCondition.condition,
      });
      console.log("API Response:", response);
      console.log("✅ Update successful");
      
      addToast("Pass condition updated successfully", "success");
      
      console.log("Refreshing pass conditions list...");
      fetchPassConditions(); // Refresh the list
    } catch (error) {
      console.error("❌ Error updating condition:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      addToast("Failed to update pass condition", "error");
      throw error;
    } finally {
      console.log("=== END SAVE CONDITION ===");
    }
  };

  const cols = buildPassConditionColumns({
    onEdit: handleEdit,
  });

  if (isLoading) return <TableLoadingSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <AppBreadcrumb paths={["admin", "manage-pass-conditions"]} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-emerald-800">
            Manage Pass Conditions
          </h1>
          <p className="text-gray-600 mt-1 dark:text-gray-400">
            Configure system phase pass conditions ({passConditions.length}{" "}
            conditions)
          </p>
        </div>
      </div>
      <DataTable columns={cols} data={passConditions} />

      <EditPassConditionModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCondition(null);
        }}
        condition={selectedCondition}
        onSave={handleSaveCondition}
      />
    </div>
  );
};

export default ManagePassCondition;
