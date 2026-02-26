import { KPIF_FALLBACK } from "./constants";

const SCB_KPIF_URL =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101G/KPIF";

interface ScbJsonResponse {
  columns: Array<{ code: string; text: string; type: string }>;
  data: Array<{ key: string[]; values: string[] }>;
}

/**
 * Fetch KPIF index from the SCB PxWeb API.
 * Returns a Map of year -> index value (December value preferred).
 *
 * Falls back to a hardcoded table if the API is unavailable.
 */
export async function fetchKpifIndex(): Promise<Map<number, number>> {
  try {
    const response = await fetch(SCB_KPIF_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: [],
        response: { format: "json" },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`SCB API error: ${response.status}`);
    }

    const data: ScbJsonResponse = await response.json();
    const yearlyIndex = new Map<number, number>();

    for (const row of data.data) {
      const timePeriod = row.key[0]; // e.g., "2024M12"
      const match = timePeriod.match(/^(\d{4})M(\d{2})$/);
      if (!match) continue;

      const year = parseInt(match[1]);
      const month = parseInt(match[2]);
      const value = parseFloat(row.values[0]);

      if (isNaN(value)) continue;

      // Prefer December value as annual reference; keep latest month otherwise
      const existing = yearlyIndex.get(year);
      if (!existing || month === 12) {
        yearlyIndex.set(year, value);
      }
    }

    return yearlyIndex;
  } catch (error) {
    console.warn("SCB API unavailable, using fallback KPIF data:", error);
    return new Map(KPIF_FALLBACK);
  }
}
