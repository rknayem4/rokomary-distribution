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

/* =========================================================
   TYPES
========================================================= */

export type Product = {
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

export type ProductPagination = {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

type ProductsClientProps = {
  initialProducts?: Product[];
  pagination?: ProductPagination;
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: string;
};

type UpdateURLParams = {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
};

/* =========================================================
   COMPONENT
========================================================= */

const ProductsClient = ({
  initialProducts = [],
  pagination,
  initialSearch = "",
  initialCategory = "",
  initialSort = "latest",
}: ProductsClientProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<string>(initialSort);

  const products: Product[] = initialProducts;

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalProducts = pagination?.totalProducts ?? 0;

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories: string[] = [
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

  /* =========================================================
     SEARCH DEBOUNCE
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") ?? "";

      if (search === currentSearch) {
        return;
      }

      updateURL({
        search,
        category,
        sort,
        page: 1,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================================================
     UPDATE URL
  ========================================================= */

  const updateURL = ({
    search: newSearch = search,
    category: newCategory = category,
    sort: newSort = sort,
    page = 1,
  }: UpdateURLParams = {}) => {
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

  /* =========================================================
     CATEGORY CHANGE
  ========================================================= */

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;

    setCategory(value);

    updateURL({
      search,
      category: value,
      sort,
      page: 1,
    });
  };

  /* =========================================================
     SORT CHANGE
  ========================================================= */

  const handleSortChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;

    setSort(value);

    updateURL({
      search,
      category,
      sort: value,
      page: 1,
    });
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    updateURL({
      search,
      category,
      sort,
      page,
    });
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("latest");

    router.push(pathname);
  };

  /* =========================================================
     PAGE NUMBERS
  ========================================================= */

  const getPageNumbers = (): (number | string)[] => {
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

  /* =========================================================
     RENDER
  ========================================================= */

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

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
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
                <option value="latest">
                  Latest Updated
                </option>

                <option value="oldest">
                  Oldest Updated
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>
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
              <span className="font-semibold text-slate-800">
                {totalPages}
              </span>
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
              <ProductCard
                key={product._id}
                product={product}
              />
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
              <span className="font-semibold text-slate-800">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-1.5">
              {/* Previous */}

              <button
                type="button"
                disabled={!pagination?.hasPreviousPage}
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />

                <span className="hidden sm:inline">
                  Previous
                </span>
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
                      onClick={() =>
                        handlePageChange(page)
                      }
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
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">
                  Next
                </span>

                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsClient;