"use client";

import React, { useEffect, useState } from "react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProductCard from "./ProductCard";

/* =========================================================
   Product Type
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

/* =========================================================
   Pagination Type
========================================================= */

export type ProductPagination = {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

/* =========================================================
   Props
========================================================= */

type ProductsClientProps = {
  initialProducts?: Product[];

  pagination?: ProductPagination;

  initialSearch?: string;

  initialCategory?: string;

  initialSort?: string;
};

/* =========================================================
   URL Update Type
========================================================= */

type UpdateURLParams = {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
};

/* =========================================================
   Component
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

  /* =======================================================
     States
  ======================================================= */

  const [search, setSearch] = useState<string>(initialSearch);

  const [category, setCategory] = useState<string>(initialCategory);

  const [sort, setSort] = useState<string>(initialSort);

  /* =======================================================
     Products
  ======================================================= */

  const products: Product[] = initialProducts;

  /* =======================================================
     Pagination Safe Values
  ======================================================= */

  const currentPage = pagination?.currentPage ?? 1;

  const totalPages = pagination?.totalPages ?? 1;

  const totalProducts = pagination?.totalProducts ?? 0;

  /* =======================================================
     Categories
  ======================================================= */

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

  /* =======================================================
     Search Effect
  ======================================================= */

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

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  /* =======================================================
     Update URL
  ======================================================= */

  const updateURL = ({
    search: newSearch = search,
    category: newCategory = category,
    sort: newSort = sort,
    page = 1,
  }: UpdateURLParams = {}) => {
    const params = new URLSearchParams();

    /* Search */
    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    }

    /* Category */
    if (newCategory) {
      params.set("category", newCategory);
    }

    /* Sort */
    if (newSort && newSort !== "latest") {
      params.set("sort", newSort);
    }

    /* Page */
    if (page > 1) {
      params.set("page", String(page));
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  /* =======================================================
     Category Change
  ======================================================= */

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

  /* =======================================================
     Sort Change
  ======================================================= */

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

  /* =======================================================
     Page Change
  ======================================================= */

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

  /* =======================================================
     Clear Filters
  ======================================================= */

  const clearFilters = () => {
    setSearch("");

    setCategory("");

    setSort("latest");

    router.push(pathname);
  };

  /* =======================================================
     Page Numbers
  ======================================================= */

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    /* If pages <= 7 */
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    /* First page */
    pages.push(1);

    /* Left dots */
    if (currentPage > 3) {
      pages.push("...");
    }

    /* Middle pages */
    const start = Math.max(2, currentPage - 1);

    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    /* Right dots */
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    /* Last page */
    pages.push(totalPages);

    return pages;
  };

  /* =======================================================
     Active Filter Check
  ======================================================= */

  const hasFilters =
    search.trim() !== "" || category !== "" || sort !== "latest";

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Products
            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              All Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Browse our complete product collection, search products, filter by
              category and sort according to your preference.
            </p>
          </div>

          {/* Product Count */}

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Boxes size={22} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Total Products
              </p>

              <p className="text-xl font-bold text-slate-900">
                {totalProducts}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            FILTER BOX
        ================================================= */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_200px_auto]">
            {/* ================= SEARCH ================= */}

            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                placeholder="Search product name, code, brand..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* ================= CATEGORY ================= */}

            <div className="relative">
              <Filter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={category}
                onChange={handleCategoryChange}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Categories</option>

                {categories.map((item: string) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▼
              </span>
            </div>

            {/* ================= SORT ================= */}

            <div className="relative">
              <ArrowDownUp
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sort}
                onChange={handleSortChange}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="latest">Latest Products</option>

                <option value="oldest">Oldest Products</option>

                <option value="name-asc">Name: A-Z</option>

                <option value="name-desc">Name: Z-A</option>

                <option value="price-low">Price: Low to High</option>

                <option value="price-high">Price: High to Low</option>

                <option value="stock-high">Stock: High to Low</option>

                <option value="stock-low">Stock: Low to High</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                ▼
              </span>
            </div>

            {/* ================= CLEAR ================= */}

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <X size={17} />

                <span>Clear</span>
              </button>
            ) : (
              <div className="hidden lg:block" />
            )}
          </div>
        </div>

        {/* =================================================
            RESULT INFO
        ================================================= */}

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Package size={17} className="text-blue-500" />

            <span>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {products.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {totalProducts}
              </span>{" "}
              products
            </span>
          </div>

          {category && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Category:</span>

              <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          /* ===============================================
             EMPTY STATE
          =============================================== */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Package size={30} className="text-slate-400" />
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              No Products Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any products matching your search or selected
              filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* =================================================
            PAGINATION
        ================================================= */}

        {products.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Page Information */}

            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-700">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>
            </p>

            {/* Pagination */}

            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {/* Previous */}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page Numbers */}

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => {
                  /*
                   * Important:
                   * Here we narrow the union type.
                   *
                   * page can be:
                   * number | string
                   *
                   * After this check,
                   * TypeScript knows page is number.
                   */

                  if (typeof page === "string") {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="px-2 text-sm text-slate-400"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`min-w-9 rounded-lg px-3 py-2 text-sm font-semibold transition ${
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsClient;
