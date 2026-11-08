import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import ProductListing from "../components/product/ProductListing";
import { CATEGORY_LABELS } from "../utils/productUtils";

export default function CategoryPage() {
  const { category } = useParams();
  const label = CATEGORY_LABELS[category];

  const selectBase = useCallback(
    (products) => products.filter((p) => p.category === category),
    [category]
  );

  if (!label) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">We couldn’t find that collection</h1>
        <p className="mt-3 text-muted">Pajamas, abayas and casual wear are all one tap away.</p>
        <Link to="/" className="mt-6 inline-block font-medium text-pink underline-offset-4 hover:underline">
          Back to home
        </Link>
      </section>
    );
  }

  return (
    <ProductListing
      key={category}
      title={label}
      selectBase={selectBase}
      hideCategoryFilter
      emptyHint={`No ${label.toLowerCase()} match these filters.`}
    />
  );
}