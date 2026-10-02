import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

const EXPRESS_API_URL =
  process.env.NEXT_PUBLIC_PASE_URL|| "http://localhost:8000";

export async function POST(request: Request) {
  try {
    // 1. Check logged-in user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // 2. Check admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can create employees",
        },
        { status: 403 }
      );
    }

    // 3. Get request data
    const body = await request.json();

    const {
      name,
      email,
      password,
      profilePhoto,
      designation,
      department,
      phone,
      alternatePhone,
      address,
      joiningDate,
    } = body;

    // 4. Basic validation
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, password and phone are required",
        },
        { status: 400 }
      );
    }

    // 5. Create Better Auth user
    const newUser = await auth.api.createUser({
      headers: await headers(),

      body: {
        name,
        email,
        password,
        role: "EMPLOYEE",

        data: {
          phone,
          address,
          image: profilePhoto || undefined,
        },
      },
    });

    if (!newUser?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create employee account",
        },
        { status: 500 }
      );
    }

    const userId = newUser.user.id;

    // 6. Create employee profile in Express API
    const employeeResponse = await fetch(
      `${EXPRESS_API_URL}/api/admin/employees`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,

          name,
          email,

          profilePhoto: profilePhoto || "",

          designation: designation || "",
          department: department || "",

          phone,
          alternatePhone: alternatePhone || "",

          address: address || "",
          joiningDate: joiningDate || "",

          role: "EMPLOYEE",
          status: "active",
        }),
      }
    );

    const employeeData = await employeeResponse.json();

    if (!employeeResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            employeeData?.message ||
            "Employee account created but profile creation failed",
          userId,
        },
        { status: 500 }
      );
    }

    // 7. Success
    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully",
        userId,
        employeeId: employeeData.employeeId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create employee",
      },
      { status: 500 }
    );
  }
}