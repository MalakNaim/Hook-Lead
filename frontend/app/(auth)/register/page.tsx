"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/authService";
import { saveTokens, isAuthenticated } from "@/lib/auth";
import { useLocale } from "@/lib/i18n";

// ── Icons ─────────────────────────────────────────────────────────────────────

function EyeOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────

interface FormErrors {
  workspaceName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(
  workspaceName: string,
  email: string,
  password: string,
  confirmPassword: string,
  t: (key: string) => string,
): FormErrors {
  const errors: FormErrors = {};

  if (!workspaceName.trim()) {
    errors.workspaceName = t("auth.register.errors.workspaceRequired");
  } else if (workspaceName.trim().length < 2) {
    errors.workspaceName = t("auth.register.errors.workspaceTooShort");
  }

  if (!email.trim()) {
    errors.email = t("auth.register.errors.emailRequired");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = t("auth.register.errors.emailInvalid");
  }

  if (!password) {
    errors.password = t("auth.register.errors.passwordRequired");
  } else if (password.length < 8) {
    errors.password = t("auth.register.errors.passwordTooShort");
  }

  if (!confirmPassword) {
    errors.confirmPassword = t("auth.register.errors.confirmPasswordRequired");
  } else if (password !== confirmPassword) {
    errors.confirmPassword = t("auth.register.errors.passwordMismatch");
  }

  return errors;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLocale();

  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/leads");
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);

    const errors = validate(workspaceName, email, password, confirmPassword, t);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const data = await register({
        workspaceName: workspaceName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      saveTokens(data.accessToken, data.refreshToken);
      router.replace("/leads");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : t("auth.register.genericError"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Brand mark */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
          <span className="text-sm font-bold tracking-tight text-white">
            {t("common.brand")}
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {t("auth.register.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("auth.register.subtitle")}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Workspace name */}
          <div>
            <label
              htmlFor="workspaceName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              {t("auth.register.workspaceLabel")}
            </label>
            <input
              id="workspaceName"
              type="text"
              autoComplete="organization"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder={t("auth.register.workspacePlaceholder")}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-1 ${
                fieldErrors.workspaceName
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              }`}
            />
            {fieldErrors.workspaceName && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.workspaceName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              {t("auth.register.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.register.emailPlaceholder")}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-1 ${
                fieldErrors.email
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              {t("auth.register.passwordLabel")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.register.passwordPlaceholder")}
                className={`w-full rounded-lg border ps-3 pe-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={t(showPassword ? "auth.register.hidePassword" : "auth.register.showPassword")}
                className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              {t("auth.register.confirmPasswordLabel")}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("auth.register.confirmPasswordPlaceholder")}
                className={`w-full rounded-lg border ps-3 pe-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.confirmPassword
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={t(showConfirm ? "auth.register.hidePassword" : "auth.register.showPassword")}
                className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3"
            >
              <AlertIcon />
              <p className="text-sm leading-snug text-red-700">{serverError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner />
                {t("auth.register.submitting")}
              </>
            ) : (
              t("auth.register.submitButton")
            )}
          </button>
        </form>
      </div>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-gray-500">
        {t("auth.register.hasAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-gray-900 underline-offset-2 hover:underline"
        >
          {t("auth.register.signIn")}
        </Link>
      </p>
    </div>
  );
}
