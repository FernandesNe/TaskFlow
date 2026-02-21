import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, color, trend, trendValue }) {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span className={trend === "up" ? "text-emerald-600" : "text-rose-600"}>
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </span>
              <span className="text-gray-400 ml-1">vs último mês</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.indigo}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}