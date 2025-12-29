import { useState, useEffect, useRef } from "react";

const SAMPLE_TEXT =
  "the quick brown fox jumps over the lazy dog. programming is the art of telling a computer what to do. practice makes perfect and consistency is key.";

type Status = "waiting" | "typing" | "finished";

export default function TypingTest() {
  const [text] = useState(SAMPLE_TEXT);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<Status>("waiting" as Status);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "typing" && startTime) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setTime(elapsed);

        // Calculate WPM
        let correct = 0;
        for (let i = 0; i < typed.length; i++) {
          if (typed[i] === text[i]) correct++;
        }
        const minutes = elapsed / 60;
        if (minutes > 0) {
          setWpm(Math.round(correct / 5 / minutes));
          setAccuracy(
            typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100
          );
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status, startTime, typed, text]);

  // Scroll text
  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const chars = textRef.current.querySelectorAll("span");
    const currentChar = chars[typed.length] as HTMLElement;

    if (currentChar) {
      const containerWidth = containerRef.current.clientWidth;
      const charLeft = currentChar.offsetLeft;
      const scrollTo = charLeft - containerWidth * 0.35;
      textRef.current.style.transform = `translateX(-${Math.max(
        0,
        scrollTo
      )}px)`;
    }
  }, [typed]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (status === "waiting" && value.length > 0) {
      setStatus("typing");
      setStartTime(Date.now());
    }

    if (value.length > text.length) return;
    setTyped(value);

    if (value.length === text.length) {
      setStatus("finished");
      // Final calculation
      let correct = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === text[i]) correct++;
      }
      const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
      const minutes = elapsed / 60;
      setWpm(Math.round(correct / 5 / minutes));
      setAccuracy(Math.round((correct / value.length) * 100));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      restart();
    }
  };

  const restart = () => {
    setTyped("");
    setStatus("waiting");
    setStartTime(null);
    setTime(0);
    setWpm(0);
    setAccuracy(100);
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
                      <span className="absolute left-0 top-0 h-full w-[3px] bg-main animate-pulse" />
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
