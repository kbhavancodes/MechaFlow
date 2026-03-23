<div align="center">
  <img width="300" alt="mechaflow-stacked-final" src="https://github.com/user-attachments/assets/24fea191-5e15-41d8-a88d-0cf85748a227" />
</div>


<div align="center">

![Claude](https://img.shields.io/badge/Claude-grey) &nbsp; ![Web App](https://img.shields.io/badge/Web%20App-grey) &nbsp; ![MIT](https://img.shields.io/badge/MIT-grey)

</div>


<div align="center">
An AI-powered web app with multiple agentic workflows that accelerates
the mechanical engineering design process from problem to finished product
</div>

## Demo
&nbsp;&nbsp;&nbsp; | video coming soon...

## Overview

| The Problem | The Solution |
|---|---|
| Engineers spend hours on research, material selection, and documentation — not actual engineering. | A 4-agent AI pipeline that takes you from raw problem statement to a finished report in minutes. |


## Meet The Agents
<h3><span style="color:#ED4F00">🟠 Spark</span> — Idea Generation</h3>
You describe the problem. Spark returns a set of distinct solution concepts — from established approaches to unconventional ones.
It doesn't choose for you. It makes sure you're not missing anything before you do.
Output: Written concept descriptions. Precise enough to sketch or take straight to CAD.

<h3><span style="color:#0046B6">🔵  Blueprint</span> — Research & Mapping</h3>
Blueprint maps the problem space before you commit to a direction. Relevant standards, constraints, prior art, feasibility of proposed solutions.
Gaps and uncertainties are flagged — not assumed away.
Output: Problem analysis, feasibility ratings, and open questions to resolve before proceeding.

<h3><span style="color:#AD0000">🔴  Forge</span> — Materials & Manufacturing</h3>
Takes a solution concept and works out what it's actually made of and how it gets built. Materials, processes, tolerances — calibrated to whether you're prototyping or going to production.
Output: Ranked material options, process recommendations, tolerances, and failure modes to watch for.

<h3><span style="color:#13601B">🟢  Rivet</span> — Report Writing</h3>
Pulls from everything — the problem, Spark's ideas, Blueprint's research, Forge's recommendations — and writes the engineering report.
Output: Structured report with executive summary, technical analysis, materials section, recommendations, and open items.


```mermaid
flowchart LR
    A([🧑 Engineer\nProblem Statement]) --> B

    subgraph Pipeline
        B[🟠 Spark\nIdea Generation]
        C[🔵 Blueprint\nResearch & Mapping]
        D[🔴 Forge\nMaterials & Manufacturing]
        E[🟢 Rivet\nReport Writing]
        B --> C --> D --> E
    end

    E --> F([📄 Engineering\nReport])
```






## Design Process

Mockup - designed in Framer

<img width="623" height="437" alt="Screenshot 2026-03-23 184453" src="https://github.com/user-attachments/assets/88972220-f067-4460-bedf-16c83f4f7d02" />

Final build - 

&nbsp; | Coming soon...

## Tech Stack

| Layer | Technology |
|---|---|
Frontend | React + Vite
Styling | Tailwind CSS
AI | Anthropic Claude API
Deployment | Vercel

