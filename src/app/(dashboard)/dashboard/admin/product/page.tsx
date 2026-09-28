import { getProducts } from "@/app/lib/actions/products";
import AdminProductsClient from "@/Components/admin/AdminProductsClient";

const AdminProductsPage = async () => {
  const data = await getProducts({
    page: 1,
    limit: 100,
    sort: "latest",
  });

  return (
    <AdminProductsClient
      initialProducts={data.products || []}
    />
  );
};

export default AdminProductsPage;