import { useContext } from "react";
import ConfirmContext from "../components/ui/confirmContext";

export default function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx;
}
