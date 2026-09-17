export function toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export const today = toLocalDateString(new Date());

export function offsetDate(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return toLocalDateString(d);
}