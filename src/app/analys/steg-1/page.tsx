"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyInfoSchema, type PropertyInfo } from "@/lib/models";
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

export default function Steg1Page() {
  const router = useRouter();
  const { fastighet, setFastighet } = useAnalysisStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertyInfo>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertyInfoSchema) as any,
    values: {
      kommun: "",
      fastighetsbeteckning: "",
      bta: undefined as unknown as number,
      totalBostadsyta: undefined as unknown as number,
      vardeHyreslagenheter: 0,
      arTomtratt: false,
      tomtrattBundenTill: undefined,
      tomtrattArligAvgald: undefined,
      taxeringsvardeMark: undefined,
      ...fastighet,
    },
  });

  const arTomtratt = watch("arTomtratt");

  function onSubmit(data: PropertyInfo) {
    setFastighet(data);
    router.push("/analys/steg-2");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fastighetsuppgifter</CardTitle>
          <CardDescription>
            Grundläggande information om fastigheten och föreningen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="kommun">
                Kommun <InfoTooltip fieldName="kommun" />
              </Label>
              <Input id="kommun" {...register("kommun")} placeholder="t.ex. Stockholm" />
              {errors.kommun && (
                <p className="text-sm text-destructive">{errors.kommun.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fastighetsbeteckning">
                Fastighetsbeteckning <InfoTooltip fieldName="fastighetsbeteckning" />
              </Label>
              <Input
                id="fastighetsbeteckning"
                {...register("fastighetsbeteckning")}
                placeholder="t.ex. Södermalm 1:23"
              />
              {errors.fastighetsbeteckning && (
                <p className="text-sm text-destructive">
                  {errors.fastighetsbeteckning.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bta">
                BTA (kvm) <InfoTooltip fieldName="bta" />
              </Label>
              <Input
                id="bta"
                type="number"
                {...register("bta")}
                placeholder="t.ex. 3500"
              />
              {errors.bta && (
                <p className="text-sm text-destructive">{errors.bta.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBostadsyta">
                Total bostadsyta (kvm) <InfoTooltip fieldName="totalBostadsyta" />
              </Label>
              <Input
                id="totalBostadsyta"
                type="number"
                {...register("totalBostadsyta")}
                placeholder="t.ex. 2800"
              />
              {errors.totalBostadsyta && (
                <p className="text-sm text-destructive">
                  {errors.totalBostadsyta.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vardeHyreslagenheter">
              Värde hyresrätter vid omvandling (kr){" "}
              <InfoTooltip fieldName="vardeHyreslagenheter" />
            </Label>
            <Input
              id="vardeHyreslagenheter"
              type="number"
              {...register("vardeHyreslagenheter")}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tomträtt</CardTitle>
          <CardDescription>
            Fyll i om föreningen har tomträtt (arrenderar marken av kommunen).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="arTomtratt"
              {...register("arTomtratt")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="arTomtratt">
              Föreningen har tomträtt <InfoTooltip fieldName="arTomtratt" />
            </Label>
          </div>

          {arTomtratt && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="tomtrattBundenTill">
                  Bunden till (år) <InfoTooltip fieldName="tomtrattBundenTill" />
                </Label>
                <Input
                  id="tomtrattBundenTill"
                  type="number"
                  {...register("tomtrattBundenTill")}
                  placeholder="t.ex. 2035"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tomtrattArligAvgald">
                  Årlig avgäld (kr) <InfoTooltip fieldName="tomtrattArligAvgald" />
                </Label>
                <Input
                  id="tomtrattArligAvgald"
                  type="number"
                  {...register("tomtrattArligAvgald")}
                  placeholder="t.ex. 250000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxeringsvardeMark">
                  Taxeringsvärde mark (kr/kvm BTA){" "}
                  <InfoTooltip fieldName="taxeringsvardeMark" />
                </Label>
                <Input
                  id="taxeringsvardeMark"
                  type="number"
                  {...register("taxeringsvardeMark")}
                  placeholder="t.ex. 15000"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Nästa: Balansräkning →
        </Button>
      </div>
    </form>
  );
}
