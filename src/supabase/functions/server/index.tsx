import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-afdc9282/health", (c) => {
  return c.json({ status: "ok" });
});

// AI Chat endpoint
app.post("/make-server-afdc9282/ai/chat", async (c) => {
  try {
    const { messages } = await c.req.json();
    const apiKey = Deno.env.get("CODESTRAL_API_KEY");

    if (!apiKey) {
      console.log("Error: Codestral API key not configured");
      return c.json({ error: "AI service not configured" }, 500);
    }

    const response = await fetch("https://codestral.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "codestral-2501",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`Codestral API error (${response.status}): ${error}`);
      return c.json({ error: `Failed to get AI response: ${error}` }, 500);
    }

    const data = await response.json();
    console.log(`AI response received successfully`);
    return c.json({ message: data.choices[0].message.content });
  } catch (error) {
    console.log(`Error in AI chat endpoint: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Code formatting endpoint
app.post("/make-server-afdc9282/code/format", async (c) => {
  try {
    const { code, language } = await c.req.json();
    const apiKey = Deno.env.get("CODESTRAL_API_KEY");

    if (!apiKey) {
      return c.json({ error: "AI service not configured" }, 500);
    }

    const response = await fetch("https://codestral.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "codestral-2501",
        messages: [{
          role: "system",
          content: "You are a code formatter. Format the provided code properly with correct indentation and style. Return only the formatted code without explanations."
        }, {
          role: "user",
          content: `Format this ${language} code:\n\n${code}`
        }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`Codestral API error in code formatting (${response.status}): ${error}`);
      return c.json({ error: `Failed to format code: ${error}` }, 500);
    }

    const data = await response.json();
    return c.json({ formattedCode: data.choices[0].message.content });
  } catch (error) {
    console.log(`Error in code formatting: ${error}`);
    return c.json({ error: "Failed to format code" }, 500);
  }
});

// Debug code endpoint
app.post("/make-server-afdc9282/code/debug", async (c) => {
  try {
    const { code, language } = await c.req.json();
    const apiKey = Deno.env.get("CODESTRAL_API_KEY");

    if (!apiKey) {
      return c.json({ error: "AI service not configured" }, 500);
    }

    const response = await fetch("https://codestral.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "codestral-2501",
        messages: [{
          role: "system",
          content: "You are a debugging assistant. Analyze the code and identify bugs, potential issues, and suggest fixes."
        }, {
          role: "user",
          content: `Debug this ${language} code:\n\n${code}`
        }],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`Codestral API error in debugging (${response.status}): ${error}`);
      return c.json({ error: `Failed to debug code: ${error}` }, 500);
    }

    const data = await response.json();
    return c.json({ analysis: data.choices[0].message.content });
  } catch (error) {
    console.log(`Error in code debugging: ${error}`);
    return c.json({ error: "Failed to debug code" }, 500);
  }
});

// Code review endpoint
app.post("/make-server-afdc9282/code/review", async (c) => {
  try {
    const { code, language } = await c.req.json();
    const apiKey = Deno.env.get("CODESTRAL_API_KEY");

    if (!apiKey) {
      return c.json({ error: "AI service not configured" }, 500);
    }

    const response = await fetch("https://codestral.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "codestral-2501",
        messages: [{
          role: "system",
          content: "You are a senior code reviewer. Review the code for best practices, performance, security, and maintainability. Provide constructive feedback."
        }, {
          role: "user",
          content: `Review this ${language} code:\n\n${code}`
        }],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`Codestral API error in code review (${response.status}): ${error}`);
      return c.json({ error: `Failed to review code: ${error}` }, 500);
    }

    const data = await response.json();
    return c.json({ review: data.choices[0].message.content });
  } catch (error) {
    console.log(`Error in code review: ${error}`);
    return c.json({ error: "Failed to review code" }, 500);
  }
});

// Generate code endpoint
app.post("/make-server-afdc9282/code/generate", async (c) => {
  try {
    const { description, language } = await c.req.json();
    const apiKey = Deno.env.get("CODESTRAL_API_KEY");

    if (!apiKey) {
      return c.json({ error: "AI service not configured" }, 500);
    }

    const response = await fetch("https://codestral.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "codestral-2501",
        messages: [{
          role: "system",
          content: "You are a code generator. Generate clean, well-structured code based on the description. Include comments for clarity."
        }, {
          role: "user",
          content: `Generate ${language} code for: ${description}`
        }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`Codestral API error in code generation (${response.status}): ${error}`);
      return c.json({ error: `Failed to generate code: ${error}` }, 500);
    }

    const data = await response.json();
    return c.json({ code: data.choices[0].message.content });
  } catch (error) {
    console.log(`Error in code generation: ${error}`);
    return c.json({ error: "Failed to generate code" }, 500);
  }
});

// Optimize code endpoint
app.post("/make-server-afdc9282/code/optimize", async (c) => {
  try {
    const { code, language } = await c.req.json();
    const apiKey = Deno.env.get("CODESTRAL_API_KEY");

    if (!apiKey) {
      return c.json({ error: "AI service not configured" }, 500);
    }

    const response = await fetch("https://codestral.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "codestral-2501",
        messages: [{
          role: "system",
          content: "You are a performance optimization expert. Optimize the code for better performance, efficiency, and resource usage. Explain the optimizations made."
        }, {
          role: "user",
          content: `Optimize this ${language} code:\n\n${code}`
        }],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`Codestral API error in optimization (${response.status}): ${error}`);
      return c.json({ error: `Failed to optimize code: ${error}` }, 500);
    }

    const data = await response.json();
    return c.json({ optimizedCode: data.choices[0].message.content });
  } catch (error) {
    console.log(`Error in code optimization: ${error}`);
    return c.json({ error: "Failed to optimize code" }, 500);
  }
});

// Document code endpoint
app.post("/make-server-afdc9282/code/document", async (c) => {
  try {
    const { code, language } = await c.req.json();
    const apiKey = Deno.env.get("CODESTRAL_API_KEY");

    if (!apiKey) {
      return c.json({ error: "AI service not configured" }, 500);
    }

    const response = await fetch("https://codestral.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "codestral-2501",
        messages: [{
          role: "system",
          content: "You are a technical documentation expert. Add comprehensive documentation, comments, and JSDoc/docstrings to the code."
        }, {
          role: "user",
          content: `Add documentation to this ${language} code:\n\n${code}`
        }],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`Codestral API error in documentation (${response.status}): ${error}`);
      return c.json({ error: `Failed to document code: ${error}` }, 500);
    }

    const data = await response.json();
    return c.json({ documentedCode: data.choices[0].message.content });
  } catch (error) {
    console.log(`Error in code documentation: ${error}`);
    return c.json({ error: "Failed to document code" }, 500);
  }
});

// Snippets endpoints
app.get("/make-server-afdc9282/snippets", async (c) => {
  try {
    const snippets = await kv.getByPrefix("snippet:");
    return c.json({ snippets: snippets || [] });
  } catch (error) {
    console.log(`Error fetching snippets: ${error}`);
    return c.json({ error: "Failed to fetch snippets" }, 500);
  }
});

app.post("/make-server-afdc9282/snippets", async (c) => {
  try {
    const snippet = await c.req.json();
    const id = `snippet:${Date.now()}`;
    await kv.set(id, { ...snippet, id, createdAt: new Date().toISOString() });
    return c.json({ success: true, id });
  } catch (error) {
    console.log(`Error saving snippet: ${error}`);
    return c.json({ error: "Failed to save snippet" }, 500);
  }
});

app.delete("/make-server-afdc9282/snippets/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting snippet: ${error}`);
    return c.json({ error: "Failed to delete snippet" }, 500);
  }
});

// Stats endpoints
app.get("/make-server-afdc9282/stats", async (c) => {
  try {
    const stats = await kv.get("user:stats") || {
      codeGenerated: 0,
      tasksCompleted: 0,
      timeSaved: 0,
    };
    return c.json(stats);
  } catch (error) {
    console.log(`Error fetching stats: ${error}`);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

app.post("/make-server-afdc9282/stats/increment", async (c) => {
  try {
    const { field, value } = await c.req.json();
    const stats = await kv.get("user:stats") || {
      codeGenerated: 0,
      tasksCompleted: 0,
      timeSaved: 0,
    };
    
    stats[field] = (stats[field] || 0) + value;
    await kv.set("user:stats", stats);
    
    return c.json({ success: true, stats });
  } catch (error) {
    console.log(`Error updating stats: ${error}`);
    return c.json({ error: "Failed to update stats" }, 500);
  }
});

Deno.serve(app.fetch);