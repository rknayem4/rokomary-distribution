"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  Package,
  Pencil,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowDownUp,
  X,
} from "lucide-react";

import {
  updateProduct,
  deleteProduct,
} from "@/app/lib/actions/products";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";


const AdminProductsClient = ({
  initialProducts = [],
  pagination,
  initialSearch = "",
  initialCategory = "",
  initialStatus = "",
  initialSort = "latest",
}) => {

  const router = useRouter();

  const pathname = usePathname();

  const searchParams =
    useSearchParams();


  // ========================================
  // STATES
  // ========================================

  const [products, setProducts] =
    useState(initialProducts);

  const [search, setSearch] =
    useState(initialSearch);

  const [category, setCategory] =
    useState(initialCategory);

  const [status, setStatus] =
    useState(initialStatus);

  const [sort, setSort] =
    useState(initialSort);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const [
    deleteProductData,
    setDeleteProductData,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);


  const currentPage =
    pagination?.currentPage || 1;

  const totalPages =
    pagination?.totalPages || 1;

  const totalProducts =
    pagination?.totalProducts || 0;


  // ========================================
  // UPDATE PRODUCTS WHEN SERVER DATA CHANGES
  // ========================================

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);


  // ========================================
  // UPDATE URL
  // ========================================

  const updateURL = ({
    newSearch = search,
    newCategory = category,
    newStatus = status,
    newSort = sort,
    page = 1,
  } = {}) => {

    const params =
      new URLSearchParams();


    if (newSearch.trim()) {
      params.set(
        "search",
        newSearch.trim()
      );
    }


    if (newCategory) {
      params.set(
        "category",
        newCategory
      );
    }


    if (newStatus) {
      params.set(
        "status",
        newStatus
      );
    }


    if (
      newSort &&
      newSort !== "latest"
    ) {
      params.set(
        "sort",
        newSort
      );
    }


    if (page > 1) {
      params.set(
        "page",
        String(page)
      );
    }


    const query =
      params.toString();


    router.push(
      query
        ? `${pathname}?${query}`
        : pathname
    );
  };


  // ========================================
  // SEARCH
  // ========================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        const currentSearch =
          searchParams.get(
            "search"
          ) || "";


        if (
          search === currentSearch
        ) {
          return;
        }


        updateURL({
          newSearch: search,
          page: 1,
        });

      }, 500);


    return () =>
      clearTimeout(timer);

  }, [search]);


  // ========================================
  // CATEGORY
  // ========================================

  const handleCategory = (
    e
  ) => {

    const value =
      e.target.value;

    setCategory(value);

    updateURL({
      newCategory: value,
      page: 1,
    });
  };


  // ========================================
  // STATUS
  // ========================================

  const handleStatus = (
    e
  ) => {

    const value =
      e.target.value;

    setStatus(value);

    updateURL({
      newStatus: value,
      page: 1,
    });
  };


  // ========================================
  // SORT
  // ========================================

  const handleSort = (
    e
  ) => {

    const value =
      e.target.value;

    setSort(value);

    updateURL({
      newSort: value,
      page: 1,
    });
  };


  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {

    setSearch("");

    setCategory("");

    setStatus("");

    setSort("latest");

    router.push(pathname);
  };


  // ========================================
  // PAGINATION
  // ========================================

  const changePage = (
    page
  ) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }


    updateURL({
      page,
    });
  };


  // ========================================
  // UPDATE PRODUCT
  // ========================================

  const handleUpdate = async (
    formData
  ) => {

    if (
      !selectedProduct?._id
    ) {
      return;
    }


    try {

      setLoading(true);


      const updatedData = {

        productName:
          formData.productName,

        productCode:
          formData.productCode,

        brand:
          formData.brand,

        weight:
          Number(formData.weight),

        weightUnit:
          formData.weightUnit,

        cartonSize:
          Number(
            formData.cartonSize
          ),

        packagingType:
          formData.packagingType,

        mrpPrice:
          Number(
            formData.mrpPrice
          ),

        tpPrice:
          Number(
            formData.tpPrice
          ),

        dpPrice:
          Number(
            formData.dpPrice
          ),

        category:
          formData.category,

        stock:
          Number(formData.stock),

        description:
          formData.description,

        status:
          formData.status,

        image:
          formData.image,
      };


      const result =
        await updateProduct(
          selectedProduct._id,
          updatedData
        );


      if (
        result?.success
      ) {

        alert(
          "Product updated successfully!"
        );


        setSelectedProduct(null);

        router.refresh();
      }

    } catch (error) {

      console.error(
        "UPDATE ERROR:",
        error
      );


      alert(
        error?.message ||
          "Failed to update product"
      );

    } finally {

      setLoading(false);
    }
  };


  // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleDelete =
    async () => {

      if (
        !deleteProductData?._id
      ) {
        return;
      }


      try {

        setDeleteLoading(true);


        const result =
          await deleteProduct(
            deleteProductData._id
          );


        if (
          result?.success
        ) {

          setProducts(
            (prev) =>
              prev.filter(
                (product) =>
                  product._id !==
                  deleteProductData._id
              )
          );


          setDeleteProductData(
            null
          );


          alert(
            "Product deleted successfully!"
          );


          router.refresh();
        }

      } catch (error) {

        console.error(
          "DELETE ERROR:",
          error
        );


        alert(
          error?.message ||
            "Failed to delete product"
        );

      } finally {

        setDeleteLoading(false);
      }
    };


  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Package size={24} />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Manage Products
              </h1>

              <p className="text-sm text-slate-500">
                Search, filter, edit and delete products
              </p>

            </div>

          </div>


          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">

            <p className="text-xs text-slate-400">
              Total Products
            </p>

            <p className="text-xl font-bold text-slate-900">
              {totalProducts}
            </p>

          </div>

        </div>


        {/* =====================================
            SEARCH & FILTER
        ====================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1fr_190px_170px_190px_auto]">


            {/* SEARCH */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search name, code or brand..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />


              {search && (
                <button
                  type="button"
                  onClick={() => {

                    setSearch("");

                    updateURL({
                      newSearch: "",
                      page: 1,
                    });

                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
                >
                  <X size={17} />
                </button>
              )}

            </div>


            {/* CATEGORY */}

            <div className="relative">

              <Filter
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={category}
                onChange={
                  handleCategory
                }
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >

                <option value="">
                  All Categories
                </option>

                <option value="Atta">
                  Atta
                </option>

                <option value="Rice">
                  Rice
                </option>

                <option value="Oil">
                  Oil
                </option>

                <option value="Beverage">
                  Beverage
                </option>

                <option value="Personal Care">
                  Personal Care
                </option>

              </select>

            </div>


            {/* STATUS */}

            <select
              value={status}
              onChange={handleStatus}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >

              <option value="">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>


            {/* SORT */}

            <div className="relative">

              <ArrowDownUp
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sort}
                onChange={handleSort}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >

                <option value="latest">
                  Latest Updated
                </option>

                <option value="oldest">
                  Oldest Updated
                </option>

                <option value="price-low">
                  DP: Low to High
                </option>

                <option value="price-high">
                  DP: High to Low
                </option>

              </select>

            </div>


            {/* CLEAR */}

            {(search ||
              category ||
              status ||
              sort !==
                "latest") && (

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 hover:bg-red-100"
              >

                <RefreshCw
                  size={16}
                />

                Clear

              </button>
            )}

          </div>


          {/* RESULT */}

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:flex-row sm:justify-between">

            <span>
              Showing{" "}
              <b className="text-slate-800">
                {products.length}
              </b>{" "}
              products
            </span>

            <span>
              Page{" "}
              <b className="text-slate-800">
                {currentPage}
              </b>{" "}
              of{" "}
              <b className="text-slate-800">
                {totalPages}
              </b>
            </span>

          </div>

        </div>


        {/* =====================================
            PRODUCTS
        ====================================== */}

        {products.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">

            <Package
              size={50}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-lg font-bold text-slate-700">
              No products found
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {products.map(
              (product) => (

                <AdminProductCard
                  key={
                    product._id
                  }
                  product={
                    product
                  }
                  onEdit={() =>
                    setSelectedProduct(
                      product
                    )
                  }
                  onDelete={() =>
                    setDeleteProductData(
                      product
                    )
                  }
                />

              )
            )}

          </div>
        )}


        {/* =====================================
            PAGINATION
        ====================================== */}

        {totalPages > 1 && (

          <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">

            <p className="text-sm text-slate-500">
              Page{" "}
              <b className="text-slate-800">
                {currentPage}
              </b>{" "}
              of{" "}
              <b className="text-slate-800">
                {totalPages}
              </b>
            </p>


            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={
                  !pagination?.hasPreviousPage
                }
                onClick={() =>
                  changePage(
                    currentPage - 1
                  )
                }
                className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >

                <ChevronLeft
                  size={17}
                />

                Previous

              </button>


              <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-blue-600 px-3 text-sm font-bold text-white">
                {currentPage}
              </span>


              <button
                type="button"
                disabled={
                  !pagination?.hasNextPage
                }
                onClick={() =>
                  changePage(
                    currentPage + 1
                  )
                }
                className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >

                Next

                <ChevronRight
                  size={17}
                />

              </button>

            </div>

          </div>
        )}


      </div>


      {/* =====================================
          EDIT MODAL
      ====================================== */}

      {selectedProduct && (

        <EditProductModal
          product={
            selectedProduct
          }
          loading={loading}
          onClose={() =>
            setSelectedProduct(
              null
            )
          }
          onSubmit={
            handleUpdate
          }
        />

      )}


      {/* =====================================
          DELETE MODAL
      ====================================== */}

      {deleteProductData && (

        <DeleteProductModal
          product={
            deleteProductData
          }
          loading={
            deleteLoading
          }
          onCancel={() =>
            setDeleteProductData(
              null
            )
          }
          onConfirm={
            handleDelete
          }
        />

      )}

    </div>
  );
};


