"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalysisStore } from "@/hooks/use-analysis-store";
import { runFullCalculation } from "@/lib/calculation-engine";
import { fetchKpifIndex } from "@/lib/scb-client";
import { KPIF_FALLBACK } from "@/lib/constants";
import { formatSEK, formatNumber, formatPercent } from "@/lib/formatters";
import {
  analysisInputSchema,
  type AnalysisInput,
  type CalculationResult,
} from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InfoTooltip } from "@/components/info-tooltip";

const TIER_COLORS: Record<number, string> = {
  1: "bg-green-100 text-green-800 border-green-300",
  2: "bg-green-50 text-green-700 border-green-200",
  3: "bg-yellow-50 text-yellow-800 border-yellow-300",
  4: "bg-orange-50 text-orange-800 border-orange-300",
  5: "bg-red-50 text-red-800 border-red-300",
  6: "bg-red-100 text-red-900 border-red-400",
};

const TIER_BADGE: Record<number, string> = {
  1: "bg-green-600",
  2: "bg-green-500",
  3: "bg-yellow-500",
  4: "bg-orange-500",
  5: "bg-red-500",
  6: "bg-red-700",
};

export default function ResultatPage() {
  const router = useRouter();
  const store = useAnalysisStore();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inflation, setInflation] = useState(store.parametrar.forvantadInflation);
  const [ranteSats, setRanteSats] = useState(store.parametrar.forvantadNominellRanta);

  useEffect(() => {
    async function calculate() {
      setLoading(true);
      setError(null);

      try {
        // Build input
        const raw: AnalysisInput = {
          fastighet: store.fastighet as AnalysisInput["fastighet"],
          balansrakning: store.balansrakning as AnalysisInput["balansrakning"],
          resultatrakning: store.resultatrakning as AnalysisInput["resultatrakning"],
          underhallsplan: { poster: store.underhallsposter },
          parametrar: {
            forvantadInflation: inflation,
            forvantadNominellRanta: ranteSats,
          },
        };

        const parsed = analysisInputSchema.safeParse(raw);
        if (!parsed.success) {
          setError(
            "Saknade uppgifter. Gå tillbaka och fyll i alla steg."
          );
          setLoading(false);
          return;
        }

        // Fetch KPIF
        let kpif: Map<number, number>;
        try {
          kpif = await fetchKpifIndex();
        } catch {
          kpif = new Map(KPIF_FALLBACK);
        }

        const calcResult = runFullCalculation(parsed.data, kpif);
        setResult(calcResult);
      } catch (err) {
        setError(
          `Beräkningsfel: ${err instanceof Error ? err.message : "Okänt fel"}`
        );
      } finally {
        setLoading(false);
      }
    }

    calculate();
  }, [store, inflation, ranteSats]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Beräknar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-8 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.push("/analys/steg-1")}
          >
            Gå till steg 1
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const { rekommendation } = result;
  const tierColor = TIER_COLORS[rekommendation.tier] ?? "";
  const tierBadge = TIER_BADGE[rekommendation.tier] ?? "bg-gray-500";

  return (
    <div className="space-y-6">
      {/* Recommendation card */}
      <Card className={`border-2 ${tierColor}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge className={`${tierBadge} text-white`}>
              Nivå {rekommendation.tier}/6
            </Badge>
            <CardTitle className="text-xl">
              {rekommendation.rubrik}
            </CardTitle>
          </div>
          <CardDescription className="text-base mt-2">
            {rekommendation.beskrivning}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rekommendation.procentjustering !== 0 && (
            <p className="text-2xl font-bold mb-4">
              {rekommendation.procentjustering > 0 ? "+" : ""}
              {rekommendation.procentjustering.toFixed(1)}% avgiftsjustering
            </p>
          )}
          <div className="space-y-2">
            <p className="font-medium">Handlingsplan:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {rekommendation.plan.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Summary table */}
      <Card>
        <CardHeader>
          <CardTitle>Sammanfattning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Långsiktigt underhåll (annuitet)</span>
              <span className="font-medium">{formatSEK(result.totalUnderhallsannuitet)}/år</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nettotillgångar</span>
              <span className="font-medium">{formatSEK(result.nettoTillgangar)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Real ränta</span>
              <span className="font-medium">{formatPercent(result.realRanta)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Långsiktig räntekostnad</span>
              <span className="font-medium">{formatSEK(result.langfristigRantekostnad)}/år</span>
            </div>
            <Separator />
            {result.tomtrattPrognos && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prognostiserad tomträttsavgäld</span>
                  <span className="font-medium">
                    {formatSEK(result.tomtrattPrognos.arligAvgald)}/år
                  </span>
                </div>
                <Separator />
              </>
            )}
            <div className="flex justify-between text-base font-bold">
              <span>
                {result.overskottUnderskottPerKvm >= 0
                  ? "Överskott per kvm"
                  : "Underskott per kvm"}
              </span>
              <span
                className={
                  result.overskottUnderskottPerKvm >= 0
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {formatSEK(Math.abs(result.overskottUnderskottPerKvm))}/kvm
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameter adjustment */}
      <Card>
        <CardHeader>
          <CardTitle>Antaganden</CardTitle>
          <CardDescription>
            Justera parametrarna och se hur resultatet förändras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inflation">
                Förväntad inflation (%)
                <InfoTooltip fieldName="forvantadInflation" />
              </Label>
              <Input
                id="inflation"
                type="number"
                step="0.1"
                value={inflation}
                onChange={(e) => setInflation(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ranta">
                Förväntad nominell ränta (%)
                <InfoTooltip fieldName="forvantadNominellRanta" />
              </Label>
              <Input
                id="ranta"
                type="number"
                step="0.1"
                value={ranteSats}
                onChange={(e) => setRanteSats(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail breakdown */}
      <Accordion type="single" collapsible>
        <AccordionItem value="underhall">
          <AccordionTrigger>Underhållsdetaljer</AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">Post</th>
                    <th className="pb-2 text-right">I dagens pengar</th>
                    <th className="pb-2 text-right">Annuitet/år</th>
                    <th className="pb-2 text-right">År till nästa</th>
                  </tr>
                </thead>
                <tbody>
                  {result.underhallsposter.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{item.beskrivning}</td>
                      <td className="py-2 text-right">
                        {formatSEK(item.kostnadIdagspengar)}
                      </td>
                      <td className="py-2 text-right">
                        {formatSEK(item.annuitet)}
                      </td>
                      <td className="py-2 text-right">
                        {item.arTillNasta > 0
                          ? `${item.arTillNasta} år`
                          : "Förfallen"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td className="pt-2">Totalt</td>
                    <td />
                    <td className="pt-2 text-right">
                      {formatSEK(result.totalUnderhallsannuitet)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {result.tomtrattPrognos && (
          <AccordionItem value="tomtratt">
            <AccordionTrigger>Tomträttsberäkning (SOU 2012:71)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Marknadsvärde</span>
                  <span>{formatSEK(result.tomtrattPrognos.marknadsvarde)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avgäldsunderlag (40%)</span>
                  <span>{formatSEK(result.tomtrattPrognos.avgaldsunderlag)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Årlig avgäld (2,75%)</span>
                  <span>{formatSEK(result.tomtrattPrognos.arligAvgald)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/analys/steg-4")}>
          ← Tillbaka till underhållsplan
        </Button>
        <Button variant="outline" onClick={() => { store.reset(); router.push("/"); }}>
          Ny analys
        </Button>
      </div>
    </div>
  );
}
