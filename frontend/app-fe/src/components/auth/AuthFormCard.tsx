import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";

import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";

const authModes: {
  value: AuthMode;
  label: string;
  icon: typeof LogIn;
}[] = [
  {
    value: "signin",
    label: "Sign in",
    icon: LogIn,
  },
  {
    value: "signup",
    label: "Sign up",
    icon: UserPlus,
  },
];

export function AuthFormCard() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const isSignIn = mode === "signin";

  return (
    <section className="flex min-h-[38rem] flex-1 items-center justify-center border-t border-slate-200 bg-white px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-12">
      <div className="w-full max-w-md">
        <div
          role="tablist"
          aria-label="Authentication mode"
          className="grid grid-cols-2 border border-slate-200 bg-slate-50 p-1"
        >
          {authModes.map((authMode) => {
            const ModeIcon = authMode.icon;
            const isSelected = mode === authMode.value;

            return (
              <Button
                key={authMode.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`${authMode.value}-panel`}
                variant="ghost"
                className={cn(
                  "h-9 gap-2 bg-transparent text-slate-600 hover:bg-white",
                  isSelected &&
                    "border border-slate-200 bg-white text-slate-950 shadow-sm hover:bg-white",
                )}
                onClick={() => setMode(authMode.value)}
              >
                <ModeIcon className="size-4" aria-hidden="true" />
                {authMode.label}
              </Button>
            );
          })}
        </div>

        <Card
          id={isSignIn ? "signin-panel" : "signup-panel"}
          role="tabpanel"
          className="mt-5 border-slate-200 px-6 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:px-7"
        >
          {isSignIn ? <SignInForm /> : <SignUpForm />}
        </Card>
      </div>
    </section>
  );
}
