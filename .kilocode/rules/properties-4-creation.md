# AI Coding Agent Guidelines - Properties 4 Creations

This document establishes the strict coding standards, design system tokens, and architectural patterns for the **Properties 4 Creations** website. All AI agents and developers must adhere to these rules to maintain consistency.

## 1. Tech Stack & Architecture
* **Core:** Static HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES Modules).
* **Build Tool:** Vite (configured but primary styles are currently vanilla CSS).
* **Tailwind Policy:** **DEPRECATED/RESTRICTED.** Do not use Tailwind utility classes (e.g., `text-xl`, `p-4`) in HTML unless explicitly instructed. All styling must be done via `css/style.css` using the established custom CSS classes.
* **Mobile-First:** Write CSS media queries using `min-width` to layer complexity on top of the mobile layout.

## 2. Design System Tokens (STRICT ENFORCEMENT)
**Do not hardcode hex values or pixel sizes.** You must use the defined CSS variables found in `:root`.

### Colors
* **Primary Navy:** `var(--color-primary-navy)` (Text, Footer, Headers)
* **Primary Gold:** `var(--color-primary-gold)` (Buttons, Links, Accents)
* **Backgrounds:** `var(--color-neutral-white)` or `var(--color-neutral-gray-50)`
* **Semantic:** `var(--color-semantic-success)`, `var(--color-semantic-error)`

### Spacing (8px Grid)
* Use `var(--spacing-1)` through `var(--spacing-16)`.
* *Example:* Instead of `margin-bottom: 20px;`, use `margin-bottom: var(--spacing-6);` (24px) or `var(--spacing-4);` (16px).

### Typography
* **Headings:** `font-family: var(--font-heading)` (Merriweather)
* **Body:** `font-family: var(--font-body)` (System Sans-Serif)
* **Classes:** Use helper classes `.h1`, `.h2`, `.h3`, `.text-small` if semantic tags cannot be used.

## 3. CSS Architecture & Component Patterns

### Class Naming
* Use descriptive, hyphenated class names (BEM-lite).
* *Good:* `.property-card`, `.property-details`, `.btn-primary`
* *Bad:* `.box`, `.gold-text`, `.wrapper`

### Key Components (Reuse These!)
1.  **Buttons:**
    * Primary: `<a href="..." class="btn btn-primary">`
    * Secondary: `<a href="..." class="btn btn-secondary">`
2.  **Cards:**
    * Standard: `.resource-card` or `.property-card`
    * *Note:* Cards should usually reside inside a grid container (e.g., `.resources-grid`).
3.  **Hero Sections:**
    * Base class: `.hero`
    * Modifier: `.hero-home`, `.hero-resources`, `.hero-contact` (controls background image).
4.  **Header:**
    * Use `.header-glass` for the sticky, translucent navigation bar.
    * **Crucial:** Ensure `padding-top: 80px` is applied to `<main>` or `<body>` to prevent content overlap.

### Layout Modifiers
* **List Views:** When transforming a grid into a list (e.g., Housing Authorities), add the `.list-view` class to the parent grid container.
    * *Requirement:* Ensure `.list-view` containers have `margin: 0 auto` to center them.

## 4. Accessibility (A11y) Standards
* **Images:** All `<img>` tags MUST have a descriptive `alt` attribute.
* **Interactive Elements:** Buttons and links must have clear labels or `aria-label` attributes if using icons.
* **Forms:** All inputs must have associated `<label>` elements.
* **Contrast:** Ensure text color contrasts sufficiently with background images (use `.hero::before` overlay for text on images).

## 5. File Structure
* **HTML:** Root directory (e.g., `index.html`, `about/index.html`).
* **CSS:** `css/style.css` (Single source of truth).
* **Images:** `images/` (Organized by category: `banners`, `properties`, `icons`).
* **JS:** `js/` (Feature-specific modules like `mobile-menu.js`, `theme-toggle.js`).

## 6. Common Pitfalls to Avoid
1.  **Do not** create new "Utility Classes" like `.margin-top-10`. Add the styling to the semantic component class.
2.  **Do not** forget the "Call to Action" styles. Use `.cta-section`, `.cta-content`, and `.cta-buttons` for bottom-of-page prompts.
3.  **Do not** mix Tailwind classes with Custom CSS in the same element.

## 7. Example Workflow
**User Request:** "Add a section for 'Emergency Contacts' that looks like the Housing Authority list."

**Agent Action:**
1.  Create HTML using `<section>` and `.container`.
2.  Use `<h2 class="h2">`.
3.  Create a wrapper `<div class="resources-grid list-view">`.
4.  Add items using `.resource-card`.
5.  **NO new CSS is needed** because these classes already exist in the Design System.