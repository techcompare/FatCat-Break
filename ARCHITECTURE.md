# 🏛️ Compose GenUI Architecture

This document explains how data flows from an AI prompt to a native Jetpack Compose UI.

## The Flowchart

```mermaid
sequenceDiagram
    participant User
    participant LLM as Claude/LLM API
    participant Parser as GenUIParser
    participant Node as UiNode (Memory)
    participant UI as GenerativeRenderer (Compose)

    User->>LLM: "Create a modern dashboard..."
    Note right of LLM: Streaming JSON response
    LLM-->>Parser: {"type": "Column", ...}
    Parser->>Node: Parses chunk into Kotlin Data Class
    Node->>UI: Tree state updates
    UI-->>User: Renders Native Android UI
```

## The Three Pillars

1. **The Schema (`UiNode.kt`)**: The strict contract between the AI and the App.
2. **The Parser (`GenUIParser.kt`)**: The engine that safely converts streaming JSON into Kotlin objects.
3. **The Renderer (`GenerativeRenderer.kt`)**: The recursive Jetpack Compose function that draws the nodes on the screen.
