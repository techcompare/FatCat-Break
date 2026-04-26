# Compose GenUI (Generative UI for Jetpack Compose)

🚀 **The missing Generative UI Engine for Android & Kotlin Multiplatform.**

`Compose GenUI` allows you to stream Server-Driven UI directly from LLMs (like Anthropic's Claude) and automatically render them as native, highly-animated Jetpack Compose components. 

No webviews. No sluggish HTML. Just clean, native Android UI built by AI in real-time.

## The Architecture

The library is broken down into three main pillars:
1. **The Schema (`UiNode.kt`)**: The strict Kotlin data classes that define the UI contract between Claude and your app.
2. **The Parser**: Takes the streaming JSON chunks from the Claude API and safely parses partial JSON into `UiNode` objects.
3. **The Renderer (`GenerativeRenderer.kt`)**: A recursive Jetpack Compose function that translates the `UiNode` tree into beautifully styled native Compose components.

## Example Flow

1. You prompt Claude: `"Create a modern dashboard for a fitness app showing 3 daily stats."`
2. Claude responds with a structured JSON UI tree.
3. `Compose GenUI` parses it on the fly and renders exactly what Claude built natively!

---

### Step 1: Provide this prompt to Claude
```text
You are a generous UI generator. You must output EXACTLY a valid JSON representation of a UI using the following structure.
Do not output markdown, only the raw JSON.

Schema:
{
  "type": "Column" | "Row" | "Card" | "Text" | "Button",
  "children": [ ... ],
  "props": {
    "text": "Hello", 
    "color": "#FFFFFF",
    "onClick": "action_id"
  }
}
```

### Step 2: Render it in your App
```kotlin
@Composable
fun MyScreen() {
    val aiResponseJson = ... // Streamed from Claude API
    val rootNode = GenUIParser.parse(aiResponseJson)
    
    GenerativeRenderer(node = rootNode)
}
```
