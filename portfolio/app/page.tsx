"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./vsContainer/vs";

export default function Home() {
  const [installed, setInstalled] = useState(false);

  // --- Marketplace stats (realistic counters starting at 0) ---
  const DEFAULT_DOWNLOADS = 0;
  const DEFAULT_INSTALLS = 0;

  const [downloadsCount, setDownloadsCount] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_DOWNLOADS;
    const saved = window.localStorage.getItem("zp_downloads");
    return saved ? Number(saved) : DEFAULT_DOWNLOADS;
  });

  const [installsCount, setInstallsCount] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_INSTALLS;
    const saved = window.localStorage.getItem("zp_installs");
    return saved ? Number(saved) : DEFAULT_INSTALLS;
  });

  const formatCompact = (n: number) => {
    if (n >= 1_000_000)
      return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
    if (n >= 1_000)
      return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
    return n.toLocaleString();
  };

  const formatFull = (n: number) => n.toLocaleString();

  const meta = useMemo(
    () => ({
      name: "Zehra Portfolio",
      publisher: "zehra",
      version: "1.0.0",
      installs: formatFull(installsCount),
      rating: "4.9",
      downloads: formatCompact(downloadsCount),
      category: "Portfolio / Personal",
    }),
    [installsCount, downloadsCount]
  );

  const onDownload = () => {
    // Each click = a "download"
    const downloadsAdd = 1 + Math.floor(Math.random() * 3); // +1 to +3
    const newDownloads = downloadsCount + downloadsAdd;

    // Installs = subset of downloads (conversion)
    // 25%–55% chance per click
    const installChance = 0.25 + Math.random() * 0.3;
    const installsAdd = Math.random() < installChance ? 1 : 0;

    // Keep installs realistically below downloads (but allow growth from 0)
    const bufferedMaxInstalls = newDownloads;
    const newInstalls = Math.min(installsCount + installsAdd, bufferedMaxInstalls);

    setDownloadsCount(newDownloads);
    setInstallsCount(newInstalls);

    // Persist so it doesn't reset on refresh
    if (typeof window !== "undefined") {
      window.localStorage.setItem("zp_downloads", String(newDownloads));
      window.localStorage.setItem("zp_installs", String(newInstalls));
    }

    // open portfolio view
    setInstalled(true);
  };

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");

  const line1 = "Hi, I'm Zehra!\n";
  const line2 =
    "Look through my Visual Studio Code inspired portfolio to learn more about me!\nI’m interested in full-stack development, systems engineering, AI, and I enjoy building technology that solves real problems.";

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.02 } },
  };

  const char = {
    hidden: { opacity: 0, y: 6, filter: "blur(2px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.18 },
    },
  };

  const renderAnimatedText = (text: string, delay = 0) =>
    text.split("\n").map((line, lineIndex) => (
      <motion.div
        key={lineIndex}
        variants={container}
        initial="hidden"
        animate="show"
        transition={{ delay }}
        className="block"
      >
        {line.split("").map((c, i) => (
          <motion.span key={i} variants={char} className="inline-block">
            {c === " " ? "\u00A0" : c}
          </motion.span>
        ))}
      </motion.div>
    ));

  // Sends via user's email client (mailto) — no backend needed
  const onSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();

    const to = "zehraahmedzaidi@gmail.com";
    const subject = `Portfolio Contact — ${contactName || "Someone"}`;
    const body = [
      `Name: ${contactName || "(not provided)"}`,
      `Email: ${contactEmail || "(not provided)"}`,
      "",
      "Message:",
      contactMsg || "(empty)",
    ].join("\n");

    const mailto = `mailto:${to}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  };

  const GitHubIcon = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.33.1-2.77 0 0 .84-.28 2.75 1.05.8-.23 1.65-.34 2.5-.34.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.56 1.44.21 2.51.1 2.77.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.82-4.58 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.48A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );

  const LinkedInIcon = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.45 20.45H17v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.5H9.66V9h3.32v1.56h.05c.46-.87 1.6-1.8 3.29-1.8 3.52 0 4.17 2.32 4.17 5.34v6.35ZM5.34 7.43a1.93 1.93 0 1 1 0-3.86 1.93 1.93 0 0 1 0 3.86ZM6.98 20.45H3.7V9h3.28v11.45ZM22 2H2v20h20V2Z" />
    </svg>
  );

  return (
    <div className="w-screen h-screen overflow-hidden ">
      <AnimatePresence mode="wait">
        {!installed ? (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-hidden bg-[#ffffff]"
          >
            <div className="w-full h-full p-2 sm:p-6 lg:p-8">
<div className="w-full h-full rounded-3xl
  shadow-[0_45px_140px_rgba(0,0,0,0.30),0_0_110px_rgba(0,122,204,0.55)]
  ring-1 ring-black/10 p-2 sm:p-4">

              <div className="w-full h-full rounded-2xl overflow-hidden border border-[#2B2B2B] bg-[#1E1E1E] shadow-[0_20px_60px_rgba(0,0,0,.55)] flex flex-col">
                {/* Header */}
                <div className="h-10 bg-[#252526] border-b border-[#2B2B2B] flex items-center justify-between px-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                    <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="text-[12px] text-[#CCCCCC] tracking-wide">
                    Extensions: Marketplace
                  </div>
                  <div className="w-16" />
                </div>

                {/* Main */}
                <div className="flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
                  <div className="min-h-full xl:h-full grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-3 sm:gap-6 xl:gap-4 p-3 sm:p-6 lg:p-7 xl:p-5">
                    {/* LEFT */}
                    <div className="min-h-0 flex flex-col gap-3 sm:gap-6">
                      {/* Title */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#2D2D2D] border border-[#2B2B2B] flex items-center justify-center">
                          <span className="text-5xl sm:text-3xl">👩‍💻</span>
                        </div>

                        <div className="min-w-0">
                          <motion.h1
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="font-semibold text-xl sm:text-3xl text-[#D4D4D4] leading-tight"
                            aria-label={meta.name}
                          >
                            {meta.name.split("").map((c, i) => (
                              <motion.span key={i} variants={char} className="inline-block">
                                {c === " " ? "\u00A0" : c}
                              </motion.span>
                            ))}
                          </motion.h1>

                          <div className="mt-1 text-[12px] sm:text-sm text-[#858585]">
                            <span className="text-[#CCCCCC]">{meta.publisher}</span>
                            <span className="mx-2">•</span>
                            <span>v{meta.version}</span>
                            <span className="mx-2">•</span>
                            <span>{meta.category}</span>
                          </div>

                          {/* BADGES + QUICK DOWNLOAD */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-[12px] px-2 py-1 rounded-md bg-[#2D2D2D] border border-[#2B2B2B] text-[#CCCCCC]">
                              ★ {meta.rating}
                            </span>
                            <span className="text-[12px] px-2 py-1 rounded-md bg-[#2D2D2D] border border-[#2B2B2B] text-[#CCCCCC]">
                              {meta.downloads} downloads
                            </span>
                            <span className="text-[12px] px-2 py-1 rounded-md bg-[#2D2D2D] border border-[#2B2B2B] text-[#CCCCCC]">
                              {meta.installs} installs
                            </span>

                            {/* Quick Download button (same height) */}
                            <button
                              type="button"
                              onClick={onDownload}
                              className="text-[12px] px-3 py-1 rounded-md bg-[#007ACC] hover:bg-[#0987d1] text-white font-semibold border border-[#007ACC]"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      <div className="rounded-xl border border-[#2B2B2B] bg-[#161616] p-4 sm:p-6 lg:p-7 xl:p-5 flex flex-col xl:flex-1 xl:min-h-0">
                        <div className="text-[12px] lg:text-[13px] text-[#858585] mb-2">
                          Description
                        </div>

                        <div className="text-sm sm:text-base lg:text-base xl:text-base leading-relaxed text-[#CFCFCF] font-medium">
                          <div className="text-[#D4D4D4] font-semibold mb-2 lg:mb-3">
                            {renderAnimatedText(line1, 0.15)}
                          </div>
                          <div>{renderAnimatedText(line2, 0.55)}</div>
                        </div>
                      </div>

                      {/* FEATURES */}
                      <div className="rounded-xl border border-[#2B2B2B] bg-[#1B1B1B] p-4 sm:p-6 lg:p-7 xl:p-5 flex flex-col xl:flex-1 xl:min-h-0">
                        <div className="text-[12px] lg:text-[13px] text-[#858585] mb-3">
                          Features
                        </div>

                        <ul className="space-y-2 lg:space-y-3 xl:space-y-2 text-sm sm:text-base lg:text-base xl:text-base text-[#CCCCCC]">
                          <li className="flex gap-2">
                            <span className="text-[#4FC1FF]">•</span>
                            VS Code-style Explorer with tabs + file switching
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#4FC1FF]">•</span>
                            Responsive layout + wrapped editor text on small screens
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#4FC1FF]">•</span>
                            Clean UI inspired by VS Code Dark+
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#4FC1FF]">•</span>
                            Quick access buttons for socials + contact
                          </li>
                        </ul>

                        {/* Social buttons */}
                        <div className="mt-4 xl:mt-auto pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <a
                            href="https://github.com/zehraz1"
                            target="_blank"
                            rel="noreferrer"
                            className="h-11 rounded-md bg-[#2D2D2D] border border-[#2B2B2B] hover:bg-[#323232] text-[#D4D4D4] text-[13px] font-semibold flex items-center justify-between px-3"
                          >
                            <span className="flex items-center gap-2">
                              <GitHubIcon className="h-5 w-5 text-[#D4D4D4]" />
                              GitHub
                            </span>
                            <span className="text-[#858585]">↗</span>
                          </a>

                          <a
                            href="https://www.linkedin.com/in/zehrazaidi110/"
                            target="_blank"
                            rel="noreferrer"
                            className="h-11 rounded-md bg-[#0A66C2] hover:bg-[#0b72d6] text-white text-[13px] font-semibold flex items-center justify-between px-3"
                          >
                            <span className="flex items-center gap-2">
                              <LinkedInIcon className="h-5 w-5 text-white" />
                              LinkedIn
                            </span>
                            <span className="opacity-90">↗</span>
                          </a>
                        </div>
                      </div>

                      {/* Mobile-only: Download CTA */}
                      <div className="xl:hidden">
                        <button
                          type="button"
                          onClick={onDownload}
                          className="w-full h-12 rounded-xl bg-[#007ACC] hover:bg-[#0987d1] text-white font-semibold text-base flex items-center justify-center gap-3"
                        >
                          Download
                          <motion.span
                            aria-hidden="true"
                            animate={{ x: [0, 8, 0] }}
                            transition={{ duration: 1.1, repeat: Infinity }}
                            className="text-white text-xl"
                          >
                            ➜
                          </motion.span>
                        </button>
                        <div className="mt-2 text-[12px] text-[#858585] text-center">
                          Opens the VS Code portfolio view
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <aside className="min-h-0 flex flex-col gap-3 sm:gap-6">
                      {/* DOWNLOAD box */}
                      <div className="hidden xl:flex flex-1 min-h-0 rounded-xl border border-[#2B2B2B] bg-[#252526] overflow-hidden relative flex-col">
                        <button
                          type="button"
                          onClick={onDownload}
                          className="w-full h-14 bg-[#007ACC] hover:bg-[#0987d1] text-white font-semibold text-base"
                        >
                          Download
                        </button>

                        <div className="p-5 sm:p-6 space-y-4 text-[13px] sm:text-[14px] lg:text-[15px] text-[#CCCCCC] flex-1">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-[#1E1E1E] border border-[#2B2B2B] p-3">
                              <div className="text-[#858585] text-[12px]">Version</div>
                              <div className="mt-1 font-semibold">v{meta.version}</div>
                            </div>

                            <div className="rounded-lg bg-[#1E1E1E] border border-[#2B2B2B] p-3">
                              <div className="text-[#858585] text-[12px]">Category</div>
                              <div className="mt-1 font-semibold">{meta.category}</div>
                            </div>

                            <div className="rounded-lg bg-[#1E1E1E] border border-[#2B2B2B] p-3">
                              <div className="text-[#858585] text-[12px]">Rating</div>
                              <div className="mt-1 font-semibold">★ {meta.rating}</div>
                            </div>

                            <div className="rounded-lg bg-[#1E1E1E] border border-[#2B2B2B] p-3">
                              <div className="text-[#858585] text-[12px]">Installs</div>
                              <div className="mt-1 font-semibold">{meta.installs}</div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#2B2B2B]" />
                        </div>

                        <div className="px-5 sm:px-6 pb-5 text-[12px] text-[#858585]">
                          (Safe — it just opens my VS Code portfolio view)
                        </div>
                      </div>

                      {/* CONTACT ME form */}
                      <div className="rounded-xl border border-[#2B2B2B] bg-[#1B1B1B] p-4 sm:p-6 xl:p-5 flex flex-col xl:flex-1 xl:min-h-0">
                        <div className="text-[12px] text-[#858585] mb-3">Contact me</div>

                        <form onSubmit={onSubmitContact} className="flex-1 flex flex-col gap-3 min-h-0">
                          <input
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Name"
                            className="h-10 px-3 rounded-md bg-[#161616] border border-[#2B2B2B] text-[#D4D4D4] placeholder:text-[#6E6E6E] outline-none focus:border-[#007ACC]"
                          />

                          <input
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            className="h-10 px-3 rounded-md bg-[#161616] border border-[#2B2B2B] text-[#D4D4D4] placeholder:text-[#6E6E6E] outline-none focus:border-[#007ACC]"
                          />

                          <textarea
                            value={contactMsg}
                            onChange={(e) => setContactMsg(e.target.value)}
                            placeholder="Message"
                            rows={6}
                            className="flex-1 min-h-[120px] px-3 py-2 rounded-md bg-[#161616] border border-[#2B2B2B] text-[#D4D4D4] placeholder:text-[#6E6E6E] outline-none focus:border-[#007ACC] resize-none"
                          />

                          <div className="text-[12px] text-[#858585]">
                            Sends via your email app to{" "}
                            <span className="text-[#CCCCCC]">zehraahmedzaidi@gmail.com</span>
                          </div>

                          <button
                            type="submit"
                            className="h-10 rounded-md bg-[#007ACC] hover:bg-[#0987d1] text-white text-[13px] font-semibold"
                          >
                            Send email
                          </button>
                        </form>
                      </div>
                    </aside>
                  </div>
                </div>

                {/* Bottom */}
                <div className="h-7 bg-[#007ACC] flex items-center justify-between px-3 text-white text-[12px] shrink-0">
                  <span className="font-semibold">Extensions</span>
                  <span className="opacity-90">Marketplace • Dark+ theme</span>
                </div>
              </div>
            </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="vscode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full overflow-hidden bg-[#0F111A]"
          >
            <Container fullPage onBack={() => setInstalled(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
