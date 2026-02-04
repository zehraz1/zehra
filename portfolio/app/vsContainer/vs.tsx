"use client";
import { useMemo, useRef, useLayoutEffect, useState } from "react";

function wrapToWidth(text, maxChars) {
  const paragraphs = text.split("\n");
  const out = [];

  for (const p of paragraphs) {
    const words = p.split(" ");
    let line = "";

    if (p.trim() === "") {
      out.push("");
      continue;
    }

    for (const w of words) {
      if (w.length > maxChars) {
        if (line.trim() !== "") {
          out.push(line.trimEnd());
          line = "";
        }
        for (let i = 0; i < w.length; i += maxChars) {
          out.push(w.slice(i, i + maxChars));
        }
        continue;
      }

      const candidate = line.length ? `${line} ${w}` : w;

      if (candidate.length <= maxChars) {
        line = candidate;
      } else {
        if (line.length) out.push(line);
        line = w;
      }
    }

    if (line.length) out.push(line);
  }

  return out;
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[#F3B6D3] bg-[#FFF0F7] px-2 py-0.5 text-[11px] text-[#6B2B4A]">
      {children}
    </span>
  );
}

function ExtensionsExperienceView({ items }) {
  return (
    <div className="p-3 sm:p-6">
      <div className="mb-3 sm:mb-6">
        <div className="text-[#3A0F24] text-[16px] sm:text-[18px] font-semibold">
          Experience
        </div>
      </div>

      {/* SCROLLER */}
      <div
        className="subtleScroll max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-260px)] overflow-y-auto pr-1"
        style={{ scrollbarGutter: "stable" }}
      >

        <div className="space-y-3 sm:space-y-4">
          {items.map((role) => (
            <div
              key={role.id}
              className="rounded-xl border border-[#F3B6D3] bg-[#FFF7FB] hover:bg-[#FFEFF7] transition-colors"
            >
              {/* ONLY CHANGE: flex → grid on sm+ */}
              <div className="p-3 sm:p-5 flex flex-col sm:grid sm:grid-cols-[1fr_150px] gap-3 sm:gap-4">
                {/* LEFT COLUMN */}
                <div>
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="shrink-0">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#FFFFFF] border border-[#F3B6D3] flex items-center justify-center text-[#FF4FA3] font-bold text-[13px] sm:text-[14px]">
                        {role.logoText ?? "GD"}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[#3A0F24] text-[13px] sm:text-[15px] font-semibold leading-snug whitespace-normal break-words">
                        {role.title}
                      </div>

                      <div className="text-[#6B2B4A] text-[11.5px] sm:text-[13px] mt-0.5 leading-snug whitespace-normal break-words">
                        {role.company}{" "}
                        <span className="text-[#8A4A69]">
                          <br />
                          {role.dates}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TOOLS */}
                  {role.tools?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {role.tools.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  )}

                  {/* SUMMARY */}
                  <div className="mt-3 text-[#4A1630] text-[12px] sm:text-[13px] leading-relaxed break-words whitespace-normal">
                    {role.summary}
                  </div>

                  {/* META */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-[#8A4A69] break-words">
                    <span>{role.location}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-[#6B2B4A]">{role.team}</span>
                  </div>
                </div>

                {/* RIGHT COLUMN — ROLE TYPE */}
                <div className="flex sm:justify-end sm:items-start">
                  <button
                    type="button"
                    className="h-8 px-3 rounded-md bg-[#FF4FA3] hover:bg-[#FF3797] text-white text-[12px] font-semibold w-full sm:w-auto"
                    title="Role type"
                  >
                    {role.roleType ?? "Experience"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Projects cards look clean on md/lg, still great on mobile */
function ExtensionsProjectsView({ items }) {
  return (
    <div className="p-3 sm:p-6">
      <div className="mb-3 sm:mb-6">
        <div className="text-[#3A0F24] text-[16px] sm:text-[18px] font-semibold">
          Projects
        </div>
      </div>

      {/* SCROLLER */}
      <div
        className="subtleScroll max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-260px)] overflow-y-auto pr-1"
        style={{ scrollbarGutter: "stable" }}
      >

        <div className="space-y-3 sm:space-y-4">
          {items.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-[#F3B6D3] bg-[#FFF7FB] hover:bg-[#FFEFF7] transition-colors"
            >
              <div className="p-3 sm:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:gap-5 gap-3">
                  <div className="shrink-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#FFFFFF] border border-[#F3B6D3] flex items-center justify-center text-[#FF4FA3] font-bold text-[13px] sm:text-[14px]">
                      {p.logoText ?? "PR"}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[#3A0F24] text-[13px] sm:text-[15px] font-semibold leading-snug break-words whitespace-normal">
                      {p.title}
                    </div>

                    <div className="mt-2 text-[#4A1630] text-[12px] sm:text-[13px] leading-relaxed break-words whitespace-normal">
                      {p.description}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.languages.map((lang) => (
                        <Badge key={lang}>{lang}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-[220px] w-full flex flex-col gap-2 md:items-end">
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 h-8 px-3 rounded-md border border-[#F3B6D3] bg-[#FFF0F7] hover:bg-[#FFE4F0] text-[12px] text-[#3A0F24]"
                        title="Open GitHub"
                      >
                        <span className="text-[#6B2B4A]">GitHub</span>
                        <span className="text-[#8A4A69]">↗</span>
                      </a>
                    ) : (
                      <div className="text-[#8A4A69] text-[12px] w-full md:w-auto text-center md:text-right">
                        GitHub: Coming soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillPill({ name, iconUrl, fallback }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="flex items-center gap-2 rounded-md border border-[#F3B6D3] bg-[#FFFFFF] hover:bg-[#FFEFF7] transition-colors px-2.5 py-2 min-w-0">
      <div className="h-6 w-6 rounded bg-[#FFF0F7] border border-[#F3B6D3] flex items-center justify-center shrink-0 overflow-hidden">
        {iconUrl && imgOk ? (
          <img
            src={iconUrl}
            alt={`${name} logo`}
            className="h-4 w-4"
            onError={() => setImgOk(false)}
          />
        ) : (
          <span className="text-[10px] text-[#FF4FA3] font-bold">
            {fallback ?? name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="text-[12px] sm:text-[13px] text-[#4A1630] truncate">
        {name}
      </div>
    </div>
  );
}

function SkillsSection({ title, items }) {
  return (
    <div className="rounded-xl border border-[#F3B6D3] bg-[#FFF7FB]">
      <div className="p-3 sm:p-5 border-b border-[#F3B6D3]">
        <div className="text-[#3A0F24] text-[13px] sm:text-[15px] font-semibold">
          {/* On very small screens, allow full wrap */}
          <span className="block sm:inline break-words whitespace-normal">
            {title}
          </span>
        </div>
        <div className="text-[#8A4A69] text-[11.5px] sm:text-[12px] mt-1">
          {items.length} items
        </div>
      </div>

      <div className="p-3 sm:p-5">
        {/* Small screens: 1 per line. sm+: grid */}
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-3">
          {items.map((s) => (
            <SkillPill
              key={s.name}
              name={s.name}
              iconUrl={s.iconUrl}
              fallback={s.fallback}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExtensionsSkillsView({ languages, tools }) {
  return (
    <div className="p-3 sm:p-6">
      <div className="mb-3 sm:mb-6">
        <div className="text-[#3A0F24] text-[16px] sm:text-[18px] font-semibold">
          Skills
        </div>
      </div>

      {/* SCROLLER */}
      <div
        className="subtleScroll max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-260px)] overflow-y-auto pr-1"
        style={{ scrollbarGutter: "stable" }}
      >

        <div className="space-y-3 sm:space-y-4">
          <SkillsSection title="Languages" items={languages} />
          <SkillsSection title="Developer Tools & Technologies" items={tools} />
        </div>
      </div>
    </div>
  );
}

export default function Container({ fullPage = false, onBack } = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const experienceRoles = useMemo(
    () => [
      {
        id: "gdms",
        company: "General Dynamics Mission Systems–Canada",
        title: "Software Developer and Test Intern",
        dates: "January 2025 – Present",
        logoText: "GD",
        location: "Calgary, AB",
        team: "ASIS Team",
        roleType: "Internship",
        tools: ["Python", ".NET Framework", "C#", "XAML", "Squish", "MVVM", "SAFe"],
        summary:
          "Developed and implemented mission-critical .NET Framework features in C#, enhancing LAV 6 radio communication and simplifying crew operations in high-stress environments.",
      },

      {
        id: "sec-2024",
        company: "Schulich Engineering Competition",
        title: "Programming Director",
        dates: "August 2024 – September 2024",
        logoText: "SEC",
        location: "Calgary, AB",
        team: "UofC Club",
        roleType: "Leadership",
        tools: [],
        summary:
          "Led the development of an engineering programming challenge for competition participants, designing a prompt that tested problem-solving and technical coding skills.",
      },

      {
        id: "cec-2024",
        company: "CFES Canadian Engineering Competition",
        title: "Consulting Director",
        dates: "September 2023 – March 2024",
        logoText: "CEC",
        location: "Calgary, AB",
        team: "UofC Club",
        roleType: "Leadership",
        tools: [],
        summary:
          "Directed the development of a detailed prompt for national engineering competitors, aligning with the competition’s main objectives and emphasizing energy and sustainability.",
      },
    ],
    []
  );

  const skillLanguages = useMemo(
    () => [
      {
        name: "Python",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      },
      {
        name: "C++",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      },
      {
        name: "C",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
      },
      {
        name: "C#",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
      },
      {
        name: "Java",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
      {
        name: "TypeScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "JavaScript",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "SQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        fallback: "SQL",
      },
      { name: "Assembly", iconUrl: null, fallback: "ASM" },
      {
        name: "HTML",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        name: "CSS",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
      { name: "JSON", iconUrl: null, fallback: "{}" },
    ],
    []
  );

  const skillTools = useMemo(
    () => [
      {
        name: ".NET",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
        fallback: ".N",
      },
      { name: "WPF", iconUrl: null, fallback: "WP" },
      {
        name: "React",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Node.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Next.js",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        fallback: "NX",
      },
      {
        name: "Flask",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
        fallback: "FL",
      },
      {
        name: "Tailwind CSS",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
      { name: "Framer Motion", iconUrl: null, fallback: "FM" },
      {
        name: "PostgreSQL",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "Firebase",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
      },
      {
        name: "Git",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "GitHub",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
        fallback: "GH",
      },
      {
        name: "Linux",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
      },
      { name: "JUnit", iconUrl: null, fallback: "JU" },
      { name: "Squish", iconUrl: null, fallback: "SQ" },
      { name: "Wireshark", iconUrl: null, fallback: "WS" },
      {
        name: "Visual Studio",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg",
        fallback: "VS",
      },
      {
        name: "IntelliJ IDEA",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg",
        fallback: "IJ",
      },
      {
        name: "Eclipse",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg",
      },
      {
        name: "Figma",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "Confluence",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg",
        fallback: "CF",
      },
      {
        name: "Jira",
        iconUrl:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
      },
    ],
    []
  );

  const projects = useMemo(
    () => [
      {
        id: "hack-the-bias",
        title: "Hack the Bias 2026 – Miss Neuroverse",
        logoText: "🧠",
        githubUrl: "https://github.com/Fatima4285/Hack_the_Bias_2026",
        githubLabel: "Hack_the_Bias_2026",
        description:
          "Built a full-stack platform in a 36-hour hackathon with a team of five to bridge the gap between neurodivergent women and researchers, expanding research in a field shaped by gender bias. Designed a two-sided, opt-in system where women log experiences and wellness data to receive personalized research and similar lived experiences, while researchers post studies surfaced to relevant users.",
        languages: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
      },

      {
        id: "ecommerce",
        title: "Full-Stack E-Commerce Website",
        logoText: "🛒",
        githubUrl:
          "https://github.com/zehraz1/projects/tree/main/E-commerce%20React",
        githubLabel: "projects / E-commerce React",
        description:
          "Designed and developed a full-stack e-commerce website following a provided UI. Implemented a responsive frontend using React and built backend services using Node.js and Flask with JSON data handling.",
        languages: ["React", "Node.js", "Flask", "JSON"],
      },

      {
        id: "disaster-relief",
        title: "Disaster Victim Relief System",
        logoText: "🚑",
        githubUrl:
          "https://github.com/zehraz1/projects/tree/main/Database%20Java",
        githubLabel: "projects / Disaster Java",
        description:
          "Developed a Java-based disaster relief tracking system with SQL integration to manage shelter assignments and essential services for displaced individuals. Ensured system reliability using JUnit test coverage to reduce runtime errors and validate functionality.",
        languages: ["Java", "SQL", "JUnit"],
      },

      {
        id: "cpp-airline",
        title: "C++ Airline Registration System",
        logoText: "✈️",
        githubUrl:
          "https://github.com/zehraz1/projects/tree/main/Airline%20C%2B%2B",
        githubLabel: "projects / Airline C++",
        description:
          "Developed an airline registration system in C++ to efficiently manage passenger bookings, flight records, and ticketing processes using object-oriented design principles.",
        languages: ["C++"],
      },

      {
        id: "museum-sql",
        title: "Arts Museum Database Application",
        logoText: "🖼️",
        githubUrl:
          "https://github.com/zehraz1/projects/tree/main/Museum%20SQL%20Python",
        githubLabel: "projects / Museum SQL Python",
        description:
          "Designed a secure SQL database with role-based access control to enhance data security and retrieval efficiency for museum operations. Built a flexible schema with simulated end-user web access to improve accessibility of collections and exhibitions.",
        languages: ["Python", "SQL", "Git", "GitHub"],
      },
    ],
    []
  );

  const files = useMemo(
    () => [
      { id: "experience", label: "experience", content: "" },
      { id: "projects", label: "projects", content: "" },
      { id: "skills", label: "skills", content: "" },
    ],
    []
  );

  const defaultFileId = files[0].id;
  const [activeFileId, setActiveFileId] = useState(defaultFileId);
  const [openTabs, setOpenTabs] = useState([defaultFileId]);

  function openFile(fileId) {
    setSidebarOpen(true);
    setOpenTabs((tabs) => (tabs.includes(fileId) ? tabs : [...tabs, fileId]));
    setActiveFileId(fileId);
  }

  function closeTab(fileId) {
    setOpenTabs((tabs) => {
      if (tabs.length === 1 && tabs[0] === fileId) return tabs;

      const nextTabs = tabs.filter((t) => t !== fileId);

      if (activeFileId === fileId) {
        const nextActive = nextTabs[nextTabs.length - 1] ?? defaultFileId;
        setActiveFileId(nextActive);
      }

      return nextTabs.length ? nextTabs : [defaultFileId];
    });
  }

  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0];

  const textColRef = useRef(null);
  const [maxChars, setMaxChars] = useState(28);

  useLayoutEffect(() => {
    if (!textColRef.current) return;
    const el = textColRef.current;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      const avgCharPx = isMobile ? 7 : 8;
      const buffer = isMobile ? 2 : 4;
      const chars = Math.max(10, Math.floor(rect.width / avgCharPx) - buffer);
      setMaxChars(chars);
    };

    compute();

    const ro = new ResizeObserver(() => compute());
    ro.observe(el);

    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [sidebarOpen]);

  const displayLines = useMemo(
    () => wrapToWidth(activeFile.content ?? "", maxChars),
    [activeFile.content, maxChars]
  );

  const tabsRef = useRef(null);
  const iconFor = (name) => (name.endsWith(".md") ? "📝" : "📄");

  const isExperienceTab = activeFileId === "experience";
  const isProjectsTab = activeFileId === "projects";
  const isSkillsTab = activeFileId === "skills";

  return (
    <div
      className={
        fullPage
          ? "w-screen h-screen overflow-hidden p-0"
          : "relative mx-[5%] mb-[10%]"
      }
    >
      <div
        className={
          fullPage
            ? "w-full h-full bg-[#FFF6FA] overflow-hidden shadow-[20px_35px_40px_20px_rgba(17,24,39,.20)] flex flex-col relative"
            : "bg-[#FFF6FA] rounded-4xl overflow-hidden shadow-[20px_35px_40px_20px_rgba(17,24,39,.20)] relative"
        }
      >
        {typeof onBack === "function" && (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-2 top-2 z-50 h-6 sm:h-8 px-2 sm:px-3 rounded-md bg-[#FFF0F7] border border-[#F3B6D3] text-[#6B2B4A] text-[10px] sm:text-[12px] hover:bg-[#FFE4F0] flex items-center gap-1.5 sm:gap-2"
            title="Back to Extensions page"
          >
            <span className="text-[#FF4FA3] text-[12px] sm:text-[14px]">←</span>
            Back
          </button>
        )}

        {/* Top bar */}
        <div className="h-12 flex items-center justify-center px-4 shrink-0 relative">
          <h1 className="text-[#3A0F24] tracking-[0.1rem] text-[18px]">
            zehra-portfolio
          </h1>
        </div>

        {/* Body */}
        <div
          className={`
            grid ${fullPage ? "flex-1" : "h-[520px] sm:h-[600px]"} min-w-0
            transition-[grid-template-columns] duration-300
            ${
              sidebarOpen
                ? "grid-cols-[56px_160px_1fr] sm:grid-cols-[56px_220px_1fr]"
                : "grid-cols-[56px_44px_1fr] sm:grid-cols-[56px_48px_1fr]"
            }
          `}
        >
          {/* Icon bar */}
          {/* Icon bar */}
          <div className="bg-[#FFE4F0] p-2 pt-1 flex flex-col items-center h-full min-h-0 border-r border-[#F3B6D3] overflow-x-hidden">
            <div className="flex flex-col items-center gap-2 w-full min-h-0 overflow-y-auto overflow-x-hidden pb-2 px-1">
          <button
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#FFEFF7] shrink-0"
                title="Explorer"
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-7 text-[#3A0F24]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              </button>

              <button
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#FFEFF7] shrink-0"
                title="Search"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-6 text-[#8A4A69]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.3-4.3m1.8-5.2a7 7.0 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>

              <button
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#FFEFF7] shrink-0"
                title="Source Control"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-6 text-[#8A4A69]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 3.75A2.25 2.25 0 1 0 6 8.25a2.25 2.25 0 0 0 0-4.5ZM6 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM18 9.75a2.25 2.25 0 1 0 0 4.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6h5.25A2.25 2.25 0 0 1 15.75 8.25v1.5M8.25 18h5.25a2.25 2.25 0 0 0 2.25-2.25v-1.5M15.75 12h-3.5"
                  />
                </svg>
              </button>

              <button
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#FFEFF7] shrink-0"
                title="Run and Debug"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-6 text-[#8A4A69]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 4.5h1.5m-7.5 6.75h15m-12 0V9a3 3 0 0 1 3-3h1.5a3 3 0 0 1 3 3v2.25m-9 0v6.75a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-6.75"
                  />
                </svg>
              </button>

              <button
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#FFEFF7] shrink-0"
                title="Extensions"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-6 text-[#8A4A69]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 3.75h3v3h-3v-3Zm6 0h3v3h-3v-3ZM7.5 10.5h3v3h-3v-3Zm6 0h3v3h-3v-3ZM7.5 17.25h3v3h-3v-3Zm6 0h3v-3Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-[#FFF7FB] text-[#3A0F24] min-w-0 overflow-y-hidden overflow-x-visible border-r border-[#F3B6D3]">
            <div className="h-12 box-border px-2 sm:px-4 flex items-center justify-between border-b border-[#F3B6D3]">
              {sidebarOpen ? (
                <>
                  <span className="uppercase tracking-[0.18em] text-[11px] font-semibold text-[#6B2B4A] truncate leading-none translate-y-[1px]">
                    Explorer
                  </span>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="h-8 w-8 flex items-center justify-center rounded-md text-[#8A4A69] hover:text-[#3A0F24] hover:bg-[#FFEFF7] select-none"
                    title="Collapse"
                    type="button"
                  >
                    &gt;
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="h-8 w-8 flex items-center justify-center mx-auto rounded-md hover:bg-[#FFEFF7] text-[14px] font-semibold text-[#8A4A69] hover:text-[#3A0F24] select-none"
                  title="Expand"
                  type="button"
                >
                  &lt;
                </button>
              )}
            </div>

            {sidebarOpen && (
              <div className="p-2 sm:p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#6B2B4A] text-[12px] font-semibold">
                  <span className="text-[#8A4A69]">▾</span>
                  <span className="truncate">zehra-portfolio</span>
                </div>

                <div className="space-y-1">
                  {files.map((file) => {
                    const isActive = file.id === activeFileId;
                    return (
                      <button
                        key={file.id}
                        onClick={() => openFile(file.id)}
                        className={`w-full text-left rounded-md px-2 py-1.5 flex items-center gap-2 text-[13px] ${
                          isActive
                            ? "text-[#3A0F24] bg-[#FFE4F0]"
                            : "text-[#6B2B4A] hover:bg-[#FFEFF7]"
                        }`}
                        type="button"
                      >
                        <span className="text-[12px] text-[#8A4A69]">
                          {iconFor(file.label)}
                        </span>
                        <span className="truncate">{file.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="min-w-0 overflow-hidden bg-[#FFFFFF] flex flex-col">
            {/* Tabs */}
            <div className="h-12 box-border border-b border-[#F3B6D3] bg-[#FFF0F7]">
              <div
                ref={tabsRef}
                className="tabsScroll h-full pl-0 pr-0 flex items-center gap-0 flex-nowrap overflow-x-auto overflow-y-hidden"
              >
                {openTabs.map((tabId) => {
                  const file = files.find((f) => f.id === tabId);
                  const isActive = tabId === activeFileId;
                  const isLastTab = openTabs.length === 1;

                  return (
                    <button
                      key={tabId}
                      onClick={() => setActiveFileId(tabId)}
                      className={`shrink-0 h-full px-3 flex items-center gap-2 border-r border-[#F3B6D3] relative ${
                        isActive
                          ? "bg-[#FFFFFF] text-[#3A0F24]"
                          : "bg-[#FFE4F0] text-[#6B2B4A] hover:bg-[#FFD8EA]"
                      } whitespace-nowrap`}
                      type="button"
                    >
                      {isActive && (
                        <span className="absolute left-0 right-0 top-0 h-[2px] bg-[#FF4FA3]" />
                      )}

                      <span className="text-[12px] text-[#8A4A69]">
                        {iconFor(file?.label ?? tabId)}
                      </span>

                      <span className="text-[13px]">{file?.label ?? tabId}</span>

                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLastTab) closeTab(tabId);
                        }}
                        className={`ml-1 text-[#8A4A69] hover:text-[#3A0F24] px-1 rounded ${
                          isLastTab
                            ? "pointer-events-none opacity-30"
                            : "hover:bg-[#FFEFF7]"
                        }`}
                        title={isLastTab ? "Can't close last tab" : "Close"}
                      >
                        ✕
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isExperienceTab ? (
                <ExtensionsExperienceView items={experienceRoles} />
              ) : isProjectsTab ? (
                <ExtensionsProjectsView items={projects} />
              ) : isSkillsTab ? (
                <ExtensionsSkillsView
                  languages={skillLanguages}
                  tools={skillTools}
                />
              ) : (
                <div className="grid grid-cols-[34px_1fr] sm:grid-cols-[48px_1fr]">
                  <div className="py-4 sm:py-6 pr-2 sm:pr-3 text-right text-[#8A4A69] select-none border-r border-[#F3B6D3]">
                    {displayLines.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  <div
                    ref={textColRef}
                    className="p-4 sm:p-6 text-[#4A1630] font-mono min-w-0"
                  >
                    {displayLines.map((line, i) => (
                      <div key={i}>{line === "" ? "\u00A0" : line}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 bg-[#FF4FA3] text-white text-[12px] flex items-center justify-between px-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold">main</span>
                <span className="opacity-90 hidden sm:inline">◦</span>
                <span className="opacity-90 hidden sm:inline">Ln 1, Col 1</span>
                <span className="opacity-90 hidden sm:inline">◦</span>
                <span className="opacity-90 hidden sm:inline">Spaces: 2</span>
              </div>

              <div className="flex items-center gap-3 opacity-95">
                <span className="hidden sm:inline">UTF-8</span>
                <span className="hidden sm:inline">LF</span>
                <span className="hidden sm:inline">TypeScript</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          button[title="Back to Extensions page"] {
            top: 8px !important;
          }
          .tabsScroll {
            scrollbar-width: none;
          }
          .tabsScroll::-webkit-scrollbar {
            height: 0px;
          }
          /* Subtle scrollbars (mobile/small screens) */
          .subtleScroll {
            scrollbar-width: thin; /* Firefox */
            scrollbar-color: rgba(255, 79, 163, 0.28) transparent;
          }

          .subtleScroll::-webkit-scrollbar {
            width: 6px;
          }

          .subtleScroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .subtleScroll::-webkit-scrollbar-thumb {
            background: rgba(255, 79, 163, 0.22);
            border-radius: 999px;
          }

          .subtleScroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 79, 163, 0.35);
          }

          /* Large screens: hide the scrollbar (still scrollable) */
          @media (min-width: 1024px) {
            .subtleScroll {
              scrollbar-width: none; /* Firefox */
            }
            .subtleScroll::-webkit-scrollbar {
              width: 0px; /* Chrome/Safari */
            }
          }

        `}</style>
      </div>
    </div>
  );
}
