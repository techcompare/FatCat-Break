package com.genui.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

/**
 * The core contract between the LLM (like Claude) and Native Jetpack Compose.
 * When you prompt Claude, it must return a JSON structure matching this tree.
 * The "type" defines WHICH compose component to render.
 */
@Serializable
data class UiNode(
    val type: String, // e.g., "MainScreen", "DashboardCard", "HeadlineText", "PremiumButton"
    val props: Map<String, String>? = null, // e.g., {"text": "Hello World", "color": "#FFC107", "action": "LOGIN"}
    val children: List<UiNode>? = null // Allows Claude to build deeply nested UI structures!
)

/**
 * An extension for extracting typed properties out of the dynamic map
 */
fun UiNode.prop(key: String, default: String = ""): String {
    return this.props?.get(key) ?: default
}

fun UiNode.propInt(key: String, default: Int = 0): Int {
    return this.props?.get(key)?.toIntOrNull() ?: default
}

fun UiNode.propBool(key: String, default: Boolean = false): Boolean {
    return this.props?.get(key)?.toBooleanStrictOrNull() ?: default
}
