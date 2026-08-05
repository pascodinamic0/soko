/** Normalize Congolese mobile input to E.164 (+243…). */
export function normalizeCongoPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("243") && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `+243${digits.slice(1)}`;
  }

  if (digits.length === 9 && /^[89]/.test(digits)) {
    return `+243${digits}`;
  }

  return null;
}

export function formatPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith("243") && digits.length === 12) {
    const local = digits.slice(3);
    return `+243 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }
  return e164;
}
