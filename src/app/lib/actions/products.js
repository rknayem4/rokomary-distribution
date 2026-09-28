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
