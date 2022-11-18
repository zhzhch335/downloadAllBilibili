export function isBv(vid: string): boolean {
  if (isNaN(Number(vid))) return true;
  return false;
}