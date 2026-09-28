"use server";

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
  sort = "latest",
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    category,
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



/* ================= UPDATE PRODUCT ================= */

export const updateProduct = async (id, productData) => {
  const res = await fetch(
    `${baseUrl}/api/products/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    }
  );

  const text = await res.text();

  console.log("UPDATE STATUS:", res.status);
  console.log("UPDATE RESPONSE:", text);

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
        `Failed to update product (${res.status})`
    );
  }

  return data;
};


/* ================= DELETE PRODUCT ================= */

export const deleteProduct = async (id) => {
  const res = await fetch(
    `${baseUrl}/api/products/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.message || "Failed to delete product"
    );
  }

  return data;
};