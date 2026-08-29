import { DiaryEntry } from "@/models/DiaryEntry";
import { SQLiteDatabase } from "expo-sqlite";

type DiaryEntryRow = {
    id: string;
    day_id: string;
    title: string;
    text: string | null;
    photo_one: string | null;
    photo_two: string | null;
    photo_three: string | null;
    created_at: string;
    updated_at: string;
  };

export class DiaryEntriesRepository {
    constructor(private db: SQLiteDatabase) {}
    
    async getDiaryEntriesForTrip(tripId: string) {
        const rows = await this.db.getAllAsync<DiaryEntryRow>(
            `SELECT diary_entries.*
                FROM diary_entries
                JOIN days ON diary_entries.day_id = days.id
                WHERE days.trip_id = ?
                ORDER BY days.date ASC;
                `,
            tripId
        );

        return rows.map(row => this.mapRowToDiaryEntry(row));
    }

    async getDiaryEntryForDay(dayId: string) {
        const rows = await this.db.getAllAsync<DiaryEntryRow>(
            "SELECT * FROM diary_entries WHERE day_id = ? ORDER BY date DESC",
            dayId
        );
        
        return rows.map(row => this.mapRowToDiaryEntry(row));
    }

    async getDiaryEntryById(id: string) {
        const row = await this.db.getFirstAsync<DiaryEntryRow>(
            "SELECT * FROM diary_entries WHERE id = ?",
            id
        );

        if (!row) return null;

        return this.mapRowToDiaryEntry(row);
    }

    // Small helper function to map database to react
    private mapRowToDiaryEntry(row: DiaryEntryRow): DiaryEntry {
        return {
            id: row.id,
            dayId: row.day_id,

            title: row.title,
            text: row.text,

            photo1: row.photo_one,
            photo2: row.photo_two,
            photo3: row.photo_three,

            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async createDiaryEntry(entry: DiaryEntry) {
        return this.db.runAsync(
            `INSERT INTO diary_entries (id, day_id, title, text, photo_one, photo_two, photo_three, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            entry.id,
            entry.dayId,

            entry.title,
            entry.text,

            entry.photo1,
            entry.photo2,
            entry.photo3,

            entry.createdAt,
            entry.updatedAt
        );
    }

    async updateDiaryEntry(entry: DiaryEntry) {
        return this.db.runAsync(
            `UPDATE diary_entries
            SET title = ?, text = ?, photo_one = ?, photo_two = ?, photo_three = ?, updated_at = ?
            WHERE id = ?`,
            entry.title,
            entry.text,

            entry.photo1,
            entry.photo2,
            entry.photo3,

            entry.updatedAt,

            entry.id
        );
    }

    async deleteDiaryEntry(id: string) {
        return this.db.runAsync(
            "DELETE FROM diary_entries WHERE id = ?",
            id
        );
    }
    
}