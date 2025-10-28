# Design Guidelines: Empathy Health Clinic Website

## Design Approach

**Selected Approach:** Hybrid - Modern Healthcare Reference with Design System Foundation

Drawing inspiration from leading mental health and healthcare platforms (Headway, Talkspace, One Medical) while maintaining the professional credibility required for a psychiatric clinic. The design balances warmth and approachability with clinical trustworthiness.

**Core Principles:**
- Trust through clarity: Clear hierarchy, readable typography, generous whitespace
- Warmth without compromise: Professional yet approachable aesthetic
- Accessibility first: WCAG AA compliant throughout, especially for mental health audience
- Conversion-focused: Clear pathways to appointment booking

## Typography System

**Font Family:**
- Universal: Inter (Google Fonts) - modern, highly readable sans-serif for all text throughout the site
- Variable font with weights 400-700 for optimal performance
- System font fallbacks: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Type Scale:**
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-sans, font-bold
- Section Headings: text-3xl md:text-4xl lg:text-5xl, font-sans, font-bold
- Subsection Headings: text-2xl md:text-3xl, font-sans, font-bold
- Card Titles: text-xl md:text-2xl, font-sans, font-semibold
- Body Large: text-lg md:text-xl, font-sans, leading-relaxed
- Body Regular: text-base md:text-lg, font-sans, leading-relaxed
- Body Small: text-sm md:text-base, font-sans
- Labels/Meta: text-xs md:text-sm, font-sans, font-medium, uppercase tracking-wide

## Layout System

**Spacing Primitives:** Consistently use Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32

**Container Strategy:**
- Full-width sections: w-full with inner max-w-7xl mx-auto px-6 lg:px-8
- Content sections: max-w-6xl mx-auto
- Text-heavy content: max-w-4xl mx-auto
- Narrow content (forms, CTAs): max-w-2xl mx-auto

**Vertical Rhythm:**
- Section spacing: py-16 md:py-24 lg:py-32
- Component spacing: space-y-12 md:space-y-16
- Card/Element spacing: space-y-6 md:space-y-8

**Grid Patterns:**
- Services/Treatments: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Team Members: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12
- Insurance Logos: grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8
- Testimonials: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8

## Page Structure

### Header/Navigation
- Sticky header with backdrop blur: sticky top-0 backdrop-blur-md
- Logo left, navigation center, CTA button right on desktop
- Mobile: hamburger menu with full-screen overlay
- Navigation links: text-base font-medium with subtle underline animation
- Primary CTA: "Request Appointment" button with phone number as secondary option
- Height: h-20 md:h-24

### Hero Section
- Height: min-h-[600px] md:min-h-[700px] lg:min-h-[800px] (not forced to viewport)
- Large background image with subtle overlay for text readability
- Content: max-w-4xl with generous padding (px-6 lg:px-8)
- Headline + supporting text + dual CTAs (primary: Request Appointment, secondary: Call Now)
- Social proof indicator below CTAs: "★★★★★ Excellent - Based on 65 reviews" with Google icon
- Buttons over image use backdrop-blur-sm with semi-transparent backgrounds

### Insurance Section
- Dedicated section showcasing accepted insurance providers
- Grid of insurance logos with subtle hover lift effect
- Heading: "Accepted Insurance Providers"
- Logo containers: aspect-square with p-6, centered content
- "View All Providers" link at bottom

### Services/Treatments Section
- Three-column grid on desktop, single column mobile
- Each service card:
  - Icon/graphic at top (medical/mental health related)
  - Treatment name as h3
  - Brief description (2-3 sentences)
  - "Learn More" link
- Cards with subtle border, rounded-2xl, p-8
- Hover effect: slight scale and shadow increase

### Team Members Section
- Four-column grid on desktop, two on tablet, one on mobile
- Each team member card:
  - Professional headshot (aspect-square, rounded-lg)
  - Name (text-xl font-semibold)
  - Credentials/title (text-sm)
  - Brief bio or specialization (optional expansion)
- Consistent image treatment across all team photos

### Testimonials Section
- Three-column masonry-style layout
- Each testimonial card:
  - Star rating at top
  - Quote text (text-lg, leading-relaxed)
  - Patient name and date
  - Google verification badge
  - Cards: rounded-xl, p-6 md:p-8
- "Trusted by 100+ patients" heading
- Subtle rotation/stagger for visual interest (every third card)

### Approach/Process Section
- Two-column layout: image left, content right on desktop
- Step-by-step breakdown with numbered elements
- Each step: number badge + heading + description
- Supporting imagery showing clinic environment or therapeutic setting
- Warm, welcoming photography

### Footer
- Three-column layout on desktop: Contact Info | Quick Links | Newsletter
- Contact section:
  - Clinic name and tagline
  - Phone number (large, clickable)
  - Email address
  - Physical address
  - Office hours
- Quick Links:
  - Services
  - Insurance
  - Our Team
  - Resources
  - Privacy Policy
- Newsletter signup:
  - Heading: "Stay Connected"
  - Email input + Subscribe button
  - Brief value proposition
- Bottom bar: Copyright, social media icons, accessibility statement
- Footer padding: py-16 md:py-20

## Component Library

### Buttons
**Primary CTA:**
- px-8 py-4, text-base md:text-lg, font-semibold, rounded-full
- Implement own hover/active states (subtle scale, opacity change)
- When over images: backdrop-blur-md with semi-transparent background

**Secondary:**
- px-6 py-3, text-base, font-medium, rounded-full
- Border style with transparent background
- Hover: filled state transition

**Text Link:**
- Inline with subtle underline on hover
- Arrow icon on treatment "Learn More" links

### Cards
**Service/Treatment Cards:**
- rounded-2xl, border, p-8
- Hover: scale-[1.02] transition-transform
- Icon/graphic top, content below, link at bottom

**Team Member Cards:**
- Image: aspect-square, rounded-lg, object-cover
- Text content: text-center, space-y-2
- Background: subtle on hover

**Testimonial Cards:**
- rounded-xl, p-6 md:p-8
- Border or subtle background
- Quote marks or star rating prominent

### Forms
**Appointment Request Form:**
- Two-column layout on desktop for efficiency
- Fields: Name, Email, Phone, Insurance Provider, Preferred Date, Message
- Label above input, text-sm font-medium
- Inputs: rounded-lg, border, px-4 py-3
- Focus states: ring treatment for accessibility
- Submit button: full-width on mobile, auto-width on desktop

**Newsletter Signup:**
- Email input + button in horizontal layout
- Input: flex-1, rounded-l-lg
- Button: rounded-r-lg, no gap between

### Insurance Logo Grid
- Consistent aspect ratios: aspect-square or aspect-video
- Centered logos with p-6
- Subtle background with border or shadow
- Grayscale default, color on hover for polish

### Review/Rating Display
- Star icons from Font Awesome via CDN
- Rating number + review count
- Platform logo (Google) as trust indicator
- Inline with hero CTA area and dedicated testimonial section

### Navigation
**Desktop:**
- Horizontal menu, evenly spaced
- Dropdown for Services (if multiple treatment types)
- Smooth scroll to sections for single-page experience

**Mobile:**
- Hamburger icon: three lines, animated to X on open
- Full-screen overlay menu
- Large touch targets (min h-12)
- Slide-in animation from right

## Images

**Hero Background:**
- Large, high-quality image: peaceful, professional clinical setting or abstract calming imagery (soft focus, warm tones)
- Subtle gradient overlay from bottom for text readability
- Position: center, cover
- Placement: Full-width background of hero section

**Team Member Photos:**
- Professional headshots on neutral/branded background
- Consistent lighting and style across all photos
- Aspect ratio: square (1:1)
- Placement: Top of each team member card
- Treatment: rounded corners (rounded-lg), subtle border or shadow

**Approach Section Image:**
- Warm, inviting photo of therapy session, waiting area, or clinical environment
- Shows human connection and professionalism
- Aspect ratio: 4:3 or 16:9
- Placement: Left side of two-column layout on desktop, above content on mobile
- Treatment: rounded-xl

**Supporting Section Images (optional):**
- Abstract, calming imagery between sections for visual breaks
- Nature scenes, gentle patterns, or therapeutic environments
- Subtle, don't compete with content

**Insurance Logos:**
- Official provider logos (SVG or high-res PNG)
- Consistent sizing within grid
- Placement: Insurance section grid

**Large Hero Image:** Yes - full-width background image in hero section with text overlay

## Animations

**Minimal and Purposeful:**
- Page load: subtle fade-in for hero content (0.6s ease-out)
- Scroll: intersection observer for section fade-ins (testimonials, team)
- Hover: scale transforms on cards (scale-[1.02], 200ms)
- Navigation: smooth scroll behavior for anchor links
- Mobile menu: slide-in transition (300ms ease-out)

**Avoid:**
- Parallax effects
- Complex scroll-triggered animations
- Auto-playing carousels
- Excessive motion that could trigger anxiety (important for mental health audience)

## Accessibility Standards

- Maintain minimum 4.5:1 contrast ratios for all text
- All interactive elements minimum 44x44px touch target
- Focus indicators visible on all interactive elements with ring utilities
- Semantic HTML throughout (nav, main, section, article, footer)
- ARIA labels for icon-only buttons
- Alt text for all images
- Skip to main content link
- Form labels properly associated with inputs
- Error messages clearly associated with form fields
- Keyboard navigation fully supported throughout site