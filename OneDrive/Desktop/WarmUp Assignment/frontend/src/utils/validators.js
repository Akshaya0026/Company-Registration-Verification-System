export function validateUrlMsg(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return "URL must start with http:// or https://";
    return null;
  } catch {
    return "Invalid URL format";
  }
}

export function validatePostalMsg(value) {
  if (!value) return null;
  if (!/^[0-9]{3,10}$/.test(value)) return "Postal code must be numeric (3–10 digits)";
  return null;
}

export function validateImageMsg(file) {
  if (!file) return null;
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  const maxBytes = 5 * 1024 * 1024;
  if (!allowed.includes(file.type)) return "Allowed image types: JPG, PNG, WebP";
  if (file.size > maxBytes) return "Image must be smaller than 5MB";
  return null;
}
