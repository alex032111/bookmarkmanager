# AI Rules for OpenClaw Bookmark Manager

## Tech Stack

- **Node.js** with ES Modules (type: "module") for modern JavaScript syntax and module imports
- **Express.js** as the web framework for routing, middleware, and HTTP server
- **SQLite** via `better-sqlite3` for a lightweight, serverless database with synchronous API
- **Vanilla JavaScript** for frontend logic - no frameworks like React, Vue, or Angular
- **Custom CSS** with CSS variables for theming - no CSS frameworks like Bootstrap or Tailwind
- **Docker** and docker-compose for containerization and deployment
- **Native ES Modules** for code organization and dependency management
- **CORS** middleware for cross-origin resource sharing support
- **Systemd** service files for native Linux deployment (alternative to Docker)

## Library Usage Rules

### Database (better-sqlite3)
- **MUST use** `better-sqlite3` for ALL database operations
- Use the synchronous API (not async) - all `db.prepare()`, `run()`, `get()`, `all()` calls are blocking
- Always use prepared statements with parameterized queries to prevent SQL injection
- Enable foreign keys with `db.pragma('foreign_keys = ON')` at initialization
- Use transactions for multi-step operations where data integrity is critical
- Store database in the `data/` directory (relative to project root)

### Web Server (Express.js)
- **MUST use** Express for all HTTP routing and middleware setup
- Define routes in separate files in `src/routes/` following the pattern: `[resource]Routes.js`
- Create controller functions in `src/controllers/` following the pattern: `[resource]Controller.js`
- Use `app.use()` to mount route handlers with their base paths
- Implement proper error handling with custom middleware in `src/middleware/`
- Use `express.json()` and `express.urlencoded()` for parsing request bodies

### Frontend Development
- **MUST NOT use** any frontend frameworks (React, Vue, Angular, Svelte, etc.)
- **MUST use** vanilla JavaScript with native DOM APIs
- **MUST use** native ES module imports (`import ... from ...`) in frontend scripts
- Store all static frontend files in the `frontend/` directory
- Serve static files using `express.static(path.join(__dirname, '../frontend'))`
- Use LocalStorage via `Storage` utility in `frontend/js/storage.js` for client-side persistence
- Use native Fetch API for all HTTP requests to the backend

### CSS/Styling
- **MUST NOT use** CSS frameworks (Bootstrap, Tailwind, Material UI, etc.)
- **MUST use** custom CSS with CSS variables (custom properties) for theming
- Define theme colors as CSS variables in `:root` for light/dark mode support
- Use responsive CSS with media queries in a separate `responsive.css` file
- Keep component-specific styles in `components.css`
- Base styles go in `styles.css`

### Code Organization
- **Backend source** MUST be in `src/` directory
- **Controllers** go in `src/controllers/` - handle business logic and database queries
- **Routes** go in `src/routes/` - define API endpoints and map to controllers
- **Middleware** goes in `src/middleware/` - handle cross-cutting concerns (auth, errors, logging)
- **Database setup** goes in `src/database/db.js` - initialize schema and export db instance
- **Server entry point** is `src/server.js` - configure Express and start the server
- **Frontend HTML** is `frontend/index.html`
- **Frontend CSS** files go in `frontend/css/`
- **Frontend JavaScript** files go in `frontend/js/`

### API Design
- Use RESTful conventions for all endpoints
- Return JSON responses for all API calls
- Use appropriate HTTP status codes (200, 201, 400, 404, 500, etc.)
- Include descriptive error messages in JSON error responses
- Use query parameters for filtering (`?folder_id=1`, `?search=query`, `?is_favorite=true`)
- Group related endpoints under resource paths (`/api/bookmarks`, `/api/folders`, `/api/tags`)

### Error Handling
- Use try-catch blocks in all controller functions
- Return consistent error JSON format: `{ error: "message" }`
- Handle SQLite constraint violations (UNIQUE, FOREIGN KEY) with appropriate status codes
- Log errors to console for debugging
- Use global error handling middleware as the last middleware in the chain

### Deployment
- Use Docker with the provided `Dockerfile` and `docker-compose.yml` for containerization
- Alternative: Use systemd service with `openclaw-backend.service` file
- Mount data volume at `/app/data` to persist SQLite database
- Expose port 3000 for the API server
- Include health check endpoint at `/health`
- Use Nginx reverse proxy in production for SSL termination and proper domain serving

### Security
- Always sanitize user inputs to prevent SQL injection (use parameterized queries)
- Use CORS middleware to control cross-origin access
- Validate required fields in controllers before database operations
- Return 400 Bad Request for validation errors
- Return 404 Not Found for non-existent resources
- Return 409 Conflict for duplicate entries (UNIQUE constraint violations)

### Development Workflow
- Use `npm run dev` for development with auto-reload via `--watch` flag
- Use `npm start` for production execution
- Keep all third-party dependencies listed in `package.json`
- Do NOT add new dependencies without explicit user request
- Follow existing code style and naming conventions (camelCase for JS/variables, snake_case for DB columns)
- Write clear, descriptive comments for complex logic