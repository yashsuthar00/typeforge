import { useState, useEffect, useRef, useCallback } from "react";

const SAMPLE_TEXT =
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling a computer what to do through a set of instructions. Every great developer was once a beginner who refused to give up. Practice makes perfect, and consistency is the key to mastering any skill. TypeForge helps you improve your typing speed and accuracy through focused practice sessions."

type Status = "waiting" | "typing" | "finished";

export default function TypingTest() {
  const [text] = useState(SAMPLE_TEXT);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<Status>("waiting");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Track correct count incrementally - no for loops needed
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Derived stats - computed from tracked counts (O(1) - no loops)
  const wpm = time > 0 ? Math.round((correctCount / 5) / (time / 60)) : 0;
  const accuracy = typed.length > 0 ? Math.round((correctCount / typed.length) * 100) : 100;

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

      // Update counts for deleted characters
      const deletedChar = typed[oldLength - 1];
      const expectedChar = text[oldLength - 1];
      
      if (deletedChar === expectedChar) {
        setCorrectCount(prev => prev - 1);
      } else {
        setErrorCount(prev => prev - 1);
      }
      
      setTyped(newValue);
      return;
    }

    // Handle new character typed
    if (newLength > oldLength) {
      const newChar = newValue[newLength - 1];
      const expectedChar = text[newLength - 1];

      if (newChar === expectedChar) {
        setCorrectCount(prev => prev + 1);
      } else {
        setErrorCount(prev => prev + 1);
      }

      setTyped(newValue);

      // Check if finished
      if (newLength === text.length) {
        setStatus("finished");
      }
    }
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
    setTyped("");
    setStatus("waiting");
    setStartTime(null);
    setTime(0);
    setCorrectCount(0);
    setErrorCount(0);
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
  }, []);

  return (
    <div className="space-y-16">
      {/* Stats */}
      <div className="flex items-center justify-center gap-24">
        <div className="text-center">
          <div className="text-7xl font-medium text-main tabular-nums tracking-tight">
            {wpm}
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
        <div className="text-center space-y-12 pt-8">
          <div className="space-y-3">
            <div className="text-9xl font-medium text-main tabular-nums tracking-tight">
              {wpm}
            </div>
            <div className="text-sub text-lg tracking-wide">
              words per minute
            </div>
          </div>

          <div className="flex justify-center gap-20 text-sub">
            <div>
              <span className="text-text text-3xl tabular-nums">
                {accuracy}%
              </span>
              <span className="ml-3 tracking-wide">accuracy</span>
            </div>
            <div>
              <span className="text-text text-3xl tabular-nums">
                {Math.round(time)}s
              </span>
              <span className="ml-3 tracking-wide">time</span>
            </div>
            <div>
              <span className="text-correct text-3xl tabular-nums">
                {correctCount}
              </span>
              <span className="ml-3 tracking-wide">correct</span>
            </div>
            <div>
              <span className="text-error text-3xl tabular-nums">
                {errorCount}
              </span>
              <span className="ml-3 tracking-wide">errors</span>
            </div>
          </div>

          <button
            onClick={restart}
            className="px-10 py-4 bg-main text-bg font-medium tracking-wide rounded-lg hover:opacity-90 transition-opacity"
          >
            try again
          </button>
        </div>
      )}

      {/* Hint */}
      {status !== "finished" && (
        <div className="text-center text-sub/50 text-sm tracking-wide">
          press <span className="text-main">tab</span> to restart
        </div>
      )}
    </div>
  );
}
