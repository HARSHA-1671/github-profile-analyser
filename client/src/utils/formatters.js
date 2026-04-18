export function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    notation: value > 999 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value || 0);
}

export function formatDate(value) {
  if (!value) {
    return "Unavailable";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function titleCase(value) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
