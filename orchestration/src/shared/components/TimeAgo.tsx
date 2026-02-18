'use client';

import { useState, useEffect } from 'react';
import { timeAgo } from '@/shared/utils/format-date';

interface TimeAgoProps {
  date: string | null;
  className?: string;
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [text, setText] = useState(() => (date ? timeAgo(date) : '-'));

  useEffect(() => {
    if (!date) return;
    setText(timeAgo(date));
    const interval = setInterval(() => setText(timeAgo(date)), 30_000);
    return () => clearInterval(interval);
  }, [date]);

  return <span className={className}>{text}</span>;
}
