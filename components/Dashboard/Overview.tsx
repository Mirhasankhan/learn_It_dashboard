"use client";

import { useOverviewQuery } from "@/redux/api/adminApi";
import { Users, GraduationCap, Clock, SaudiRiyal, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Overview() {
  const { data, isLoading } = useOverviewQuery("");
  const overview = data?.result;

  const statCards = [
    {
      title: "Total Job Seekers",
      value: overview?.totalJobSeekers?.toLocaleString() ?? "0",
      href: "/job-seeker-management",
      icon: Users,
      color: "blue",
      badge: "Platform Users",
      bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Career Experts",
      value: overview?.totalExperts?.toLocaleString() ?? "0",
      href: "/expert-management",
      icon: GraduationCap,
      color: "purple",
      badge: "Verified Advisors",
      bgGradient: "from-purple-500/10 via-purple-500/5 to-transparent",
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Pending Expert Applications",
      value: overview?.totalApplication?.toLocaleString() ?? "0",
      href: "/expert-management?view=applications",
      icon: Clock,
      color: "amber",
      badge: Number(overview?.totalApplication || 0) > 0 ? "Action Required" : "Up to date",
      badgeAlert: Number(overview?.totalApplication || 0) > 0,
      bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Total Platform Revenue",
      value: overview?.incomingMoney !== undefined ? Number(overview.incomingMoney).toLocaleString() : "0",
      isCurrency: true,
      href: "/finance",
      icon: SaudiRiyal,
      color: "orange",
      badge: "Lifetime Earnings",
      bgGradient: "from-orange-500/10 via-orange-500/5 to-transparent",
      iconBg: "bg-orange-50 text-bprimary border-orange-100",
      iconColor: "text-bprimary",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col justify-between h-[155px]"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={idx}
            href={card.href}
            className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-100/90 shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Ambient subtle gradient glow on top */}
            <div
              className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${card.bgGradient} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
            />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                {card.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-xs`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <div className="flex items-baseline gap-1.5">
                {card.isCurrency && (
                  <SaudiRiyal className="w-6 h-6 text-bprimary self-center" />
                )}
                <span className="font-bold text-3xl tracking-tight text-gray-900">
                  {card.value}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    card.badgeAlert
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {card.badge}
                </span>

                <span className="text-xs font-medium text-gray-400 group-hover:text-bprimary inline-flex items-center gap-0.5 transition-colors">
                  Details
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

