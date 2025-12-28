import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./TypingTest.module.css";

// Static paragraph for now - we'll add more configuration later
const SAMPLE_TEXT =
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling a computer what to do through a set of instructions. Every great developer was once a beginner who refused to give up. Practice makes perfect, and consistency is the key to mastering any skill. TypeForge helps you improve your typing speed and accuracy through focused practice sessions.";

interface Stats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  time: number;
}

type TestStatus = "waiting" | "typing" | "finished";

export default function TypingTest() {
  const [text] = useState(SAMPLE_TEXT);
  const [typedText, setTypedText] = useState("");
  const [status, setStatus] = useState<TestStatus>("waiting");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    time: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Calculate stats
  const calculateStats = useCallback(
    (typed: string, elapsedSeconds: number): Stats => {
      let correctChars = 0;
      let incorrectChars = 0;

      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === text[i]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      }

      const totalChars = typed.length;
      const accuracy =
        totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

      // WPM calculation: (characters / 5) / minutes
      // Standard word = 5 characters
      const minutes = elapsedSeconds / 60;
      const rawWpm = minutes > 0 ? Math.round(totalChars / 5 / minutes) : 0;
      const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;

      return {
        wpm,
        rawWpm,
        accuracy,
        correctChars,
        incorrectChars,
        totalChars,
        time: elapsedSeconds,
      };
    },
    [text]
  );

  // Smooth scroll - keep current character centered/focused
  useEffect(() => {
    if (!wordsContainerRef.current || !wrapperRef.current) return;

    const container = wordsContainerRef.current;
    const wrapper = wrapperRef.current;

    // Find the current character span
    const chars = container.querySelectorAll("span");
    const currentCharIndex = typedText.length;
    const currentChar = chars[currentCharIndex] as HTMLElement;

    if (currentChar) {
      const wrapperWidth = wrapper.clientWidth;
      const charOffsetLeft = currentChar.offsetLeft;
      const charWidth = currentChar.offsetWidth;

      // Keep the current character at ~30% from the left (focused position)
      const focusPosition = wrapperWidth * 0.3;
      const scrollAmount = charOffsetLeft - focusPosition + charWidth / 2;

      // Calculate transition speed based on WPM (faster typing = faster scroll)
      // Base: 150ms, faster at higher WPM
      const baseSpeed = 150;
      const wpmFactor = Math.max(1, stats.wpm / 60); // Normalize around 60 WPM
      const transitionSpeed = Math.max(50, baseSpeed / wpmFactor);

      container.style.transition = `transform ${transitionSpeed}ms ease-out`;
      container.style.transform = `translateX(-${Math.max(0, scrollAmount)}px)`;
    }
  }, [typedText, stats.wpm]);

  // Timer effect
  useEffect(() => {
    if (status === "typing" && startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        setStats(calculateStats(typedText, elapsed));
      }, 100);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, startTime, typedText, calculateStats]);

  // Handle input change
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Start timer on first keystroke
    if (status === "waiting" && value.length > 0) {
      setStatus("typing");
      setStartTime(Date.now());
    }

    // Don't allow typing beyond the text length
    if (value.length > text.length) return;

    setTypedText(value);

    // Check if finished
    if (value.length === text.length) {
      setStatus("finished");
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      const finalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
      setStats(calculateStats(value, finalTime));
    }
  };

  // Handle key events for special keys
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent tab from moving focus
    if (e.key === "Tab") {
      e.preventDefault();
      reset();
    }
  };

  // Reset test
  const reset = () => {
    setTypedText("");
    setStatus("waiting");
    setStartTime(null);
    setCurrentTime(0);
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      time: 0,
    });
    // Reset scroll position
    if (wordsContainerRef.current) {
      wordsContainerRef.current.style.transition = "none";
      wordsContainerRef.current.style.transform = "translateX(0)";
    }
    inputRef.current?.focus();
  };

  // Focus input on mount and click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Render characters with highlighting
  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = styles.char;
      const isCurrent = index === typedText.length;

      if (index < typedText.length) {
        if (typedText[index] === char) {
          className += ` ${styles.correct}`;
        } else {
          className += ` ${styles.incorrect}`;
        }
      } else if (isCurrent) {
        className += ` ${styles.current}`;
      }

      // Handle space character display
      const displayChar = char === " " ? "\u00A0" : char;

      return (
        <span key={index} className={className}>
          {displayChar}
        </span>
      );
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.wpm}</span>
          <span className={styles.statLabel}>wpm</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.accuracy}%</span>
          <span className={styles.statLabel}>accuracy</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatTime(currentTime)}</span>
          <span className={styles.statLabel}>time</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {typedText.length}/{text.length}
          </span>
          <span className={styles.statLabel}>chars</span>
        </div>
      </div>

      {/* Typing area */}
      <div className={styles.typingArea} onClick={handleContainerClick}>
        <div ref={wrapperRef} className={styles.textDisplayWrapper}>
          {/* Focus indicator line - shows where user should focus */}
          <div className={styles.focusLine} />
          <div ref={wordsContainerRef} className={styles.textDisplay}>
            {renderText()}
          </div>
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="text"
          value={typedText}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className={styles.hiddenInput}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={status === "finished"}
        />

        {/* Click to focus overlay - semi-transparent to show text */}
        {status === "waiting" && (
          <div className={styles.overlay} onClick={handleContainerClick}>
            <p>Click here or start typing...</p>
          </div>
        )}
      </div>

      {/* Results */}
      {status === "finished" && (
        <div className={styles.results}>
          <h2>Test Complete!</h2>
          <div className={styles.resultsGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultValue}>{stats.wpm}</span>
              <span className={styles.resultLabel}>WPM</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultValue}>{stats.rawWpm}</span>
              <span className={styles.resultLabel}>Raw WPM</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultValue}>{stats.accuracy}%</span>
              <span className={styles.resultLabel}>Accuracy</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultValue}>
                {formatTime(stats.time)}
              </span>
              <span className={styles.resultLabel}>Time</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultValue}>{stats.correctChars}</span>
              <span className={styles.resultLabel}>Correct</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultValue}>{stats.incorrectChars}</span>
              <span className={styles.resultLabel}>Errors</span>
            </div>
          </div>
        </div>
      )}

      {/* Reset hint */}
      <div className={styles.hint}>
        Press <kbd>Tab</kbd> to restart
      </div>
    </div>
  );
}
