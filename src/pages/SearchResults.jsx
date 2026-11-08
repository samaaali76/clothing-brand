import { useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductListing from "../components/product/ProductListing";
import { searchProducts } from "../utils/productUtils";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const selectBase = useCallback((products) => searchProducts(products, q), [q]);

  if (!q) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">What are you looking for?</h1>
        <p className="mt-3 text-muted">Search by name, category or color, like “abaya black”.</p>
        <Link to="/" className="mt-6 inline-block font-medium text-pink underline-offset-4 hover:underline">
          Back to home
        </Link>
      </section>
    );
  }

  return (
    <ProductListing
      key={q}
      title={`Results for “${q}”`}
      selectBase={selectBase}
      emptyHint="Check the spelling, or search for a category or color instead."
    />
  );
}