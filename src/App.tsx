import { useState } from "react";
import { Header } from "./components/Header";
import { SideMenu } from "./components/SideMenu";
import { AIAssistant } from "./components/AIAssistant";
import { QuickActions } from "./components/QuickActions";
import { CodeSnippets } from "./components/CodeSnippets";
import { StatsCard } from "./components/StatsCard";
import { CodeActionDialog } from "./components/CodeActionDialog";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] =
    useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [snippetRefresh, setSnippetRefresh] = useState(0);

  const handleActionClick = (action: string) => {
    setSelectedAction(action);
    setActionDialogOpen(true);
  };

  const handleSnippetSaved = () => {
    setSnippetRefresh((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onOpenChange={setMenuOpen} />

      {/* Main Content */}
      <main className="pt-16 pb-8">
        <div className="max-w-md mx-auto px-4 space-y-8">
          {/* Welcome Section */}
          <div className="pt-6">
            <h1 className="mb-2">Welcome back, John</h1>
            <p className="text-gray-600">
              Let's boost your coding productivity today
            </p>
          </div>

          {/* Stats Overview */}
          <StatsCard />

          {/* AI Assistant */}
          <AIAssistant />

          {/* Quick Actions */}
          <QuickActions onActionClick={handleActionClick} />

          {/* Code Snippets */}
          <CodeSnippets refreshTrigger={snippetRefresh} />
        </div>
      </main>

      {/* Code Action Dialog */}
      <CodeActionDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        action={selectedAction}
        onSnippetSaved={handleSnippetSaved}
      />

      <Toaster />
    </div>
  );
}