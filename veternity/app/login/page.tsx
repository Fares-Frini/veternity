"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bone02Icon, LockIcon, UserIcon, ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import AnimatedCharacters from "@/components/animated-characters/AnimatedCharacters";

async function mockLogin(_values: { username: string; password: string }) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { data: { access_token: "mock_token_" + Date.now() } };
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<{ username?: string; password?: string }>({});

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextFieldError: { username?: string; password?: string } = {};
    if (!username) nextFieldError.username = "Please enter your username";
    else if (username.length < 3) nextFieldError.username = "Username must be at least 3 characters";
    if (!password) nextFieldError.password = "Please enter your password";
    else if (password.length < 6) nextFieldError.password = "Password must be at least 6 characters";
    setFieldError(nextFieldError);
    if (nextFieldError.username || nextFieldError.password) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await mockLogin({ username, password });
      localStorage.setItem("access_token", data.access_token);
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch {
      setError("Incorrect username or password, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background felt texture */}
      <Image src="/assets/whoold_background.png" alt="" fill priority className="object-cover" />

      {/* Top-left corner cloud */}
      <img
        src="/assets/tl_whool_cloud.png"
        alt=""
        className="pointer-events-none absolute top-0 left-0 z-10 w-[340px] opacity-95"
      />

      {/* Bottom cloud band (ground) */}
      <img
        src="/assets/whool_cloud.png"
        alt=""
        className="pointer-events-none absolute inset-x-0 bottom-[-100px] z-[15] w-full select-none"
      />

      {/* Content */}
      <div className="relative z-20 flex h-full w-full flex-col px-14 py-8">
        {/* Brand mark */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent shadow-sm">
            <Image src="/logos/logo_color.png" alt="Veternity" width={34} height={34} className="rounded-md" />
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-foreground">Veternity</div>
            <div className="text-sm font-medium text-muted-foreground">Care. Connect. Make a Difference.</div>
          </div>
        </div>

        {/* Main area: characters left, form right */}
        <div className="flex min-h-0 flex-1 flex-row items-center justify-center gap-10">
          {/* Characters stage: a soft circular backdrop behind the animals
              (not clipped, so nothing of them is ever cut off). */}
          <div className="relative flex shrink-0 -translate-x-14 items-end justify-center">
            <div
              className="absolute rounded-full bg-primary/10"
              style={{ width: "600px", height: "600px", bottom: "0px" }}
            />
            <div className="relative z-20">
              <AnimatedCharacters
                isTyping={isTyping}
                showPassword={showPassword}
                passwordLength={password.length}
              />
            </div>
          </div>

          {/* Login card */}
          <div className="relative w-[420px] rounded-[28px] border border-border bg-card p-10 shadow-xl">
            {/* Overlapping badge */}
            <div className="absolute -top-11 left-1/2 -translate-x-1/2">
              <Image
                src="/assets/whool_logo.png"
                alt=""
                width={88}
                height={88}
                className="rounded-full shadow-md"
              />
            </div>

            {/* Corner ribbon */}
            <div
              className="absolute top-0 right-6 flex h-14 w-11 items-start justify-center rounded-b-md bg-status-pink pt-2 shadow-sm"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)" }}
            >
              <HugeiconsIcon icon={Bone02Icon} className="h-4 w-4 text-white" strokeWidth={2.4} />
            </div>

            <div className="mt-8 text-center">
              <h1 className="text-[26px] leading-tight font-extrabold tracking-tight text-foreground">
                Sign in to your workspace
              </h1>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                Your veterinary dashboard, simplified.
                <HeartIcon className="h-3.5 w-3.5 text-status-pink" />
              </p>
            </div>

            <form onSubmit={handleLogin} autoComplete="off" className="mt-8 flex flex-col">
              <label className="mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-foreground">
                Username
                <HugeiconsIcon icon={Bone02Icon} className="h-3 w-3 text-status-pink" strokeWidth={2.4} />
              </label>
              <div className="mb-1">
                <div className="flex h-12 items-center gap-2 rounded-full border border-border bg-muted px-4 transition-colors focus-within:border-primary focus-within:bg-card focus-within:shadow-[0_0_0_3px_rgba(0,153,142,0.15)]">
                  <HugeiconsIcon icon={UserIcon} className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    placeholder="Enter your username"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                {fieldError.username && (
                  <div className="mt-1 pl-4 text-[13px] text-status-danger">{fieldError.username}</div>
                )}
              </div>

              <label className="mt-5 mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-foreground">
                Password
                <HugeiconsIcon icon={Bone02Icon} className="h-3 w-3 text-status-pink" strokeWidth={2.4} />
              </label>
              <div className="mb-1">
                <div className="flex h-12 items-center gap-2 rounded-full border border-border bg-muted px-4 transition-colors focus-within:border-primary focus-within:bg-card focus-within:shadow-[0_0_0_3px_rgba(0,153,142,0.15)]">
                  <HugeiconsIcon icon={LockIcon} className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex shrink-0 items-center text-muted-foreground transition-colors hover:text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <HugeiconsIcon icon={showPassword ? ViewIcon : ViewOffIcon} className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
                {fieldError.password && (
                  <div className="mt-1 pl-4 text-[13px] text-status-danger">{fieldError.password}</div>
                )}
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-status-danger/30 bg-status-danger-bg px-4 py-2.5 text-[13px] text-status-danger">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#00b3a4] to-primary text-[15px] font-bold tracking-wide text-primary-foreground shadow-md transition-opacity hover:opacity-95 active:opacity-85 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <HugeiconsIcon icon={Bone02Icon} className="h-4 w-4 text-primary-foreground" strokeWidth={2.4} />
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-5 flex items-center gap-3 text-[13px]">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted"
            >
              <FeishuIcon />
              Sign in with Feishu
            </button>

            <div className="mt-6 text-center text-[13px] text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                Contact your admin for access
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-30 flex shrink-0 items-center justify-between pt-4 pb-2 text-[13px] font-medium text-foreground">
          <div className="flex items-center gap-3">
            <a href="#" className="transition-colors hover:text-primary">
              Help Center
            </a>
            <span className="text-border">|</span>
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <HugeiconsIcon icon={Bone02Icon} className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.4} />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-2 shadow-sm">
            <HeartIcon className="h-3.5 w-3.5 text-status-pink" />
            <span>Built for Vets. Designed for Care.</span>
            <HugeiconsIcon icon={Bone02Icon} className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2.4} />
          </div>

          <YarnBall className="h-16 w-16" />
        </div>
      </div>
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7.5-4.6-10-9.1C.5 8.6 2.2 5 5.7 5c2 0 3.4 1 4.3 2.3C11 5.9 12.4 5 14.3 5c3.5 0 5.2 3.6 3.7 6.9C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

function YarnBall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path
        d="M8 70c15-25 40-8 45-30"
        fill="none"
        stroke="#e5799f"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="62" cy="62" r="26" fill="#f5a8c4" />
      <circle cx="62" cy="62" r="26" fill="url(#yarnShine)" />
      <path d="M40 52c8 10 8 22 0 32M50 40c14 8 20 22 12 36M56 74c10-2 18-10 20-20" fill="none" stroke="#e5799f" strokeWidth="1.5" opacity="0.6" />
      <defs>
        <radialGradient id="yarnShine" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function FeishuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#00D6B9" />
      <path
        d="M6 15.5c2-1 3.5-3 4-6.5 1 3 3 5 6 5.5-1.5 1-3.5 3-4 6.5-1-3-3-5-6-5.5Z"
        fill="white"
      />
    </svg>
  );
}
