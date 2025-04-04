import { useState, useRef, useEffect, useCallback } from 'react';

const AUTO_MODE_KEY = 'timer_auto_mode';
const TIMER_STATE_KEY = 'timer_state';
const UPDATE_INTERVAL = 1000; // 1 second

interface UseTimerProps {
  seconds: number;
  defaultValue: number;
  onComplete?: () => void;
  onCountdownStart?: () => void;
  onTimeChange?: (newSeconds: number, isRunning: boolean) => void;
}

interface UseTimerReturn {
  isRunning: boolean;
  isAutoMode: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggleAutoMode: () => void;
  handleTimeChange: (value: string) => void;
}

export const useTimer = ({
  seconds,
  defaultValue,
  onComplete,
  onCountdownStart,
  onTimeChange,
}: UseTimerProps): UseTimerReturn => {
  const [isRunning, setIsRunning] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(() => {
    const savedAutoMode = localStorage.getItem(AUTO_MODE_KEY);
    return savedAutoMode ? JSON.parse(savedAutoMode) : false;
  });

  const endTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const currentTimeRef = useRef<number>(seconds);
  const lastUpdateRef = useRef<number>(0);
  const isInitializedRef = useRef(false);

  const updateTimer = useCallback(() => {
    if (!isRunning || !endTimeRef.current) return;

    const now = Date.now();
    const remaining = Math.max(0, endTimeRef.current - now);
    const newSeconds = Math.ceil(remaining / 1000);

    if (newSeconds !== currentTimeRef.current && now - lastUpdateRef.current >= UPDATE_INTERVAL) {
      currentTimeRef.current = newSeconds;
      onTimeChange?.(newSeconds, isRunning);
      lastUpdateRef.current = now;
    }

    if (remaining <= 0) {
      currentTimeRef.current = 0;
      onTimeChange?.(0, isRunning);
      setIsRunning(false);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      localStorage.removeItem(TIMER_STATE_KEY);

      if (isAutoMode) {
        onCountdownStart?.();
        setTimeout(() => {
          onComplete?.();
          currentTimeRef.current = defaultValue;
          onTimeChange?.(defaultValue, isRunning);
          endTimeRef.current = Date.now() + defaultValue * 1000;
          setIsRunning(true);
        }, 3000);
      }
      return;
    }

    frameRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, isAutoMode, onComplete, onCountdownStart, onTimeChange, defaultValue, isRunning]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      currentTimeRef.current = seconds;
      localStorage.removeItem(TIMER_STATE_KEY);
      isInitializedRef.current = true;
    }

    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + currentTimeRef.current * 1000;
      }
      frameRef.current = requestAnimationFrame(updateTimer);
    } else if (currentTimeRef.current > 0) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      endTimeRef.current = null;
    }

    if (isRunning) {
      localStorage.setItem(
        TIMER_STATE_KEY,
        JSON.stringify({
          endTime: endTimeRef.current,
          wasRunning: isRunning
        })
      );
    } else {
      localStorage.removeItem(TIMER_STATE_KEY);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isRunning, updateTimer, seconds]);

  const start = useCallback(() => {
    if (!isRunning && currentTimeRef.current > 0) {
      setIsRunning(true);
      endTimeRef.current = Date.now() + currentTimeRef.current * 1000;
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      localStorage.removeItem(TIMER_STATE_KEY);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    currentTimeRef.current = defaultValue;
    endTimeRef.current = Date.now() + defaultValue * 1000;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    localStorage.removeItem(TIMER_STATE_KEY);
    setIsRunning(true);
  }, [defaultValue]);

  const toggleAutoMode = useCallback(() => {
    const newAutoMode = !isAutoMode;
    setIsAutoMode(newAutoMode);
    localStorage.setItem(AUTO_MODE_KEY, JSON.stringify(newAutoMode));
  }, [isAutoMode]);

  const handleTimeChange = useCallback((value: string) => {
    const [minutes, seconds] = value.split(':').map(Number);
    const totalSeconds = minutes * 60 + (seconds || 0);
    currentTimeRef.current = totalSeconds;
    if (isRunning) {
      endTimeRef.current = Date.now() + totalSeconds * 1000;
    }
  }, [isRunning]);

  return {
    isRunning,
    isAutoMode,
    start,
    pause,
    reset,
    toggleAutoMode,
    handleTimeChange,
  };
}; 