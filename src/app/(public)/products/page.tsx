import { getProducts } from "@/app/lib/actions/products";
import ProductsClient from "@/Components/ProductsClient";
const ProductsPage = async ({ searchParams }) => {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
  const search = params?.search || "";
  const category = params?.category || "";
  const sort = params?.sort || "latest";

  const data = await getProducts({
    page,
    limit: 12,
    search,
    category,
    sort,
  });

  return (
    <ProductsClient 
      initialProducts={data.products || []}
      pagination={data.pagination}
      initialSearch={search}
      initialCategory={category}
      initialSort={sort}
    />
  );
};

export default ProductsPage;