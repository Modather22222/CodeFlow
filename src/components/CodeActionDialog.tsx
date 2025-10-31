import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2, Copy, Save } from "lucide-react";
import { api } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from "../utils/clipboard";

interface CodeActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: string;
  onSnippetSaved?: () => void;
}

const actionConfig: Record<string, { title: string; description: string; needsCode: boolean }> = {
  format: { title: "Format Code", description: "Enter code to format", needsCode: true },
  debug: { title: "Debug Code", description: "Enter code to debug", needsCode: true },
  review: { title: "Code Review", description: "Enter code for review", needsCode: true },
  generate: { title: "Generate Code", description: "Describe what you want to generate", needsCode: false },
  optimize: { title: "Optimize Code", description: "Enter code to optimize", needsCode: true },
  document: { title: "Document Code", description: "Enter code to document", needsCode: true },
};

export function CodeActionDialog({ open, onOpenChange, action, onSnippetSaved }: CodeActionDialogProps) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const config = actionConfig[action];

  const handleExecute = async () => {
    if (config.needsCode && !code.trim()) {
      toast.error("Please enter code");
      return;
    }
    if (!config.needsCode && !description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      let response;
      switch (action) {
        case "format":
          response = await api.formatCode(code, language);
          setResult(response.formattedCode);
          break;
        case "debug":
          response = await api.debugCode(code, language);
          setResult(response.analysis);
          break;
        case "review":
          response = await api.reviewCode(code, language);
          setResult(response.review);
          break;
        case "generate":
          response = await api.generateCode(description, language);
          setResult(response.code);
          await api.incrementStat("codeGenerated", 1);
          break;
        case "optimize":
          response = await api.optimizeCode(code, language);
          setResult(response.optimizedCode);
          break;
        case "document":
          response = await api.documentCode(code, language);
          setResult(response.documentedCode);
          break;
      }
      
      await api.incrementStat("tasksCompleted", 1);
      await api.incrementStat("timeSaved", 0.5);
      toast.success("Action completed successfully!");
    } catch (error: any) {
      console.error("Code action error:", error);
      const errorMsg = error?.message || "Failed to execute action";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(result);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleSave = async () => {
    if (!result) return;
    
    try {
      await api.saveSnippet({
        title: `${config.title} Result`,
        language,
        code: result,
      });
      toast.success("Snippet saved!");
      onSnippetSaved?.();
    } catch (error) {
      console.error("Save snippet error:", error);
      toast.error("Failed to save snippet");
    }
  };

  const handleClose = () => {
    setCode("");
    setDescription("");
    setResult("");
    onOpenChange(false);
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="TypeScript">TypeScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="C++">C++</SelectItem>
                <SelectItem value="Go">Go</SelectItem>
                <SelectItem value="Rust">Rust</SelectItem>
                <SelectItem value="CSS">CSS</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.needsCode ? (
            <div>
              <Label>Code</Label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here..."
                className="min-h-[150px] font-mono text-sm"
              />
            </div>
          ) : (
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to generate..."
                className="min-h-[100px]"
              />
            </div>
          )}

          <Button
            onClick={handleExecute}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Execute"
            )}
          </Button>

          {result && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Result</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
