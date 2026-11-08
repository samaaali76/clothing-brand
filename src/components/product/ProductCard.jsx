import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";
import { getColorValue } from "./colorMap";
import {
  formatPrice,
  getDiscountPercent,
  getEffectivePrice,
  hasDiscount,
  isOutOfStock,
} from "../../utils/productUtils";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [color, setColor] = useState(product.colors?.[0] ?? null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const out = isOutOfStock(product);
  const discounted = hasDiscount(product);
  const [first, second] = product.images || [];
  const lowStock = !out && product.stock <= 3;

  const commit = (size) => {
    addToCart(product, { size, color, quantity: 1 });
    setSheetOpen(false);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  const handleAdd = () => {
    if (out) return;
    const sizes = product.sizes || [];
    if (sizes.length <= 1) commit(sizes[0] ?? null);
    else setSheetOpen((o) => !o);
  };

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-pink-soft">
        <Link
          to={`/product/${product.id}`}
          className="block h-full w-full focus-visible:outline-2 focus-visible:outline-pink"
          aria-label={product.name}
        >
          {first ? (
            <>
              <img
                src={first}
                alt={product.name}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                  second ? "group-hover:opacity-0" : "group-hover:scale-105"
                } ${out ? "grayscale-[40%]" : ""}`}
              />
              {second && (
                <img
                  src={second}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center font-heading text-lg text-blush">
              No image
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discounted && (
            <span className="rounded-full bg-pink px-2.5 py-1 text-xs font-semibold text-white">
              -{getDiscountPercent(product)}%
            </span>
          )}
          {product.isNewArrival && !out && (
            <span className="rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur">
              New
            </span>
          )}
        </div>

        {out && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-surface/80 py-2 text-center text-sm font-semibold text-error backdrop-blur">
            Out of Stock
          </div>
        )}

        {/* Size sheet */}
        <div
          aria-hidden={!sheetOpen}
          className={`absolute inset-x-0 bottom-0 rounded-t-[20px] bg-surface/95 p-4 backdrop-blur transition-transform duration-300 ease-out ${
            sheetOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Pick a size</p>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="rounded-full p-1 text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-pink"
              aria-label="Close size picker"
              tabIndex={sheetOpen ? 0 : -1}
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(product.sizes || []).map((s) => (
              <button
                key={s}
                type="button"
                tabIndex={sheetOpen ? 0 : -1}
                onClick={() => commit(s)}
                className="min-h-11 min-w-11 rounded-full border border-border px-3 text-sm font-medium text-ink transition-colors hover:border-pink hover:bg-pink hover:text-white focus-visible:outline-2 focus-visible:outline-pink"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <Link
          to={`/product/${product.id}`}
          className="font-heading text-lg leading-snug text-ink hover:text-pink"
        >
          {product.name}
        </Link>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className={`font-semibold ${discounted ? "text-pink" : "text-ink"}`}>
            {formatPrice(getEffectivePrice(product))}
          </span>
          {discounted && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {product.colors?.length > 0 && (
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Color">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={color === c}
                aria-label={c}
                title={c}
                onClick={() => setColor(c)}
                className={`h-5 w-5 rounded-full border border-border transition-transform focus-visible:outline-2 focus-visible:outline-pink ${
                  color === c ? "scale-110 ring-2 ring-ink ring-offset-2" : "hover:scale-110"
                }`}
                style={{ backgroundColor: getColorValue(c) }}
              />
            ))}
          </div>
        )}

        {lowStock && (
          <p className="text-xs font-medium text-pink">Only {product.stock} left</p>
        )}

        <div className="mt-auto pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAdd}
            disabled={out}
            className="w-full"
          >
            {out ? "Out of Stock" : added ? "Added to cart ✓" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
}