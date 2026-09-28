"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Boxes,
  Check,
  CircleDollarSign,
  ImagePlus,
  Layers3,
  Package,
  Save,
  Trash2,
  Truck,
  Upload,
  User,
} from "lucide-react";

import { Button, Input, Label, ListBox, Select, TextArea } from "@heroui/react";

const categories = [
  "Edible Oil",
  "Atta",
  "Maida",
  "Salt",
  "Canola Oil",
  "Mustard Oil",
  "Rice",
  "Masala",
  "Water",
  "Other",
];

const packagingTypes = ["Carton", "Bag", "Bottle", "Packet", "Box", "Drum"];

const weightUnits = ["kg", "g", "liter", "ml"];

const statusOptions = [
  {
    id: "active",
    label: "Active",
    description: "Product is available for sale",
  },
  {
    id: "inactive",
    label: "Inactive",
    description: "Product is temporarily disabled",
  },
  {
    id: "out_of_stock",
    label: "Out of Stock",
    description: "Product currently has no stock",
  },
];

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-slate-600";

const cardClassName =
  "overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-900";

type FormData = {
  productName: string;
  productCode: string;
  brand: string;

  // Number
  weight: number;
  weightUnit: string;

  // Number
  cartonSize: number;

  packagingType: string;

  // Number
  mrpPrice: number;
  tpPrice: number;
  dpPrice: number;

  category: string;

  // Number
  stock: number;

  description: string;
  status: string;
};

