import { getProducts } from "@/app/lib/actions/products";
import AdminProductsClient from "@/Components/admin/AdminProductsClient";

const AdminProductsPage = async ({
  searchParams,
}) => {
  const params = await searchParams;

  const page =
    Number(params?.page) || 1;

  const search =
    params?.search || "";

  const category =
    params?.category || "";

  const status =
    params?.status || "";

  const sort =
    params?.sort || "latest";

  const data = await getProducts({
    page,
    limit: 12,
    search,
    category,
    status,
    sort,
  });

  return (
    <AdminProductsClient
      initialProducts={
        data.products || []
      }
      pagination={
        data.pagination
      }
      initialSearch={search}
      initialCategory={category}
      initialStatus={status}
      initialSort={sort}
    />
  );
};

export default AdminProductsPage;