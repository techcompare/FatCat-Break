# Contributing to Compose GenUI

We love pull requests! If you'd like to help make Compose GenUI better, follow these steps:

## 1. Local Development
* Clone the repository.
* Open the project in Android Studio.
* Ensure you can build the `library` module.

## 2. Making Changes
* **UI Components**: If you want to add a new Jetpack Compose component, make sure to update both `UiNode.kt` (the schema) and `GenerativeRenderer.kt` (the rendering logic).
* **Parsing**: Changes to `GenUIParser.kt` should be robust against malformed or hallucinated JSON from LLMs.

## 3. Submitting a Pull Request
* Open a PR against the `main` branch.
* Describe your changes clearly.
* If your PR addresses an existing issue, link it!

Thanks for helping us build the future of Generative UI!