export default function AddProductPage() {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<FormData>({
    productName: "",
    productCode: "",
    brand: "",

    weight: 0,
    weightUnit: "kg",

    cartonSize: 0,

    packagingType: "Carton",

    mrpPrice: 0,
    tpPrice: 0,
    dpPrice: 0,

    category: "",

    stock: 0,

    description: "",
    status: "active",
  });

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploadingImage(true);
    setErrorMessage("");

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName) {
        throw new Error("Cloudinary cloud name is not configured.");
      }

      if (!uploadPreset) {
        throw new Error("Cloudinary upload preset is not configured.");
      }

      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      if (!data.secure_url) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      return data.secure_url as string;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setErrorMessage("");

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setProductImage(file);
    setImagePreview(previewUrl);
    setImageUrl("");

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setProductImage(null);
      setImageUrl("");
      setImagePreview("");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload product image.",
      );
      URL.revokeObjectURL(previewUrl);
    } finally {
      e.target.value = "";
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setProductImage(null);
    setImagePreview("");
    setImageUrl("");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.productName.trim()) {
      setErrorMessage("Product name is required.");
      return;
    }

    if (!formData.category) {
      setErrorMessage("Please select a product category.");
      return;
    }

    if (isUploadingImage) {
      setErrorMessage("Please wait until the product image finishes uploading.");
      return;
    }

    const ProductData = {
      productName: formData.productName.trim(),
      productCode: formData.productCode.trim(),
      brand: formData.brand.trim(),
      weight: Number(formData.weight),
      weightUnit: formData.weightUnit,
      cartonSize: Number(formData.cartonSize),
      packagingType: formData.packagingType,
      mrpPrice: Number(formData.mrpPrice),
      tpPrice: Number(formData.tpPrice),
      dpPrice: Number(formData.dpPrice),
      category: formData.category,
      stock: Number(formData.stock),
      description: formData.description.trim(),
      status: formData.status,
      image: imageUrl,
    };

    console.log("Product data:", ProductData);

    // TODO: Send ProductData to your Express/MongoDB API.
    // Example: await fetch("/api/products", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(ProductData),
    // });
  };

  const stockNumber = Number(formData.stock || 0);

  return (
    <main className="min-h-screen bg-[#f7f8fc] dark:bg-[#070b14]">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =========================================================
            HEADER
        ========================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Link
                href="/admin/products"
                className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10"
              >
                <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-0.5" />
              </Link>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    Inventory
                  </span>

                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                  <span className="text-xs text-slate-400">Products</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                  Add New Product
                </h1>

                <p className="mt-1.5 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                  Create a new product and add it to your distribution
                  inventory.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/products"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Link>

              <button
                type="submit"
                form="product-form"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 hover:shadow-indigo-500/30"
              >
                <Save className="h-4 w-4" />
                Save Product
              </button>
            </div>
          </div>
        </header>

        {/* =========================================================
            FORM
        ========================================================== */}

        <form id="product-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            {/* =====================================================
                LEFT
            ====================================================== */}

            <div className="space-y-6">
              {/* BASIC INFORMATION */}

              <section className={cardClassName}>
                <SectionHeader
                  icon={<Package className="h-5 w-5" />}
                  iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  title="Basic Information"
                  description="Product identity and general information"
                />

                <div className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Product Name */}

                    <div className="md:col-span-2">
                      <FieldLabel label="Product Name" required />

                      <Input
                        name="productName"
                        value={formData.productName}
                        onChange={(e) =>
                          updateField("productName", e.target.value)
                        }
                        placeholder="e.g. Teer Soybean Oil"
                        className={inputClassName}
                        required
                      />
                    </div>

                    {/* Product Code */}

                    <div>
                      <FieldLabel label="Product Code / SKU" />

                      <Input
                        name="productCode"
                        value={formData.productCode}
                        onChange={(e) =>
                          updateField("productCode", e.target.value)
                        }
                        placeholder="e.g. TSO-001"
                        className={inputClassName}
                      />
                    </div>

                    {/* Brand */}

                    <div>
                      <FieldLabel label="Brand" />

                      <Input
                        name="brand"
                        value={formData.brand}
                        onChange={(e) => updateField("brand", e.target.value)}
                        placeholder="e.g. Teer"
                        className={inputClassName}
                      />
                    </div>

                    {/* Category */}

                    <div className="md:col-span-2">
                      <FieldLabel label="Category" required />

                      <Select
                        selectedKey={formData.category}
                        onSelectionChange={(key) =>
                          updateField("category", String(key))
                        }
                        placeholder="Select product category"
                        className="w-full"
                        isRequired
                      >
                        <Label className="sr-only">Category</Label>

                        <Select.Trigger
                          className={`${inputClassName} flex items-center justify-between`}
                        >
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>

                        <Select.Popover>
                          <ListBox>
                            {categories.map((category) => (
                              <ListBox.Item
                                key={category}
                                id={category}
                                textValue={category}
                              >
                                {category}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}

                  <div>
                    <FieldLabel label="Description" />

                    <TextArea
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      placeholder="Write a short description about this product..."
                      className={`${inputClassName} min-h-[120px] resize-none`}
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Keep the description short and useful for shopkeepers and
                      sales officers.
                    </p>
                  </div>
                </div>
              </section>

              {/* =====================================================
                  PACKAGING
              ====================================================== */}

              <section className={cardClassName}>
                <SectionHeader
                  icon={<Boxes className="h-5 w-5" />}
                  iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  title="Packaging & Quantity"
                  description="Product weight and packaging configuration"
                />

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Weight */}

                    <div>
                      <FieldLabel label="Product Weight" />

                      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.weight}
                          onChange={(e) =>
                            updateField("weight", Number(e.target.value))
                          }
                          placeholder="5"
                          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm outline-none focus:ring-0"
                        />

                        <Select
                          selectedKey={formData.weightUnit}
                          onSelectionChange={(key) =>
                            updateField("weightUnit", String(key))
                          }
                          className="w-[105px] shrink-0"
                        >
                          <Label className="sr-only">Unit</Label>

                          <Select.Trigger className="flex h-full items-center justify-between border-l border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>

                          <Select.Popover>
                            <ListBox>
                              {weightUnits.map((unit) => (
                                <ListBox.Item
                                  key={unit}
                                  id={unit}
                                  textValue={unit}
                                >
                                  {unit.toUpperCase()}
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              ))}
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    </div>

                    {/* Packaging */}

                    <div>
                      <FieldLabel label="Packaging Type" />

                      <Select
                        selectedKey={formData.packagingType}
                        onSelectionChange={(key) =>
                          updateField("packagingType", String(key))
                        }
                        className="w-full"
                      >
                        <Label className="sr-only">Packaging Type</Label>

                        <Select.Trigger
                          className={`${inputClassName} flex items-center justify-between`}
                        >
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>

                        <Select.Popover>
                          <ListBox>
                            {packagingTypes.map((type) => (
                              <ListBox.Item
                                key={type}
                                id={type}
                                textValue={type}
                              >
                                {type}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Carton Size */}

                    <div className="md:col-span-2">
                      <FieldLabel label="Carton / Bag Size" />

                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.cartonSize}
                        onChange={(e) =>
                          updateField("cartonSize", Number(e.target.value))
                        }
                        placeholder="e.g. 12"
                        className={inputClassName}
                      />

                      <p className="mt-2 text-xs text-slate-400">
                        Example: 12 pcs/carton, 24 pcs/carton, 5 kg/bag
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* =====================================================
                  PRICING
              ====================================================== */}

              <section className={cardClassName}>
                <SectionHeader
                  icon={<CircleDollarSign className="h-5 w-5" />}
                  iconClass="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  title="Pricing Information"
                  description="Configure MRP, trade and distributor pricing"
                />

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* MRP */}

                    <PriceCard
                      title="MRP Price"
                      description="Maximum retail price"
                      value={formData.mrpPrice}
                      onChange={(value) => updateField("mrpPrice", value)}
                      required
                      accent="indigo"
                    />

                    {/* TP */}

                    <PriceCard
                      title="TP Price"
                      description="Trade price"
                      value={formData.tpPrice}
                      onChange={(value) => updateField("tpPrice", value)}
                      required
                      accent="emerald"
                    />

                    {/* DP */}

                    <PriceCard
                      title="DP Price"
                      description="Distributor price"
                      value={formData.dpPrice}
                      onChange={(value) => updateField("dpPrice", value)}
                      required
                      accent="amber"
                    />
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <BadgeDollarSign className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />

                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Pricing guide
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        MRP is the maximum retail price. TP is the trade price
                        and DP is the distributor price.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* =====================================================
                RIGHT
            ====================================================== */}

            <aside className="space-y-6">
              {/* =====================================================
                  PRODUCT IMAGE
              ====================================================== */}
              <section className={cardClassName}>
                <SectionHeader
                  icon={<ImagePlus className="h-5 w-5" />}
                  iconClass="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                  title="Product Image"
                  description="Add a clear product photo"
                />

                <div className="p-6">
                  {/* Product Image */}
                  <div className="flex flex-col items-center">
                    <label className="cursor-pointer group">
                      <div className="w-32 h-32  overflow-hidden border-4 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all group-hover:border-indigo-500">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImagePlus className="w-12 h-12 text-slate-400" />
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>

                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      {isUploadingImage
                        ? "Uploading image..."
                        : imageUrl
                          ? "Product image uploaded ✓"
                          : "Click to upload product image"}
                    </p>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="mt-2 text-xs font-medium text-red-500 hover:text-red-600"
                      >
                        Remove image
                      </button>
                    )}

                    <p className="mt-1 text-[11px] text-slate-400">
                      PNG, JPG or WEBP • Maximum 5MB
                    </p>

                    {errorMessage && (
                      <p className="mt-3 text-center text-xs font-medium text-red-500">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </div>
              </section>
              {/* =====================================================
                  INVENTORY
              ====================================================== */}

              <section className={cardClassName}>
                <SectionHeader
                  icon={<Layers3 className="h-5 w-5" />}
                  iconClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                  title="Inventory"
                  description="Set your initial available stock"
                />

                <div className="p-6">
                  <div className="mb-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Current Stock
                      </span>

                      <Truck className="h-4 w-4 text-slate-400" />
                    </div>

                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {stockNumber.toLocaleString()}
                      </span>

                      <span className="pb-1 text-sm text-slate-400">units</span>
                    </div>
                  </div>

                  <FieldLabel label="Initial Stock" />

                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={(e) =>
                      updateField("stock", Number(e.target.value))
                    }
                    placeholder="0"
                    className={inputClassName}
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Number of available product units.
                  </p>
                </div>
              </section>

              {/* =====================================================
                  STATUS
              ====================================================== */}

              <section className={cardClassName}>
                <div className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Product Status
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Control product availability
                      </p>
                    </div>

                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        formData.status === "active"
                          ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]"
                          : "bg-slate-400"
                      }`}
                    />
                  </div>

                  <Select
                    selectedKey={formData.status}
                    onSelectionChange={(key) =>
                      updateField("status", String(key))
                    }
                    className="w-full"
                  >
                    <Label className="sr-only">Product Status</Label>

                    <Select.Trigger
                      className={`${inputClassName} flex items-center justify-between`}
                    >
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover>
                      <ListBox>
                        {statusOptions.map((status) => (
                          <ListBox.Item
                            key={status.id}
                            id={status.id}
                            textValue={status.label}
                          >
                            <div>
                              <p className="font-medium">{status.label}</p>

                              <p className="text-xs text-slate-400">
                                {status.description}
                              </p>
                            </div>

                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          formData.status === "active"
                            ? "bg-emerald-500"
                            : formData.status === "inactive"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />

                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {formData.status === "active"
                          ? "Product is active"
                          : formData.status === "inactive"
                            ? "Product is inactive"
                            : "Product is out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          {/* =======================================================
              BOTTOM ACTION
          ======================================================== */}

          <div className="sticky bottom-4 z-20 mt-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <Package className="h-4 w-4" />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fields marked with{" "}
                  <span className="font-bold text-red-500">*</span> are
                  required.
                </p>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">
                <Link
                  href="/admin/products"
                  className="flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </Link>

                <Button
                  type="submit"
                  form="product-form"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 sm:flex-none"
                >
                  <Save className="h-4 w-4" />
                  Save Product
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ===============================================================
   SECTION HEADER
================================================================ */

function SectionHeader({
  icon,
  iconClass,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

/* ===============================================================
   FIELD LABEL
================================================================ */

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2.5 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {label}

      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

/* ===============================================================
   PRICE CARD
================================================================ */

function PriceCard({
  title,
  description,
  value,
  onChange,
  required = false,
  accent,
}: {
  title: string;
  description: string;

  // IMPORTANT: number
  value: number;

  // IMPORTANT: number
  onChange: (value: number) => void;

  required?: boolean;
  accent: "indigo" | "emerald" | "amber";
}) {
  const accentStyles = {
    indigo:
      "border-indigo-200 bg-indigo-50/40 dark:border-indigo-500/20 dark:bg-indigo-500/5",

    emerald:
      "border-emerald-200 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/5",

    amber:
      "border-amber-200 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-500/5",
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 ${accentStyles[accent]}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {title}

            {required && <span className="ml-1 text-red-500">*</span>}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm dark:bg-slate-900">
          ৳
        </span>
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
          ৳
        </span>

        <Input
          type="number"
          min="0"
          step="0.01"
          // number value
          value={value}
          // convert input string to number
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0.00"
          required={required}
          className={`${inputClassName} pl-8`}
        />
      </div>
    </div>
  );
}
