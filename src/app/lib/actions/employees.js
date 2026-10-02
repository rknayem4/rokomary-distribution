const baseUrl = process.env.NEXT_PUBLIC_PASE_URL;

export const getEmployees = async ({
  search = "",
  status = "",
} = {}) => {
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