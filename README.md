<div align="center">
Show Image
An AI-powered web app with multiple agentic workflows that accelerates the mechanical engineering design process from problem to finished product
Show Image Show Image Show Image Show Image
Live Demo · Report a Bug · Request a Feature
</div>

The Problem
Mechanical engineers spend enormous amounts of time on the early stages of product development — researching solutions, selecting materials, validating feasibility, and writing reports. Most of that time isn't spent engineering — it's spent searching, cross-referencing, and documenting.
The Solution
MechaFlow is a multi-agent AI web app that guides engineers through the full design workflow — from raw problem statement to a finished engineering report — using a pipeline of four specialised AI agents, each owning a specific stage of the process.

Pipeline
Show Image

Agents
Show Image
AgentRoleDescriptionShow ImageIdea generationTurn a raw problem into a set of viable concepts. Spark explores the solution space so you don't start from a blank page.Show ImageResearch & feasibilityDeep dive into your chosen direction. Blueprint researches existing solutions, maps out constraints, and defines your engineering approach.Show ImageMaterial & manufacturingPick the right material and figure out how to make it. Forge recommends materials, manufacturing processes, and where to source them.Show ImageReport writingLock it all together. Rivet compiles everything into a clean, structured engineering report ready to share or act on.

How Context Chaining Works
Each agent receives the full output of all previous agents — so by the time Rivet writes the report, it has the complete picture.
Show Image

System Architecture
Show Image

User Flow
Show Image

Examples
Spark — idea generation
Show Image
Blueprint — research & feasibility
Show Image
Forge — material & manufacturing
Show Image
Rivet — engineering report
Show Image

Tech Stack
LayerTechnologyFrontendReact + ViteStylingTailwind CSSAIAnthropic Claude APIDeploymentVercel

Getting Started
Prerequisites

Node.js v18+
Anthropic API key

Installation
bashgit clone https://github.com/yourusername/mechaflow.git
cd mechaflow
npm install
Environment setup
Create a .env file in the root:
envVITE_ANTHROPIC_API_KEY=your_api_key_here
Run locally
bashnpm run dev
Open http://localhost:5173

Project Structure
mechaflow/
├── docs/                        # README assets
├── src/
│   ├── agents/
│   │   ├── spark.js             # Idea generation agent
│   │   ├── blueprint.js         # Research & feasibility agent
│   │   ├── forge.js             # Material & manufacturing agent
│   │   └── rivet.js             # Report writing agent
│   ├── components/
│   │   ├── AgentPanel.jsx
│   │   ├── ReportOutput.jsx
│   │   └── PipelineProgress.jsx
│   ├── utils/
│   │   └── contextChain.js      # Passes context between agents
│   └── App.jsx
├── .env
└── README.md

Inspiration

FutureHouse — multi-agent scientific research platform
GPT Researcher — agentic deep research pipeline
Vercel AI SDK — streaming AI responses in React


What I'd Build Next

 Upload sketches or CAD screenshots as context
 Export report as PDF
 Save and revisit past projects
 User-defined constraints panel (budget, manufacturing method, industry)
 Integrate live materials database


Author
Built by [Your Name] — exploring how agentic AI workflows can accelerate mechanical engineering product development.
