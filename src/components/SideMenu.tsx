import { User, Settings, Code2, Sparkles, History, BookMarked, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface SideMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SideMenu({ open, onOpenChange }: SideMenuProps) {
  const menuItems = [
    { icon: Code2, label: "My Code", action: () => {} },
    { icon: Sparkles, label: "AI Assistant", action: () => {} },
    { icon: History, label: "History", action: () => {} },
    { icon: BookMarked, label: "Saved Snippets", action: () => {} },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 bg-white">
        <SheetHeader className="mb-8">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Access your profile, settings, and navigation options
          </SheetDescription>
        </SheetHeader>

        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16 bg-black">
            <AvatarFallback className="bg-black text-white">
              JD
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Menu Items */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <Separator className="mb-6" />

        {/* Settings & Logout */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-red-600">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
