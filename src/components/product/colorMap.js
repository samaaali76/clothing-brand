// أسماء الألوان لازم تطابق اللي في mockProducts.js بالظبط
export const COLOR_MAP = {
  Black: "var(--color-product-black)",
  Pink: "var(--color-product-blush)",
  Blush: "var(--color-product-blush)",
  Ivory: "var(--color-product-ivory)",
  Sage: "var(--color-product-sage)",
  Navy: "var(--color-product-navy)",
  Mauve: "var(--color-product-mauve)",
};

export const getColorValue = (name) => COLOR_MAP[name] || "#CCCCCC";