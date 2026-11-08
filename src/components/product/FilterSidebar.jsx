import { useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { getColorValue } from "./colorMap";
import { CATEGORY_LABELS } from "../../utils/productUtils";

const toggleIn = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

function Section({ title, children }) {
  return (
    <details open className="group border-b border-border py-5 first:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          className="h-4 w-4 text-muted transition-transform group-open:rotate-180"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-pink"
      />
      {label}
    </label>
  );
}

function FilterPanel({ filters, onChange, options, hideCategory }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div>
      {!hideCategory && options.categories.length > 1 && (
        <Section title="Category">
          <div className="flex flex-col">
            {options.categories.map((c) => (
              <CheckRow
                key={c}
                label={CATEGORY_LABELS[c] || c}
                checked={filters.categories.includes(c)}
                onChange={() => set({ categories: toggleIn(filters.categories, c) })}
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {options.sizes.map((s) => {
            const on = filters.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => set({ sizes: toggleIn(filters.sizes, s) })}
                className={`min-h-11 min-w-11 rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-pink ${
                  on
                    ? "border-ink bg-ink text-white"
                    : "border-border text-ink hover:border-ink"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Color">
        <div className="flex flex-wrap gap-3">
          {options.colors.map((c) => {
            const on = filters.colors.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                aria-label={c}
                title={c}
                onClick={() => set({ colors: toggleIn(filters.colors, c) })}
                className={`h-9 w-9 rounded-full border border-border transition-transform focus-visible:outline-2 focus-visible:outline-pink ${
                  on ? "ring-2 ring-ink ring-offset-2" : "hover:scale-110"
                }`}
                style={{ backgroundColor: getColorValue(c) }}
              />
            );
          })}
        </div>
      </Section>

      <Section title="Price (EGP)">
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder={String(options.minPrice)}
            value={filters.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
            aria-label="Minimum price"
          />
          <span className="text-muted">–</span>
          <Input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder={String(options.maxPrice)}
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
            aria-label="Maximum price"
          />
        </div>
      </Section>

      <Section title="Availability">
        <div className="flex flex-col">
          <CheckRow
            label="In stock only"
            checked={filters.inStockOnly}
            onChange={() => set({ inStockOnly: !filters.inStockOnly })}
          />
          <CheckRow
            label="On sale only"
            checked={filters.onSaleOnly}
            onChange={() => set({ onSaleOnly: !filters.onSaleOnly })}
          />
        </div>
      </Section>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
  onClear,
  options,
  hideCategory = false,
  activeCount = 0,
  resultCount = 0,
  mobileOpen = false,
  onMobileClose = () => {},
}) {
  // قفل سكرول الصفحة + Escape لما الـ Drawer يتفتح
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onMobileClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, onMobileClose]);

  const panel = (
    <FilterPanel
      filters={filters}
      onChange={onChange}
      options={options}
      hideCategory={hideCategory}
    />
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] self-start overflow-y-auto pr-2 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-2xl">Filters</h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-medium text-pink underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        {panel}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={onMobileClose}
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-background transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-heading text-2xl">Filters</h2>
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-pink-soft"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{panel}</div>
          <div className="flex gap-3 border-t border-border bg-surface px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClear}
              disabled={activeCount === 0}
              className="flex-1"
            >
              Clear all
            </Button>
            <Button type="button" onClick={onMobileClose} className="flex-1">
              Show {resultCount} {resultCount === 1 ? "item" : "items"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}