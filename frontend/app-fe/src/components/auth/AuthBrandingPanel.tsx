import {
  ArrowRight,
  Bot,
  Database,
  FileUp,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const pipelineSteps = [
  {
    label: "Upload",
    description: "Files enter the workspace.",
    icon: FileUp,
  },
  {
    label: "Parse",
    description: "Content is cleaned and chunked.",
    icon: ScanSearch,
  },
  {
    label: "Index",
    description: "Vectors and metadata are stored.",
    icon: Database,
  },
  {
    label: "Answer",
    description: "Retrieval powers admin responses.",
    icon: Bot,
  },
];

export function AuthBrandingPanel() {
  return (
    <section className="flex min-h-[38rem] flex-1 flex-col justify-between bg-[#043c3b] px-6 py-8 text-white sm:px-10 lg:px-12">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center border border-white/15 bg-white/10 text-emerald-100">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold">AI Support Admin</p>
          <p className="text-xs text-emerald-50/70">RAG operations console</p>
        </div>
      </div>

      <div className="my-12 max-w-xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-100/70">
          Admin access
        </p>
        <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
          Prepare, index, and monitor knowledge sources in one place.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-emerald-50/75">
          Sign in to manage uploads, review ingestion progress, and keep your
          retrieval pipeline ready for high-quality answers.
        </p>
      </div>

      <div aria-label="RAG pipeline flow" className="max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-stretch">
          {pipelineSteps.map((step, index) => {
            const StepIcon = step.icon;
            const showConnector = index < pipelineSteps.length - 1;

            return (
              <div className="contents" key={step.label}>
                <div className="border border-white/12 bg-white/[0.07] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
                  <div className="flex size-9 items-center justify-center border border-emerald-100/20 bg-emerald-50/10 text-emerald-100">
                    <StepIcon className="size-4" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-sm font-semibold">{step.label}</h2>
                  <p className="mt-2 text-xs leading-5 text-emerald-50/68">
                    {step.description}
                  </p>
                </div>

                {showConnector ? (
                  <div
                    className="hidden items-center justify-center px-1 text-emerald-100/50 sm:flex"
                    aria-hidden="true"
                  >
                    <ArrowRight className="size-4" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-emerald-50/70">
        <ShieldCheck className="size-4 text-emerald-100" aria-hidden="true" />
        <span>Role-based admin entry for ingestion and document workflows.</span>
      </div>
    </section>
  );
}
