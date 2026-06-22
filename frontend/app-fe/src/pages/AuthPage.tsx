import { AuthBrandingPanel } from "@/components/auth/AuthBrandingPanel";
import { AuthFormCard } from "@/components/auth/AuthFormCard";

export function AuthPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(30rem,0.92fr)]">
        <AuthBrandingPanel />
        <AuthFormCard />
      </div>
    </main>
  );
}
