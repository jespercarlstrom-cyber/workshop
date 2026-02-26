import type { Recommendation } from "./models";

/** Round up to nearest 0.5%. */
function roundUpHalf(pct: number): number {
  return Math.ceil(pct * 2) / 2;
}

/**
 * Calculate fee adjustment recommendation based on the 6-tier model.
 *
 * @param surplusDeficitPerSqm - Positive = surplus, negative = deficit (SEK/sqm)
 * @param totalFees - Total annual membership fees (SEK)
 * @param totalArea - Total apartment area (sqm)
 */
export function calculateRecommendation(
  surplusDeficitPerSqm: number,
  totalFees: number,
  totalArea: number
): Recommendation {
  const feePerSqm = totalFees / totalArea;

  // deficitPercent: positive = deficit, negative = surplus
  const deficitPercent = (-surplusDeficitPerSqm / feePerSqm) * 100;

  if (deficitPercent < -10) {
    // Tier 1: Surplus > 10%
    const reduction = roundUpHalf(Math.abs(deficitPercent) - 10);
    return {
      tier: 1,
      rubrik: "Avgiften kan sänkas",
      beskrivning:
        "Föreningen har ett tydligt överskott. Avgiften kan sänkas till en nivå som ligger 10% över det långsiktiga behovet, fryses några år och sedan höjas i takt med inflationen.",
      procentjustering: -reduction,
      plan: [
        `Sänk avgiften med ${reduction.toFixed(1)}% till +10% över behov`,
        "Frys avgiften i 2–3 år",
        "Höj sedan i takt med inflationen (ca 2%/år)",
      ],
    };
  }

  if (deficitPercent <= 0) {
    // Tier 2: Surplus 0–10%
    return {
      tier: 2,
      rubrik: "Avgiften är lagom",
      beskrivning:
        "Föreningen har ett litet överskott. Avgiften behöver inte höjas just nu — frys den några år och börja sedan höja i takt med inflationen.",
      procentjustering: 0,
      plan: [
        "Frys avgiften i 2–3 år",
        "Höj sedan i takt med inflationen (ca 2%/år)",
      ],
    };
  }

  if (deficitPercent <= 1.5) {
    // Tier 3: Deficit 0–1.5%
    return {
      tier: 3,
      rubrik: "Mindre höjning behövs",
      beskrivning:
        "Avgiften ligger nära rätt nivå men bör justeras upp något för att säkerställa långsiktig hållbarhet.",
      procentjustering: 1.5,
      plan: [
        "Höj avgiften med 1,5% omedelbart",
        "Fortsätt höja i takt med inflationen (ca 2%/år)",
      ],
    };
  }

  if (deficitPercent <= 5) {
    // Tier 4: Deficit 1.5–5%
    const raise = roundUpHalf(deficitPercent);
    return {
      tier: 4,
      rubrik: "Höjning behövs",
      beskrivning:
        "Avgiften är för låg och behöver höjas till rätt nivå direkt för att undvika framtida problem.",
      procentjustering: raise,
      plan: [
        `Höj avgiften med ${raise.toFixed(1)}% omedelbart`,
        "Fortsätt höja i takt med inflationen (ca 2%/år)",
      ],
    };
  }

  if (deficitPercent <= 8) {
    // Tier 5: Deficit 5–8%
    const remaining = roundUpHalf(deficitPercent - 5);
    const total = roundUpHalf(deficitPercent);
    return {
      tier: 5,
      rubrik: "Betydande höjning behövs",
      beskrivning:
        "Avgiften behöver höjas rejält. En uppdelning i två steg rekommenderas för att mildra effekten för medlemmarna.",
      procentjustering: total,
      plan: [
        "Höj avgiften med 5,0% nu",
        `Höj med ytterligare ${remaining.toFixed(1)}% nästa år`,
        "Fortsätt höja i takt med inflationen (ca 2%/år)",
      ],
    };
  }

  // Tier 6: Deficit > 8%
  const firstRaise = roundUpHalf(deficitPercent - 3);
  const total = roundUpHalf(deficitPercent);
  return {
    tier: 6,
    rubrik: "Kraftig höjning krävs omedelbart",
    beskrivning:
      "Avgiften är väsentligt för låg. Åtgärder behöver vidtas omedelbart för att undvika en ekonomisk kris i föreningen.",
    procentjustering: total,
    plan: [
      `Höj avgiften med ${firstRaise.toFixed(1)}% omedelbart`,
      "Höj med ytterligare 5,0% nästa år",
      "Fortsätt höja i takt med inflationen (ca 2%/år)",
    ],
  };
}
