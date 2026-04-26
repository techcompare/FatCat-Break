package com.genui.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.genui.model.UiNode
import com.genui.model.prop

/**
 * The massive "when" statement that translates Claude's generated UI Node Tree
 * into Native Jetpack Compose elements.
 */
@Composable
fun GenerativeRenderer(
    node: UiNode,
    modifier: Modifier = Modifier,
    onAction: (String, Map<String, String>) -> Unit = { _, _ -> }
) {
    // You map the "type" defined by the LLM strictly to your own pre-built, premium Compose modifiers and UI functions
    when (node.type) {
        
        "ScreenOutliner" -> {
            // A wrapper for full screens
            Column(
                modifier = modifier
                    .fillMaxSize()
                    .background(Color(0xFF121212))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Recursively render children!
                node.children?.forEach { childNode ->
                    GenerativeRenderer(childNode, onAction = onAction)
                }
            }
        }
        
        "RowItem" -> {
            Row(
                modifier = modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                node.children?.forEach { childNode ->
                    GenerativeRenderer(childNode, onAction = onAction)
                }
            }
        }
        
        "GlassCard" -> {
            // Because you are a premium UI expert, this is where you drop in your Glassmorphic custom components
            // For now, this is a placeholder generic Card that feels slightly elevated.
            val bgColorHex = node.prop("color", "#1E1E24")
            val parsedColor = try { Color(android.graphics.Color.parseColor(bgColorHex)) } catch (e: Exception) { Color.DarkGray }
            val actionId = node.prop("actionId", "")
            
            Surface(
                modifier = modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .clickable(enabled = actionId.isNotEmpty()) {
                        onAction(actionId, node.props ?: emptyMap())
                    },
                color = parsedColor,
                shadowElevation = 8.dp
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    node.children?.forEach { childNode ->
                        GenerativeRenderer(childNode, onAction = onAction)
                    }
                }
            }
        }

        "HeadlineText" -> {
            val textValue = node.prop("text", "Default Header")
            Text(
                text = textValue,
                color = Color.White,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = (-0.5).sp
            )
        }

        "BodyText" -> {
            val textValue = node.prop("text", "Default Text")
            Text(
                text = textValue,
                color = Color.White.copy(alpha = 0.7f),
                fontSize = 15.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 22.sp
            )
        }
        
        "PrimaryCTA" -> {
            val label = node.prop("label", "Click Me")
            val actionId = node.prop("actionId")
            
            Button(
                onClick = { onAction(actionId, node.props ?: emptyMap()) },
                modifier = modifier.fillMaxWidth().height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF6B4EE6))
            ) {
                Text(text = label, fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
            }
        }

        else -> {
            // Graceful fallback for components Claude hallucinates and you don't support
            Text(
                text = "Unsupported GenUI Component: ${node.type}",
                color = Color.Red,
                modifier = Modifier.padding(8.dp)
            )
        }
    }
}
