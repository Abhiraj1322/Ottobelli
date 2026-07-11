# Ottobelli — MERN Stack Development Plan

## 1. Tech Stack

- **Frontend:** React (Vite), React Router, Zustand or Redux Toolkit for state, Tailwind CSS for styling, Framer Motion + GSAP for the 3D/hover animations, Swiper.js for image sliders/carousels.
- **Backend:** Node.js + Express.
- **Database:** MongoDB (Atlas) with Mongoose ODM.
- **Auth:** JWT (access + refresh tokens) with httpOnly cookies; bcrypt for password hashing.
- **File/Image storage:** Cloudinary or AWS S3 for product images and user-uploaded reference photos.
- **Payments:** Stripe.
- **Search/Sort:** MongoDB indexes + query params for now; consider Algolia/Elasticsearch later if catalog grows.
- **Hosting:** Vercel/Netlify (frontend), Render/Railway/EC2 (backend), MongoDB Atlas (DB).

## 2. Information Architecture

Two top-level collections, each with its own landing page, navigation tree, and product flow:

- **Classics** (made-to-measure, customizable) → Suits & Blazers, Dress Shirts, Pants, Overcoats & Outerwear, Accessories
- **Everyday Wear** (off-the-rack, not customizable) → Shirts, Sweaters, Pants, Jackets, Accessories

Each top category has subcategories (level 2) as shown in your nav doc — these map directly to a `category` / `subcategory` field structure in the database rather than separate collections, so the same schema and components serve both sections, with an `isCustomizable` flag distinguishing Classics from Everyday Wear.

## 3. Database Schema (MongoDB / Mongoose)

**User**
- name, email, password (hashed), role (customer/admin)
- profiles: [ProfileId] (references Profile collection)
- favorites: [ProductId]
- cart: [{ productId, profileId, customizationId, quantity }]
- addresses, orders: [OrderId]

**Profile** (for measurements — supports multiple per user: self, child, etc.)
- userId
- displayName (e.g. "3163", "456465", or custom label)
- measurements: { neckCollar, chest, shoulderWidth, sleeve, torso, stomach, hip, bicep, wrist, waist, legs, crotch, thighs, knees }
- preferredFit, fabricsToAvoid: [String], specialInstructions, referencePhotos: [url]
- completionStatus (e.g. "0/14 filled")

**Category**
- name, slug, parentCategory (null for top-level), section ("classics" | "everyday"), order, image/banner

**Product**
- name, slug, section ("classics" | "everyday"), category, subcategory
- price, currency
- images: [url], badge ("Best Seller", "New Arrival", "Limited", "Classic")
- isCustomizable (Boolean)
- description, materials: [String]
- customizationOptions (only for classics): [{ groupName (e.g. "Jacket > Shoulder Type"), options: [{ label, image, description }] }]
- relatedProducts: [ProductId] ("customers also bought")
- ratings, priority (backend-controlled sort weight), stock, sku
- careInfo, returnPolicyText

**CustomizationSelection** (per cart item)
- userId, profileId, productId
- selections: { groupName: chosenOptionLabel, ... }
- createdAt

**Order**
- userId, items: [{ productId, profileId, customizationId, qty, price }]
- shippingAddress, paymentStatus, orderStatus, totals, timestamps

**Cart** (can be embedded in User or separate collection)
- userId, items: [{ productId, profileId, customizationSelectionId, quantity }]

## 4. API Endpoints (Express)

**Auth**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- GET /api/auth/me

**Profiles**
- GET /api/profiles (list user's profiles)
- POST /api/profiles
- PUT /api/profiles/:id
- DELETE /api/profiles/:id
- PUT /api/profiles/:id/measurements

**Categories**
- GET /api/categories?section=classics|everyday
- GET /api/categories/:slug

**Products**
- GET /api/products?section=&category=&subcategory=&sort=price_asc|price_desc|material|top_rated&page=&limit=
- GET /api/products/:slug
- GET /api/products/:id/related

**Favorites**
- GET /api/favorites
- POST /api/favorites/:productId
- DELETE /api/favorites/:productId

**Cart**
- GET /api/cart
- POST /api/cart (requires profileId; if product.isCustomizable, requires customizationSelectionId)
- PUT /api/cart/:itemId
- DELETE /api/cart/:itemId

**Customization**
- POST /api/customizations (save a configured selection, returns id used by cart)
- GET /api/customizations/:id

**Orders / Checkout**
- POST /api/checkout/create-payment-intent (Stripe)
- POST /api/orders
- GET /api/orders (user history)

**Admin** (protected, role=admin)
- CRUD for products, categories, customization options, priority/ordering

## 5. Frontend Page/Component Map

1. **LandingPage** — split-screen logo layout, top half (Classics) / bottom half (Everyday Wear), each clickable, hover/parallax 3D effect (Framer Motion + CSS transforms or a lightweight Three.js layer if true 3D is wanted).
2. **SectionLandingPage** (`/classics`, `/everyday-wear`) — hero copy block + horizontally scrollable subcategory cards (boxes 1–5), hover animation, click-transition animation, responsive scroll snapping (`overflow-x-auto` + `scroll-snap-type`).
3. **CategoryListingPage** (`/classics/suits-blazers`) — top nav (breadcrumb + quick category dropdowns), sort-by control (price, material, top rated), product grid with badges, favorite icon (auth-gated).
4. **ProductPage** (`/product/:slug`) — composed of:
   - `ProductNavBar` (thin black/white nav, breadcrumb, prev/next slider with progress dots, "1 of 42" counter)
   - `ProductImageGallery` (full-bleed image, auto-rotate every 5s, manual bullet/dot navigation)
   - `FloatingInfoPane` (frosted-glass overlay: name, price, Add to Cart button — visually distinct "Customizable" variant, description, materials, "Customers also bought" horizontal carousel of 3–4 items, returns/Fit Right Guarantee links)
5. **CustomizationModal** — overlay/drawer form triggered from Add to Cart on customizable items:
   - Accordion/collapsible sections per garment part (Jacket, Lapels, Buttons, etc.)
   - Image-based option selection (click swatch/image to choose, checkmark on selected)
   - "Save Customizations" sticky header button
6. **ProfileSelectorModal** — appears at Add to Cart; force-select which saved profile (self/child/etc.) the item is for.
7. **MeasurementsPage / ProfileDashboard** (`/account/profiles/:id/measurements`):
   - Left panel: list of profiles with fill progress ("0/14 filled")
   - Center: dynamic body diagram (swaps illustration based on Upper/Lower body toggle and selected measurement)
   - Right panel: measurement list with input fields, Prev/Next navigation, "Guide" video popup, Profile Details accordion (display name, preferred fit, fabrics to avoid, reference photo upload, special instructions)
8. **AccountPages** — login/register, order history, saved favorites, address book.
9. **CartPage / Checkout** — itemized by profile, Stripe payment flow.

## 6. Key UX/Interaction Notes to Implement

- Subcategory boxes: CSS `scroll-snap`, `transform: scale()` + shadow on hover, route transition animation (Framer Motion `AnimatePresence`) on click.
- Product image carousel: `setInterval` auto-advance (5s), pause on manual interaction, dot indicators.
- Floating info pane: `backdrop-filter: blur()` with semi-transparent background, fixed/sticky position over full-bleed image.
- Customizable badge styling: subtle accent color/border on the "Customizable" tag rather than a loud effect, matching your reference mockups.
- Body diagram: store as SVG with named regions; highlight/swap region or whole diagram based on `selectedMeasurement` state and `upperBody/lowerBody` toggle.

## 7. Build Phases / Milestones

1. **Phase 1 — Foundation:** repo setup (client/server folders), MongoDB schema, auth, basic category/product CRUD + seed data.
2. **Phase 2 — Core Browsing:** Landing page, section landing pages, category listing with sort, product page (static, no customization yet).
3. **Phase 3 — Customization & Profiles:** Profile creation, measurements UI, customization modal, cart logic requiring profile + customization selection.
4. **Phase 4 — Commerce:** Cart, Stripe checkout, order history, favorites.
5. **Phase 5 — Polish:** Animations (hover, transitions, auto-slide), responsive QA across breakpoints, admin panel for managing products/priority.
6. **Phase 6 — Launch prep:** Performance (image optimization/CDN), SEO basics, analytics, accessibility pass.

## 8. Suggested Folder Structure

```
/server
  /models       (User, Profile, Product, Category, Order, Customization)
  /routes
  /controllers
  /middleware   (auth, error handling)
  /config       (db, cloudinary, stripe)
/client
  /src
    /pages      (Landing, SectionLanding, CategoryListing, ProductPage, Account, Measurements, Cart, Checkout)
    /components (Nav, ProductCard, FloatingPane, CustomizationModal, ProfileSelector, ImageCarousel, MeasurementDiagram)
    /store      (Zustand/Redux slices: auth, cart, favorites)
    /api        (axios service layer)
    /assets
```

This gives you schema, routes, components, and phased milestones to start scaffolding the repo. Happy to generate starter code (Mongoose models, Express routes, or React component skeletons) for any specific phase next.
