# Design System Strategy: Atmospheric OLED Excellence

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Celestial Event."** 

We are moving away from the "flat app" paradigm toward a digital environment that feels deep, vast, and illuminated by internal energy. This is an OLED-first experience designed to leverage infinite contrast ratios. By utilizing a true black foundation (#000000), we eliminate the physical boundary between the screen hardware and the interface. 

The aesthetic is characterized by **Luminous Intent**: light is never accidental. It is used to guide the eye, signify importance, and breathe life into a professional, futuristic editorial layout. We reject rigid, boxed-in grids in favor of overlapping layers, ethereal "aura" gradients, and sharp, glass-like precision.

## 2. Colors & Luminous Surfaces
The palette is rooted in the "Abyssal Purple" spectrum, designed to make the vibrant accents feel like light sources in a dark room.

### The Palette
*   **Background (OLED Black):** `#000000` — The absolute foundation.
*   **Atmospheric Base:** `#05010a` — Used for subtle background shifts.
*   **Primary Accent (The Flare):** `#cb97ff` / `#8f4bd3` — High-energy interactive elements.
*   **Secondary Accent (The Glow):** `#b386df` — Supporting light sources.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for defining sections. Structure must be achieved through:
*   **Tonal Transitions:** Moving from `surface` (#0e0e0e) to `surface-container-low` (#131313) to create implied containment.
*   **Light Bleed:** Using a soft radial gradient of `primary` at 5% opacity to "spotlight" a specific content area.

### The Glass & Gradient Rule
To achieve "Visual Soul," main CTAs and hero backgrounds should utilize a transition from `primary` (#cb97ff) to `primary-container` (#c185ff). Floating panels must use **Glassmorphism**: 
*   **Fill:** `surface-container` at 40-60% opacity.
*   **Backdrop Blur:** 12px to 20px.
*   **Inner Glow:** A 1px inside stroke of `on-surface` at 10% opacity to catch the "rim light."

## 3. Typography: Editorial Authority
We use **Space Grotesk** not just as a font, but as a structural element. 

*   **Display & Headline Scale:** These are the "heroes." Use `display-lg` (3.5rem) with tight tracking (-2%) and high contrast against the black background. Headlines should feel architectural.
*   **Body & Labels:** Prioritize legibility. `body-md` (0.875rem) provides a sophisticated, technical feel.
*   **Contrast as Hierarchy:** Instead of varying font weights excessively, use color contrast. Pair `on-surface` (pure white) for headings with `on-surface-variant` (#ababab) for body text to create a natural receding effect.

## 4. Elevation & Depth: Tonal Layering
In this system, "Up" means "Brighter." We do not use traditional drop shadows to indicate height; we use light.

*   **The Layering Principle:** Place a `surface-container-highest` (#262626) card on a `surface` (#0e0e0e) background. The shift in value provides all the "lift" required.
*   **Ambient Shadows:** If a floating component (like a modal) requires a shadow, it must be a **Tinted Glow**. Use a blur of 40px-60px with a color derived from `primary` at 8% opacity. This mimics how a neon light casts a glow on a black surface.
*   **The "Ghost Border" Fallback:** For interactive states or accessibility, use a 1px border with `outline-variant` (#484848) at 20% opacity. It should be felt, not seen.

## 5. Component Guidelines

### Buttons (The Light Sources)
*   **Primary:** Solid `primary` fill. No border. Text is `on-primary-fixed` (#000000) for maximum punch.
*   **Secondary:** Glassmorphic fill with a "Ghost Border."
*   **Tertiary:** Ghost text with a subtle underline or `primary` icon.

### Cards & Containers
*   **Strict Rule:** No divider lines. Use `surface-container` tiers and 1.5x standard vertical whitespace to separate thoughts.
*   **The "Aura" Card:** For featured content, implement a subtle, animated radial gradient behind the card that moves slowly, creating a "breathing" light effect.

### Input Fields
*   **Style:** Minimalist. Only a bottom border using `outline-variant` at 30%. On focus, the border glows with the `primary` color and a subtle 2px outer bloom.

### Additional Signature Component: The "Atmospheric Orb"
Large, blurred vector shapes (150px-400px) in `secondary_container` (#5c3285) placed at 10% opacity in the background. These should slowly drift or pulse to make the UI feel "alive."

## 6. Do's and Don'ts

| Do | Don't |
| :--- | :--- |
| **Do** use true black (#000000) for the main canvas to save power and increase pop. | **Don't** use "Dark Grey" (#121212) as a primary background; it flattens the OLED effect. |
| **Do** use Space Grotesk in a high-contrast, editorial layout with wide margins. | **Don't** crowd the interface. This system requires "void space" to feel premium. |
| **Do** use subtle backdrop blurs on any floating navigation or panel. | **Don't** use 100% opaque solid borders to separate sections. |
| **Do** treat light as a functional tool to guide the user to a CTA. | **Don't** add glows to every element; if everything glows, nothing is important. |
| **Do** use sharp 4px to 12px corner radii for a futuristic, precision-milled look. | **Don't** use overly rounded (pill-shaped) cards which can feel "bubbly" and consumer-grade. |