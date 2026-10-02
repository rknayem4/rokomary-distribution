import { getAdminUsers } from "@/app/lib/actions/employees";
import ManageUsersClient from "@/Components/admin/ManageUsersClient";


const ManageUserPage = async () => {
  const data = await getAdminUsers({
    page: 1,
    status: "all",
  });

  return (
    <ManageUsersClient
      initialUsers={data.users || []}
      initialPagination={data.pagination}
    />
  );
};

export default ManageUserPage;
