import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, getProducts, getSettings } from "../services/api";
import { useCart } from "../context/CartContext";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import ProductCard from "../components/product/ProductCard";
import SizeGuide from "../components/product/SizeGuide";
import { getColorValue } from "../components/product/colorMap";
import {
  CATEGORY_LABELS,
  formatPrice,
  getDiscountPercent,
  getEffectivePrice,
  hasDiscount,
  isOutOfStock,
} from "../utils/productUtils";

function Accordion({ title, defaultOpen = false, children }) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-xl leading-none text-muted transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [status, setStatus] = useState("loading"); // loading | error | notfound | ready
  const [attempt, setAttempt] = useState(0);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [settings, setSettings] = useState(null);

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState("");
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const addedTimer = useRef(null);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setActiveImage(0);
    setColor(null);
    setSize(null);
    setQuantity(1);
    setFormError("");
    window.scrollTo({ top: 0 });

    Promise.all([
      getProductById(id),
      getProducts(),
      getSettings().catch(() => null), // الإعدادات مش لازم توقف الصفحة
    ])
      .then(([p, all, s]) => {
        if (cancelled) return;
        if (!p) return setStatus("notfound");
        setProduct(p);
        setSettings(s);
        setRelated(all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4));
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  if (status === "loading") return <Loading />;

  if (status === "error")
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <ErrorMessage
          message="We couldn’t load this product. Check your connection and try again."
          onRetry={() => setAttempt((a) => a + 1)}
        />
      </div>
    );

  if (status === "notfound")
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">This product isn’t available</h1>
        <p className="mt-3 text-muted">It may have been removed or the link is wrong.</p>
        <Link to="/" className="mt-6 inline-block font-medium text-pink underline-offset-4 hover:underline">
          Back to home
        </Link>
      </section>
    );

  const out = isOutOfStock(product);
  const discounted = hasDiscount(product);
  const images = product.images?.length ? product.images : [null];
  const maxQty = Math.max(1, product.stock || 1);

  // أسماء حقول الإعدادات: اتفقي مع سما على الأسماء النهائية
  const shippingFee = settings?.shippingFee ?? "[SHIPPING FEE]";
  const deliveryTime = settings?.deliveryTime ?? "[DELIVERY TIME]";
  const returnPolicy = settings?.returnPolicy ?? "[RETURN POLICY]";

  const validate = () => {
    const missing = [];
    if (product.sizes?.length && !size) missing.push("a size");
    if (product.colors?.length && !color) missing.push("a color");
    if (missing.length) {
      setFormError(`Please choose ${missing.join(" and ")} first.`);
      return false;
    }
    setFormError("");
    return true;
  };

  const handleAdd = () => {
    if (out || !validate()) return;
    addToCart(product, { size, color, quantity });
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (out || !validate()) return;
    addToCart(product, { size, color, quantity });
    navigate("/checkout");
  };

  const onZoomMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      on: true,
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.category}`} className="hover:text-ink">
            {CATEGORY_LABELS[product.category] || product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto sm:max-h-[640px] sm:flex-col sm:overflow-y-auto">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === activeImage}
                    className={`h-24 w-[72px] shrink-0 overflow-hidden rounded-xl border-2 transition-colors focus-visible:outline-2 focus-visible:outline-pink ${
                      i === activeImage ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {src && <img src={src} alt="" className="h-full w-full object-cover" />}
                  </button>
                ))}
              </div>
            )}

            <div
              className="relative aspect-[3/4] flex-1 cursor-zoom-in overflow-hidden rounded-[24px] bg-pink-soft"
              onMouseMove={onZoomMove}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
            >
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-200 ease-out"
                  style={{
                    transform: zoom.on ? "scale(1.8)" : "scale(1)",
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center font-heading text-xl text-blush">
                  No image
                </div>
              )}
              {discounted && (
                <span className="absolute left-4 top-4 rounded-full bg-pink px-3 py-1 text-sm font-semibold text-white">
                  -{getDiscountPercent(product)}%
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            <h1 className="text-4xl sm:text-5xl">{product.name}</h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className={`text-2xl font-semibold ${discounted ? "text-pink" : "text-ink"}`}>
                {formatPrice(getEffectivePrice(product))}
              </span>
              {discounted && (
                <span className="text-lg text-muted line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            <p className={`mt-3 text-sm font-medium ${out ? "text-error" : "text-success"}`}>
              {out
                ? "Out of stock · غير متوفر"
                : product.stock <= 3
                ? `In stock · only ${product.stock} left`
                : "In stock · متوفر"}
            </p>

            {product.colors?.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium">
                  Color{color && <span className="ml-2 font-normal text-muted">{color}</span>}
                </p>
                <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Color">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={color === c}
                      aria-label={c}
                      title={c}
                      onClick={() => {
                        setColor(c);
                        setFormError("");
                      }}
                      className={`h-11 w-11 rounded-full border border-border transition-transform focus-visible:outline-2 focus-visible:outline-pink ${
                        color === c ? "scale-105 ring-2 ring-ink ring-offset-2" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: getColorValue(c) }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Size{size && <span className="ml-2 font-normal text-muted">{size}</span>}
                  </p>
                  <button
                    type="button"
                    onClick={() => setGuideOpen(true)}
                    className="text-sm text-pink underline-offset-4 hover:underline"
                  >
                    Size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={size === s}
                      onClick={() => {
                        setSize(s);
                        setFormError("");
                      }}
                      className={`min-h-12 min-w-12 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-pink ${
                        size === s
                          ? "border-ink bg-ink text-white"
                          : "border-border text-ink hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formError && (
              <p role="alert" className="mt-4 text-sm font-medium text-error">
                {formError}
              </p>
            )}

            {/* Quantity + actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-12 w-fit items-center rounded-full border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || out}
                  className="flex h-12 w-12 items-center justify-center text-xl disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty || out}
                  className="flex h-12 w-12 items-center justify-center text-xl disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Button type="button" onClick={handleAdd} disabled={out} className="flex-1">
                {out ? "Out of Stock" : added ? "Added to cart ✓" : "Add to Cart"}
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleBuyNow}
              disabled={out}
              className="mt-3 w-full"
            >
              Buy Now
            </Button>

            <div className="mt-10">
              <Accordion title="Description" defaultOpen>
                <p>{product.description}</p>
              </Accordion>
              <Accordion title="Details">
                <dl className="grid grid-cols-[100px_1fr] gap-y-2">
                  <dt className="text-ink">Material</dt>
                  <dd>{product.material || "—"}</dd>
                  <dt className="text-ink">Colors</dt>
                  <dd>{product.colors?.join(", ") || "—"}</dd>
                  <dt className="text-ink">Sizes</dt>
                  <dd>{product.sizes?.join(", ") || "—"}</dd>
                </dl>
              </Accordion>
              <Accordion title="Shipping & returns">
                <ul className="space-y-2">
                  <li>Shipping fee: {shippingFee}</li>
                  <li>Delivery time: {deliveryTime}</li>
                  <li>Returns: {returnPolicy}</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24" aria-labelledby="related-title">
            <h2 id="related-title" className="mb-8 text-3xl sm:text-4xl">
              You may also like
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <SizeGuide
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        sizes={product.sizes}
      />
    </>
  );
}