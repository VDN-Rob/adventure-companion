import { isValidDateString } from "./dateValidation";

export type DayValidationErrors = {
    date?: string;
    title?: string;
    plannedElevation?: string;
    plannedDistance?: string;
};

type DayFields = {
    date: string;
    title: string;
    plannedElevation: string;
    plannedDistance: string;
}

export function validateDayFields(fields: DayFields): DayValidationErrors {
    const errors: DayValidationErrors = {};

    if (!isValidDateString(fields.date.trim())) {
        errors.date = "Please enter a valid date in the format YYYY-MM-DD.";
    }


    if (fields.plannedElevation.trim() !== "") {
        const elevation = Number(fields.plannedElevation);

        if (!Number.isFinite(elevation) || elevation <= 0) {
            errors.plannedElevation = "Elevation must be a positive or zero number.";
        }
    }


    if (fields.plannedDistance.trim() !== "") {
        const distance = Number(fields.plannedDistance);

        if (!Number.isFinite(distance) || distance <= 0) {
            errors.plannedDistance = "Distance must be a positive or zero number.";
        }
    }

    return errors;
}