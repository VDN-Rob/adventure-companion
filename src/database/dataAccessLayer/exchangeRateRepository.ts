import { SQLiteDatabase } from "expo-sqlite";

import { ExchangeRate } from "@/models/ExchangeRate";

type ExchangeRateRow = {
	id: string;
	date: string;

	base_currency: string;
	target_currency: string;

	rate_date: string;
	rate: number;
};

/**
 * Provides SQLite persistence operations for exchange rates.
 */
export class ExchangeRateRepository {
	constructor(private readonly db: SQLiteDatabase) {}


	/**
	 * Returns the exchange rate stored for a specific date and currency pair.
	 */
	async getRate(date: string, baseCurrency: string, targetCurrency: string): Promise<ExchangeRate | null> {
		const row = await this.db.getFirstAsync<ExchangeRateRow>(
			`
				SELECT *
				FROM exchange_rates
				WHERE date = ?
					AND base_currency = ?
					AND target_currency = ?
			`,
			date,
			baseCurrency,
			targetCurrency
		);

		return row ? this.mapRowToExchangeRate(row) : null;
	}


	/**
	 * Persists an exchange rate.
	 *
	 * The database uniqueness constraint ensures that a currency pair can only
	 * have one stored rate for a given date.
	 */
	async saveRate(
		exchangeRate: ExchangeRate
	): Promise<void> {
		await this.db.runAsync(
			`
				INSERT OR REPLACE INTO exchange_rates (
					id,
					date,
					base_currency,
					target_currency,
					rate_date,
					rate
				)
				VALUES (?, ?, ?, ?, ?, ?)
			`,
			exchangeRate.id,
			exchangeRate.date,
			exchangeRate.baseCurrency,
			exchangeRate.targetCurrency,
			exchangeRate.rateDate,
			exchangeRate.rate
		);
	}

	/**
	 * Maps a SQLite row to the domain ExchangeRate model.
	 */
	private mapRowToExchangeRate(row: ExchangeRateRow): ExchangeRate {
		return {
			id: row.id,
			date: row.date,
			baseCurrency: row.base_currency,
			targetCurrency: row.target_currency,
			rateDate: row.rate_date,
			rate: row.rate,
		};
	}
}