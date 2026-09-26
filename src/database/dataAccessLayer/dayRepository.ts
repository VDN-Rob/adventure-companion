import { Day } from "@/models/Day";
import { SQLiteDatabase } from "expo-sqlite";

type DayRow = {
    id: string;
    trip_id: string;

    date: string;
    title: string | null;
    notes: string | null;

    planned_elevation: number | null;
    planned_distance: number | null;
};


/**
 * Provides SQLite persistence operations for trip days.
 */
export class DaysRepository {
    constructor(private db: SQLiteDatabase) {}
        

    /**
     * Returns the day belonging to a trip on the specified date.
     */
    async getDayByTripAndDate(tripId: string, date: string): Promise<Day | null> {
        const row = await this.db.getFirstAsync<DayRow>(
            "SELECT * FROM days WHERE date = ? AND trip_id = ?",
            date,
            tripId
        )
        
        return row ? this.mapRowToDay(row) : null;
    }


    /**
     * Determines whether a trip already has a day on the specified date.
     *
     * An optional day ID can be excluded when checking an existing day during
     * an update.
     */
    async hasDayOnDate( tripId: string, date: string, excludeDayId?: string ): Promise<boolean> {
        let query = `
            SELECT 1
            FROM days
            WHERE trip_id = ?
                AND date = ?
        `;
      
        const params: string[] = [tripId, date];
      
        if (excludeDayId) {
            query += ` AND id != ?`;
            params.push(excludeDayId);
        }
      
        query += ` LIMIT 1`;
      
        const row = await this.db.getFirstAsync<{ "1": number }>(
            query,
            ...params
        );
      
        return row !== null;
    }


    /**
     * Returns all days belonging to a trip that fall outside its date range.
     *
     * An open-ended trip uses a far-future date as its effective end date.
     */
    async getDaysOutsideTrip(tripId: string, startDate: string, endDate: string | null): Promise<Day[]> {
        const effectiveEndDate = endDate ?? "9999-12-31";
      
        const rows = await this.db.getAllAsync<DayRow>(
            `
                SELECT *
                FROM days
                WHERE trip_id = ?
                    AND (date < ? OR date > ?)
                ORDER BY date ASC
            `,
            tripId,
            startDate,
            effectiveEndDate
        );
      
        return rows.map(row => this.mapRowToDay(row));
    }


    /**
     * Returns all days belonging to a trip in chronological order.
     */
    async getAllDayForTrip(tripId: string): Promise<Day[]> {
        const rows = await this.db.getAllAsync<DayRow>(
            "SELECT * FROM days WHERE trip_id = ? ORDER BY date ASC",
            tripId
        );
        
        return rows.map(row => this.mapRowToDay(row));
    }


    /**
     * Returns a day by its ID.
     */
    async getDayById(id: string): Promise<Day | null> {
        const row = await this.db.getFirstAsync<DayRow>(
            "SELECT * FROM days WHERE id = ?",
            id
        );

        return row ? this.mapRowToDay(row) : null;
    }


    /**
     * Maps a SQLite row to the domain Day model.
     */
    private mapRowToDay(row: DayRow): Day {
        return {
            id: row.id,
            tripId: row.trip_id,
            date: row.date,
            title: row.title,
            notes: row.notes,
            plannedElevation: row.planned_elevation,
            plannedDistance: row.planned_distance,
        };
    }

    /**
     * Persists a new trip day.
     */
    async createDay(day: Day) {
        return this.db.runAsync(
            `INSERT INTO days (
                id,
                trip_id,
                date,
                title,
                notes,
                planned_elevation,
                planned_distance
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            day.id,
            day.tripId,
            day.date,
            day.title,
            day.notes,
            day.plannedElevation,
            day.plannedDistance
        );
    }

    /**
     * Updates an existing day
     */
    async updateDay(day: Day) {
        return this.db.runAsync(
            `UPDATE days
            SET date = ?,
                title = ?,
                notes = ?,
                planned_elevation = ?,
                planned_distance = ?
            WHERE id = ?`,
            day.date,
            day.title,
            day.notes,
            day.plannedElevation,
            day.plannedDistance,
            day.id
        );
    }

    /**
     * Deletes a trip day by ID.
     *
     * Related POIs and diary entries are removed by their database-level
     * foreign-key cascade.
     */
    async deleteDay(id: string) {
        return this.db.runAsync(
            "DELETE FROM days WHERE id = ?",
            id
        );
    }
    
}