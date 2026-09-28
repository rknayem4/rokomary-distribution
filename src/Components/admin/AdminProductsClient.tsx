"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Package,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  updateProduct,
  deleteProduct,
} from "@/app/lib/actions/products";

const AdminProductsClient = ({
  initialProducts = [],
}) => {
  const [products, setProducts] = useState(
    initialProducts
  );

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  /* ================= UPDATE ================= */

  const handleUpdate = async (formData) => {
    if (!selectedProduct?._id) return;

    try {
      setLoading(true);

      const updatedData = {
        productName: formData.productName,
        productCode: formData.productCode,
        brand: formData.brand,

        weight: Number(formData.weight),
        weightUnit: formData.weightUnit,

        cartonSize: Number(formData.cartonSize),

        packagingType: formData.packagingType,

        mrpPrice: Number(formData.mrpPrice),
        tpPrice: Number(formData.tpPrice),
        dpPrice: Number(formData.dpPrice),

        category: formData.category,

        stock: Number(formData.stock),

        description: formData.description,

        status: formData.status,

        image: formData.image,
      };

      const result = await updateProduct(
        selectedProduct._id,
        updatedData
      );

      if (result.success) {
        const updatedProduct = {
          ...selectedProduct,
          ...updatedData,

          // Backend will actually generate this.
          // We reload it below.
        };

        setProducts((prev) =>
          prev.map((product) =>
            product._id === selectedProduct._id
              ? updatedProduct
              : product
          )
        );

        setSelectedProduct(null);

        alert("Product updated successfully!");

        // Refresh page to get backend-generated lastUpdate
        window.location.reload();
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.message ||
          "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const result = await deleteProduct(deleteId);

      if (result.success) {
        setProducts((prev) =>
          prev.filter(
            (product) =>
              product._id !== deleteId
          )
        );

        setDeleteId(null);

        alert("Product deleted successfully!");
      }
    } catch (error) {
      console.error(error);

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

        {/* ================= HEADER ================= */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Package size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                  Manage Products
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Edit or delete your products
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-400">
              Total Products
            </p>

            <p className="text-xl font-bold text-slate-900">
              {products.length}
            </p>
          </div>

        </div>

        {/* ================= PRODUCTS ================= */}

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
              Add your first product to manage it here.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {products.map((product) => (
              <AdminProductCard
                key={product._id}
                product={product}
                onEdit={() =>
                  setSelectedProduct(product)
                }
                onDelete={() =>
                  setDeleteId(product._id)
                }
              />
            ))}

          </div>
        )}

      </div>

      {/* ================= EDIT MODAL ================= */}

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          loading={loading}
          onClose={() =>
            !loading && setSelectedProduct(null)
          }
          onSubmit={handleUpdate}
        />
      )}

      {/* ================= DELETE MODAL ================= */}

      {deleteId && (
        <DeleteModal
          loading={deleteLoading}
          onClose={() =>
            !deleteLoading && setDeleteId(null)
          }
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};


/* =========================================================
   PRODUCT CARD
========================================================= */

const AdminProductCard = ({
  product,
  onEdit,
  onDelete,
}) => {
  const stock = Number(product.stock || 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Image */}

      <div className="relative h-52 bg-slate-50">

        {product.image ? (
          <Image
            src={product.image}
            alt={product.productName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-5"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Package size={55} />
          </div>
        )}

        <div className="absolute right-4 top-4">

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              product.status === "active"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {product.status || "active"}
          </span>

        </div>

      </div>

      {/* Content */}

      <div className="p-5">

        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {product.category || "No Category"}
        </p>

        <h2 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900">
          {product.productName}
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Code: {product.productCode || "N/A"}
        </p>

        {/* Prices */}

        <div className="mt-4 grid grid-cols-3 divide-x rounded-xl border border-slate-100 bg-slate-50">

          <SmallPrice
            label="MRP"
            value={product.mrpPrice}
          />

          <SmallPrice
            label="TP"
            value={product.tpPrice}
          />

          <SmallPrice
            label="DP"
            value={product.dpPrice}
          />

        </div>

        {/* Stock */}

        <div className="mt-4 flex items-center justify-between">

          <div>
            <p className="text-xs text-slate-400">
              Stock
            </p>

            <p className="text-sm font-bold text-slate-800">
              {stock.toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">
              Brand
            </p>

            <p className="text-sm font-semibold text-slate-700">
              {product.brand || "N/A"}
            </p>
          </div>

        </div>

        {/* Last update */}

        {product.lastUpdate && (
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">

            <RefreshCw
              size={14}
              className="text-slate-400"
            />

            <span className="text-xs text-slate-500">
              Updated{" "}
              {new Date(
                product.lastUpdate
              ).toLocaleString("en-BD", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Dhaka",
              })}
            </span>

          </div>
        )}

        {/* Actions */}

        <div className="mt-5 grid grid-cols-2 gap-3">

          <button
            onClick={onEdit}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};


/* =========================================================
   EDIT MODAL
========================================================= */

const EditProductModal = ({
  product,
  loading,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    productName: product.productName || "",
    productCode: product.productCode || "",
    brand: product.brand || "",

    weight: product.weight || "",
    weightUnit: product.weightUnit || "kg",

    cartonSize: product.cartonSize || "",

    packagingType:
      product.packagingType || "",

    mrpPrice: product.mrpPrice || "",
    tpPrice: product.tpPrice || "",
    dpPrice: product.dpPrice || "",

    category: product.category || "",

    stock: product.stock || "",

    description:
      product.description || "",

    status: product.status || "active",

    image: product.image || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">

      <div className="flex min-h-full items-center justify-center">

        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Edit Product
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Update all product information
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="max-h-[75vh] overflow-y-auto p-5 md:p-6"
          >

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <Input
                label="Product Name"
                name="productName"
                value={form.productName}
                onChange={handleChange}
                required
              />

              <Input
                label="Product Code"
                name="productCode"
                value={form.productCode}
                onChange={handleChange}
                required
              />

              <Input
                label="Brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
              />

              <Input
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />

              <Input
                label="Weight"
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
              />

              <Select
                label="Weight Unit"
                name="weightUnit"
                value={form.weightUnit}
                onChange={handleChange}
                options={[
                  "kg",
                  "gm",
                  "liter",
                  "ml",
                  "piece",
                ]}
              />

              <Input
                label="Carton Size"
                name="cartonSize"
                type="number"
                value={form.cartonSize}
                onChange={handleChange}
              />

              <Input
                label="Packaging Type"
                name="packagingType"
                value={form.packagingType}
                onChange={handleChange}
              />

              <Input
                label="MRP Price"
                name="mrpPrice"
                type="number"
                value={form.mrpPrice}
                onChange={handleChange}
                required
              />

              <Input
                label="TP Price"
                name="tpPrice"
                type="number"
                value={form.tpPrice}
                onChange={handleChange}
                required
              />

              <Input
                label="DP Price"
                name="dpPrice"
                type="number"
                value={form.dpPrice}
                onChange={handleChange}
                required
              />

              <Input
                label="Stock"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
              />

              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                  "active",
                  "inactive",
                ]}
              />

              <div className="md:col-span-2">

                <Input
                  label="Image URL"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                />

              </div>

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Product description..."
                />

              </div>

            </div>

            {/* Current image */}

            {form.image && (
              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                <div className="relative h-48 w-full">
                  <Image
                    src={form.image}
                    alt="Product preview"
                    fill
                    sizes="100vw"
                    className="object-contain p-4"
                  />
                </div>

              </div>
            )}

            {/* Buttons */}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="h-11 rounded-xl border border-slate-200 px-6 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Update Product
                  </>
                )}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
};


/* =========================================================
   DELETE MODAL
========================================================= */

const DeleteModal = ({
  loading,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <Trash2 size={22} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Delete Product?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to delete this product?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            disabled={loading}
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Delete Product
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};


/* =========================================================
   INPUT
========================================================= */

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
};


/* =========================================================
   SELECT
========================================================= */

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};


/* =========================================================
   SMALL PRICE
========================================================= */

const SmallPrice = ({ label, value }) => {
  return (
    <div className="p-3">
      <p className="text-[10px] font-medium uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        ৳{Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
};

export default AdminProductsClient;