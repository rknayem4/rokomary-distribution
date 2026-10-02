
import { getPublicEmployees } from "@/app/lib/actions/employees";
import EmployeesClient from "@/Components/Employee/EmployeesClient";


const EmployeesPage = async () => {

  const data =
    await getPublicEmployees({
      status: "active",
      page: 1,
      limit: 12,
    });


  return (
    <EmployeesClient
      initialEmployees={
        data.employees || []
      }
      pagination={
        data.pagination
      }
    />
  );
};


export default EmployeesPage;