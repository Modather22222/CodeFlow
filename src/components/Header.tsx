import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <h1 className="text-xl tracking-tight">CodeFlow</h1>
        
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>
    </header>
  );
}