// ========================================================
// PRODUCT CARD
// ========================================================

const AdminProductCard = ({
  product,
  onEdit,
  onDelete,
}) => {

  const stock =
    Number(product.stock || 0);


  const stockStatus =
    stock === 0
      ? {
          text: "Out of Stock",
          className:
            "border-red-100 bg-red-50 text-red-600",
        }
      : stock <= 10
      ? {
          text: "Low Stock",
          className:
            "border-amber-100 bg-amber-50 text-amber-600",
        }
      : {
          text: "In Stock",
          className:
            "border-emerald-100 bg-emerald-50 text-emerald-600",
        };


  return (

    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">


      {/* IMAGE */}

      <div className="relative h-56 border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-slate-50">

        {product.image ? (

          <Image
            src={product.image}
            alt={
              product.productName ||
              "Product"
            }
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-contain p-5 transition duration-500 group-hover:scale-105"
          />

        ) : (

          <div className="flex h-full items-center justify-center text-slate-300">

            <Package
              size={60}
            />

          </div>
        )}


        {/* STATUS */}

        <div className="absolute right-4 top-4">

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
          >
            {stockStatus.text}
          </span>

        </div>

      </div>


      {/* CONTENT */}

      <div className="p-5">

        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          {product.category ||
            "Uncategorized"}
        </p>


        <h2 className="mt-1 line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-slate-900">
          {product.productName}
        </h2>


        <p className="mt-1 text-xs text-slate-400">
          Code:{" "}
          {product.productCode ||
            "N/A"}
        </p>


        {/* PRICE */}

        <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">

          <Price
            label="MRP"
            value={
              product.mrpPrice
            }
          />

          <Price
            label="TP"
            value={
              product.tpPrice
            }
          />

          <Price
            label="DP"
            value={
              product.dpPrice
            }
            highlight
          />

        </div>


        {/* DETAILS */}

        <div className="mt-4 grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-[11px] text-slate-400">
              Stock
            </p>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {stock.toLocaleString()}
            </p>

          </div>


          <div className="rounded-xl bg-slate-50 p-3">

            <p className="text-[11px] text-slate-400">
              Brand
            </p>

            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {product.brand ||
                "N/A"}
            </p>

          </div>

        </div>


        {/* WEIGHT */}

        <div className="mt-3 grid grid-cols-2 gap-3">

          <div className="rounded-xl border border-slate-100 p-3">

            <p className="text-[11px] text-slate-400">
              Weight
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {product.weight ||
                0}{" "}
              {product.weightUnit ||
                ""}
            </p>

          </div>


          <div className="rounded-xl border border-slate-100 p-3">

            <p className="text-[11px] text-slate-400">
              Carton
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {product.cartonSize ||
                0}
            </p>

          </div>

        </div>


        {/* LAST UPDATE */}

        {product.lastUpdate && (

          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">

            <RefreshCw
              size={14}
              className="shrink-0 text-slate-400"
            />

            <div className="min-w-0">

              <p className="text-[11px] text-slate-400">
                Last Updated
              </p>

              <p className="truncate text-xs font-medium text-slate-600">

                {new Date(
                  product.lastUpdate
                ).toLocaleString(
                  "en-BD",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZone:
                      "Asia/Dhaka",
                  }
                )}

              </p>

            </div>

          </div>
        )}


        {/* ACTION BUTTONS */}

        <div className="mt-5 grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={onEdit}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
          >

            <Pencil
              size={16}
            />

            Edit

          </button>


          <button
            type="button"
            onClick={onDelete}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >

            <Trash2
              size={16}
            />

            Delete

          </button>

        </div>

      </div>

    </div>
  );
};


