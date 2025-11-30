import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, resetPasswordSchema, type ForgotPasswordInput, type ResetPasswordInput } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Mail, ArrowLeft, Check, Eye, EyeOff } from "lucide-react";

type Step = "email" | "otp" | "success";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const onEmailSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send reset code");
      }

      setEmail(data.email);
      setStep("otp");
      toast({
        title: "Check your email",
        description: "We've sent a 6-digit code to reset your password.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: data.otp, password: data.password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      setStep("success");
      toast({
        title: "Password reset!",
        description: "Your password has been successfully reset.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20 pb-8">
      <div className="absolute inset-0 bg-radial-primary opacity-50" />
      
      <Card className="w-full max-w-md bg-card/80 border-border/50 backdrop-blur-sm relative z-10" data-testid="card-forgot-password">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 glow-primary">
            {step === "success" ? (
              <Check className="w-6 h-6 text-primary" />
            ) : step === "otp" ? (
              <KeyRound className="w-6 h-6 text-primary" />
            ) : (
              <Mail className="w-6 h-6 text-primary" />
            )}
          </div>
          <CardTitle className="font-heading text-3xl uppercase tracking-wide">
            {step === "success" ? "All Done!" : step === "otp" ? "Enter Code" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {step === "success"
              ? "Your password has been reset successfully"
              : step === "otp"
              ? `Enter the 6-digit code sent to ${email}`
              : "Enter your email to receive a reset code"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {step === "email" && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="athlete@example.com"
                          className="bg-background border-border/50 focus:border-primary/50"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full gradient-primary gap-2 font-heading uppercase tracking-wide"
                  disabled={isLoading}
                  data-testid="button-send-code"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Reset Code
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          {step === "otp" && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field} data-testid="input-otp">
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className="border-border/50" />
                            <InputOTPSlot index={1} className="border-border/50" />
                            <InputOTPSlot index={2} className="border-border/50" />
                            <InputOTPSlot index={3} className="border-border/50" />
                            <InputOTPSlot index={4} className="border-border/50" />
                            <InputOTPSlot index={5} className="border-border/50" />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={otpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="bg-background border-border/50 focus:border-primary/50 pr-10"
                            data-testid="input-new-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={otpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            className="bg-background border-border/50 focus:border-primary/50 pr-10"
                            data-testid="input-confirm-new-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full gradient-primary gap-2 font-heading uppercase tracking-wide"
                  disabled={isLoading}
                  data-testid="button-reset-password"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Resetting...
                    </span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      Reset Password
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full gap-2"
                  onClick={() => setStep("email")}
                  data-testid="button-back-to-email"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to email
                </Button>
              </form>
            </Form>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                You can now sign in with your new password.
              </p>
              <Link href="/login">
                <Button className="w-full gradient-primary gap-2 font-heading uppercase tracking-wide" data-testid="button-go-to-login">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {step !== "success" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login">
                  <span className="text-primary hover:underline cursor-pointer font-medium" data-testid="link-back-to-login">
                    Sign in
                  </span>
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}