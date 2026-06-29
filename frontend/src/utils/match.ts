import type { Job } from "../store/mock-data";
import type { StudentProfile } from "../store/app-store";

/**
 * Compute dynamic match% for a job vs student preferences.
 * Weights:
 *  - Skills overlap (40%)
 *  - Distance vs preferred max (25%)
 *  - Pay vs minimum (20%)
 *  - Looking-for type (10%)
 *  - Availability slot match (5%)
 */
export function computeMatchPct(job: Job, profile: StudentProfile | null): number {
  if (!profile) return Math.min(98, Math.max(40, job.matchPct ?? 75));

  // Skills
  const want = (profile.skills ?? []).map(s => s.toLowerCase());
  const jobBag = [job.category, job.title, ...(job.requirements ?? [])].join(" ").toLowerCase();
  let skillScore = 0;
  if (want.length === 0) skillScore = 0.5;
  else {
    const hit = want.filter(s => jobBag.includes(s.toLowerCase().split(" ")[0])).length;
    skillScore = Math.min(1, hit / Math.max(1, Math.min(want.length, 3)));
  }

  // Distance
  const maxD = profile.maxDistance ?? 5;
  const distScore = job.distanceKm <= maxD ? 1 : Math.max(0, 1 - (job.distanceKm - maxD) / 10);

  // Pay
  const minPay = profile.minPay ?? 300;
  const jobMonthlyEquiv = job.payUnit.includes("hr") ? job.pay * 8 * 22 : job.pay * 22;
  const payScore = jobMonthlyEquiv >= minPay * 22 ? 1 : Math.max(0.3, (jobMonthlyEquiv / (minPay * 22)));

  // Type
  const typeScore = !profile.lookingFor || profile.lookingFor === job.shiftType ? 1 : 0.4;

  // Availability
  const avail = (profile.availability ?? "").toLowerCase();
  const availScore = avail && job.shiftTime.toLowerCase().includes(avail) ? 1 : 0.6;

  const raw = skillScore * 0.4 + distScore * 0.25 + Math.min(1, payScore) * 0.2 + typeScore * 0.1 + availScore * 0.05;
  return Math.round(Math.max(45, Math.min(99, raw * 100)));
}
