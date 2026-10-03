"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";

import {
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
} from "lucide-react";

import { updateUserStatus } from "@/app/lib/actions/employees";
// import { deleteUser } from "better-auth/api";

// ========================================================
// TYPES
// ========================================================

type UserStatus = "active" | "blocked";

type UserRole = "ADMIN" | "USER" | string;

interface User {
  _id: string;
  name?: string | null;
  email: string;
  role?: UserRole | null;
  status?: UserStatus | string | null;
  image?: string | null;
  profilePhoto?: string | null;
  createdAt?: string | Date | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface UsersApiResponse {
  users?: User[];
  pagination?: Pagination;
  message?: string;
}

interface ActionResponse {
  success?: boolean;
  message?: string;
}

interface ManageUsersClientProps {
  initialUsers: User[];
  initialPagination: Pagination;
}

// ========================================================
// ERROR HELPER
// ========================================================

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

// ========================================================
// COMPONENT
// ========================================================

const ManageUsersClient = ({
  initialUsers,
  initialPagination,
}: ManageUsersClientProps) => {
  // ======================================================
  // STATES
  // ======================================================

  const [users, setUsers] = useState<User[]>(initialUsers);

  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const [search, setSearch] = useState<string>("");

  const [status, setStatus] = useState<"all" | UserStatus>("all");

  const [loading, setLoading] = useState<boolean>(false);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ======================================================
  // FETCH USERS
  // ======================================================

  const fetchUsers = async (
    page: number = 1,
    currentSearch: string = search,
    currentStatus: "all" | UserStatus = status,
  ): Promise<void> => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("search", currentSearch);
      params.set("status", currentStatus);
      params.set("page", String(page));

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        cache: "no-store",
      });

      const data: UsersApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || []);

      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error: unknown) {
      console.error("GET USERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SEARCH
  // ======================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, search, status);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ======================================================
  // STATUS FILTER
  // ======================================================

  const handleStatusFilter = (newStatus: "all" | UserStatus): void => {
    setStatus(newStatus);

    fetchUsers(1, search, newStatus);
  };

  // ======================================================
  // BLOCK / UNBLOCK
  // ======================================================

  const handleStatus = async (user: User): Promise<void> => {
    const newStatus: UserStatus =
      user.status === "blocked" ? "active" : "blocked";

    try {
      setActionLoading(user._id);

      const data: ActionResponse = await updateUserStatus(user._id, newStatus);

      if (!data.success) {
        throw new Error(data.message || "Failed to update user status");
      }

      setUsers((previous: User[]) =>
        previous.map(
          (item: User): User =>
            item._id === user._id
              ? {
                  ...item,
                  status: newStatus,
                }
              : item,
        ),
      );

      alert(data.message || "User status updated successfully");
    } catch (error: unknown) {
      alert(getErrorMessage(error));
    } finally {
      setActionLoading(null);
    }
  };

  // ======================================================
  // DELETE USER
  // ======================================================

  const handleDelete = async (user: User): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name || user.email}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user._id);

      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      const data: ActionResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      if (data.success) {
        setUsers((previous) =>
          previous.filter((item) => item._id !== user._id),
        );

        setPagination((previous) => ({
          ...previous,
          totalUsers: Math.max(previous.totalUsers - 1, 0),
        }));

        alert(data.message || "User deleted successfully");
      }
    } catch (error: unknown) {
      console.error("DELETE USER ERROR:", error);

      alert(getErrorMessage(error));
    } finally {
      setActionLoading(null);
    }
  };

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Users size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                Manage Users
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage registered users, block or delete accounts.
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTER */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* SEARCH */}

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* STATUS */}

            <select
              value={status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleStatusFilter(e.target.value as "all" | UserStatus)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* TABLE HEADER */}

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-sm font-bold text-slate-800">All Users</p>

              <p className="text-xs text-slate-400">
                {pagination?.totalUsers || 0} total users
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
              20 / page
            </div>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-slate-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            /* EMPTY */

            <div className="py-20 text-center">
              <Users size={35} className="mx-auto text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                No users found
              </p>
            </div>
          ) : (
            /* TABLE */

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Role
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user: User) => {
                    const isAdmin = user.role === "ADMIN";

                    const isBlocked = user.status === "blocked";

                    const isLoading = actionLoading === user._id;

                    const userImage = user.image || user.profilePhoto || null;

                    return (
                      <tr
                        key={user._id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* USER */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100">
                              {userImage ? (
                                <Image
                                  src={userImage}
                                  alt={user.name || "User"}
                                  fill
                                  className="object-cover"
                                  sizes="44px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                                  {(user.name || user.email || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-slate-800">
                                {user.name || "No Name"}
                              </p>

                              <p className="text-xs text-slate-400">
                                ID: {String(user._id).slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={15} className="text-slate-400" />

                            {user.email}
                          </div>
                        </td>

                        {/* ROLE */}

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {user.role || "USER"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              isBlocked
                                ? "bg-red-50 text-red-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>

                        {/* CREATED */}

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-BD",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {/* BLOCK / UNBLOCK */}

                            <button
                              type="button"
                              disabled={isAdmin || isLoading}
                              onClick={() => handleStatus(user)}
                              title={
                                isAdmin
                                  ? "Admin cannot be blocked"
                                  : isBlocked
                                    ? "Unblock user"
                                    : "Block user"
                              }
                              className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                isBlocked
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                              }`}
                            >
                              {isBlocked ? (
                                <ShieldCheck size={15} />
                              ) : (
                                <ShieldOff size={15} />
                              )}

                              {isBlocked ? "Unblock" : "Block"}
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              disabled={isAdmin || isLoading}
                              onClick={() => handleDelete(user)}
                              title={
                                isAdmin
                                  ? "Admin cannot be deleted"
                                  : "Delete user"
                              }
                              className="flex h-9 items-center gap-1.5 rounded-lg bg-red-50 px-3 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PAGINATION */}

        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() => fetchUsers(pagination.currentPage - 1)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">
              {pagination.currentPage}
            </span>

            <span className="text-sm text-slate-400">of</span>

            <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600">
              {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => fetchUsers(pagination.currentPage + 1)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersClient;
