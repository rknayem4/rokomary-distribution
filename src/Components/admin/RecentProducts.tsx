"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  _id: string;

  productName?: string;
  productCode?: string;
  brand?: string;

  image?: string;
  productImage?: string;

  dpPrice?: number;
  status?: string;

  lastUpdate?: string;
};

const RecentProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_PASE_URL;

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${baseUrl}/api/admin/dashboard/recent-products`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load recent products",
          );
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error(
          "Recent products error:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, [baseUrl]);

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-gray-900">
            Recent Products
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Recently added or updated products
          </p>
        </div>

        <Link
          href="/dashboard/admin/product"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View All →
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3 p-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && products.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="text-4xl">📦</div>

          <p className="mt-3 font-semibold text-gray-900">
            No products found
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Add your first product to see it here.
          </p>
        </div>
      )}

      {/* Products */}
      {!loading && products.length > 0 && (
        <div className="divide-y divide-gray-100">
          {products.map((product) => {
            const productImage =
              product.image ||
              product.productImage ||
              "";

            return (
              <div
                key={product._id}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50"
              >
                {/* Image */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={
                        product.productName ||
                        "Product"
                      }
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl">
                      📦
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {product.productName ||
                      "Unnamed Product"}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                    {product.productCode && (
                      <span>
                        Code: {product.productCode}
                      </span>
                    )}

                    {product.brand && (
                      <span>
                        Brand: {product.brand}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    ৳
                    {typeof product.dpPrice ===
                    "number"
                      ? product.dpPrice.toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status === "active"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentProducts;