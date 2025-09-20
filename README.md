# 🚀 Rushaid Khan - Portfolio Website

A modern, full-stack portfolio website built with Next.js 15, featuring a dynamic content management system, blog platform, and responsive design. This project showcases my skills as a full-stack developer while providing an interactive platform for displaying projects and sharing technical insights.

## ✨ Features

### 🎨 **Frontend**

- **Modern Design**: Clean, responsive UI with smooth animations and transitions
- **Dark/Light Mode**: Toggle between themes with persistent user preferences
- **Mobile-First**: Fully responsive design optimized for all devices
- **Performance**: Optimized with Next.js 15 and Turbopack for lightning-fast loading
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### 📱 **Pages & Sections**

- **Home**: Hero section with call-to-action buttons
- **About**: Skills showcase with animated skill cards and CV download
- **Projects**: Filterable project gallery with detailed project pages
- **Blog**: Dynamic blog with tag filtering and markdown support
- **Contact**: Interactive contact form with multiple contact methods

### 🔧 **Admin Dashboard**

- **Authentication**: Secure Firebase Authentication system
- **Content Management**: Full CRUD operations for projects and blog posts
- **Image Upload**: Firebase Storage integration for media management
- **Real-time Updates**: Live data synchronization across all pages
- **Rich Text Editor**: Markdown support for blog content

### 🛠 **Technical Stack**

#### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Icons** - Comprehensive icon library
- **React Markdown** - Markdown rendering with GitHub Flavored Markdown

#### **Backend & Database**

- **Firebase Firestore** - NoSQL database for content storage
- **Firebase Storage** - File upload and media management
- **Firebase Authentication** - User authentication and authorization
- **Firebase Hosting** - Static site hosting

#### **Development Tools**

- **ESLint** - Code linting and formatting
- **Turbopack** - Fast bundling and development server
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Firebase project with Firestore and Storage enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/strelizia53/strelizia53.github.io.git
   cd strelizia53.github.io
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Configuration**

   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Firebase Storage
   - Enable Authentication (Email/Password)
   - Deploy Firestore rules and storage rules:
     ```bash
     firebase deploy --only firestore:rules,storage
     ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page with skills
│   ├── admin/             # Admin dashboard
│   │   ├── blogs/         # Blog management
│   │   └── projects/      # Project management
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   ├── projects/          # Project pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Footer.tsx
│   ├── Login.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   └── ThemeToggle.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx
└── lib/                   # Utility functions
    ├── firebase.ts
    ├── firebaseHelpers.ts
    ├── posts.tsx
    └── projects.ts
```

## 🎯 Key Features Explained

### **Dynamic Content Management**

- Projects and blog posts are stored in Firestore
- Real-time updates across all pages
- Image uploads handled by Firebase Storage
- Admin interface for easy content management

### **Responsive Design**

- Mobile-first approach with Tailwind CSS
- Smooth animations and transitions
- Accessible navigation and interactions
- Optimized images and performance

### **Blog System**

- Markdown support with GitHub Flavored Markdown
- Tag-based filtering and categorization
- Reading time estimation
- Image carousels and galleries

### **Project Showcase**

- Filterable by category (Full-Stack, Frontend, API)
- Detailed project pages with galleries
- Technology stack highlighting
- Live demo and source code links

## 🚀 Deployment

### **Vercel (Recommended)**

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### **Firebase Hosting**

```bash
npm run build
firebase deploy --only hosting
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Rushaid Khan**

- Email: [rushaidkhan53@gmail.com](mailto:rushaidkhan53@gmail.com)
- GitHub: [@strelizia53](https://github.com/strelizia53)
- LinkedIn: [rushaid-khan](https://linkedin.com/in/rushaid-khan)

---

⭐ **Star this repository if you found it helpful!**
