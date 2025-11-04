# VideoBlitz AI - AI-Powered Video Generator

Transform ideas into viral short-form content with AI.

## Project info

**URL**: https://lovable.dev/projects/a7205652-ce26-49b4-bf06-1161509b920b

## 🚀 Features

- **AI Video Generation**: Create professional videos from text prompts in seconds
- **Multi-Platform Support**: Optimized for TikTok, Instagram Reels, and YouTube Shorts
- **Smart Scheduler**: AI-powered content scheduling and automation
- **Template Library**: Access professionally designed video templates
- **Analytics Dashboard**: Track performance and engagement metrics
- **Team Collaboration**: Work together on video projects
- **Cloud Storage**: Access your projects from anywhere

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a7205652-ce26-49b4-bf06-1161509b920b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions, Storage)
- **Routing**: React Router v6
- **State Management**: React Hooks + Custom Hooks
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animations

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (shadcn)
│   ├── video-generator/       # Video generator sub-components
│   ├── Dashboard.tsx          # Main dashboard
│   ├── VideoGenerator.tsx     # Video creation interface
│   └── ...
├── constants/
│   └── videoOptions.ts        # Shared configuration constants
├── hooks/
│   ├── useAuth.tsx           # Authentication hook
│   ├── useVideoData.tsx      # Video data management
│   └── useVideoGeneration.tsx # Video generation logic
├── pages/
│   ├── Landing.tsx           # Landing page
│   └── Dashboard.tsx         # Dashboard page
├── utils/
│   └── videoHelpers.ts       # Video utility functions
└── integrations/
    └── supabase/             # Supabase configuration
```

## 🎨 Design System

The app uses a comprehensive design system with semantic color tokens. Key principles:

✅ **DO:**
- Use semantic color tokens from design system (e.g., `bg-primary`, `text-foreground`)
- Keep components under 300 lines
- Extract reusable logic into hooks
- Use TypeScript for type safety

❌ **DON'T:**
- Use direct colors (e.g., `text-red-600`, `bg-blue-100`)
- Create monolithic components
- Duplicate constants across files

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a7205652-ce26-49b4-bf06-1161509b920b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
