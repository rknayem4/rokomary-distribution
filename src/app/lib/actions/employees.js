const baseUrl = process.env.NEXT_PUBLIC_PASE_URL;

export const getEmployees = async ({ search = "", status = "" } = {}) => {
  try {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (status) {
      params.set("status", status);
    }

    const queryString = params.toString();

    const res = await fetch(
      `${baseUrl}/api/employees${queryString ? `?${queryString}` : ""}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch employees");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error);

    return {
      success: false,
      employees: [],
    };
  }
};

// ========================================
// GET PUBLIC EMPLOYEES
// ========================================

export const getPublicEmployees = async ({
  search = "",
  status = "active",
  page = 1,
  limit = 12,
} = {}) => {
  const params = new URLSearchParams();

  params.set("search", search);

  params.set("status", status);

  params.set("page", String(page));

  params.set("limit", String(limit));

  const url = `${baseUrl}/api/public/employees?${params.toString()}`;

  console.log("GET EMPLOYEES:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    const text = await res.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Backend returned:", text);

      throw new Error(`Backend returned invalid JSON. Status: ${res.status}`);
    }

    if (!res.ok) {
      console.error("Employee API Error:", data);

      throw new Error(
        data?.message || `Failed to load employees (${res.status})`,
      );
    }

    return data;
  } catch (error) {
    console.error("getPublicEmployees ERROR:", error);

    throw error;
  }
};

// ==========================================
// GET USERS
// ==========================================

export const getAdminUsers = async ({
  search = "",
  status = "all",
  page = 1,
} = {}) => {
  const params = new URLSearchParams();

  params.set("search", search);

  params.set("status", status);

  params.set("page", String(page));

  const res = await fetch(
    `${baseUrl}/api/admin/users?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load users");
  }

  return data;
};

// ==========================================
// BLOCK / UNBLOCK
// ==========================================

export const updateUserStatus = async (userId, status) => {
  const res = await fetch(`${baseUrl}/api/admin/users/${userId}/status`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      status,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update user");
  }

  return data;
};

// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = async (userId) => {
  const res = await fetch(`${baseUrl}/api/admin/users/${userId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete user");
  }

  return data;
};
