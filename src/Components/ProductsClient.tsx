"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Package,
  Boxes,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  ArrowDownUp,
} from "lucide-react";
import ProductCard from "./ProductCard";

const ProductsClient = ({
  initialProducts = [],
  pagination,
  initialSearch = "",
  initialCategory = "",
  initialSort = "latest",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);

  const products = initialProducts;

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalProducts = pagination?.totalProducts || 0;

  const categories = [
    "Edible Oil",
    "Atta",
    "Maida",
    "Suji",
    "Salt",
    "Canola Oil",
    "Mustard Oil",
    "Rice",
    "Masala",
    "Water",
    "Other",
  ];

  /*
   * ------------------------------------------------
   * Search debounce
   * ------------------------------------------------
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";

      if (search === currentSearch) return;

      updateURL({
        search,
        category,
        sort,
        page: 1,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /*
   * ------------------------------------------------
   * Update URL
   * ------------------------------------------------
   */

  const updateURL = ({
    search: newSearch = search,
    category: newCategory = category,
    sort: newSort = sort,
    page = 1,
  }) => {
    const params = new URLSearchParams();

    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    }

    if (newCategory) {
      params.set("category", newCategory);
    }

    if (newSort && newSort !== "latest") {
      params.set("sort", newSort);
    }

    if (page > 1) {
      params.set("page", String(page));
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  /*
   * ------------------------------------------------
   * Category
   * ------------------------------------------------
   */

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setCategory(value);

    updateURL({
      search,
      category: value,
      sort,
      page: 1,
    });
  };

  /*
   * ------------------------------------------------
   * Sort
   * ------------------------------------------------
   */

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setSort(value);

    updateURL({
      search,
      category,
      sort: value,
      page: 1,
    });
  };

  /*
   * ------------------------------------------------
   * Pagination
   * ------------------------------------------------
   */

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    updateURL({
      search,
      category,
      sort,
      page,
    });
  };

  /*
   * ------------------------------------------------
   * Clear filters
   * ------------------------------------------------
   */

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("latest");

    router.push(pathname);
  };

  /*
   * ------------------------------------------------
   * Page numbers
   * ------------------------------------------------
   */

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}

        <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Package size={22} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                All Products
              </h1>
            </div>

            <p className="text-sm text-slate-500">
              Browse, search and manage your products
            </p>
          </div>

          {/* Total */}

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Boxes size={19} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Total Products
              </p>

              <p className="text-xl font-bold text-slate-900">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
            {/* Search */}

            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product name, code or brand..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    updateURL({
                      search: "",
                      category,
                      sort,
                      page: 1,
                    });
                  }}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category */}

            <div className="relative">
              <Filter
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={category}
                onChange={handleCategoryChange}
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">All Categories</option>

                {/* 
                  Category list should come from backend
                  if you have a category API.
                */}

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}

                {/* <option value="Food">Food</option>
                <option value="Beverage">Beverage</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Household">Household</option> */}
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▼
              </span>
            </div>

            {/* Sort */}

            <div className="relative">
              <ArrowDownUp
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sort}
                onChange={handleSortChange}
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="latest">Latest Updated</option>

                <option value="oldest">Oldest Updated</option>

                <option value="price-low">Price: Low to High</option>

                <option value="price-high">Price: High to Low</option>
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▼
              </span>
            </div>

            {/* Clear */}

            {(search || category || sort !== "latest") && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <RefreshCw size={17} />
                Clear
              </button>
            )}
          </div>

          {/* Result */}

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-800">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">{totalPages}</span>
            </p>

            <p className="text-sm text-slate-500">
              {totalProducts} products found
            </p>
          </div>
        </div>

        {/* ================= PRODUCT GRID ================= */}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Package size={30} />
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              No products found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No products match your current search or filter.
            </p>

            {(search || category) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-800">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1.5">
              {/* Previous */}

              <button
                type="button"
                disabled={!pagination?.hasPreviousPage}
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />

                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Pages */}

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="px-2 text-slate-400"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page as number)}
                      className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next */}

              <button
                type="button"
                disabled={!pagination?.hasNextPage}
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">Next</span>

                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   PRODUCT CARD
========================================================= */

// const ProductCard = ({ product }) => {
//   const stock = Number(product.stock || 0);

//   const stockStatus =
//     stock === 0
//       ? {
//           text: "Out of Stock",
//           className:
//             "border-red-100 bg-red-50 text-red-600",
//         }
//       : stock <= 10
//       ? {
//           text: "Low Stock",
//           className:
//             "border-amber-100 bg-amber-50 text-amber-600",
//         }
//       : {
//           text: "In Stock",
//           className:
//             "border-emerald-100 bg-emerald-50 text-emerald-600",
//         };

//   return (
//     <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

//       {/* Header */}

//       <div className="border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5">
//         <div className="flex items-start justify-between gap-3">

//           <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-100">
//             <Package size={26} />
//           </div>

//           <span
//             className={`rounded-full border px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
//           >
//             {stockStatus.text}
//           </span>
//         </div>

//         <div className="mt-5">
//           <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
//             {product.category || "Uncategorized"}
//           </p>

//           <h2 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-slate-900">
//             {product.productName}
//           </h2>

//           <p className="mt-1 text-xs text-slate-400">
//             Code: {product.productCode || "N/A"}
//           </p>
//         </div>
//       </div>

//       {/* Prices */}

//       <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
//         <Price
//           label="MRP"
//           value={product.mrpPrice}
//         />

//         <Price
//           label="TP"
//           value={product.tpPrice}
//         />

//         <Price
//           label="DP"
//           value={product.dpPrice}
//           highlight
//         />
//       </div>

//       {/* Details */}

//       <div className="p-5">

//         <div className="mb-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
//               <Boxes size={17} />
//             </div>

//             <div>
//               <p className="text-xs text-slate-400">
//                 Stock
//               </p>

//               <p className="text-sm font-bold text-slate-800">
//                 {stock.toLocaleString()}
//               </p>
//             </div>
//           </div>

//           {product.brand && (
//             <div className="text-right">
//               <p className="text-xs text-slate-400">
//                 Brand
//               </p>

//               <p className="max-w-28 truncate text-sm font-semibold text-slate-700">
//                 {product.brand}
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <div className="rounded-xl bg-slate-50 p-3">
//             <p className="text-[11px] text-slate-400">
//               Weight
//             </p>

//             <p className="mt-1 text-sm font-semibold text-slate-700">
//               {product.weight || 0}{" "}
//               {product.weightUnit || ""}
//             </p>
//           </div>

//           <div className="rounded-xl bg-slate-50 p-3">
//             <p className="text-[11px] text-slate-400">
//               Carton Size
//             </p>

//             <p className="mt-1 text-sm font-semibold text-slate-700">
//               {product.cartonSize || 0}
//             </p>
//           </div>
//         </div>

//         {/* Last update */}

//         {product.lastUpdate && (
//           <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
//             <div className="flex items-center gap-2">
//               <RefreshCw
//                 size={14}
//                 className="text-slate-400"
//               />

//               <span className="text-xs text-slate-400">
//                 Last updated
//               </span>
//             </div>

//             <span className="text-xs font-medium text-slate-600">
//               {new Date(
//                 product.lastUpdate
//               ).toLocaleString("en-BD", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//                 timeZone: "Asia/Dhaka",
//               })}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

/* =========================================================
   PRICE
========================================================= */

export default ProductsClient;