// ========================================================
// PRICE
// ========================================================

const Price = ({
  label,
  value,
  highlight = false,
}) => {

  return (

    <div className="p-3">

      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-bold ${
          highlight
            ? "text-blue-600"
            : "text-slate-800"
        }`}
      >
        ৳
        {Number(
          value || 0
        ).toLocaleString()}
      </p>

    </div>
  );
};


// ========================================================
// EDIT MODAL
// ========================================================

const EditProductModal = ({
  product,
  loading,
  onClose,
  onSubmit,
}) => {

  const [form, setForm] =
    useState({
      productName:
        product.productName ||
        "",

      productCode:
        product.productCode ||
        "",

      brand:
        product.brand || "",

      weight:
        product.weight || 0,

      weightUnit:
        product.weightUnit || "",

      cartonSize:
        product.cartonSize || 0,

      packagingType:
        product.packagingType ||
        "",

      mrpPrice:
        product.mrpPrice || 0,

      tpPrice:
        product.tpPrice || 0,

      dpPrice:
        product.dpPrice || 0,

      category:
        product.category || "",

      stock:
        product.stock || 0,

      description:
        product.description ||
        "",

      status:
        product.status ||
        "active",

      image:
        product.image || "",
    });


  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;


    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = (
    e
  ) => {

    e.preventDefault();

    onSubmit({
      ...form,

      weight:
        Number(form.weight),

      cartonSize:
        Number(
          form.cartonSize
        ),

      mrpPrice:
        Number(
          form.mrpPrice
        ),

      tpPrice:
        Number(
          form.tpPrice
        ),

      dpPrice:
        Number(
          form.dpPrice
        ),

      stock:
        Number(form.stock),
    });
  };


  return (

    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">

      <div className="flex min-h-full items-center justify-center">

        <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">


          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-slate-100 p-6">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Edit Product
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Update all product information
              </p>

            </div>


            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-500 hover:bg-red-50 hover:text-red-500"
            >
              ×
            </button>

          </div>


          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
            className="p-6"
          >

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


              <Input
                label="Product Name"
                name="productName"
                value={
                  form.productName
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Product Code"
                name="productCode"
                value={
                  form.productCode
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Brand"
                name="brand"
                value={
                  form.brand
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Category"
                name="category"
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Weight"
                name="weight"
                type="number"
                value={
                  form.weight
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Weight Unit"
                name="weightUnit"
                value={
                  form.weightUnit
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Carton Size"
                name="cartonSize"
                type="number"
                value={
                  form.cartonSize
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Packaging Type"
                name="packagingType"
                value={
                  form.packagingType
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="MRP Price"
                name="mrpPrice"
                type="number"
                value={
                  form.mrpPrice
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="TP Price"
                name="tpPrice"
                type="number"
                value={
                  form.tpPrice
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="DP Price"
                name="dpPrice"
                type="number"
                value={
                  form.dpPrice
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Stock"
                name="stock"
                type="number"
                value={
                  form.stock
                }
                onChange={
                  handleChange
                }
              />


              <Input
                label="Image URL"
                name="image"
                value={
                  form.image
                }
                onChange={
                  handleChange
                }
              />


              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={
                    form.status
                  }
                  onChange={
                    handleChange
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500"
                >

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                rows={4}
                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                placeholder="Product description..."
              />

            </div>


            {/* BUTTONS */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={
                  onClose
                }
                disabled={
                  loading
                }
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={
                  loading
                }
                className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Updating..."
                  : "Update Product"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};


// ========================================================
// INPUT
// ========================================================

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}) => {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
};


// ========================================================
// DELETE MODAL
// ========================================================

const DeleteProductModal = ({
  product,
  loading,
  onCancel,
  onConfirm,
}) => {

  return (

    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">


        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">

          <Trash2
            size={26}
          />

        </div>


        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Delete Product?
        </h2>


        <p className="mt-2 text-sm leading-6 text-slate-500">

          Are you sure you want to delete{" "}

          <span className="font-semibold text-slate-700">
            {product.productName}
          </span>

          ? This action cannot be undone.

        </p>


        <div className="mt-6 flex gap-3">

          <button
            type="button"
            onClick={
              onCancel
            }
            disabled={
              loading
            }
            className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={
              onConfirm
            }
            disabled={
              loading
            }
            className="flex-1 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >

            {loading
              ? "Deleting..."
              : "Yes, Delete"}

          </button>

        </div>

      </div>

    </div>
  );
};


export default AdminProductsClient;