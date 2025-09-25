# Hangout Chat App 💬

A modern real-time chat application built with Next.js, Convex, and Clerk authentication. Features include direct messaging, group chats, real-time presence, message read receipts, and more.

![Hangout Chat App Screenshot](public/screenshot-for-readme.png)

## ✨ Features

- 🔐 **Authentication** - Secure auth with Clerk
- 💬 **Real-time Messaging** - Instant message delivery with Convex
- 👥 **Group Chats** - Create and manage group conversations
- 📱 **Responsive Design** - Works on desktop and mobile
- 🟢 **Presence System** - See who's online
- ✅ **Read Receipts** - Track message delivery and read status
- 🚫 **Block/Unblock Users** - User safety controls
- 👋 **Friend Requests** - Connect with other users
- 📨 **Group Invitations** - Invite users to join groups
- 🎨 **Dark/Light Mode** - Theme support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database and functions)
- **Authentication**: Clerk
- **UI Components**: Radix UI, Lucide React
- **Form Handling**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS with shadcn/ui components

## 🚀 Local Development

### Prerequisites

- Node.js 18+ and npm
- [Convex account](https://convex.dev)
- [Clerk account](https://clerk.com)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Hangout-ChatApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_JWT_ISSUER_DOMAIN` - Clerk JWT issuer domain
- `CLERK_WEBHOOK_SECRET` - Clerk webhook secret

### 4. Set up Convex

```bash
npx convex dev
```

This will:

- Create a new Convex project (if needed)
- Set up your database schema
- Deploy your Convex functions

### 5. Set up Clerk

1. Create a Clerk application
2. Configure OAuth providers (optional)
3. Set up webhooks pointing to your Convex HTTP actions
4. Copy the keys to your `.env.local`

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Set up Convex for production**:

   ```bash
   npx convex deploy --prod
   ```

3. **Deploy to Vercel**:
   - Connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy!

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/hangout-chatapp)

### Environment Variables for Production

Set these in your deployment platform:

```env
# Convex
CONVEX_DEPLOYMENT=your-prod-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-live-publishable-key
CLERK_SECRET_KEY=sk_live_your-live-secret-key
CLERK_JWT_ISSUER_DOMAIN=https://your-domain.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Post-Deployment Setup

1. **Update Clerk settings**:
   - Add your production domain to allowed origins
   - Update webhook URLs to point to your production domain

2. **Update Convex settings**:
   - Configure production environment variables
   - Set up any required integrations

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── (root)/            # Main app routes
│   │   ├── conversations/ # Chat interface
│   │   ├── friends/       # Friends management
│   │   └── notifications/ # Notifications page
│   ├── sign-in/          # Authentication pages
│   └── sign-up/
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Auth-related components
│   ├── layout/           # Layout components
│   └── shared/           # Shared components
├── convex/               # Convex backend functions
│   ├── schema.ts         # Database schema
│   ├── auth.config.ts    # Auth configuration
│   ├── conversation.ts   # Conversation functions
│   ├── message.ts        # Message functions
│   ├── group.ts          # Group functions
│   └── user.ts           # User functions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── providers/            # React context providers
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help with deployment, please open an issue or reach out to the maintainers.

---

Built with ❤️ using Next.js and Convex
