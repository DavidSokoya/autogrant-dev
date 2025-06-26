import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  status: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  iconBg: string;
}

export function StatCard({
  title,
  value,
  status,
  trend = "neutral",
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <div className="px-6 py-2 bg-white rounded-md border shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <p className="text-sm md:text-base font-medium text-muted-foreground">{title}</p>
          <div
            className={cn(
              "flex items-center justify-center h-12 w-12 rounded-full",
              iconBg
            )}
          >
            {icon}
            </div>
          </div>

          <div className="flex justify-between items-end">
            <h3 className="text-4xl font-bold mt-2">{value}</h3>

            <div className="flex items-center">
              {trend === "up" && (
                <TrendingUp className="mr-1 h-4 w-4 text-emerald-600" />
              )}
              {trend === "down" && (
                <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
              )}

              <span
                className={cn(
                  "text-sm",
                  trend === "up"
                    ? "text-emerald-600"
                    : trend === "down"
                    ? "text-red-600"
                    : "text-muted-foreground"
                )}
              >
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
  );
}
