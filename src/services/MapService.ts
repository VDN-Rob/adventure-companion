import { DaysRepository } from "@/database/dayRepository";
import { TripsRepository } from "@/database/tripRepository";


export class MapServices {
    constructor (
        private tripsRepository: TripsRepository,
        private daysRepository: DaysRepository
    ) {}

    // Queries
    getDownloadableRegions() {}
    
    getDownloadedRegions() {}

    // Scripts
    downloadRegion() {}
    
    deleteRegion() {}
}