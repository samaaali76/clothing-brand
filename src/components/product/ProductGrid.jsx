import ProductCard from "./ProductCard";
import Button from "../common/Button";

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-[20px] bg-border" />
      <div className="mt-4 h-5 w-3/4 rounded-full bg-border" />
      <div className="mt-3 h-4 w-1/3 rounded-full bg-border" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-5 rounded-full bg-border" />
        <div className="h-5 w-5 rounded-full bg-border" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading = false, onClearFilters, emptyHint }) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4"
        aria-busy="true"
        aria-label="Loading products"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center rounded-[28px] border border-dashed border-border bg-surface px-6 py-20 text-center">
        <p className="font-heading text-3xl text-ink">No products found</p>
        <p className="mt-1 font-arabic text-muted">لا توجد منتجات</p>
        <p className="mt-4 max-w-sm text-sm text-muted">
          {emptyHint || "Try removing a filter or changing your search."}
        </p>
        {onClearFilters && (
          <Button type="button" onClick={onClearFilters} className="mt-6">
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}