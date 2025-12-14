const CATEGORY_COLOR_PALETTE = [
  "#9c0d0dff", // red coral
  "#FF9F1C", // amber
  "#2EC4B6", // teal
  "#3A86FF", // blue
  "#8338EC", // purple
  "#FB5607", // orange
  "#06D6A0", // mint
  "#EF476F", // pink
];

const PROJECT_GRADIENTS = [
  "linear-gradient(135deg, rgba(255,107,107,0.18), rgba(255,107,107,0.45))",
  "linear-gradient(135deg, rgba(255,159,28,0.18), rgba(255,159,28,0.45))",
  "linear-gradient(135deg, rgba(46,196,182,0.18), rgba(46,196,182,0.45))",
  "linear-gradient(135deg, rgba(58,134,255,0.18), rgba(58,134,255,0.45))",
  "linear-gradient(135deg, rgba(131,56,236,0.18), rgba(131,56,236,0.45))",
  "linear-gradient(135deg, rgba(251,86,7,0.18), rgba(251,86,7,0.45))",
  "linear-gradient(135deg, rgba(6,214,160,0.18), rgba(6,214,160,0.45))",
  "linear-gradient(135deg, rgba(239,71,111,0.18), rgba(239,71,111,0.45))",
];

const hashKey = (key: string | number) => {
  const str = key.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const hexToRgba = (hex: string, alpha = 1) => {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getCategoryColor = (key: string | number) => {
  const index = hashKey(key) % CATEGORY_COLOR_PALETTE.length;
  return CATEGORY_COLOR_PALETTE[index];
};

export const getCategorySoftGradient = (key: string | number) => {
  const color = getCategoryColor(key);
  return `linear-gradient(135deg, ${hexToRgba(color, 0.16)}, ${hexToRgba(color, 0.45)})`;
};

export const getProjectGradient = (key: string | number) => {
  const index = hashKey(key) % PROJECT_GRADIENTS.length;
  return PROJECT_GRADIENTS[index];
};