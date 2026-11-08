import ProductListing from "../components/product/ProductListing";

const selectBase = (products) => products.filter((p) => p.isOnSale);

export default function Sale() {
  return (
    <ProductListing
      title="Sale"
      description="Selected pieces at reduced prices."
      selectBase={selectBase}
    />
  );
}