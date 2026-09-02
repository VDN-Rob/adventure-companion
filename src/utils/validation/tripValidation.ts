import { isValidDateString } from "./dateValidation";

export type TripValidationErrors = {
    name?: string;
    startDate?: string;
    endDate?: string;
    budget?: string;
    budgetCurrency?: string;
  };

type TripFields = {
    name: string;
    startDate: string;
    endDate: string;
    budget: string;
    budgetCurrency: string;
  };
  
export function validateTripFields(fields: TripFields): TripValidationErrors {
    const errors: TripValidationErrors = {};
  
    if (fields.name.trim() === "") {
      errors.name = "Give your adventure a name before saving it.";
    }
  
    if (!isValidDateString(fields.startDate.trim())) {
      errors.startDate =
        "Please enter a valid start date in the format YYYY-MM-DD.";
    }
  
    if (
      fields.endDate.trim() !== "" &&
      !isValidDateString(fields.endDate.trim())
    ) {
      errors.endDate =
        "Please enter a valid end date in the format YYYY-MM-DD.";
    }
  
    if (
      isValidDateString(fields.startDate.trim()) &&
      fields.endDate.trim() !== "" &&
      isValidDateString(fields.endDate.trim()) &&
      fields.endDate.trim() < fields.startDate.trim()
    ) {
      errors.endDate = "The end date cannot be before the start date.";
    }
  
    if (fields.budget.trim() !== "") {
      const budget = Number(fields.budget);
  
      if (!Number.isFinite(budget) || budget <= 0) {
        errors.budget = "Budget must be a positive or zero number.";
      }
    }
  
    if (fields.budgetCurrency.trim() === "") {
      errors.budgetCurrency = "Please provide a budget currency.";
    }
  
    return errors;
  }