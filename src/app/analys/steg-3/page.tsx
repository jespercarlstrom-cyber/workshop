"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeStatementSchema, type IncomeStatement } from "@/lib/models";
import { useAnalysisStore } from "@/hooks/use-analysis-store";
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
import { InfoTooltip } from "@/components/info-tooltip";

export default function Steg3Page() {
  const router = useRouter();
  const { resultatrakning, setResultatrakning } = useAnalysisStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeStatement>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(incomeStatementSchema) as any,
    defaultValues: {
      arsresultat: undefined,
      medlemsavgifter: undefined,
      avskrivningar: 0,
      planeradeUnderhallsutgifter: 0,
      tomtrattskostnad: 0,
      rantenetto: undefined,
      ...resultatrakning,
    },
  });

  function onSubmit(data: IncomeStatement) {
    setResultatrakning(data);
    router.push("/analys/steg-4");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resultaträkning</CardTitle>
          <CardDescription>
            Nyckeltal från föreningens senaste årsredovisning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="arsresultat">
                Årsresultat (kr) <InfoTooltip fieldName="arsresultat" />
              </Label>
              <Input
                id="arsresultat"
                type="number"
                {...register("arsresultat")}
                placeholder="t.ex. -50000"
              />
              {errors.arsresultat && (
                <p className="text-sm text-destructive">
                  {errors.arsresultat.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medlemsavgifter">
                Medlemsavgifter totalt (kr/år){" "}
                <InfoTooltip fieldName="medlemsavgifter" />
              </Label>
              <Input
                id="medlemsavgifter"
                type="number"
                {...register("medlemsavgifter")}
                placeholder="t.ex. 2400000"
              />
              {errors.medlemsavgifter && (
                <p className="text-sm text-destructive">
                  {errors.medlemsavgifter.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="avskrivningar">
                Avskrivningar (kr) <InfoTooltip fieldName="avskrivningar" />
              </Label>
              <Input
                id="avskrivningar"
                type="number"
                {...register("avskrivningar")}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planeradeUnderhallsutgifter">
                Planerat underhåll (kr){" "}
                <InfoTooltip fieldName="planeradeUnderhallsutgifter" />
              </Label>
              <Input
                id="planeradeUnderhallsutgifter"
                type="number"
                {...register("planeradeUnderhallsutgifter")}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tomtrattskostnad">
                Tomträttskostnad (kr/år){" "}
                <InfoTooltip fieldName="tomtrattskostnad" />
              </Label>
              <Input
                id="tomtrattskostnad"
                type="number"
                {...register("tomtrattskostnad")}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rantenetto">
                Räntenetto (kr) <InfoTooltip fieldName="rantenetto" />
              </Label>
              <Input
                id="rantenetto"
                type="number"
                {...register("rantenetto")}
                placeholder="t.ex. 450000"
              />
              {errors.rantenetto && (
                <p className="text-sm text-destructive">
                  {errors.rantenetto.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/analys/steg-2")}>
          ← Tillbaka
        </Button>
        <Button type="submit" size="lg">
          Nästa: Underhållsplan →
        </Button>
      </div>
    </form>
  );
}
