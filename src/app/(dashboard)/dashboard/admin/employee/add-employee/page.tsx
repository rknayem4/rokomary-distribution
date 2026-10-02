"use client";

import { authClient } from "@/app/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";

const AddEmployeePage = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    department: "",
    phone: "",
    alternatePhone: "",
    address: "",
    joiningDate: "",
  });

  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // PHOTO CHANGE
  // ========================================

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // File type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // File size
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setPhoto(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // ========================================
  // REMOVE PHOTO
  // ========================================

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPreview("");
  };

  // ========================================
  // UPLOAD CLOUDINARY
  // ========================================

  const uploadImage = async () => {
    if (!photo) {
      return "";
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing.");
    }

    const formData = new FormData();

    formData.append("file", photo);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload image.");
    }

    const data = await response.json();

    return data.secure_url;
  };
  // const { data: session } = authClient.useSession();
  // const userId = session?.user?.id;

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter employee name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter employee email.");
      return;
    }

    if (!formData.password) {
      alert("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (!formData.designation.trim()) {
      alert("Please enter employee designation.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter employee phone number.");
      return;
    }

    try {
      setSubmitting(true);

      // ========================================
      // 1. UPLOAD PHOTO TO CLOUDINARY
      // ========================================

      let profilePhoto = "";

      if (photo) {
        setUploading(true);

        profilePhoto = await uploadImage();

        setUploading(false);
      }

      // ========================================
      // 2. CREATE EMPLOYEE
      // ========================================

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PASE_URL}/api/admin/employees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: formData.email.trim(),

            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,

            profilePhoto,

            designation: formData.designation.trim(),
            department: formData.department.trim(),

            phone: formData.phone.trim(),
            alternatePhone: formData.alternatePhone.trim(),

            address: formData.address.trim(),
            joiningDate: formData.joiningDate,
          }),
        },
      );

      // ========================================
      // 3. READ RESPONSE ONLY ONCE
      // ========================================

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("SERVER RETURNED NON-JSON:", text);

        throw new Error(
          `Server returned an invalid response (${response.status})`,
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create employee.");
      }

      // ========================================
      // 4. SUCCESS
      // ========================================

      console.log("Employee added:", data);

      alert("Employee created successfully!");

      // ========================================
      // 5. GO TO EMPLOYEE LIST
      // ========================================

      window.location.href = "/dashboard/admin/employee";
    } catch (error) {
      console.error("ADD EMPLOYEE ERROR:", error);

      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-6">
          <Link
            href="/dashboard/admin/employee"
            className="mb-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Employees
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Add Employee
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new employee account and profile.
          </p>
        </div>

        {/* ========================================
            FORM
        ======================================== */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========================================
              PROFILE PHOTO
          ======================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              Profile Photo
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Upload employee profile photo. Maximum size 5MB.
            </p>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Preview */}
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-100">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Employee preview"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-gray-400">
                    👤
                  </div>
                )}
              </div>

              <div>
                <label className="inline-flex cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>

                {photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="ml-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}

                {photo && (
                  <p className="mt-2 text-xs text-gray-500">{photo.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* ========================================
              ACCOUNT INFORMATION
          ======================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Login Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@example.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password *
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  This password will be used by the employee to login.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================
              EMPLOYEE INFORMATION
          ======================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Employee Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Designation */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Designation *
                </label>

                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Sales Executive"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Department */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Sales"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01700000000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alternate Phone
                </label>

                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  placeholder="01800000000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Joining Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Joining Date
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                placeholder="Enter employee address"
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* ========================================
              ROLE / STATUS
          ======================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Account Role
            </h2>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Role:</span> EMPLOYEE
              </p>

              <p className="mt-1 text-xs text-blue-600">
                New employees will automatically be registered with the EMPLOYEE
                role.
              </p>
            </div>
          </div>

          {/* ========================================
              SUBMIT
          ======================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/admin/employee"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading Photo..."
                : submitting
                  ? "Creating Employee..."
                  : "Register Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeePage;
