"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./vsContainer/vs";

const GitHubIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.33.1-2.77 0 0 .84-.28 2.75 1.05.8-.23 1.65-.34 2.5-.34.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.56 1.44.21 2.51.1 2.77.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.82-4.58 5.08.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.48A10.05 10.05 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
  </svg>
);

const LinkedInIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M20.45 20.45H17v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.5H9.66V9h3.32v1.56h.05c.46-.87 1.6-1.8 3.29-1.8 3.52 0 4.17 2.32 4.17 5.34v6.35ZM5.34 7.43a1.93 1.93 0 1 1 0-3.86 1.93 1.93 0 0 1 0 3.86ZM6.98 20.45H3.7V9h3.28v11.45ZM22 2H2v20h20V2Z" />
  </svg>
);

export default function Home() {
  const [installed, setInstalled] = useState(false);

  // --- Marketplace stats (realistic counters starting at 0) ---
  const DEFAULT_DOWNLOADS = 0;

  const [downloadsCount, setDownloadsCount] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_DOWNLOADS;
    const saved = window.localStorage.getItem("zp_downloads");
    return saved ? Number(saved) : DEFAULT_DOWNLOADS;
  });

  const formatCompact = (n: number) => {
    if (n >= 1_000_000)
      return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
    return n.toLocaleString();
  };

  const meta = useMemo(
    () => ({
      name: "Zehra's Portfolio",
      publisher: "zehra",
      version: "1.0.0",
      rating: "5.0",
      downloads: formatCompact(downloadsCount),
      category: "Portfolio / Personal",
    }),
    [downloadsCount]
  );

  const onDownload = () => {
    // Each click = a "download"
    const downloadsAdd = 1 + Math.floor(Math.random() * 3); // +1 to +3
    const newDownloads = downloadsCount + downloadsAdd;

    setDownloadsCount(newDownloads);

    // Persist so it doesn't reset on refresh
    if (typeof window !== "undefined") {
      window.localStorage.setItem("zp_downloads", String(newDownloads));
    }

    // open portfolio view
    setInstalled(true);
  };

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");

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
            className="w-full h-full overflow-hidden bg-[#FFF6FA]"
          >
            <div className="w-full h-full p-2 sm:p-6 lg:p-8">
              <div className="w-full h-full sm:rounded-3xl shadow-[80px_80px_80px_rgba(0,0,0,0)] sm:p-4">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-[#FFFFFF] shadow-[0_20px_60px_rgba(17,24,39,.18)] flex flex-col">
                  {/* Header */}
                  <div className="h-10 bg-[#FFE4F0] border-b border-[#F3B6D3] flex items-center justify-between px-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#FF5FA2]" />
                      <span className="h-3 w-3 rounded-full bg-[#FFC062]" />
                      <span className="h-3 w-3 rounded-full bg-[#41D3A2]" />
                    </div>
                    <div className="text-[12px] text-[#6B2B4A] tracking-wide items-center flex justify-center">
                      Zehra&apos;s Portfolio
                    </div>
                    <div className="w-16" />
                  </div>

                  {/* Main */}
                  <div className="flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
                    <div className="min-h-full xl:h-full grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-3 sm:gap-6 xl:gap-4 p-3 sm:p-6 lg:p-7 xl:p-5">
                      {/* LEFT */}
                      <div className="min-h-0 flex flex-col gap-3 sm:gap-6">
                        {/* Title */}
                        <div className="flex items-start gap-3 sm:gap-4 mt-1 mb-1">
                          <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FFF0F7] border border-[#F3B6D3] flex items-center justify-center">
                            <span className="text-5xl sm:text-3xl">👩‍💻</span>
                          </div>

                          <div className="min-w-0">
                            <motion.h1
                              variants={container}
                              initial="hidden"
                              animate="show"
                              className="font-semibold text-lg sm:text-3xl text-[#3A0F24] leading-tight"
                              aria-label={meta.name}
                            >
                              {meta.name.split("").map((c, i) => (
                                <motion.span
                                  key={i}
                                  variants={char}
                                  className="inline-block"
                                >
                                  {c === " " ? "\u00A0" : c}
                                </motion.span>
                              ))}
                            </motion.h1>

                            <div className="mt-1 text-[12px] sm:text-sm text-[#8A4A69]">
                              <span className="text-[#6B2B4A]">
                                {meta.publisher}
                              </span>
                              <span className="mx-2">•</span>
                              <span>v{meta.version}</span>
                              <span className="mx-2">•</span>
                              <span>{meta.category}</span>
                            </div>

                            {/* BADGES + QUICK DOWNLOAD */}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="text-[12px] px-2 py-1 rounded-md bg-[#FFF0F7] border border-[#F3B6D3] text-[#6B2B4A]">
                                ★ {meta.rating}
                              </span>
                              <span className="text-[12px] px-2 py-1 rounded-md bg-[#FFF0F7] border border-[#F3B6D3] text-[#6B2B4A]">
                                {meta.downloads} downloads
                              </span>

                              <button
                                type="button"
                                onClick={onDownload}
                                className="text-[12px] px-3 py-1 rounded-md bg-[#FF4FA3] hover:bg-[#FF3797] text-white font-semibold border border-[#FF4FA3]"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="rounded-xl border border-[#F3B6D3] bg-[#FFF7FB] p-4 sm:p-6 lg:p-7 xl:p-5 flex flex-col xl:flex-1 xl:min-h-0">
                          <div className="text-[12px] lg:text-[13px] text-[#8A4A69] mb-2">
                            About Me
                          </div>

                          <p className="text-sm sm:text-base lg:text-base xl:text-base leading-relaxed text-[#4A1630] font-medium">
                            <span className="text-[#FF4FA3] font-semibold">
                              Hi, I am Zehra — a software engineer and developer.
                            </span>
                            <br />
                            <br />
                            I’m passionate about full-stack development, embedded systems, and AI, and I enjoy building practical technology that solves real problems. I’m also active in student leadership and love connecting with people who are curious, driven, and eager to learn.
                            <br />
                            <br />
                            <span className="text-[13px] text-[#8A4A69] font-normal">
                              Click “Download” to learn more about me! ✨
                            </span>
                          </p>
                        </div>

                        {/* FEATURES */}
                        <div className="rounded-xl border border-[#F3B6D3] bg-[#FFF7FB] p-4 sm:p-6 lg:p-7 xl:p-5 flex flex-col xl:flex-1 xl:min-h-0">
                          <div className="text-[12px] lg:text-[13px] text-[#8A4A69] mb-1">
                            Hobbies & Interests
                          </div>

                          <ul className="space-y-2 lg:space-y-3 xl:space-y-2 text-sm sm:text-base lg:text-base xl:text-base text-[#4A1630]">
                            <li className="flex gap-2">
                              <span className="text-[#FF4FA3]">•</span>
                              🏋️‍♀️ Gym girl — love training & staying active
                            </li>
                            <li className="flex gap-2">
                              <span className="text-[#FF4FA3]">•</span>
                              🪽 Red Bull enthusiast (yes, the wings are real)
                            </li>
                            <li className="flex gap-2">
                              <span className="text-[#FF4FA3]">•</span>
                              📌 Pinterest addict (inspo scrolling)
                            </li>
                            <li className="flex gap-2">
                              <span className="text-[#FF4FA3]">•</span>
                              🌸 Perfume obsessed — I love a good signature scent
                            </li>
                          </ul>

                          {/* Social buttons */}
                          <div className="mt-4 xl:mt-auto pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <a
                              href="https://github.com/zehraz1"
                              target="_blank"
                              rel="noreferrer"
                              className="h-11 rounded-md bg-[#FFF0F7] border border-[#F3B6D3] hover:bg-[#FFE4F0] text-[#3A0F24] text-[13px] font-semibold flex items-center justify-between px-3"
                            >
                              <span className="flex items-center gap-2">
                                <GitHubIcon className="h-5 w-5 text-[#3A0F24]" />
                                GitHub
                              </span>
                              <span className="text-[#8A4A69]">↗</span>
                            </a>

                            <a
                              href="https://www.linkedin.com/in/zehrazaidi110/"
                              target="_blank"
                              rel="noreferrer"
                              className="h-11 rounded-md bg-[#FF4FA3] hover:bg-[#FF3797] text-white text-[13px] font-semibold flex items-center justify-between px-3"
                            >
                              <span className="flex items-center gap-2">
                                <LinkedInIcon className="h-5 w-5 text-white" />
                                LinkedIn
                              </span>
                              <span className="opacity-90">↗</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <aside className="min-h-0 flex flex-col gap-3 sm:gap-6">
                        <div className="rounded-xl border border-[#F3B6D3] bg-[#FFF7FB] p-4 sm:p-6 xl:p-5 flex flex-col xl:flex-1 xl:min-h-0">
                          <div className="text-[12px] text-[#8A4A69] mb-3">
                            Contact me
                          </div>

                          <form
                            onSubmit={onSubmitContact}
                            className="flex-1 flex flex-col gap-3 min-h-0"
                          >
                            <input
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="Name"
                              className="h-10 px-3 rounded-md bg-[#FFFFFF] border border-[#F3B6D3] text-[#3A0F24] placeholder:text-[#B77A97] outline-none focus:border-[#FF4FA3]"
                            />

                            <input
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="Email"
                              type="email"
                              className="h-10 px-3 rounded-md bg-[#FFFFFF] border border-[#F3B6D3] text-[#3A0F24] placeholder:text-[#B77A97] outline-none focus:border-[#FF4FA3]"
                            />

                            <textarea
                              value={contactMsg}
                              onChange={(e) => setContactMsg(e.target.value)}
                              placeholder="Message"
                              rows={6}
                              className="flex-1 min-h-30 px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#F3B6D3] text-[#3A0F24] placeholder:text-[#B77A97] outline-none focus:border-[#FF4FA3] resize-none"
                            />

                            <div className="text-[12px] text-[#8A4A69]">
                              Sends via your email app to{" "}
                              <span className="text-[#6B2B4A]">
                                zehraahmedzaidi@gmail.com
                              </span>
                            </div>

                            <button
                              type="submit"
                              className="h-10 rounded-md bg-[#FF4FA3] hover:bg-[#FF3797] text-white text-[13px] font-semibold"
                            >
                              Send email
                            </button>
                          </form>
                        </div>
                      </aside>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="h-7 bg-[#FF4FA3] flex items-center justify-between px-3 text-white text-[12px] shrink-0">
                    <span className="font-semibold">Zehra&apos;s Portfolio</span>
                    <span className="opacity-90">@Zehra2026</span>
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
            className="w-full h-full overflow-hidden bg-[#FFF6FA]"
          >
            <Container fullPage onBack={() => setInstalled(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
