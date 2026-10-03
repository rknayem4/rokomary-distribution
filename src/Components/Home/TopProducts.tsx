import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Package, RefreshCw } from "lucide-react";

import { getLatestProducts } from "@/app/lib/actions/products";

type Product = {
  _id: string;
  productName: string;
  productCode?: string | null;
  brand?: string | null;
  image?: string | null;
  weight?: string | number | null;
  weightUnit?: string | null;
  cartonSize?: string | number | null;
  packagingType?: string | null;
  mrpPrice?: number | null;
  tpPrice?: number | null;
  dpPrice?: number | null;
  category?: string | null;
  stock?: number | null;
  description?: string | null;
  status?: boolean | string | null;
  lastUpdate?: string | Date | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
};

const LatestProducts = async () => {
  const products: Product[] = await getLatestProducts();

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <RefreshCw size={14} />
              Recently Updated
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Latest Products
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
              Explore our 6 most recently updated products from the database.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View All Products
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Products */}

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Package size={45} className="mx-auto text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-700">
              No products available
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Products will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: Product) => (
              <LatestProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestProducts;

// ==================================================
// PRODUCT CARD
// ==================================================

interface LatestProductCardProps {
  product: Product;
}

const LatestProductCard = ({ product }: LatestProductCardProps) => {
  const stock = Number(product.stock || 0);

  const stockStatus =
    stock === 0
      ? {
          text: "Out of Stock",
          className: "bg-red-50 text-red-600 border-red-100",
        }
      : stock <= 10
        ? {
            text: "Low Stock",
            className: "bg-amber-50 text-amber-600 border-amber-100",
          }
        : {
            text: "In Stock",
            className: "bg-emerald-50 text-emerald-600 border-emerald-100",
          };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      {/* Image */}

      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.productName || "Product"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Package size={55} />
          </div>
        )}

        {/* Stock */}

        <span
          className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
        >
          {stockStatus.text}
        </span>

        {/* Category */}

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur">
          {product.category || "Uncategorized"}
        </span>
      </div>

      {/* Content */}

      <div className="p-5">
        <p className="text-xs font-medium text-slate-400">
          Code: {product.productCode || "N/A"}
        </p>

        <h3 className="mt-1 line-clamp-2 min-h-[52px] text-lg font-bold leading-7 text-slate-900">
          {product.productName}
        </h3>
      </div>
    </div>
  );
};
