// كل منطق المنتجات في مكان واحد: فلترة، ترتيب، بحث، وتنسيق الأسعار.
// الأربع صفحات (Category / NewArrivals / Sale / Search) بتستخدمه من غير تكرار.

export const CATEGORY_LABELS = {
  pajamas: "Pajamas",
  abayas: "Abayas",
  "casual-wear": "Casual Wear",
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
];

export const DEFAULT_FILTERS = {
  categories: [],
  sizes: [],
  colors: [],
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
  onSaleOnly: false,
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/* ---------- Price helpers ---------- */

export const hasDiscount = (p) => p.salePrice != null && p.salePrice < p.price;

export const getEffectivePrice = (p) => (hasDiscount(p) ? p.salePrice : p.price);

export const getDiscountPercent = (p) =>
  hasDiscount(p) ? Math.round((1 - p.salePrice / p.price) * 100) : 0;

export const formatPrice = (n) => `${Number(n).toLocaleString("en-US")} EGP`;

export const isOutOfStock = (p) => !(p.stock > 0);

/* ---------- Search ---------- */

const normalize = (s) => String(s ?? "").toLowerCase().replace(/-/g, " ");

export function searchProducts(products, query) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return products.filter((p) => {
    const haystack = normalize(
      [
        p.name,
        p.category,
        CATEGORY_LABELS[p.category],
        p.description,
        p.material,
        ...(p.colors || []),
      ].join(" ")
    );
    // "abaya" لازم تلاقي "abayas"
    return tokens.every((t) => {
      const singular = t.length > 3 ? t.replace(/s$/, "") : t;
      return haystack.includes(t) || haystack.includes(singular);
    });
  });
}

/* ---------- Filters ---------- */

export function applyFilters(products, f) {
  const min = f.minPrice === "" ? null : Number(f.minPrice);
  const max = f.maxPrice === "" ? null : Number(f.maxPrice);
  const wantedColors = f.colors.map((c) => c.toLowerCase());

  return products.filter((p) => {
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.sizes.length && !f.sizes.some((s) => p.sizes?.includes(s))) return false;
    if (
      wantedColors.length &&
      !p.colors?.some((c) => wantedColors.includes(c.toLowerCase()))
    )
      return false;

    const price = getEffectivePrice(p);
    if (min !== null && price < min) return false;
    if (max !== null && price > max) return false;

    if (f.inStockOnly && isOutOfStock(p)) return false;
    if (f.onSaleOnly && !(p.isOnSale || hasDiscount(p))) return false;
    return true;
  });
}

export function countActiveFilters(f) {
  return (
    f.categories.length +
    f.sizes.length +
    f.colors.length +
    (f.minPrice !== "" || f.maxPrice !== "" ? 1 : 0) +
    (f.inStockOnly ? 1 : 0) +
    (f.onSaleOnly ? 1 : 0)
  );
}

export function getFilterOptions(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  const colors = [...new Set(products.flatMap((p) => p.colors || []))];
  const sizes = [...new Set(products.flatMap((p) => p.sizes || []))].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a);
    const ib = SIZE_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  const prices = products.map(getEffectivePrice);
  return {
    categories,
    colors,
    sizes,
    minPrice: prices.length ? Math.floor(Math.min(...prices)) : 0,
    maxPrice: prices.length ? Math.ceil(Math.max(...prices)) : 0,
  };
}

/* ---------- Sorting ---------- */

export function sortProducts(products, sortKey) {
  const list = [...products];
  switch (sortKey) {
    case "price-asc":
      return list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    case "price-desc":
      return list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    case "best-selling":
      // مؤقتاً بـ isBestSeller لحد ما الـ Backend يدينا أرقام مبيعات
      return list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    case "newest":
    default:
      // مفيش تاريخ في الداتا: الجديد الأول، وبعدين الـ id الأكبر
      return list.sort(
        (a, b) =>
          Number(b.isNewArrival) - Number(a.isNewArrival) ||
          String(b.id).localeCompare(String(a.id), undefined, { numeric: true })
      );
  }
}