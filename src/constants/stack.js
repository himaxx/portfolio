import claude from "../assets/logos/claude.svg";
import openai from "../assets/logos/openai.svg";
import gemini from "../assets/logos/gemini.svg";
import meta from "../assets/logos/meta.svg";
import mistral from "../assets/logos/mistral.svg";
import deepseek from "../assets/logos/deepseek.svg";
import langchain from "../assets/logos/langchain.svg";
import crewai from "../assets/logos/crewai.svg";
import langflow from "../assets/logos/langflow.svg";
import huggingface from "../assets/logos/huggingface.svg";
import n8n from "../assets/logos/n8n.svg";
import fastapi from "../assets/logos/fastapi.svg";
import langfuse from "../assets/logos/langfuse.svg";
import claudecode from "../assets/logos/claudecode.svg";
import antigravity from "../assets/logos/antigravity.svg";
import google from "../assets/logos/google.svg";

// Data for the interactive "Agent Stack" section.
// Coordinates live in a 1000 x 600 design space; the graph scales to fit.

export const GRAPH_W = 1000;
export const GRAPH_H = 600;

export const layers = [
  { id: "trigger", label: "Trigger", x: 80 },
  { id: "models", label: "Foundation models", x: 285 },
  { id: "frameworks", label: "Agent frameworks", x: 510 },
  { id: "automation", label: "Automation & APIs", x: 735 },
  { id: "output", label: "Outcome", x: 925 },
];

export const nodes = [
  // Trigger
  { id: "prompt", layer: "trigger", y: 230, name: "User prompt", icon: "prompt", color: "#aaa6c3",
    role: "Entry point", desc: "A question, a chat message or a voice command: anything a person asks the system to do." },
  { id: "event", layer: "trigger", y: 370, name: "Webhook / Event", icon: "webhook", color: "#f5af19",
    role: "Entry point", desc: "Scheduled jobs, form submissions, new emails or app events that start a workflow with no human in the loop." },

  // Models
  { id: "claude", layer: "models", y: 70, name: "Claude", logo: claude, color: "#D97757",
    role: "Anthropic", desc: "Long-context reasoning, coding and reliable tool use. A strong default brain for agents." },
  { id: "gpt", layer: "models", y: 162, name: "GPT", logo: openai, color: "#10A37F",
    role: "OpenAI", desc: "General-purpose reasoning, structured outputs and multimodal understanding." },
  { id: "gemini", layer: "models", y: 254, name: "Gemini", logo: gemini, color: "#4796E3",
    role: "Google DeepMind", desc: "Native multimodality with very large context windows for video, audio and documents." },
  { id: "llama", layer: "models", y: 346, name: "Llama", logo: meta, color: "#0467DF",
    role: "Meta · open weights", desc: "Open-weight models for self-hosting, fine-tuning and privacy-sensitive workloads." },
  { id: "mistral", layer: "models", y: 438, name: "Mistral", logo: mistral, color: "#FA520F",
    role: "Mistral AI", desc: "Fast, efficient open and hosted models, great for low-latency routing and extraction." },
  { id: "deepseek", layer: "models", y: 530, name: "DeepSeek", logo: deepseek, color: "#4D6BFE",
    role: "Open reasoning models", desc: "Cost-efficient reasoning and coding models with open weights." },

  // Frameworks
  { id: "langchain", layer: "frameworks", y: 100, name: "LangChain", logo: langchain, color: "#3fb39a",
    role: "LLM framework", desc: "Chains, tools, retrieval (RAG) and memory: the building blocks for LLM apps." },
  { id: "crewai", layer: "frameworks", y: 200, name: "CrewAI", logo: crewai, color: "#FF5A50",
    role: "Multi-agent", desc: "Teams of role-based agents (researcher, writer, reviewer) that collaborate on a task." },
  { id: "agents", layer: "frameworks", y: 300, name: "AI Agents", icon: "agents", color: "#915EFF",
    role: "Autonomous loops", desc: "Plan → act → observe loops with tool calling, memory and guardrails." },
  { id: "langflow", layer: "frameworks", y: 400, name: "Langflow", logo: langflow, color: "#B57BFF",
    role: "Visual builder", desc: "Drag-and-drop flows for RAG pipelines and agents, exportable as APIs.",
    usedIn: ["MargAI", "KhetiBuddy"] },
  { id: "huggingface", layer: "frameworks", y: 500, name: "Hugging Face", logo: huggingface, color: "#FFD21E",
    role: "Model hub", desc: "Open models, datasets and pipelines for vision, NLP and fine-tuning.",
    usedIn: ["KhetiBuddy"] },

  // Automation
  { id: "n8n", layer: "automation", y: 230, name: "n8n", logo: n8n, color: "#EA4B71",
    role: "Workflow automation", desc: "Connects agents to 400+ apps: Slack, Gmail, Sheets, CRMs. Triggers, branches and retries included." },
  { id: "fastapi", layer: "automation", y: 370, name: "FastAPI", logo: fastapi, color: "#009688",
    role: "API layer", desc: "Typed, async Python APIs that expose models and agents to apps.",
    usedIn: ["MargAI"] },

  // Output
  { id: "outcome", layer: "output", y: 300, name: "Answer / Action", icon: "outcome", color: "#38ef7d",
    role: "Result", desc: "A grounded answer, a generated asset, or a real action taken in another system." },

  // Observability (sits under the main flow)
  { id: "langfuse", layer: "observe", x: 622, y: 560, name: "Langfuse", logo: langfuse, color: "#E11D48",
    role: "LLM observability", desc: "Traces every prompt, tool call, latency and token cost, plus evals and prompt versioning." },
];

const byLayer = (l) => nodes.filter((n) => n.layer === l).map((n) => n.id);

// Edges: [from, to, kind]
export const edges = [
  ...byLayer("trigger").flatMap((a) => byLayer("models").map((b) => [a, b, "flow"])),
  ...byLayer("models").flatMap((a) => byLayer("frameworks").map((b) => [a, b, "flow"])),
  ...byLayer("frameworks").flatMap((a) => byLayer("automation").map((b) => [a, b, "flow"])),
  ...byLayer("automation").map((a) => [a, "outcome", "flow"]),
  ["langchain", "langfuse", "trace"],
  ["agents", "langfuse", "trace"],
  ["crewai", "langfuse", "trace"],
  ["n8n", "langfuse", "trace"],
  ["fastapi", "langfuse", "trace"],
];

// Scripted sample request for the "Run" button.
export const sampleRun = [
  { node: "prompt", log: 'prompt › "Summarise this week\'s GitHub activity and post it to Slack"' },
  { node: "claude", log: "claude › planning: needs repo data → summary → delivery" },
  { node: "langchain", log: "langchain › tool_call github.search(commits, since=7d)" },
  { node: "n8n", log: "n8n › slack.postMessage(#team-updates)" },
  { node: "outcome", log: "✓ done · summary delivered to Slack" },
  { node: "langfuse", log: "langfuse › trace saved · 4 spans · 1.8s · 2.3k tokens" },
];

// Tools used to build things (not runtime nodes).
export const builders = [
  { name: "Claude Code", logo: claudecode, desc: "Agentic coding in the terminal and IDE", color: "#D97757" },
  { name: "Google Antigravity", logo: antigravity, desc: "Agent-first development environment", color: "#4796E3" },
  { name: "Google Stitch", logo: google, desc: "AI UI design → front-end code", color: "#34A853" },
  { name: "Google Flow", logo: google, desc: "AI filmmaking with Veo", color: "#FBBC05" },
];
