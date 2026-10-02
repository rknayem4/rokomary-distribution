import { BriefcaseBusiness, CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
const EmployeeCard = ({
  employee,
}) => {
  const isActive =
    employee.status === "active";

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="relative h-64 bg-slate-100">

        {employee.profilePhoto ? (
          <Image
            src={employee.profilePhoto}
            alt={employee.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-black text-slate-300">
            {employee.name
              ?.charAt(0)
              .toUpperCase()}
          </div>
        )}

        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>

      </div>


      <div className="p-5">

        <h2 className="text-lg font-bold text-slate-900">
          {employee.name}
        </h2>

        <p className="mt-1 text-sm font-semibold text-blue-600">
          {employee.designation ||
            "Employee"}
        </p>


        {employee.department && (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <BriefcaseBusiness size={14} />
            {employee.department}
          </div>
        )}


        <div className="mt-4 space-y-3 border-t pt-4">

          {employee.email && (
            <div className="flex gap-3">
              <Mail
                size={16}
                className="mt-1 text-blue-500"
              />

              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">
                  Email
                </p>

                <p className="truncate text-sm text-slate-700">
                  {employee.email}
                </p>
              </div>
            </div>
          )}


          {employee.phone && (
            <div className="flex gap-3">
              <Phone
                size={16}
                className="mt-1 text-emerald-500"
              />

              <div>
                <p className="text-[11px] text-slate-400">
                  Phone
                </p>

                <p className="text-sm font-semibold text-slate-700">
                  {employee.phone}
                </p>
              </div>
            </div>
          )}


          {employee.address && (
            <div className="flex gap-3">
              <MapPin
                size={16}
                className="mt-1 text-amber-500"
              />

              <div>
                <p className="text-[11px] text-slate-400">
                  Address
                </p>

                <p className="text-sm text-slate-600">
                  {employee.address}
                </p>
              </div>
            </div>
          )}


          {employee.joiningDate && (
            <div className="flex gap-3">
              <CalendarDays
                size={16}
                className="mt-1 text-purple-500"
              />

              <div>
                <p className="text-[11px] text-slate-400">
                  Joined
                </p>

                <p className="text-sm text-slate-700">
                  {new Date(
                    employee.joiningDate
                  ).toLocaleDateString(
                    "en-BD",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default EmployeeCard;