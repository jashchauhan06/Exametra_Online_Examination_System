import type { Exam } from '@/types';

/**
 * Computes the real-time dynamic status of an exam.
 * 
 * Rules:
 * - If exam.status === 'draft', it remains 'draft' (not published).
 * - If current time < start_time, it is 'upcoming'.
 * - If current time >= start_time AND current time <= start_time + duration, it is 'live'.
 * - If current time > start_time + duration, it is 'completed'.
 */
export function getDynamicExamStatus(exam: Exam): Exam['status'] {
  if (exam.status === 'draft') return 'draft';

  // Parse exam date and startTime
  // exam.date is 'YYYY-MM-DD'
  // exam.startTime is 'HH:mm'
  const startTimeVal = exam.startTime || (exam as any).start_time;
  
  if (!exam.date || !startTimeVal) {
    // Fallback if missing data
    return exam.status;
  }

  // Make sure start time is just HH:mm
  const timeFormatted = startTimeVal.substring(0, 5);
  const startTimeStr = `${exam.date}T${timeFormatted}:00`;
  const startTimeMs = new Date(startTimeStr).getTime();
  
  // Duration is in minutes
  const durationMs = (exam.duration || 0) * 60 * 1000;
  const endTime = startTimeMs + durationMs;
  
  const now = Date.now();

  if (now < startTimeMs) {
    return 'upcoming';
  } else if (now >= startTimeMs && now <= endTime) {
    return 'live';
  } else {
    return 'completed';
  }
}
