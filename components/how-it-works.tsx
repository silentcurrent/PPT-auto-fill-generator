import { FileText, Table, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground text-balance">
          How It Works
        </h2>
        <p className="text-sm text-muted-foreground">
          Three simple steps to generate your presentations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StepCard
          step={1}
          icon={<FileText className="size-5" />}
          title="Upload Template"
          description="Upload your .pptx file with [placeholder] tags where data should be inserted."
        />
        <StepCard
          step={2}
          icon={<Table className="size-5" />}
          title="Upload Excel Data"
          description="Upload an .xlsx file where column headers match your placeholders."
        />
        <StepCard
          step={3}
          icon={<Sparkles className="size-5" />}
          title="Download Result"
          description="Get your filled-out presentation with all original styling preserved."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeaturePill
          icon={<Shield className="size-4" />}
          text="Preserves all formatting"
        />
        <FeaturePill
          icon={<Zap className="size-4" />}
          text="Instant processing"
        />
        <FeaturePill
          icon={<ArrowRight className="size-4" />}
          text="Only replaces text runs"
        />
      </div>
    </section>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          {step}
        </span>
        <div className="flex items-center justify-center size-9 rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeaturePill({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-2.5">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-medium text-muted-foreground">{text}</span>
    </div>
  );
}
