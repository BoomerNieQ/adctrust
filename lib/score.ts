/**
 * Score formula: each net vote is worth 5 points, clamped to -100..+100.
 * (positiveVotes - negativeVotes) * 5
 *
 * Examples:
 *   20 positive, 0 negative  → +100 (max)
 *    1 positive, 0 negative  →   +5
 *    3 positive, 1 negative  →  +10
 *    0 positive, 5 negative  →  -25
 */
export function calculateScore(positiveCount: number, negativeCount: number): number {
  return Math.max(-100, Math.min(100, (positiveCount - negativeCount) * 5));
}
