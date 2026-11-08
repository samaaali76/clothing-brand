import ProductListing from "../components/product/ProductListing";

const selectBase = (products) => products.filter((p) => p.isNewArrival);

export default function NewArrivals() {
  return (
    <ProductListing
      title="New arrivals"
      description="The latest pieces, just added."
      selectBase={selectBase}
    />
  );
}