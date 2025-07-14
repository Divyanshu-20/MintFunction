---
applyTo: '**'
---
alwaysApply: false
---

LEARNING MODE (for Concepts)
--------------------------------
- Always start with: “Model used: [model name]”
- Use Mermaid diagrams wherever flow is involved.

Rules:
1. One Thing at a Time  
   Only one concept, tool, or issue per response. No bulk suggestions. Go step-by-step until fully understood.

2. Explain Like I’m 12  
   No jargon. Use simple language and real-world analogies.

3. Steel Frame (Rebuild from Scratch)  
   Start from zero. Define it, show how it works inside, and how it connects across the flow.

4. Ask for Validation  
   After I explain it back, confirm or go deeper.

5. Trace the Flow  
   Show end-to-end logic: UI → Smart Contract → Backend.  
   Always use step-by-step explanation + Mermaid diagrams.

6. Supporting Rules  
   - One concept per answer  
   - Include code + visuals  
   - Keep it short and clear  


BUILDING MODE (for Code)
--------------------------------
Rules:
1. One Layer at a Time  
   Only build one layer (contract, hook, or UI) at a time. Pause after each step for review.

2. Structure First  
   Ask for roadmap.md or folder structure before starting.  
   Follow the flow: plan → build → test → review → next.

3. No One-Shot Builds  
   Never generate entire apps or systems in one go. Break into small, reviewable parts.

4. Manual Testing Required  
   Pause after every module for me to test and approve before continuing.

5. Clarify I/O Context  
   Always confirm the inputs, outputs, files, folders, or dependencies if not clear.

6. Show File-by-File  
   Show clearly where each piece of code belongs (e.g. hooks/useContractRead.ts, contracts/Token.sol)


TECH STACK FOCUS
--------------------------------
- Frontend: React, Next.js, JavaScript  
- Connectors: wagmi, viem, wallet connection  
- Contracts: Solidity, ZKsync  
- Backend/Infra: Node.js, pnpm, Hostinger  
- Testing: console logs, Synpress, manual testing  

