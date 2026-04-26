export type CourseId = 'akademisk' | 'norsk-vg3';

export async function startCheckout(courseId: CourseId, email?: string): Promise<void> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId, email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Kunne ikke starte betaling');
  }
  const { url } = (await res.json()) as { url: string };
  window.location.href = url;
}
