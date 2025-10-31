import { Wand2, Bug, FileCheck, Code, Zap, FileText } from "lucide-react";
import { Card } from "./ui/card";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const actions = [
  {
    id: "format",
    icon: Code,
    label: "Format Code",
    description: "Auto-format your code",
    color: "bg-black",
  },
  {
    id: "debug",
    icon: Bug,
    label: "Debug",
    description: "Find and fix bugs",
    color: "bg-gray-800",
  },
  {
    id: "review",
    icon: FileCheck,
    label: "Code Review",
    description: "Get AI code review",
    color: "bg-gray-700",
  },
  {
    id: "generate",
    icon: Wand2,
    label: "Generate",
    description: "Generate code snippets",
    color: "bg-gray-600",
  },
  {
    id: "optimize",
    icon: Zap,
    label: "Optimize",
    description: "Optimize performance",
    color: "bg-gray-500",
  },
  {
    id: "document",
    icon: FileText,
    label: "Document",
    description: "Generate docs",
    color: "bg-gray-400",
  },
];

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div>
      <h2 className="mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Card
            key={action.label}
            onClick={() => onActionClick(action.id)}
            className="p-4 border-gray-200 hover:border-black transition-colors cursor-pointer"
          >
            <div className={`${action.color} text-white w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
              <action.icon className="h-6 w-6" />
            </div>
            <h3 className="font-medium mb-1">{action.label}</h3>
            <p className="text-xs text-gray-500">{action.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
