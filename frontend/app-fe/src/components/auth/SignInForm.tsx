import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/supabaseClient";
import { useRouter } from "@tanstack/react-router";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn(email, password);
      router.navigate({ from: "/login", to: "/overview" });
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-semibold tracking-normal">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm">
          Sign in with your admin email and password.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="signin-password">Password</Label>
              <a
                href="/auth"
                className="text-xs font-medium text-slate-700 underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="signin-password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={handleSignIn}
            disabled={isSigningIn}
          >
            Sign in
          </Button>
        </form>
      </CardContent>
    </>
  );
};

export default SignInForm;
