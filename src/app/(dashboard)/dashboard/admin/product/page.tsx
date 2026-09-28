import { getProducts } from "@/app/lib/actions/products";

const ProductsPage = async () => {
  const products = await getProducts();

  console.log(products);

  return (
    <div>
      <h1>Products</h1>

      {products.map((product) => (
        <div key={product._id} className="border border-red-500 p-3 m-5">
          <h2>{product.productName}</h2>

          <p>MRP: ৳{product.mrpPrice}</p>
          <p>TP: ৳{product.tpPrice}</p>
          <p>DP: ৳{product.dpPrice}</p>
          <p>Stock: {product.stock}</p>
          <p>
            Last Update:{" "}
            {new Date(product.lastUpdate).toLocaleString("en-BD", {
              timeZone: "Asia/Dhaka",
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
