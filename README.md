# Portfolio Backend

This project contains a Node.js + Express backend to handle contact form submissions securely via Nodemailer and SMTP.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
*(On Windows: `copy .env.example .env`)*

**IMPORTANT:** You must configure the `.env` file manually.
- **FRONTEND_URL:** Must match the exact URL your frontend is running on (e.g., `http://localhost:8080`).
- **PORT:** The backend port (default: 5000).
- **MAIL_HOST / MAIL_PORT:** Standard SMTP settings (default `smtp.gmail.com` and `465`).
- **MAIL_USER:** Your email address used to authenticate the SMTP server.
- **MAIL_PASSWORD:** The password for authentication.
  - *If using Gmail:* Do **NOT** use your main account password. You must generate an [App Password](https://support.google.com/accounts/answer/185833). Ensure 2-Step Verification is enabled on your Google Account, then generate a 16-character App Password specifically for this portfolio backend.
- **MAIL_TO:** The inbox where you want to receive the contact messages.

### 3. Run the Application
You can run the entire portfolio (frontend + backend) with a single command:
```bash
npm start
```
or
```bash
npm run dev
```
Open your browser and navigate to:
**[http://localhost:5000](http://localhost:5000)**

### 4. Optional: Running Frontend Separately (e.g., Live Server)
If you prefer running the frontend via a separate dev server (like VS Code Live Server or `live-server`), you can run:
```bash
npx live-server --port=8080 --no-browser
```
The backend automatically allows CORS requests from `http://localhost:8080`, `http://localhost:5500`, and other local ports.

## API Endpoint
### `POST /api/contact`
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Mail sent to Devanth Saravanan."
}
```

**Failure Response (400 / 500):**
```json
{
  "success": false,
  "message": "Mail hasn't been sent. Please try again."
}
```

## Production Deployment Notes
- Ensure `.env` is never committed.
- Configure CORS to strictly allow your production domain in the `FRONTEND_URL` variable.
- Keep the `express-rate-limit` configuration active to prevent spam abuse.
