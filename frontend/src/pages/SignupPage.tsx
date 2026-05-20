import { useState, type SubmitEvent } from "react";
import { Link } from "react-router-dom";
import type { AuthService } from "../services/AuthService";
import "./SignupPage.css";

interface SignupPageProps {
  authService: AuthService;
  onSignupComplete: (username: string, password: string) => Promise<void>;
}

type Step = "signup" | "confirm";

export default function SignupPage({ authService, onSignupComplete }: SignupPageProps) {
  const [step, setStep] = useState<Step>("signup");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!username.trim()) errors.username = "Username is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setFormError("");
    setIsLoading(true);
    try {
      const { isSignUpComplete } = await authService.signup(
        username.trim(),
        email.trim(),
        password,
      );
      if (isSignUpComplete) {
        await onSignupComplete(username.trim(), password);
      } else {
        setStep("confirm");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirm(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim()) {
      setFieldErrors({ code: "Verification code is required." });
      return;
    }

    setFieldErrors({});
    setFormError("");
    setIsLoading(true);
    try {
      await authService.confirmSignup(username.trim(), code.trim());
      await onSignupComplete(username.trim(), password);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Confirmation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "confirm") {
    return (
      <main className="signup-page">
        <div className="signup-card">
          <h1>Check your email</h1>
          <p className="signup-subtitle">
            We sent a verification code to <strong>{email}</strong>.
          </p>
          <form className="signup-form" onSubmit={handleConfirm} noValidate>
            <div className="form-field">
              <label htmlFor="code">Verification code</label>
              <input
                id="code"
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={fieldErrors.code ? "input-error" : ""}
                autoComplete="one-time-code"
              />
              {fieldErrors.code && <span className="field-error">{fieldErrors.code}</span>}
            </div>
            {formError && <p className="signup-error">{formError}</p>}
            <button className="btn-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Verifying…" : "Verify & sign in"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="signup-page">
      <div className="signup-card">
        <h1>Create an account</h1>
        <p className="signup-subtitle">Sign up to start finding spaces.</p>
        <form className="signup-form" onSubmit={handleSignup} noValidate>
          <div className="form-field">
            <label htmlFor="su-username">Username</label>
            <input
              id="su-username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={fieldErrors.username ? "input-error" : ""}
            />
            {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="su-email">Email</label>
            <input
              id="su-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldErrors.email ? "input-error" : ""}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="su-password">Password</label>
            <input
              id="su-password"
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldErrors.password ? "input-error" : ""}
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="su-confirm">Confirm password</label>
            <input
              id="su-confirm"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldErrors.confirmPassword ? "input-error" : ""}
            />
            {fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>
          {formError && <p className="signup-error">{formError}</p>}
          <button className="btn-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="signup-login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
