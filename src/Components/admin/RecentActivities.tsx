"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Activity = {
  _id: string;

  type: "employee" | "product" | "system";

  title: string;

  description: string;

  userId?: string | null;

  createdAt: string;
};

const RecentActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_PASE_URL;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${baseUrl}/api/admin/dashboard/recent-activities`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load activities");
        }

        setActivities(data.activities || []);
      } catch (error) {
        console.error("Recent activities error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [baseUrl]);

  const getIcon = (type: Activity["type"]) => {
    if (type === "employee") {
      return "👤";
    }

    if (type === "product") {
      return "📦";
    }

    return "⚙️";
  };

  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-gray-900">Recent Activity</h2>

          <p className="mt-1 text-xs text-gray-500">Latest admin actions</p>
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="space-y-3 p-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {/* Empty */}

      {!loading && activities.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="text-4xl">📝</div>

          <p className="mt-3 font-semibold text-gray-900">No recent activity</p>

          <p className="mt-1 text-sm text-gray-500">
            Admin activities will appear here.
          </p>
        </div>
      )}

      {/* Activities */}

      {!loading && activities.length > 0 && (
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <div key={activity._id} className="flex gap-4 px-5 py-4">
              {/* Icon */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                {getIcon(activity.type)}
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {activity.title}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {activity.description}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentActivities;
