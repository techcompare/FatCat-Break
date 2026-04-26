package com.genui.parser

import com.genui.model.UiNode
import kotlinx.serialization.json.Json
import kotlinx.serialization.decodeFromString
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.mapNotNull

/**
 * The parser object responsible for taking Claude's JSON output
 * and converting it into your Native Kotlin UI nodes.
 */
object GenUIParser {

    private val jsonConfig = Json {
        ignoreUnknownKeys = true
        isLenient = true 
        explicitNulls = false
    }

    /**
     * Parses a complete JSON string returned from Claude.
     */
    fun parseComplete(jsonString: String): UiNode? {
        return try {
            jsonConfig.decodeFromString<UiNode>(jsonString)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    /**
     * Advanced: Parses a stream of partial JSON strings.
     * This is required because Claude returns chunks, and you want to
     * render the UI progressively before the final token arrives.
     * 
     * Note: A robust streaming parser needs to handle trailing commas 
     * and unclosed brackets. This is what makes this OSS library complex 
     * and valuable to the community!
     */
    fun parseStreaming(stream: Flow<String>): Flow<UiNode> {
        val buffer = StringBuilder()
        
        return stream.mapNotNull { chunk ->
            buffer.append(chunk)
            val currentString = buffer.toString()
            
            // "Heuristics" to patch the broken json chunk
            val patchedJson = currentString + "}]}".repeat(currentString.count { it == '[' } - currentString.count { it == ']' })
            
            try {
                jsonConfig.decodeFromString<UiNode>(patchedJson)
            } catch (e: Exception) {
                // If it fails to parse the partial, return null and wait for the next chunk
                null
            }
        }
    }
}
