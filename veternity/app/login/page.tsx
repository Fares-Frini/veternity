"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
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
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Image src="/logos/logo_color.png" alt="Veternity" width={34} height={34} className="rounded-md" />
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-[#1e2a4a]">Veternity</div>
            <div className="text-sm font-medium text-[#4a5a94]">Care. Connect. Make a Difference.</div>
          </div>
        </div>

        {/* Main area: characters left, form right */}
        <div className="flex min-h-0 flex-1 flex-row items-center justify-center gap-10">
          {/* Characters stage: a soft circular backdrop behind the animals
              (not clipped, so nothing of them is ever cut off). */}
          <div className="relative flex shrink-0 -translate-x-14 items-end justify-center">
            <div
              className="absolute rounded-full bg-[#c3d3f7]/60"
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
          <div className="relative w-[420px] rounded-[28px] border border-[#eee6d8] bg-[#fdfbf5] p-10 shadow-xl">
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
              className="absolute top-0 right-6 flex h-14 w-11 items-start justify-center rounded-b-md bg-[#f5b8cf] pt-2 shadow-sm"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)" }}
            >
              <PawIcon className="h-4 w-4 text-white" />
            </div>

            <div className="mt-8 text-center">
              <h1 className="text-[26px] leading-tight font-extrabold tracking-tight text-[#1e2a4a]">
                Sign in to your workspace
              </h1>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-[#7b88a8]">
                Your veterinary dashboard, simplified.
                <HeartIcon className="h-3.5 w-3.5 text-[#f5a8c4]" />
              </p>
            </div>

            <form onSubmit={handleLogin} autoComplete="off" className="mt-8 flex flex-col">
              <label className="mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-[#1e2a4a]">
                Username
                <PawIcon className="h-3 w-3 text-[#f5a8c4]" />
              </label>
              <div className="mb-1">
                <div className="flex h-12 items-center gap-2 rounded-full border border-[#c9d6f7] bg-[#f3f6ff] px-4 transition-colors focus-within:border-[#8fa8ef] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(143,168,239,0.2)]">
                  <UserIcon className="shrink-0 text-[#8fa8ef]" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    placeholder="Enter your username"
                    className="w-full bg-transparent text-sm text-[#1e2a4a] placeholder:text-[#a3ade0] focus:outline-none"
                  />
                </div>
                {fieldError.username && (
                  <div className="mt-1 pl-4 text-[13px] text-red-500">{fieldError.username}</div>
                )}
              </div>

              <label className="mt-5 mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-[#1e2a4a]">
                Password
                <PawIcon className="h-3 w-3 text-[#f5a8c4]" />
              </label>
              <div className="mb-1">
                <div className="flex h-12 items-center gap-2 rounded-full border border-[#c9d6f7] bg-[#f3f6ff] px-4 transition-colors focus-within:border-[#8fa8ef] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(143,168,239,0.2)]">
                  <LockIcon className="shrink-0 text-[#8fa8ef]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm text-[#1e2a4a] placeholder:text-[#a3ade0] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex shrink-0 items-center text-[#8fa8ef] transition-colors hover:text-[#5d7ce0]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {fieldError.password && (
                  <div className="mt-1 pl-4 text-[13px] text-red-500">{fieldError.password}</div>
                )}
              </div>

              {error && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-500">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#93b0f5] to-[#5d7ce0] text-[15px] font-bold tracking-wide text-white shadow-md transition-opacity hover:opacity-95 active:opacity-85 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <PawIcon className="h-4 w-4 text-white" />
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-5 flex items-center gap-3 text-[13px]">
              <div className="h-px flex-1 bg-[#eee6d8]" />
              <span className="text-[#a3ade0]">or</span>
              <div className="h-px flex-1 bg-[#eee6d8]" />
            </div>

            <button
              type="button"
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#eee6d8] bg-white text-sm font-medium text-[#1e2a4a] transition-colors hover:border-[#c9d6f7] hover:bg-[#f3f6ff]"
            >
              <FeishuIcon />
              Sign in with Feishu
            </button>

            <div className="mt-6 text-center text-[13px] text-[#7b88a8]">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-semibold text-[#5d7ce0] hover:text-[#3f5fd0] hover:underline">
                Contact your admin for access
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-30 flex shrink-0 items-center justify-between pt-4 pb-2 text-[13px] font-medium text-[#3a4a80]">
          <div className="flex items-center gap-3">
            <a href="#" className="transition-colors hover:text-[#1e2a4a]">
              Help Center
            </a>
            <span className="text-[#c9d6f7]">|</span>
            <a href="#" className="transition-colors hover:text-[#1e2a4a]">
              Privacy Policy
            </a>
            <PawIcon className="h-3.5 w-3.5 text-[#c9d6f7]" />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#eee6d8] bg-white/80 px-5 py-2 shadow-sm">
            <HeartIcon className="h-3.5 w-3.5 text-[#f5a8c4]" />
            <span>Built for Vets. Designed for Care.</span>
            <PawIcon className="h-3.5 w-3.5 text-[#c9d6f7]" />
          </div>

          <YarnBall className="h-16 w-16" />
        </div>
      </div>
    </div>
  );
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <ellipse cx="7" cy="8.5" rx="2.1" ry="2.7" />
      <ellipse cx="12" cy="6" rx="2.1" ry="2.7" />
      <ellipse cx="17" cy="8.5" rx="2.1" ry="2.7" />
      <path d="M12 12c3 0 5.5 2.1 5.5 5s-2 4.5-5.5 4.5S6.5 19.9 6.5 17s2.5-5 5.5-5Z" />
    </svg>
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

function UserIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM4 20c0-3.5 3.58-6 8-6s8 2.5 8 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.36 5.35A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a13.4 13.4 0 0 1-3.24 4.14M6.6 6.6C4.06 8.24 2 12 2 12a13.4 13.4 0 0 0 5.34 5.87"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
