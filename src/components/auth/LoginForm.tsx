import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Globe, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  code: z
    .string()
    .min(2, "Code is required")
    .regex(/^[A-Z]{2}-\d{2}$/, "Code must be in format XX-00"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (data.code === "DV-01" && data.password === "password123") {
        console.log("Login successful", data);
        // Redirect would happen here
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const translations = {
    en: {
      title: "Login",
      description: "Enter your credentials to access your account",
      codeLabel: "Unique Code",
      codePlaceholder: "e.g. DV-01",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      loginButton: "Login",
      forgotPassword: "Forgot password?",
      loading: "Logging in...",
    },
    ar: {
      title: "تسجيل الدخول",
      description: "أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك",
      codeLabel: "الرمز الفريد",
      codePlaceholder: "مثال DV-01",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      loginButton: "تسجيل الدخول",
      forgotPassword: "نسيت كلمة المرور؟",
      loading: "جاري تسجيل الدخول...",
    },
  };

  const t = translations[language];

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-background p-4 ${language === "ar" ? "rtl" : "ltr"}`}
    >
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 p-2">
            {/* Organization logo placeholder */}
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80"
              alt="Life Makers Pirates Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">{t.codeLabel}</Label>
              <Input
                id="code"
                placeholder={t.codePlaceholder}
                {...register("code")}
                className={errors.code ? "border-destructive" : ""}
              />
              {errors.code && (
                <p className="text-xs text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  {...register("password")}
                  className={
                    errors.password ? "border-destructive pr-10" : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  {t.loading}
                </>
              ) : (
                <>
                  {t.loginButton} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button variant="link" className="text-sm text-primary">
            {t.forgotPassword}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex items-center text-xs text-muted-foreground"
            onClick={toggleLanguage}
          >
            <Globe className="mr-1 h-3 w-3" />
            {language === "en" ? "العربية" : "English"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
