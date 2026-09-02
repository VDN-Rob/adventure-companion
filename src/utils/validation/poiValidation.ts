import { isValidDateString } from "./dateValidation";

export type POIValidationErrors = {
    name?: string;
    type?: string;
    latitude?: string;
    longitude?: string;
    visitedAt?: string;
  };

type POIFields = {
    name: string;
    latitude: string;
    longitude: string;
    visitedAt: string;
  };
  
export function validatePOIFields(fields: POIFields): POIValidationErrors {
    const errors: POIValidationErrors = {};
  
    if (fields.name.trim() === "") {
      errors.name = "Give your POI a name before saving it.";
    }

    if (
      fields.visitedAt.trim() !== "" && !isValidDateString(fields.visitedAt.trim())
    ) {
      errors.visitedAt = "Please enter a valid visit date in the format YYYY-MM-DD.";
    }
  
  
    if (fields.latitude.trim() !== "") {
      const latitude = Number(fields.latitude);
  
      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        errors.latitude = "Latitude must be a number between -90 and 90";
      }
    }
  
    if (fields.longitude.trim() !== "") {
      const longitude = Number(fields.longitude);
  
      if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        errors.longitude = "Latitude must be a number between -90 and 90";
      }
    }
  
    return errors;
  }