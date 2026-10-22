export const PRO_VALIDATE_URL = "https://openx-co.vercel.app/api/pro/validate";

export function isValidProPayload(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    "valid" in data &&
    (data as { valid: unknown }).valid === true
  );
}

export async function validateProKey(key: string): Promise<"valid" | "invalid" | "error"> {
  try {
    const response = await fetch(PRO_VALIDATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ key }),
      cache: "no-store",
    });
    if (!response.ok) return "error";
    const data: unknown = await response.json();
    return isValidProPayload(data) ? "valid" : "invalid";
  } catch {
    return "error";
  }
}
