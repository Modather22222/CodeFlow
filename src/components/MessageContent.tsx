import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { copyToClipboard } from "../utils/clipboard";
import { toast } from "sonner@2.0.3";
import { useState } from "react";

interface CodeBlock {
  language: string;
  code: string;
}

interface MessageContentProps {
  content: string;
  role: "user" | "assistant";
}

export function MessageContent({ content, role }: MessageContentProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Parse content for code blocks
  const parseContent = (text: string) => {
    const parts: Array<{ type: "text" | "code"; content: string; language?: string }> = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }

      // Add code block
      parts.push({
        type: "code",
        language: match[1] || "plaintext",
        content: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: "text" as const, content: text }];
  };

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await copyToClipboard(code);
      setCopiedIndex(index);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
      toast.error("Failed to copy code");
    }
  };

  const parts = parseContent(content);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.type === "code") {
          return (
            <div key={index} className="relative group">
              <div className="flex items-center justify-between bg-gray-800 text-white px-3 py-2 rounded-t-lg">
                <span className="text-xs uppercase tracking-wide">{part.language}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-white hover:bg-gray-700"
                  onClick={() => handleCopyCode(part.content, index)}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 rounded-b-lg p-4 overflow-x-auto">
                <code className="text-sm font-mono">{part.content}</code>
              </pre>
            </div>
          );
        } else {
          // Render text with preserved formatting
          return (
            <div key={index} className="text-sm whitespace-pre-wrap">
              {part.content.split("\n").map((line, lineIndex) => (
                <p key={lineIndex}>{line || "\u00A0"}</p>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
}
