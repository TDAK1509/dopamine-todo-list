# Dopamine Todo List

A responsive Todo List application with Firebase authentication and real-time database sync.

## Features

- Sign in with Google Authentication
- Create and manage todo categories
- Add, delete and mark todo items as completed
- Drag and drop todos between categories
- Real-time sync with Firestore database
- Mobile-friendly responsive design

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Environment Setup

Create a `.env` file based on the `.env.example` with your Firebase configuration.

```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_HOSTING_URL=https://your-project-id.web.app
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Firebase Deployment

To deploy to Firebase Hosting, follow these steps:

1. If you haven't initialized Firebase:

```bash
bun run firebase:init
```

2. Select 'Hosting' when prompted
3. Choose your Firebase project
4. Specify `.output/public` as the public directory
5. Configure as a single-page app (yes)
6. Set up GitHub Actions (optional)

Then deploy with:

```bash
# Build and deploy in one command
bun run deploy

# Or separately
bun run build
bun run firebase:deploy
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Preview the production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

## Firebase Configuration

The application uses Firebase for:

- Authentication (Google Sign-in)
- Firestore Database (todo storage)
- Hosting (web deployment)

Make sure to enable these services in your Firebase Console and set the appropriate security rules for Firestore.
