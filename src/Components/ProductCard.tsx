import Image from "next/image";
import { Package, Boxes, RefreshCw } from "lucide-react";

const ProductCard = ({ product }) => {
  const stock = Number(product.stock || 0);

  const stockStatus =
    stock === 0
      ? {
          text: "Out of Stock",
          className: "border-red-100 bg-red-50 text-red-600",
        }
      : stock <= 10
        ? {
            text: "Low Stock",
            className: "border-amber-100 bg-amber-50 text-amber-600",
          }
        : {
            text: "In Stock",
            className: "border-emerald-100 bg-emerald-50 text-emerald-600",
          };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      {/* ================= IMAGE HEADER ================= */}

      <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50">
        {/* Product Image */}

        <div className="relative h-56 w-full overflow-hidden bg-white">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.productName || "Product image"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-contain p-5 transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <Package size={50} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Stock Badge */}

        <div className="absolute right-4 top-4">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${stockStatus.className}`}
          >
            {stockStatus.text}
          </span>
        </div>
      </div>

      {/* ================= PRODUCT INFO ================= */}

      <div className="p-5">
        {/* Category */}

        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
          {product.category || "Uncategorized"}
        </p>

        {/* Product Name */}

        <h2 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-slate-900">
          {product.productName}
        </h2>

        {/* Product Code */}

        <p className="mt-1 text-xs text-slate-400">
          Code: {product.productCode || "N/A"}
        </p>

        {/* Brand */}

        {product.brand && (
          <p className="mt-1 text-xs text-slate-500">
            Brand:{" "}
            <span className="font-semibold text-slate-700">
              {product.brand}
            </span>
          </p>
        )}
      </div>

      {/* ================= PRICES ================= */}

      <div className="grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100">
        <Price label={`${product.packagingType} Size`} value={product.cartonSize | 0} highlight />

        <Price label="TP Price" value={product.tpPrice} />

        <Price label="MRP Price" value={product.mrpPrice} />
      </div>

      {/* ================= DETAILS ================= */}

      <div className="p-5">
       

        {/* ================= LAST UPDATE ================= */}

        {product.lastUpdate && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <RefreshCw size={13} />
              </div>

              <div>
                <p className="text-[11px] text-slate-400">Last Updated</p>

                <p className="text-xs font-semibold text-slate-700">
                  {new Date(product.lastUpdate).toLocaleDateString("en-BD", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Dhaka",
                  })}
                </p>
              </div>
            </div>

            <span className="text-xs font-medium text-slate-500">
              {new Date(product.lastUpdate).toLocaleTimeString("en-BD", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Dhaka",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= PRICE COMPONENT ================= */

const Price = ({ label, value, highlight = false }) => {
  return (
    <div className="p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-base font-bold ${
          highlight ? "text-blue-600" : "text-slate-900"
        }`}
      >
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
};

export default ProductCard;
