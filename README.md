# Support Bot - Advanced Mobile Chatbot App

An advanced AI-powered customer support chatbot with offline capabilities, message persistence, PWA installation, and more. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

### Core Chat Features
- **96,000+ Response Knowledge Base** - Instant answers from a large local database
- **Real-time Chat Interface** - Smooth, responsive messaging with typing indicators
- **Message Persistence** - All conversations saved to IndexedDB
- **Copy & Rating System** - Users can copy responses and rate helpfulness
- **Quick Categories** - Fast access to common support topics

### Mobile & PWA
- **Progressive Web App (PWA)** - Install directly on Android/iOS home screen
- **Offline Mode** - Works without internet connection
- **Service Worker** - Automatic caching for offline support
- **Responsive Design** - Optimized for all screen sizes
- **Mobile-First** - Touch-friendly interface

### Advanced Features
- **Conversation History** - Browse and restore previous chats
- **Settings Panel** - Dark mode, notifications, clear data options
- **Navigation Drawer** - Quick access to conversations and settings
- **Export Chat** - Download conversations as JSON
- **Auto-Save** - Messages saved automatically
- **Connection Status** - Shows when offline

## Installation & Setup

### Quick Start

1. **Download & Install**
   ```bash
   # Clone or download the project
   git clone <repo-url>
   cd support-bot

   # Install dependencies
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Open in Browser**
   - Desktop: http://localhost:3000
   - Mobile: Scan QR code or navigate to your server IP

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Click Deploy
4. Access your live app

## Installation on Mobile

### Android

1. **Open in Chrome/Edge**
   - Navigate to your app URL
   - Tap the menu icon (⋮)
   - Select "Install app" or "Add to Home screen"
   - Tap "Install"

2. **Or Use Install Button**
   - The app shows an "Install Support Bot" prompt
   - Tap "Install" and confirm

### iOS (Web Clip)

1. **Safari Browser**
   - Open the app in Safari
   - Tap Share icon
   - Select "Add to Home Screen"
   - Choose a name and tap "Add"

2. **Features** (Similar to native app)
   - Home screen icon
   - Full-screen mode
   - Offline support

## How to Use

### Starting a Conversation

1. **New Chat**
   - Tap "New Chat" button in the sidebar
   - Choose a category or type your question

2. **Quick Categories**
   - Account Help
   - Password Reset
   - Billing
   - Technical Issue
   - Subscription
   - Features

### Managing Conversations

1. **View History**
   - Open sidebar (hamburger menu)
   - Tap any conversation to view it
   - Swipe left or tap delete to remove

2. **Export Chat**
   - Open sidebar
   - Tap "Export Chat"
   - Download as JSON file

3. **Settings**
   - Tap Settings icon
   - Toggle dark mode
   - Manage notifications
   - Clear all data (danger zone)

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: IndexedDB (client-side)
- **UI Components**: Lucide React icons
- **PWA**: Service Workers, Web App Manifest
- **Storage**: IDB library for easy IndexedDB access

## Project Structure

```
support-bot/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main chat page
│   └── globals.css         # Global styles & animations
├── components/
│   ├── chat-window.tsx     # Main chat interface
│   ├── chat-input.tsx      # Message input
│   ├── message-bubble.tsx  # Message display
│   ├── message-actions.tsx # Copy & rating buttons
│   ├── quick-categories.tsx    # Category buttons
│   ├── drawer.tsx          # Navigation sidebar
│   ├── settings.tsx        # Settings panel
│   ├── install-button.tsx  # PWA install prompt
│   └── service-worker-register.tsx
├── lib/
│   ├── db-utils.ts         # IndexedDB operations
│   ├── chat-utils.ts       # Bot response logic
│   └── types.ts            # TypeScript interfaces
├── public/
│   ├── sw.js               # Service Worker
│   ├── manifest.json       # PWA manifest
│   └── bot-responses-full.json  # 96k responses
└── package.json
```

## Database Schema

### Messages Table
```typescript
{
  id: string (UUID)
  text: string
  sender: 'user' | 'bot'
  timestamp: number
  conversationId: string
}
```

### Conversations Table
```typescript
{
  id: string (UUID)
  title: string
  createdAt: number
  updatedAt: number
  messageCount: number
}
```

### Preferences Table
```typescript
{
  key: string
  value: any
}
```

## Features Explained

### Offline Mode
- Service Worker caches all assets
- IndexedDB stores all messages locally
- Syncs when connection restored

### PWA Installation
- Browser detects app installability
- Shows "Install" prompt
- Creates home screen shortcut
- Works like native app

### Message Persistence
- Every message auto-saved to IndexedDB
- Survives browser refresh
- Full conversation history available

### Export Functionality
- Download entire conversation
- JSON format for easy parsing
- Date-stamped filenames

## Performance Tips

1. **Initial Load**: ~2-3 seconds (optimized for mobile)
2. **Message Response**: <500ms average
3. **Offline**: Instant responses from cache
4. **Storage**: ~100+ messages per conversation before storage limits

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Install Button Not Showing
- Use HTTPS (required for PWA)
- Clear browser cache
- Check manifest.json is accessible

### IndexedDB Not Working
- Enable in browser settings
- Check storage quota (usually 50MB+)
- Clear app data if corrupted

### Service Worker Issues
- Check browser console for errors
- Unregister old workers in DevTools
- Hard refresh (Ctrl+Shift+R)

### Messages Not Saving
- Check IndexedDB in DevTools
- Verify storage quota
- Try clearing app data

## API Reference

### Core Functions

```typescript
// Database
initDB() - Initialize IndexedDB
saveMessage(message) - Save message
getMessages(conversationId) - Retrieve all messages
saveConversation(conversation) - Save conversation
deleteConversation(id) - Delete conversation

// Chat
loadBotDatabase() - Load 96k responses
getBotResponse(query) - Get bot answer
```

## Future Enhancements

- [ ] AI model integration (OpenAI, Anthropic)
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Message reactions/emojis
- [ ] Voice input/output
- [ ] Real-time collaboration
- [ ] Admin dashboard

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -am 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT - Feel free to use this project for personal or commercial use.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## Deployment URLs

- **Production**: [your-domain.com](https://your-domain.com)
- **Vercel**: [app.vercel.app](https://app.vercel.app)

---

**Built with ❤️ using Next.js and Modern Web Technologies**

Version: 1.0.0  
Last Updated: 2026
