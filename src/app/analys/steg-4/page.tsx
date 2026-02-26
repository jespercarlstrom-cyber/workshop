"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenancePlanSchema, type MaintenancePlan } from "@/lib/models";
import { useAnalysisStore } from "@/hooks/use-analysis-store";
import { EXAMPLE_MAINTENANCE_ITEMS } from "@/lib/constants";
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

export default function Steg4Page() {
  const router = useRouter();
  const { underhallsposter, setUnderhallsposter } = useAnalysisStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MaintenancePlan>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(maintenancePlanSchema) as any,
    values: {
      poster: underhallsposter.length > 0 ? underhallsposter : EXAMPLE_MAINTENANCE_ITEMS,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "poster",
  });

  function onSubmit(data: MaintenancePlan) {
    setUnderhallsposter(data.poster);
    router.push("/analys/resultat");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Underhållsplan</CardTitle>
          <CardDescription>
            Ange föreningens planerade underhållsposter. Exempeldata är
            förifyld — anpassa efter er förenings faktiska underhållsplan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header row */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_100px_120px_80px_40px] gap-2 text-sm font-medium text-muted-foreground">
            <span>Beskrivning</span>
            <span>Senast (år)</span>
            <span>Kostnad (kr)</span>
            <span>Intervall</span>
            <span />
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-2 sm:grid-cols-[1fr_100px_120px_80px_40px] items-start border-b pb-3 sm:border-0 sm:pb-0"
            >
              <div>
                <Label className="sm:hidden text-xs text-muted-foreground">Beskrivning</Label>
                <Input
                  {...register(`poster.${index}.beskrivning`)}
                  placeholder="t.ex. Tak"
                />
                {errors.poster?.[index]?.beskrivning && (
                  <p className="text-xs text-destructive">
                    {errors.poster[index].beskrivning?.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="sm:hidden text-xs text-muted-foreground">Senast utfört</Label>
                <Input
                  type="number"
                  {...register(`poster.${index}.senastUtfort`)}
                  placeholder="2010"
                />
              </div>

              <div>
                <Label className="sm:hidden text-xs text-muted-foreground">Kostnad (kr)</Label>
                <Input
                  type="number"
                  {...register(`poster.${index}.kostnadDa`)}
                  placeholder="500000"
                />
              </div>

              <div>
                <Label className="sm:hidden text-xs text-muted-foreground">Intervall (år)</Label>
                <Input
                  type="number"
                  {...register(`poster.${index}.intervall`)}
                  placeholder="30"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive/80 mt-0.5"
                disabled={fields.length <= 1}
              >
                ✕
              </Button>
            </div>
          ))}

          {errors.poster?.root && (
            <p className="text-sm text-destructive">{errors.poster.root.message}</p>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                beskrivning: "",
                senastUtfort: 2020,
                kostnadDa: 0,
                intervall: 20,
              })
            }
          >
            + Lägg till post
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/analys/steg-3")}>
          ← Tillbaka
        </Button>
        <Button type="submit" size="lg">
          Beräkna resultat →
        </Button>
      </div>
    </form>
  );
}
