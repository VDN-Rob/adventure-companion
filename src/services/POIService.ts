import { PoisRepository } from "@/database/poiRepository";
import { POI } from "@/models/POI";
import { ServiceResult } from "@/types/serviceResult";
import { validatePOIFields } from "@/utils/validation/poiValidation";

export class POIServices {
    constructor(
      private poisRepository: PoisRepository
    ) {}
  
    // Queries
    async getPOI(poiId: string) {
      return this.poisRepository.getPOIById(poiId);
    }
  
    async getPOIsForDay(dayId: string) {
      return this.poisRepository.getAllPOIsForDay(dayId);
    }
  
    // Scripts
    async createPOI(poi: POI): Promise<ServiceResult> {
      const errors = validatePOIFields({
        name: poi.name,
        latitude: poi.latitude === null ? "" : String(poi.latitude),
        longitude: poi.longitude === null ? "" : String(poi.longitude),
        visitedAt: poi.visitedAt ?? ""
      })

      if (Object.keys(errors).length > 0) {
        return {
          success: false,
          errors,
        };
      }

      await this.poisRepository.createPOI(poi);

      return {
        success: true,
      }
    }

    async updatePOI(updatedPOI: POI): Promise<ServiceResult> {
      const errors = validatePOIFields({
        name: updatedPOI.name,
        latitude: updatedPOI.latitude === null ? "" : String(updatedPOI.latitude),
        longitude: updatedPOI.longitude === null ? "" : String(updatedPOI.longitude),
        visitedAt: updatedPOI.visitedAt ?? ""
      })

      if (Object.keys(errors).length > 0) {
        return {
          success: false,
          errors,
        };
      }

      await this.poisRepository.updatePOI(updatedPOI);

      return {
        success: true,
      }
    }

    async deletePOI(poiId: string) {
      return this.poisRepository.deletePOI(poiId);
    }
  }