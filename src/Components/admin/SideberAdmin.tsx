"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Person,
  ArrowRightFromSquare,
  LayoutHeaderSideContent,
} from "@gravity-ui/icons";
import Image from "next/image";
import MobileSidebar from "./MobileSideberFree";
import { authClient } from "@/app/lib/auth-client";
import { FaUserTie } from "react-icons/fa";
import { BsBoxFill } from "react-icons/bs";
import { MdOutlineAddBox } from "react-icons/md";
import type { ComponentType } from "react";

type SidebarIconProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

type SidebarLink = {
  name: string;
  href: string;
  icon: ComponentType<SidebarIconProps>;
};

const links: SidebarLink[] = [
  {
    name: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutHeaderSideContent,
  },
  {
    name: "Product",
    href: "/dashboard/admin/product",
    icon: BsBoxFill,
  },
  {
    name: "Add Product",
    href: "/dashboard/admin/add-product",
    icon: MdOutlineAddBox,
  },
  {
    name: "Employee",
    href: "/dashboard/admin/employee",
    icon: FaUserTie,
  },
  {
    name: "Manage User",
    href: "/dashboard/admin/manage-user",
    icon: Person,
  },
];

export default function SidebarAdmin() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name ?? "Admin";
  const userImage = session?.user?.image ?? "/assats/default-avatar.png";

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden min-h-screen w-72 flex-col border-r bg-white lg:flex">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assats/rokomary-distribution.svg"
              width={180}
              height={60}
              alt="Rokomary Distribution Logo"
              className="object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard/admin" &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
              >
                <Icon width={22} height={22} />

                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="flex items-center justify-between border-t p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl p-3 transition hover:bg-gray-100"
          >
            <Image
              src={userImage}
              alt={userName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />

            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800">{userName}</p>

              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </button>

          {/* Sign Out */}
          <button
            type="button"
            aria-label="Sign out"
            className="ml-2 rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-red-500"
            onClick={async () => {
              await authClient.signOut();
            }}
          >
            <ArrowRightFromSquare width={28} height={28} />
          </button>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <MobileSidebar links={links} />
    </>
  );
}
