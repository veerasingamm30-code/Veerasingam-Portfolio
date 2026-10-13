VEERASINGAM PORTFOLIO — UPDATED STATIC SITE

FILES
  index.html, style.css, script.js
  profile.jpg
  Veerasingam_Resume.pdf
  assets/resume-preview.webp
  assets/projects/aptix.webp, expensex.webp, portfolio.webp
  netlify.toml
  .env.example

LOCAL TESTING
  Open index.html in a browser, or run a simple static server from this folder:
    python -m http.server 8000
  Then open http://localhost:8000.
  Google Fonts requires an internet connection; the rest of the site is static.

NETLIFY DEPLOYMENT
  1. Sign in to Netlify and choose Add new site > Deploy manually, or connect the Git repository.
  2. Publish the contents of this folder with index.html at the publish root.
  3. netlify.toml sets publish = "."; no build command is needed for this static HTML/CSS/JS project.
  4. Open the deployed URL and test navigation, the theme switcher, clocks, project details, resume PDF, and contact links on desktop and mobile.

RENDER / NEON ARCHITECTURE NOTE
  The uploaded project is a static HTML/CSS/JavaScript website. It contains no React application, backend service, API routes, or database layer. The requested changes do not require server-side storage or processing: the clocks run in the browser, and email/WhatsApp actions open external apps. Therefore this package does not invent a Render backend or Neon schema merely to claim that architecture is configured. Render + Neon can be added if a genuine server-side feature is authorized; at that point configure the backend URL, CORS origin, and DATABASE_URL as Render environment variables, and never expose database secrets in browser code.

CONTACT
  Email action (✉️ Email Me): mailto:veerasingamm30@gmail.com
  WhatsApp action (logo + "Chat on WhatsApp"): https://wa.me/918807872577?text=<encoded message>, using the number already in the project (+91 88078 72577).
  Pre-filled text: "Hi Veera 🤗👋! I visited your Portfolio and would like to contact with you."
  WhatsApp opens the chat with this text in the message box; the visitor must press Send. Nothing is sent automatically.
  A mailto link opens the visitor's email application; it cannot guarantee delivery or confirm inbox receipt. No message form or email-sending backend is included.

TECHNOLOGY VERIFICATION
  AptiX and ExpenseX source repositories were not included in this ZIP. Their requested stacks are labelled as owner-provided / verification pending rather than claimed as independently verified. Confirm the real source stack before publishing these labels as verified.

RESUME
  The dedicated Resume section and navigation link were removed as requested, but Veerasingam_Resume.pdf and the remaining resume download links were preserved.

PROJECT VIEWER
  Each "View Project ↗" button opens an accessible <dialog> built from that project's own card (screenshot, name, description, features, technology groups, real links). Escape / the close button / the backdrop close it, focus returns to the button, and page scrolling is locked while it is open. Live Demo links are not shown because none exist in the project; only the existing GitHub profile link appears (Portfolio card).

OTHER CHANGES IN THIS PASS
  Motivation card added to About; Languages card is now a list; "View Resume" button added on Home (opens the PDF in a new tab); Contact label renumbered 05; Portfolio card tech list corrected to HTML5, CSS3, JavaScript (no Tailwind/Bootstrap in this site); dead form/resume CSS and JS removed; html overflow-x fix so the off-screen mobile menu no longer widens the mobile layout viewport.
