import { ExchangeRateRepository } from "@/database/exchangeRateRepository";
import { ExchangeRate } from "@/models/ExchangeRate";

type FrankfurterRateResponse = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export class ExchangeRateService {
  constructor(
    private readonly exchangeRateRepository: ExchangeRateRepository
  ) {}

  async getRate(
    fromCurrency: string,
    toCurrency: string,
    date: string
  ): Promise<number | null> {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();

    if (from === to) {
      return 1;
    }

    const cachedRate =
      await this.exchangeRateRepository.getRate(
        date,
        from,
        to
      );

    if (cachedRate !== null) {
      return cachedRate.rate;
    }

    const result = await this.fetchHistoricalRate(
      from,
      to,
      date
    );

    if (result === null) {
      return null;
    }

    const exchangeRate: ExchangeRate = {
        id: crypto.randomUUID(),
        date,
        baseCurrency: from,
        targetCurrency: to,
        rateDate: result.date,
        rate: result.rate,
    };

    await this.exchangeRateRepository.saveRate(
      exchangeRate
    );

    return result.rate;
  }

  async convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    date: string
  ): Promise<number | null> {
    const rate = await this.getRate(
      fromCurrency,
      toCurrency,
      date
    );

    if (rate === null) {
      return null;
    }

    return amount * rate;
  }

  private async fetchHistoricalRate(
    fromCurrency: string,
    toCurrency: string,
    date: string
  ): Promise<FrankfurterRateResponse | null> {
    const startDate = this.getDateDaysAgo(date, 7);

    const url =
      `https://api.frankfurter.dev/v2/rates` +
      `?from=${startDate}` +
      `&to=${date}` +
      `&base=${fromCurrency}` +
      `&quotes=${toCurrency}` +
      `&providers=ecb`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const data =
        (await response.json()) as FrankfurterRateResponse[];

      const availableRates = data
        .filter((rate) => rate.date <= date)
        .sort((a, b) =>
          b.date.localeCompare(a.date)
        );

      return availableRates[0] ?? null;
    } catch {
      return null;
    }
  }

  private getDateDaysAgo(
    date: string,
    days: number
  ): string {
    const result = new Date(`${date}T00:00:00Z`);

    result.setUTCDate(
      result.getUTCDate() - days
    );

    return result.toISOString().slice(0, 10);
  }
}