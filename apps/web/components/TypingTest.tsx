import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getRandomParagraph, getNewRandomParagraph } from "../data/paragraphs";

type Status = "waiting" | "typing" | "finished";

export default function TypingTest() {
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<Status>("waiting");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Initialize random text on client side only to avoid hydration mismatch
  useEffect(() => {
    setText(getRandomParagraph());
    setIsLoaded(true);
  }, []);

  // Compute correct and error counts from typed string - handles bulk operations correctly
  const { correctCount, errorCount } = useMemo(() => {
    let correct = 0;
    let errors = 0;
    
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) {
        correct++;
      } else {
        errors++;
      }
    }
    
    return { correctCount: correct, errorCount: errors };
  }, [typed, text]);

  // Derived stats - computed from memoized counts
  const wpm = time > 0 ? Math.round((correctCount / 5) / (time / 60)) : 0;
  const accuracy = typed.length > 0 ? Math.round((correctCount / typed.length) * 100) : 100;

  // Throttled display for WPM to avoid jittery updates in the UI
  const [displayWpm, setDisplayWpm] = useState<number>(0);
  const wpmRef = useRef<number>(wpm);

  // keep ref up to date with the latest real wpm
  useEffect(() => {
    wpmRef.current = wpm;
  }, [wpm]);

  // Update displayed WPM at a slower interval while typing; set immediately when not typing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === "typing") {
      // update displayed WPM every 500ms
      interval = setInterval(() => {
        setDisplayWpm(Math.round(wpmRef.current));
      }, 500);
    } else {
      // when not typing (waiting or finished), show the current WPM immediately
      setDisplayWpm(wpm);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, wpm]);

  // Find the start of current word - O(1) using lastIndexOf instead of loop
  const getWordBoundary = useCallback((position: number): number => {
    if (position === 0) return 0;
    const lastSpace = text.lastIndexOf(" ", position - 1);
    return lastSpace === -1 ? 0 : lastSpace + 1;
  }, [text]);

  // Timer - only updates time, stats are derived
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "typing" && startTime) {
      interval = setInterval(() => {
        setTime((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status, startTime]);

  // Scroll text
  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const chars = textRef.current.querySelectorAll("span");
    const currentChar = chars[typed.length] as HTMLElement;

    if (currentChar) {
      const containerWidth = containerRef.current.clientWidth;
      const charLeft = currentChar.offsetLeft;
      const scrollTo = charLeft - containerWidth * 0.35;
      textRef.current.style.transform = `translateX(-${Math.max(0, scrollTo)}px)`;
    }
  }, [typed]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const oldLength = typed.length;
    const newLength = newValue.length;

    // Start typing
    if (status === "waiting" && newLength > 0) {
      setStatus("typing");
      setStartTime(Date.now());
    }

    // Prevent typing beyond text
    if (newLength > text.length) return;

    // Handle backspace - restrict to current word only
    if (newLength < oldLength) {
      const wordBoundary = getWordBoundary(oldLength);
      
      // Can't delete past the start of current word
      if (newLength < wordBoundary) {
        return; // Block the deletion
      }

      setTyped(newValue);
      return;
    }

    // Handle new character(s) typed
    if (newLength > oldLength) {
      setTyped(newValue);

      // Check if finished
      if (newLength === text.length) {
        setStatus("finished");
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Prevent pasting
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      restart();
    }

    // Also handle Backspace to prevent default if at word boundary
    if (e.key === "Backspace") {
      const wordBoundary = getWordBoundary(typed.length);
      if (typed.length <= wordBoundary) {
        e.preventDefault();
      }
    }
  };

  const restart = () => {
    setText(getNewRandomParagraph(text));
    setTyped("");
    setStatus("waiting");
    setStartTime(null);
    setTime(0);
    setIsFocused(false);
    if (textRef.current) {
      textRef.current.style.transform = "translateX(0)";
    }
    inputRef.current?.focus();
  };

  const retry = () => {
    // Keep the same text but reset everything else
    setTyped("");
    setStatus("waiting");
    setStartTime(null);
    setTime(0);
    setIsFocused(false);
    if (textRef.current) {
      textRef.current.style.transform = "translateX(0)";
    }
    inputRef.current?.focus();
  };

  const handleClick = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    if (status === "waiting") setIsFocused(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoaded]);

  // Show loading state until client-side text is loaded
  if (!isLoaded) {
    return (
      <div className="space-y-16">
        <div className="flex items-center justify-center gap-24">
          <div className="text-center">
            <div className="text-7xl font-medium text-main tabular-nums tracking-tight">0</div>
            <div className="text-sub text-sm mt-3 uppercase tracking-widest">wpm</div>
          </div>
          <div className="text-center">
            <div className="text-7xl font-medium text-sub tabular-nums tracking-tight">100%</div>
            <div className="text-sub text-sm mt-3 uppercase tracking-widest">acc</div>
          </div>
          <div className="text-center">
            <div className="text-7xl font-medium text-sub tabular-nums tracking-tight">0s</div>
            <div className="text-sub text-sm mt-3 uppercase tracking-widest">time</div>
          </div>
        </div>
        <div className="relative py-12">
          <div className="overflow-hidden">
            <div className="whitespace-nowrap text-4xl leading-loose font-mono text-sub/40">
              loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Stats */}
      <div className="flex items-center justify-center gap-24">
        <div className="text-center">
          <div className="text-7xl font-medium text-main tabular-nums tracking-tight">
            {displayWpm}
          </div>
          <div className="text-sub text-sm mt-3 uppercase tracking-widest">
            wpm
          </div>
        </div>
        <div className="text-center">
          <div className="text-7xl font-medium text-sub tabular-nums tracking-tight">
            {accuracy}%
          </div>
          <div className="text-sub text-sm mt-3 uppercase tracking-widest">
            acc
          </div>
        </div>
        <div className="text-center">
          <div className="text-7xl font-medium text-sub tabular-nums tracking-tight">
            {Math.floor(time)}s
          </div>
          <div className="text-sub text-sm mt-3 uppercase tracking-widest">
            time
          </div>
        </div>
      </div>

      {/* Typing Area - hide when finished */}
      {status !== "finished" && (
        <div
          ref={containerRef}
          onClick={handleClick}
          className="relative py-12 cursor-text"
        >
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={handleBlur}
            className="absolute opacity-0 pointer-events-none"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />

          <div className="overflow-hidden">
            <div
              ref={textRef}
              className="whitespace-nowrap text-4xl leading-loose transition-transform duration-150 ease-out font-mono"
              style={{ letterSpacing: "0.025em" }}
            >
              {text.split("").map((char, i) => {
                let color = "text-sub/40";
                if (i < typed.length) {
                  color = typed[i] === char ? "text-correct" : "text-error";
                } else if (i === typed.length) {
                  color = "text-main";
                }

                return (
                  <span key={i} className={`relative ${color}`}>
                    {char === " " ? "\u00A0" : char}
                    {i === typed.length && (
                      <span className="absolute left-0 top-0 h-full w-0.5 bg-main animate-pulse" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Blur overlay */}
          {status === "waiting" && !isFocused && (
            <div
              onClick={handleClick}
              className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-bg/50 cursor-pointer"
            >
              <span className="text-sub text-lg tracking-wide">
                click to start typing
              </span>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {status === "finished" && (
        <div className="text-center space-y-16 pt-8 pb-4">
          {/* Main WPM Result */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-[10rem] font-bold text-main tabular-nums tracking-tighter leading-none">
                {displayWpm}
              </div>
              <div className="text-sub text-xl tracking-wider uppercase font-semibold">
                words per minute
              </div>
            </div>
            <div className="h-px w-32 mx-auto bg-main/20"></div>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2 p-6 rounded-xl bg-sub/5 border border-sub/10 hover:border-sub/20 transition-colors">
              <div className="text-4xl font-bold text-text tabular-nums">
                {accuracy}%
              </div>
              <div className="text-sub text-sm tracking-wider uppercase font-medium">
                accuracy
              </div>
            </div>
            <div className="space-y-2 p-6 rounded-xl bg-sub/5 border border-sub/10 hover:border-sub/20 transition-colors">
              <div className="text-4xl font-bold text-text tabular-nums">
                {Math.round(time)}s
              </div>
              <div className="text-sub text-sm tracking-wider uppercase font-medium">
                time
              </div>
            </div>
            <div className="space-y-2 p-6 rounded-xl bg-correct/10 border border-correct/20 hover:border-correct/30 transition-colors">
              <div className="text-4xl font-bold text-correct tabular-nums">
                {correctCount}
              </div>
              <div className="text-sub text-sm tracking-wider uppercase font-medium">
                correct
              </div>
            </div>
            <div className="space-y-2 p-6 rounded-xl bg-error/10 border border-error/20 hover:border-error/30 transition-colors">
              <div className="text-4xl font-bold text-error tabular-nums">
                {errorCount}
              </div>
              <div className="text-sub text-sm tracking-wider uppercase font-medium">
                errors
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={retry}
              className="px-12 py-4 bg-sub/10 text-main border-2 border-main/30 font-semibold text-lg tracking-wide rounded-xl hover:bg-sub/20 hover:border-main/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Retry Same
            </button>
            <button
              onClick={restart}
              className="px-12 py-4 bg-main text-bg font-semibold text-lg tracking-wide rounded-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-main/20"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Hint and Retry */}
      {status !== "finished" && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={retry}
            className="px-8 py-3 bg-sub/10 text-main border border-main/20 font-medium tracking-wide rounded-lg hover:bg-sub/20 hover:border-main/40 active:scale-95 transition-all duration-200"
          >
            Retry Same Paragraph
          </button>
          <div className="text-center text-sub/50 text-sm tracking-wide">
            press <span className="text-main">tab</span> to restart with new paragraph
          </div>
        </div>
      )}
    </div>
  );
}
