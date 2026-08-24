import { PoisRepository } from "@/database/poiRepository";
import { POI } from "@/models/POI";

export class POIServices {
    constructor(
      private poisRepository: PoisRepository
    ) {}
  
    async getPOI(poiId: string) {
      return this.poisRepository.getPOIById(poiId);
    }
  
    async getPOIsForDay(dayId: string) {
      return this.poisRepository.getAllPOIsForDay(dayId);
    }
  
    async createPOI(poi: POI) {
        await this.poisRepository.createPOI(poi);
    }

    async updatePOI(updatedPOI: POI) {
        await this.poisRepository.updatePOI(updatedPOI);
    }

    async deletePOI(poiId: string) {
      return this.poisRepository.deletePOI(poiId);
    }
  }