"use client";

import AnimatedCharacters from "@/components/animated-characters/AnimatedCharacters";
import { PawIcon } from "@/components/layout/icons";
import { LockIcon, UserIcon, ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import {
  BoneDoodle,
  GroundBack,
  GroundFront,
  HeartIcon,
  PawMark,
  PawPattern,
  PawTrail,
} from "./_components/decorations";

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
    if (!username) nextFieldError.username = "Entrez votre nom d'utilisateur";
    else if (username.length < 3) nextFieldError.username = "3 caractères minimum";
    if (!password) nextFieldError.password = "Entrez votre mot de passe";
    else if (password.length < 6) nextFieldError.password = "6 caractères minimum";
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
      setError("Identifiants incorrects, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[linear-gradient(180deg,#e8f1ff_0%,#f5f8fd_48%,#fbfcfe_100%)]">
      <PawPattern className="pointer-events-none absolute inset-0 z-0 h-full w-full text-primary/[0.045]" />

      <div className="pointer-events-none absolute -top-40 -left-32 z-0 h-[520px] w-[520px] rounded-full bg-white/70 blur-3xl" />

      <PawTrail className="float-soft-slow pointer-events-none absolute top-[10%] left-1/2 z-[5] w-190 -translate-x-1/2 text-primary" />

      <PawMark className="float-soft pointer-events-none absolute top-[30%] left-[7%] z-[5] h-7 w-7 -rotate-12 text-primary/15" />
      <PawMark className="float-soft-slow pointer-events-none absolute top-[22%] right-[9%] z-[5] h-9 w-9 rotate-12 text-primary/12" />
      <BoneDoodle className="float-soft-slow pointer-events-none absolute top-[44%] left-[4%] z-[5] w-14 -rotate-12 text-primary/12" />
      <HeartIcon className="float-soft pointer-events-none absolute top-[38%] right-[5%] z-[5] h-6 w-6 text-status-pink/25" />

      <GroundBack className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-125 w-full" />

      <div className="relative flex h-full w-full flex-col px-8 pt-8 pb-6 xl:px-14">
        <div className="relative z-30 flex shrink-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-card shadow-md ring-1 ring-black/5">
            <Image src="/logos/logo_color.png" alt="Veternity" width={36} height={36} className="rounded-md" />
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-foreground">Veternity</div>
            <div className="text-sm font-medium text-muted-foreground">Soignez. Connectez. Faites la différence.</div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center gap-10 xl:gap-24">
          <div className="relative z-20 hidden shrink-0 items-end justify-center lg:flex">
            <div className="pointer-events-none absolute bottom-10 h-[620px] w-[620px] rounded-full bg-white/45 blur-3xl" />
            <div className="relative origin-bottom scale-110 2xl:scale-125">
              <AnimatedCharacters isTyping={isTyping} showPassword={showPassword} passwordLength={password.length} />
            </div>
          </div>

          <div className="relative z-30 w-[500px] shrink-0 rounded-[32px] border border-border bg-card px-11 pt-16 pb-10 shadow-2xl lg:translate-x-10">
            <div className="pointer-events-none absolute inset-2.5 rounded-[24px] border-2 border-dashed border-primary/15" />

            <div className="absolute -top-11 left-1/2 flex h-22 w-22 -translate-x-1/2 items-center justify-center rounded-full bg-card shadow-lg ring-1 ring-black/5">
              <span className="flex h-17 w-17 items-center justify-center rounded-full bg-[#299CF1]">
                <PawIcon className="h-9 w-9 text-primary-foreground" />
              </span>
            </div>

            <h1 className="relative text-center text-[30px] leading-tight font-extrabold tracking-tight text-foreground">
              Content de vous revoir&nbsp;!
            </h1>

            <form onSubmit={handleLogin} autoComplete="off" className="relative mt-7 flex flex-col">
              <label className="mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-foreground">
                Nom d&apos;utilisateur
                <PawIcon className="h-3 w-3 text-status-pink" />
              </label>
              <div>
                <div className="flex h-12 items-center gap-2 rounded-full border border-border bg-muted px-4 transition-colors focus-within:border-primary focus-within:bg-card focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_15%,transparent)]">
                  <HugeiconsIcon icon={UserIcon} className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    placeholder="Ex : dr.kadiri"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                {fieldError.username && (
                  <div className="mt-1 pl-4 text-[13px] text-status-danger">{fieldError.username}</div>
                )}
              </div>

              <label className="mt-4 mb-1.5 flex items-center gap-1 text-[13px] font-semibold text-foreground">
                Mot de passe
                <PawIcon className="h-3 w-3 text-status-pink" />
              </label>
              <div>
                <div className="flex h-12 items-center gap-2 rounded-full border border-border bg-muted px-4 transition-colors focus-within:border-primary focus-within:bg-card focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_15%,transparent)]">
                  <HugeiconsIcon icon={LockIcon} className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex shrink-0 items-center text-muted-foreground transition-colors hover:text-primary"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-[#299CF1] text-[15px] font-bold tracking-wide text-primary-foreground shadow-lg transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <PawIcon className="h-4 w-4 text-primary-foreground" />
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="relative mt-5 text-center text-[13px] text-muted-foreground">
              Besoin d&apos;aide ?{" "}
              <a href="#" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                Contactez votre administrateur
              </a>
            </div>
          </div>
        </div>

        <div className="relative z-30 flex shrink-0 items-center justify-between text-[13px] font-medium text-foreground">
          <div className="flex items-center gap-3">
            <a href="#" className="transition-colors hover:text-primary">
              Centre d&apos;aide
            </a>
            <span className="text-border">|</span>
            <a href="#" className="transition-colors hover:text-primary">
              Confidentialité
            </a>
          </div>
          <span className="text-muted-foreground">© {new Date().getFullYear()} Veternity</span>
        </div>
      </div>

      <GroundFront className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-78.5 w-full" />
    </div>
  );
}
