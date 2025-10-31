import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { TrendingUp, Code, CheckCircle, Clock } from "lucide-react";
import { api } from "../utils/api";

interface Stats {
  codeGenerated: number;
  tasksCompleted: number;
  timeSaved: number;
}

export function StatsCard() {
  const [stats, setStats] = useState<Stats>({
    codeGenerated: 0,
    tasksCompleted: 0,
    timeSaved: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, []);

  const statsDisplay = [
    {
      icon: Code,
      label: "Code Generated",
      value: stats.codeGenerated.toString(),
      unit: "snippets",
    },
    {
      icon: CheckCircle,
      label: "Tasks Completed",
      value: stats.tasksCompleted.toString(),
      unit: "tasks",
    },
    {
      icon: TrendingUp,
      label: "Productivity",
      value: stats.tasksCompleted > 0 ? "+24%" : "0%",
      unit: "this week",
    },
    {
      icon: Clock,
      label: "Time Saved",
      value: stats.timeSaved.toFixed(1),
      unit: "hours",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statsDisplay.map((stat) => (
        <Card key={stat.label} className="p-4 border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="h-4 w-4 text-gray-600" />
            <p className="text-xs text-gray-600">{stat.label}</p>
          </div>
          <p className="text-2xl font-medium mb-1">{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.unit}</p>
        </Card>
      ))}
    </div>
  );
}
