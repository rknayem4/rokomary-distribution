import SidebarAdmin from "@/Components/admin/SideberAdmin";

export default async function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-lg:flex-col gap-1.5">
        <SidebarAdmin />

        <main className="lg:flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
