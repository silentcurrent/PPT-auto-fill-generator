import { Header } from "@/components/header";
import { GeneratorForm } from "@/components/generator-form";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <Header />

          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground text-balance">
                Upload Your Files
              </h2>
              <p className="text-sm text-muted-foreground">
                Provide your PPTX template and Excel data file to get started.
              </p>
            </div>
            <GeneratorForm />
          </section>

          <div className="h-px bg-border" />

          <HowItWorks />

          <div className="h-px bg-border" />

          <footer className="pb-8">
            <p className="text-xs text-muted-foreground text-center">
              Only the first row of your Excel file is used. Styling from the
              template is fully preserved.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
