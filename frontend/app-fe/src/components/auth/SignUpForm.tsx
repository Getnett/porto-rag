import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/supabaseClient";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignUp = async () => {
    setIsSigningUp(true);
    try {
      const data = await signUp(email, password);
      console.log("Sign-up data:", data, data?.session);
      if (!data?.session && data?.user) {
        toast.success(
          "Sign-up successful! Please check your email for the confirmation link.",
          {
            position: "top-right",
            style: { backgroundColor: "green", color: "white" },
          },
        );
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    } finally {
      setIsSigningUp(false);
    }
  };
  return (
    <>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-semibold tracking-normal">
          Create an account
        </CardTitle>
        <CardDescription className="text-sm">
          Request access to manage ingestion and knowledge base workflows.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={handleSignUp}
            disabled={isSigningUp}
          >
            Sign up
          </Button>
        </form>
      </CardContent>
    </>
  );
};

export default SignUpForm;
