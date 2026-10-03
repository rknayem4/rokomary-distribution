const baseUrl = process.env.NEXT_PUBLIC_PASE_URL;

export const createProduct = async (newProduct) => {
  const res = await fetch(`${baseUrl}/api/add-product`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newProduct),
  });
  return res.json();
};

export const getProducts = async ({
  page = 1,
  limit = 12,
  search = "",
  category = "",
  status = "",
  sort = "latest",
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    category,
    status,
    sort,
  });

  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get products");
  }

  return data;
};

// ========================================
// UPDATE PRODUCT
// ========================================

export const updateProduct = async (id, productData) => {
  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(productData),

      cache: "no-store",
    });

    const text = await res.text();

    let data = {};

    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }

    console.log("UPDATE STATUS:", res.status);

    console.log("UPDATE RESPONSE:", data);

    if (!res.ok) {
      throw new Error(
        data?.message || `Failed to update product (${res.status})`,
      );
    }

    return data;
  } catch (error) {
    console.error("updateProduct error:", error);

    throw error;
  }
};

// ========================================
// DELETE PRODUCT
// ========================================

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    const text = await res.text();

    let data = {};

    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }

    console.log("DELETE STATUS:", res.status);

    console.log("DELETE RESPONSE:", data);

    if (!res.ok) {
      throw new Error(
        data?.message || `Failed to delete product (${res.status})`,
      );
    }

    return data;
  } catch (error) {
    console.error("deleteProduct error:", error);

    throw error;
  }
};

// Latest 6 Products
export const getLatestProducts = async () => {
  try {
    const res = await fetch(
      `${baseUrl}/api/products/top-latest`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.message ||
          "Failed to get latest products"
      );
    }

    return data.products || [];
  } catch (error) {
    console.error(
      "getLatestProducts error:",
      error
    );

    return [];
  }
};
