import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from "../../services/api";
import ErrorMessage from "../common/ErrorMessage";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import SortDropdown from "./SortDropdown";
import {
  DEFAULT_FILTERS,
  applyFilters,
  countActiveFilters,
  getFilterOptions,
  sortProducts,
} from "../../utils/productUtils";

/**
 * صفحة قائمة منتجات كاملة (عنوان + فلاتر + ترتيب + Grid + Loading + Error).
 * Category / NewArrivals / Sale / SearchResults كلهم بيستخدموها.
 * selectBase لازم تكون دالة ثابتة (برا الكومبوننت أو في useCallback).
 */
export default function ProductListing({
  title,
  description,
  selectBase = (products) => products,
  hideCategoryFilter = false,
  emptyHint,
}) {
  const [all, setAll] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [attempt, setAttempt] = useState(0);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getProducts()
      .then((data) => {
        if (cancelled) return;
        setAll(data);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const base = useMemo(() => selectBase(all), [all, selectBase]);
  const options = useMemo(() => getFilterOptions(base), [base]);
  const visible = useMemo(
    () => sortProducts(applyFilters(base, filters), sort),
    [base, filters, sort]
  );
  const activeCount = countActiveFilters(filters);

  const clearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 text-muted">{description}</p>}
      </header>

      {status === "error" ? (
        <ErrorMessage
          message="We couldn’t load the products. Check your connection and try again."
          onRetry={() => setAttempt((a) => a + 1)}
        />
      ) : (
        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            options={options}
            hideCategory={hideCategoryFilter}
            activeCount={activeCount}
            resultCount={visible.length}
            mobileOpen={drawerOpen}
            onMobileClose={closeDrawer}
          />

          <div>
            <div className="mb-8 flex items-center justify-between gap-3">
              <p className="text-sm text-muted" aria-live="polite">
                {status === "loading"
                  ? "Loading…"
                  : `${visible.length} ${visible.length === 1 ? "product" : "products"}`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-pink lg:hidden"
                >
                  Filters
                  {activeCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pink px-1.5 text-xs text-white">
                      {activeCount}
                    </span>
                  )}
                </button>
                <SortDropdown value={sort} onChange={setSort} />
              </div>
            </div>

            <ProductGrid
              products={visible}
              loading={status === "loading"}
              onClearFilters={activeCount > 0 ? clearFilters : undefined}
              emptyHint={emptyHint}
            />
          </div>
        </div>
      )}
    </section>
  );
}