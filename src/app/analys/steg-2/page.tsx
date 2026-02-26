"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { balanceSheetSchema, type BalanceSheet } from "@/lib/models";
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

export default function Steg2Page() {
  const router = useRouter();
  const { balansrakning, setBalansrakning } = useAnalysisStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BalanceSheet>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(balanceSheetSchema) as any,
    defaultValues: {
      kassaBank: undefined,
      forutbetaldaKostnader: 0,
      ovrigaOmsattningstillgangar: 0,
      banklan: 0,
      upplupenKostnader: 0,
      ovrigaKortfristigaSkulder: 0,
      ...balansrakning,
    },
  });

  function onSubmit(data: BalanceSheet) {
    setBalansrakning(data);
    router.push("/analys/steg-3");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tillgångar</CardTitle>
          <CardDescription>
            Omsättningstillgångar från föreningens balansräkning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kassaBank">
              Kassa och bank (kr) <InfoTooltip fieldName="kassaBank" />
            </Label>
            <Input
              id="kassaBank"
              type="number"
              {...register("kassaBank")}
              placeholder="t.ex. 500000"
            />
            {errors.kassaBank && (
              <p className="text-sm text-destructive">{errors.kassaBank.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="forutbetaldaKostnader">
              Förutbetalda kostnader (kr){" "}
              <InfoTooltip fieldName="forutbetaldaKostnader" />
            </Label>
            <Input
              id="forutbetaldaKostnader"
              type="number"
              {...register("forutbetaldaKostnader")}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ovrigaOmsattningstillgangar">
              Övriga omsättningstillgångar (kr){" "}
              <InfoTooltip fieldName="ovrigaOmsattningstillgangar" />
            </Label>
            <Input
              id="ovrigaOmsattningstillgangar"
              type="number"
              {...register("ovrigaOmsattningstillgangar")}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skulder</CardTitle>
          <CardDescription>
            Skulder från föreningens balansräkning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banklan">
              Banklån (kr) <InfoTooltip fieldName="banklan" />
            </Label>
            <Input
              id="banklan"
              type="number"
              {...register("banklan")}
              placeholder="t.ex. 15000000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upplupenKostnader">
              Upplupna kostnader (kr){" "}
              <InfoTooltip fieldName="upplupenKostnader" />
            </Label>
            <Input
              id="upplupenKostnader"
              type="number"
              {...register("upplupenKostnader")}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ovrigaKortfristigaSkulder">
              Övriga kortfristiga skulder (kr){" "}
              <InfoTooltip fieldName="ovrigaKortfristigaSkulder" />
            </Label>
            <Input
              id="ovrigaKortfristigaSkulder"
              type="number"
              {...register("ovrigaKortfristigaSkulder")}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/analys/steg-1")}>
          ← Tillbaka
        </Button>
        <Button type="submit" size="lg">
          Nästa: Resultaträkning →
        </Button>
      </div>
    </form>
  );
}
