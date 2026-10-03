"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

type Employee = {
  _id: string;
  userId: string;

  name: string;
  email: string;

  profilePhoto?: string;

  designation?: string;
  role?: string;
  department?: string;

  phone?: string;
  alternatePhone?: string;

  address?: string;
  joiningDate?: string;

  status: "active" | "inactive";

  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  initialEmployees: Employee[];
};

const EmployeeTable = ({
  initialEmployees,
}: Props) => {
  const [employees, setEmployees] =
    useState<Employee[]>(initialEmployees);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);

  // Edit modal
  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null);

  const [saving, setSaving] = useState(false);

  // Edit photo
  const [editPhoto, setEditPhoto] =
    useState<File | null>(null);

  const [editPreview, setEditPreview] =
    useState("");

  const [uploadingPhoto, setUploadingPhoto] =
    useState(false);

  // ========================================
  // EXPRESS API URL
  // ========================================

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL;

  // ========================================
  // FETCH EMPLOYEES
  // ========================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set(
          "search",
          search.trim(),
        );
      }

      if (status) {
        params.set("status", status);
      }

      const queryString =
        params.toString();

      const res = await fetch(
        `${baseUrl}/api/employees${
          queryString
            ? `?${queryString}`
            : ""
        }`,
      );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch employees",
        );
      }

      const data = await res.json();

      if (data.success) {
        setEmployees(
          data.employees || [],
        );
      }
    } catch (error) {
      console.error(
        "Fetch employees error:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SEARCH DEBOUNCE
  // ========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search, status]);

  // ========================================
  // OPEN EDIT MODAL
  // ========================================

  const handleEdit = (
    employee: Employee,
  ) => {
    setEditingEmployee({
      ...employee,
    });

    setEditPhoto(null);

    setEditPreview(
      employee.profilePhoto || "",
    );
  };

  // ========================================
  // CLOSE EDIT MODAL
  // ========================================

  const closeEditModal = () => {
    if (saving) return;

    setEditingEmployee(null);
    setEditPhoto(null);
    setEditPreview("");
  };

  // ========================================
  // EDIT PHOTO CHANGE
  // ========================================

  const handleEditPhotoChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select an image file.",
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Image size must be less than 5MB.",
      );
      return;
    }

    setEditPhoto(file);

    const previewUrl =
      URL.createObjectURL(file);

    setEditPreview(previewUrl);
  };

  // ========================================
  // UPLOAD PHOTO TO CLOUDINARY
  // ========================================

  const uploadEditPhoto =
    async () => {
      if (!editPhoto) {
        return (
          editingEmployee
            ?.profilePhoto || ""
        );
      }

      const cloudName =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (
        !cloudName ||
        !uploadPreset
      ) {
        throw new Error(
          "Cloudinary configuration is missing.",
        );
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        editPhoto,
      );

      formData.append(
        "upload_preset",
        uploadPreset,
      );

      const response =
        await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

      if (!response.ok) {
        throw new Error(
          "Failed to upload image.",
        );
      }

      const data =
        await response.json();

      return data.secure_url;
    };

  // ========================================
  // UPDATE EMPLOYEE
  // ========================================

  const handleUpdateEmployee =
    async () => {
      if (!editingEmployee) {
        return;
      }

      if (
        !editingEmployee.name.trim()
      ) {
        alert(
          "Employee name is required.",
        );
        return;
      }

      if (
        !editingEmployee.email.trim()
      ) {
        alert(
          "Employee email is required.",
        );
        return;
      }

      if (
        !editingEmployee.designation?.trim()
      ) {
        alert(
          "Designation is required.",
        );
        return;
      }

      if (
        !editingEmployee.phone?.trim()
      ) {
        alert(
          "Phone number is required.",
        );
        return;
      }

      try {
        setSaving(true);

        let profilePhoto =
          editingEmployee.profilePhoto ||
          "";

        // Upload new photo
        if (editPhoto) {
          setUploadingPhoto(true);

          profilePhoto =
            await uploadEditPhoto();

          setUploadingPhoto(false);
        }

        // ========================================
        // UPDATE EXPRESS API
        // ========================================

        const response =
          await fetch(
            `${baseUrl}/api/employees/${editingEmployee._id}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name: editingEmployee.name.trim(),

                email:
                  editingEmployee.email.trim(),

                profilePhoto,

                designation:
                  editingEmployee.designation ||
                  "",

                department:
                  editingEmployee.department ||
                  "",

                phone:
                  editingEmployee.phone ||
                  "",

                alternatePhone:
                  editingEmployee.alternatePhone ||
                  "",

                address:
                  editingEmployee.address ||
                  "",

                joiningDate:
                  editingEmployee.joiningDate ||
                  "",

                status:
                  editingEmployee.status,
              }),
            },
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update employee.",
          );
        }

        // ========================================
        // UPDATE TABLE LOCALLY
        // ========================================

        setEmployees(
          (previousEmployees) =>
            previousEmployees.map(
              (employee) =>
                employee._id ===
                editingEmployee._id
                  ? {
                      ...employee,
                      ...editingEmployee,
                      profilePhoto,
                    }
                  : employee,
            ),
        );

        // Close modal
        setEditingEmployee(null);
        setEditPhoto(null);
        setEditPreview("");

        alert(
          "Employee updated successfully.",
        );
      } catch (error) {
        console.error(
          "UPDATE EMPLOYEE ERROR:",
          error,
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to update employee.",
        );
      } finally {
        setSaving(false);
        setUploadingPhoto(false);
      }
    };

  // ========================================
  // CHANGE STATUS
  // ========================================

  const handleStatusChange = async (
    employee: Employee,
  ) => {
    const newStatus =
      employee.status === "active"
        ? "inactive"
        : "active";

    const confirmed =
      window.confirm(
        `Are you sure you want to ${
          newStatus === "active"
            ? "activate"
            : "deactivate"
        } ${employee.name}?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      const res =
        await fetch(
          `${baseUrl}/api/employees/${employee._id}/status`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status: newStatus,
            }),
          },
        );

      const data =
        await res.json();

      if (
        !res.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update status",
        );
      }

      setEmployees(
        (previousEmployees) =>
          previousEmployees.map(
            (item) =>
              item._id ===
              employee._id
                ? {
                    ...item,
                    status: newStatus,
                  }
                : item,
          ),
      );
    } catch (error) {
      console.error(
        "Update employee status error:",
        error,
      );

      alert(
        "Failed to update employee status.",
      );
    }
  };

  return (
    <>
      {/* ========================================
          EMPLOYEE TABLE
      ======================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* ========================================
            SEARCH / FILTER
        ======================================== */}

        <div className="border-b border-gray-200 p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row">

            {/* Search */}

            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                placeholder="Search by name, email, phone, designation..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Status */}

            <div className="w-full md:w-48">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value,
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            </div>
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="border-b border-gray-100 px-5 py-3 text-sm text-gray-500">
            Loading employees...
          </div>
        )}

        {/* ========================================
            TABLE
        ======================================== */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">

            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200 text-left">

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Employee
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Designation
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Department
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {employees.length > 0 ? (
                employees.map(
                  (employee) => (
                    <tr
                      key={
                        employee._id
                      }
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >

                      {/* Employee */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">

                            {employee.profilePhoto ? (
                              <Image
                                src={
                                  employee.profilePhoto
                                }
                                alt={
                                  employee.name
                                }
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-500">
                                {employee.name
                                  ?.charAt(
                                    0,
                                  )
                                  ?.toUpperCase()}
                              </div>
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-gray-900">
                              {
                                employee.name
                              }
                            </p>

                            <p className="truncate text-sm text-gray-500">
                              {
                                employee.email
                              }
                            </p>

                          </div>
                        </div>
                      </td>

                      {/* Designation */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800">
                          {
                            employee.designation ||
                            "Not specified"
                          }
                        </p>
                      </td>

                      {/* Department */}

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600">
                          {
                            employee.department ||
                            "Not specified"
                          }
                        </p>
                      </td>

                      {/* Phone */}

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {
                            employee.phone ||
                            "N/A"
                          }
                        </p>
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              employee,
                            )
                          }
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            employee.status ===
                            "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {employee.status ===
                          "active"
                            ? "Active"
                            : "Inactive"}
                        </button>

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              employee,
                            )
                          }
                          className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                      </td>

                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >
                    <div className="mx-auto max-w-sm">

                      <div className="mb-3 text-4xl">
                        👥
                      </div>

                      <h3 className="font-semibold text-gray-900">
                        No employees found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your
                        search or status
                        filter.
                      </p>

                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* ========================================
            FOOTER
        ======================================== */}

        <div className="border-t border-gray-200 px-5 py-4">
          <p className="text-sm text-gray-500">

            Showing{" "}

            <span className="font-semibold text-gray-800">
              {
                employees.length
              }
            </span>{" "}

            employee
            {employees.length !==
            1
              ? "s"
              : ""}

          </p>
        </div>
      </div>

      {/* ========================================
          EDIT MODAL
      ======================================== */}

      {editingEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeEditModal();
            }
          }}
        >

          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* ========================================
                MODAL HEADER
            ======================================== */}

            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 py-4">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Employee
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update employee information
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* ========================================
                MODAL BODY
            ======================================== */}

            <div className="overflow-y-auto p-5">

              <div className="space-y-6">

                {/* ========================================
                    PROFILE PHOTO
                ======================================== */}

                <div className="rounded-xl bg-gray-50 p-4">

                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Profile Photo
                  </label>

                  <div className="flex items-center gap-4">

                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-white">

                      {editPreview ? (
                        <Image
                          src={
                            editPreview
                          }
                          alt={
                            editingEmployee.name
                          }
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-500">
                          {editingEmployee.name
                            ?.charAt(
                              0,
                            )
                            ?.toUpperCase()}
                        </div>
                      )}

                    </div>

                    <div>

                      <label className="inline-flex cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">

                        Change Photo

                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            handleEditPhotoChange
                          }
                          className="hidden"
                        />

                      </label>

                      <p className="mt-2 text-xs text-gray-500">
                        Maximum 5MB.
                      </p>

                    </div>

                  </div>
                </div>

                {/* ========================================
                    BASIC INFORMATION
                ======================================== */}

                <div>

                  <h3 className="mb-4 text-base font-semibold text-gray-900">
                    Basic Information
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">

                    {/* Name */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>

                      <input
                        type="text"
                        value={
                          editingEmployee.name
                        }
                        onChange={(e) =>
                          setEditingEmployee(
                            {
                              ...editingEmployee,
                              name:
                                e.target
                                  .value,
                            },
                          )
                        }
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
                        value={
                          editingEmployee.email
                        }
                        onChange={(e) =>
                          setEditingEmployee(
                            {
                              ...editingEmployee,
                              email:
                                e.target
                                  .value,
                            },
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Designation */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Designation *
                      </label>

                      <input
                        type="text"
                        value={
                          editingEmployee.designation ||
                          ""
                        }
                        onChange={(e) =>
                          setEditingEmployee(
                            {
                              ...editingEmployee,
                              designation:
                                e.target
                                  .value,
                            },
                          )
                        }
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
                        value={
                          editingEmployee.department ||
                          ""
                        }
                        onChange={(e) =>
                          setEditingEmployee(
                            {
                              ...editingEmployee,
                              department:
                                e.target
                                  .value,
                            },
                          )
                        }
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
                        value={
                          editingEmployee.phone ||
                          ""
                        }
                        onChange={(e) =>
                          setEditingEmployee(
                            {
                              ...editingEmployee,
                              phone:
                                e.target
                                  .value,
                            },
                          )
                        }
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
                        value={
                          editingEmployee.alternatePhone ||
                          ""
                        }
                        onChange={(e) =>
                          setEditingEmployee(
                            {
                              ...editingEmployee,
                              alternatePhone:
                                e.target
                                  .value,
                            },
                          )
                        }
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
                        value={
                          editingEmployee.joiningDate ||
                          ""
                        }
                        onChange={(e) =>
                          setEditingEmployee(
                            {
                              ...editingEmployee,
                              joiningDate:
                                e.target
                                  .value,
                            },
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Status */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Status
                      </label>

                      <select
                        value={
                          editingEmployee.status
                        }
                        onChange={(e) =>
                          setEditingEmployee(
                            {
                              ...editingEmployee,
                              status:
                                e.target
                                  .value as
                                  | "active"
                                  | "inactive",
                            },
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                </div>

                {/* ========================================
                    ADDRESS
                ======================================== */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address
                  </label>

                  <textarea
                    rows={4}
                    value={
                      editingEmployee.address ||
                      ""
                    }
                    onChange={(e) =>
                      setEditingEmployee(
                        {
                          ...editingEmployee,
                          address:
                            e.target.value,
                        },
                      )
                    }
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>
            </div>

            {/* ========================================
                MODAL FOOTER
            ======================================== */}

            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={saving}
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleUpdateEmployee
                }
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingPhoto
                  ? "Uploading Photo..."
                  : saving
                    ? "Updating..."
                    : "Update Employee"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeTable;