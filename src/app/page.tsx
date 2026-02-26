import Link from "next/link";
import { ResumeBanner } from "@/components/resume-banner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-bold">Sanna Avgiften</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-2xl text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Vad kostar din BRF
            <br />
            <span className="text-primary">egentligen?</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {"Analysera om din bostadsr\u00e4ttsf\u00f6renings avgift \u00e4r h\u00e5llbar p\u00e5 l\u00e5ng sikt. Baserat p\u00e5 underh\u00e5llsplan, balansr\u00e4kning och resultatr\u00e4kning f\u00e5r du en tydlig rekommendation."}
          </p>

          <ResumeBanner />

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/analys"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Starta analys
            </Link>
            <p className="text-sm text-muted-foreground">
              {"Gratis. Ingen inloggning kr\u00e4vs."}
            </p>
          </div>

          <div className="grid gap-6 pt-8 sm:grid-cols-3 text-left">
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="font-semibold">{"Underh\u00e5llsplan"}</h3>
              <p className="text-sm text-muted-foreground">
                {"Ber\u00e4kna l\u00e5ngsiktiga underh\u00e5llskostnader med annuitetsmetoden och KPIF-justering."}
              </p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="font-semibold">Ekonomisk analys</h3>
              <p className="text-sm text-muted-foreground">
                {"Balansr\u00e4kning, resultatr\u00e4kning och real r\u00e4nta ger en komplett bild av f\u00f6reningens ekonomi."}
              </p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="font-semibold">Rekommendation</h3>
              <p className="text-sm text-muted-foreground">
                {"F\u00e5 en tydlig 6-gradig bed\u00f6mning med konkret handlingsplan f\u00f6r avgiftsjustering."}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white py-6 text-center text-sm text-muted-foreground">
        <p>
          {"Sanna Avgiften \u2014 ett verktyg f\u00f6r bostadsr\u00e4ttsf\u00f6reningar. Ber\u00e4kningarna baseras p\u00e5 SOU 2012:71 och SCB:s KPIF-index."}
        </p>
      </footer>
    </div>
  );
}
