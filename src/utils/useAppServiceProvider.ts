import { AppServicesContext } from "@/providers/AppServicesProvider";
import { useContext } from "react";

// Hook for the application layer
export function useAppServices() {
  const service = useContext(AppServicesContext);

  if (!service) {
    throw new Error(
      "useAppServices must be used inside AppServicesProvider"
    );
  }

  return service;
}