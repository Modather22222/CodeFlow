import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, Copy, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from "../utils/clipboard";

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
}

interface CodeSnippetsProps {
  refreshTrigger?: number;
}

export function CodeSnippets({ refreshTrigger }: CodeSnippetsProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSnippets = async () => {
    try {
      const response = await api.getSnippets();
      const sortedSnippets = (response.snippets || [])
        .sort((a: Snippet, b: Snippet) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3);
      setSnippets(sortedSnippets);
    } catch (error) {
      console.error("Failed to load snippets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnippets();
  }, [refreshTrigger]);

  const handleCopy = async (code: string) => {
    try {
      await copyToClipboard(code);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSnippet(id);
      setSnippets(snippets.filter(s => s.id !== id));
      toast.success("Snippet deleted!");
    } catch (error) {
      console.error("Failed to delete snippet:", error);
      toast.error("Failed to delete snippet");
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div>
        <h2 className="mb-4">Recent Snippets</h2>
        <p className="text-gray-500 text-sm">Loading snippets...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Recent Snippets</h2>
        {snippets.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={loadSnippets}
          >
            Refresh
          </Button>
        )}
      </div>

      {snippets.length === 0 ? (
        <Card className="p-6 border-gray-200 text-center">
          <p className="text-gray-500 text-sm">No snippets yet. Use Quick Actions to generate and save code!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {snippets.map((snippet) => (
            <Card key={snippet.id} className="p-4 border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium mb-1">{snippet.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {snippet.language}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleCopy(snippet.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(snippet.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <pre className="bg-gray-50 rounded-lg p-3 text-xs overflow-x-auto mb-3">
                <code>{snippet.code}</code>
              </pre>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{getTimeAgo(snippet.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
