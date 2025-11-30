# Athletic Spirit AI Chatbot - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from ChatGPT's clean conversational interface combined with Linear's modern typography and Stripe's confident restraint. The athletic theme uses bold neon accents against dark backgrounds with glassmorphism effects for depth.

## Core Design Elements

### A. Typography
**Font Families**:
- Headings: 'Teko' (weights: 600, 700) - Bold, athletic, uppercase for impact
- Body: 'Inter' (weights: 400, 700) - Clean, readable for chat and content

**Hierarchy**:
- Hero Titles: 2.8-4.5rem, uppercase, letter-spacing 1px, neon text-shadow
- Section Headings: 1.8-2.5rem, uppercase, Teko font
- Chat Messages: 0.95rem, Inter font
- Labels/Tags: 0.78-0.9rem, uppercase, Teko font with letter-spacing

### B. Color System
**Primary Palette**:
- Background: #0a1a23 (deep dark blue)
- Text: #ffffff (white) with #c5e0ec (muted for secondary)
- Primary Accent: #00ff9d (neon green) - CTAs, highlights, success states
- Secondary Accent: #00e5ff (electric blue) - borders, cards, interactive elements

**Glassmorphism Cards**: rgba(8,26,35,.55) with blur(10px) backdrop and neon borders (rgba(0,229,255,.15))

### C. Layout System
**Spacing Units**: Tailwind scale - primary units are 2, 4, 8, 12, 16, 24 (p-2, h-8, m-4, py-12, gap-24)

**Containers**:
- Max-width sections: 1200-1400px centered
- Chat interface: 600-800px max-width for optimal reading
- Full-width with inner constraints for landing pages

### D. Component Library

**Navigation**:
- Fixed top navigation with glassmorphism backdrop
- Brand logo with animated neon dot indicator
- Transparent background with gradient fade
- Border: 1px solid rgba(0,229,255,.15)

**Chat Interface** (ChatGPT-like):
- Full-height conversational layout with fixed header/footer
- Message bubbles: Bot messages (left-aligned, electric blue tint), User messages (right-aligned, neon green tint)
- Rounded message containers (14px radius) with max-width 80%
- Input area: Fixed bottom with send button, quick action pills above
- Typing indicator: Animated dots with electric blue color
- Message timestamps and read receipts optional but subtle

**Cards & Panels**:
- Border-radius: 16-18px for all cards
- Borders: 1px solid rgba(0,229,255,.15) or rgba(0,255,157,.35)
- Box-shadow: Neon glow effects (0 0 0 1px + 0 15px 35px with color opacity)
- Hover states: translateY(-4px) with enhanced glow

**Buttons**:
- Primary: Gradient (neon green to electric blue), dark text, 999px radius for pills
- Ghost: rgba(255,255,255,.08) background with subtle border
- Hover: translateY(-1px to -2px) with transition 220ms
- Disabled: 50% opacity, no-pointer cursor

**Forms**:
- Input fields: Dark background rgba(0,0,0,.3), 1px border rgba(255,255,255,.2), 8-10px radius
- Labels: Small (0.8rem), muted color, uppercase for Teko labels
- Password strength indicator: Dynamic color from red to neon green
- Error messages: Red text (#ff4d4d), visible on validation failure

**Dashboard Components**:
- Profile card: Centered content with 120px circular avatar, neon border glow
- Stats grid: 2-4 columns, large numbers (2.2rem) in neon green, uppercase labels
- Activity feed: Timeline-style with tags, dates, and action badges
- Trophy case: Grid layout with icons and achievement dates

**Background Treatments**:
- YouTube video embed: Fixed full-screen with overlay (radial gradients + dark tint)
- Radial gradients: Multiple layers for depth (electric blue at 80%, neon green at 20%)
- Overlay opacity: 55-75% to maintain readability

### E. Animations
**Minimal & Purposeful**:
- Card hover: Transform translateY(-4px) only, 220ms ease
- Button interactions: Subtle scale(1.02) on hover, no complex animations
- Typing indicator: Gentle bounce animation for chat
- Page transitions: Simple fadeUp (0.9s) for hero content
- No scroll-triggered animations or parallax effects

## Page-Specific Guidelines

**Landing Page**:
- Hero: 80-100vh with video background, centered content, dual CTA buttons
- Feature strip: 3-column grid with glassmorphism cards positioned below hero (-60px margin)
- Testimonials/Gallery: Image tiles with gradient overlays, 280px min-height
- AI Coach section: Embedded chat demo or screenshot with feature highlights
- Footer: Simple, centered, minimal links

**Chat Interface**:
- Full-viewport height with header, scrollable message area, and fixed input footer
- Message grouping by sender with timestamps
- Quick action buttons: Pill-shaped, minimal, above input field
- Welcome message from bot on first load
- Smooth auto-scroll to latest message

**Dashboard**:
- Grid layout: Profile sidebar (300px) + main content area
- Responsive: Stack vertically on mobile (<1024px)
- Editable profile: Inline edit mode with save/cancel actions
- Chart integration: Canvas-based performance graphs with neon line colors
- Date display: Real-time clock in header

**Authentication Pages**:
- Centered form container (max-width 400px) over video background
- Social login buttons with brand colors (Google, GitHub)
- Password strength indicator for signup
- Forgot password: Two-step OTP flow with clear state transitions

## Images

**Hero Sections**: Use athletic/sports action imagery with high energy. Place overlays with radial gradients to ensure text readability. Images should be full-bleed with neon color grading (blue/green tints).

**Profile Avatars**: Circular with neon border glow effect (3px border, box-shadow).

**Dashboard Graphics**: Performance chart visualizations using canvas with neon green/electric blue line colors against dark background.

**Feature Illustrations**: Optional icon-based graphics or minimal line illustrations with neon accent colors - avoid photographic imagery in feature cards.

## Accessibility
- Maintain 4.5:1 contrast ratio for body text (white on dark background achieves this)
- Focus states: Neon green outline for keyboard navigation
- Alt text for all images and icons
- Semantic HTML structure for screen readers
- ARIA labels for chat messages and interactive elements