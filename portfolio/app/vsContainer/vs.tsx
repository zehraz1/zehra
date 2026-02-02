"use client";
import { useMemo, useRef, useLayoutEffect, useState, useEffect } from "react";

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
      // hard-break super long "words" (urls etc.)
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

export default function Container() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const files = useMemo(
    () => [
      {
        id: "aboutme.md",
        label: "aboutme.md",
        content:
          "About me content...\nThis is a longer line to show wrapping on small screens. This should wrap inside the editor panel instead of overflowing.\nThird line example",
      },
      {
        id: "experience",
        label: "experience",
        content: "Experience content...\nMore experience...\nAnother line...",
      },
      {
        id: "projects",
        label: "projects",
        content: "Projects content...\nProject 1\nProject 2",
      },
      {
        id: "skills.md",
        label: "skills.md",
        content: "Skills content...\nJavaScript\nReact\nTailwind",
      },
      {
        id: "contactme.md",
        label: "contactme.md",
        content: "Contact content...\nemail: ...\nlinkedin: ...",
      },
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
      // don't close the last tab
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

  /**
   * ✅ Measure actual editor text width and derive maxChars from it
   * This makes wrapping always fill to the right edge on any screen size.
   */
  const textColRef = useRef(null);
  const [maxChars, setMaxChars] = useState(28);

  useLayoutEffect(() => {
    if (!textColRef.current) return;

    const el = textColRef.current;

    const compute = () => {
      const rect = el.getBoundingClientRect();

      // approx average character width in your current font sizes
      const isMobile = window.innerWidth < 640;
      const avgCharPx = isMobile ? 7 : 8;

      // leave a little buffer so it doesn't wrap too late
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

  /**
   * ✅ VS Code-style overlay scrollbar for the tabs row
   * - hide native scrollbar
   * - draw our own thumb
   * - show only on hover/scroll
   */
  const tabsRef = useRef(null);
  const [showOverlayScroll, setShowOverlayScroll] = useState(false);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;

    let hideTimer;

    const updateThumb = () => {
      const scrollW = el.scrollWidth;
      const clientW = el.clientWidth;
      const scrollL = el.scrollLeft;

      if (scrollW <= clientW) {
        setThumb({ left: 0, width: 0 });
        return;
      }

      const ratio = clientW / scrollW;
      const thumbW = Math.max(24, Math.floor(clientW * ratio));
      const maxLeft = clientW - thumbW;
      const left = Math.floor((scrollL / (scrollW - clientW)) * maxLeft);

      setThumb({ left, width: thumbW });
    };

    const showThenAutoHide = () => {
      setShowOverlayScroll(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setShowOverlayScroll(false), 900);
    };

    const onScroll = () => {
      updateThumb();
      showThenAutoHide();
    };

    const onEnter = () => {
      updateThumb();
      setShowOverlayScroll(true);
    };

    const onLeave = () => {
      setShowOverlayScroll(false);
    };

    updateThumb();

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    const ro = new ResizeObserver(() => updateThumb());
    ro.observe(el);

    return () => {
      clearTimeout(hideTimer);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, [openTabs.length]);

  return (
    <div className="relative mx-[5%] mb-[10%]">
      <div className="bg-vs-top rounded-4xl overflow-hidden shadow-[20px_35px_40px_20px_rgba(0,0,0,.5)]">
        {/* Top bar */}
        <div className="h-12 flex items-center justify-center px-4">
          <h1 className="text-vs-text-dark font-extrabold text-[18px]">
            zehra-portfolio
          </h1>
        </div>

        {/* Body */}
        <div
          className={`
            grid h-[520px] sm:h-[600px] min-w-0
            transition-[grid-template-columns] duration-300
            ${
              sidebarOpen
                ? "grid-cols-[56px_160px_1fr] sm:grid-cols-[56px_220px_1fr]"
                : "grid-cols-[56px_36px_1fr] sm:grid-cols-[56px_40px_1fr]"
            }
          `}
        >
          {/* Icon bar */}
          <div className="bg-vs-folder p-2 pt-4 flex items-start justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-7 text-vs-text-light"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>

          {/* Sidebar */}
          <div className="bg-vs-sidebar text-vs-text-dark min-w-0 overflow-hidden">
            <div className="h-12 px-2 sm:px-4 flex items-center gap-2 border-b border-vs-text-dark/20">
              {sidebarOpen ? (
                <>
                  <span className="font-bold truncate">zehra-portfolio</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="font-medium text-vs-text-dark/80 hover:text-vs-text-dark select-none"
                    aria-label="Collapse sidebar"
                  >
                    &gt;
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-8 h-8 flex items-center justify-center mx-auto rounded-md hover:bg-vs-sidebar/30 font-medium text-vs-text-dark/80 hover:text-vs-text-dark select-none"
                  aria-label="Expand sidebar"
                >
                  &lt;
                </button>
              )}
            </div>

            {sidebarOpen && (
              <div className="p-2 sm:p-4 space-y-2">
                {files.map((file) => {
                  const isActive = file.id === activeFileId;
                  return (
                    <button
                      key={file.id}
                      onClick={() => openFile(file.id)}
                      className={`w-full text-left rounded-lg px-2 py-1 hover:bg-vs-sidebar/20 ${
                        isActive
                          ? "font-bold text-vs-text-dark"
                          : "text-vs-text-dark/60"
                      }`}
                    >
                      {file.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="min-w-0 overflow-hidden bg-vs-tab flex flex-col">
            {/* ✅ Tabs row wrapper (relative) */}
            <div className="relative h-12 border-b border-vs-text-dark/20">
              {/* Tabs row: horizontal scroll, native scrollbar hidden */}
              <div
                ref={tabsRef}
                className="h-12 px-2 sm:px-4 flex items-center gap-2 flex-nowrap overflow-x-auto overflow-y-hidden tabs-native-hide"
              >
                {openTabs.map((tabId) => {
                  const file = files.find((f) => f.id === tabId);
                  const isActive = tabId === activeFileId;
                  const isLastTab = openTabs.length === 1;

                  return (
                    <button
                      key={tabId}
                      onClick={() => setActiveFileId(tabId)}
                      className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-t-md border ${
                        isActive
                          ? "border-vs-text-dark/50"
                          : "border-transparent opacity-70"
                      } bg-vs-sidebar whitespace-nowrap`}
                    >
                      <span
                        className={`text-sm ${
                          isActive ? "font-bold" : "font-medium"
                        } text-vs-text-dark`}
                      >
                        {file?.label ?? tabId}
                      </span>

                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLastTab) closeTab(tabId);
                        }}
                        className={`text-vs-text-dark/60 hover:text-vs-text-dark ${
                          isLastTab ? "pointer-events-none opacity-30" : ""
                        }`}
                      >
                        x
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Overlay scrollbar thumb (VS Code-style) */}
              {thumb.width > 0 && (
                <div
                  className={`pointer-events-none absolute left-2 right-2 bottom-[4px] h-[3px] transition-opacity duration-150 ${
                    showOverlayScroll ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div
                    className="h-[3px] rounded-full bg-vs-text-dark/30"
                    style={{
                      width: `${thumb.width}px`,
                      transform: `translateX(${thumb.left}px)`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-[34px_1fr] sm:grid-cols-[48px_1fr]">
                {/* Line numbers */}
                <div className="py-4 sm:py-6 pr-2 sm:pr-3 text-right text-vs-text-dark/40 select-none border-r border-vs-text-dark/10">
                  {displayLines.map((_, i) => (
                    <div
                      key={i}
                      className="leading-5 sm:leading-6 text-xs sm:text-sm"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Text column (measured by ref) */}
                <div
                  ref={textColRef}
                  className="p-4 sm:p-6 text-vs-text-dark font-medium min-w-0"
                >
                  {displayLines.map((line, i) => (
                    <div
                      key={i}
                      className="leading-5 sm:leading-6 text-xs sm:text-sm break-words"
                    >
                      {line === "" ? "\u00A0" : line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-8 bg-[#2b0018] flex items-center px-4 pl-10 text-white/80 text-sm">
          main
        </div>
      </div>
    </div>
  );
}
