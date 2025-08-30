# AI Avatar Store Mobile App - Intelligent Virtual Companions Platform

## Overview

AI Avatar Store is a comprehensive platform that allows users to create, customize, and interact with AI-powered virtual avatars. The platform features advanced conversational AI capabilities, voice interactions, and multimedia messaging, providing users with personalized virtual companions for various relationship types including friends, mentors, and romantic partners.

## 🌟 Key Features

### Core Functionality
- **Custom AI Avatar Creation**: Create personalized AI avatars with unique personalities, appearances, and voices
- **Multi-Modal Communication**: Text messaging, voice messages, and image sharing
- **Voice Synthesis & Recognition**: Real-time speech-to-text and text-to-speech using OpenAI's Whisper and TTS
- **Personality Customization**: Choose from various personality types (gentle, energetic, strict, wise, romantic, logical)
- **Relationship Types**: Friend, Lover, or Mentor avatar roles with tailored conversation styles
- **Cross-Platform Support**: Web application, mobile app (iOS/Android), and marketing website

### Advanced AI Features
- **Context-Aware Conversations**: AI maintains conversation history and adapts responses based on user interactions
- **Automatic Summary Generation**: Periodic conversation summarization to maintain long-term memory
- **Image Understanding**: Vision capabilities for analyzing and discussing shared images
- **Dynamic Personality Adaptation**: AI behavior adjusts based on chosen personality traits and relationship dynamics

### User Experience
- **Real-Time Messaging**: Instant AI responses with typing indicators
- **Voice Call Modal**: Push-to-talk voice interaction interface
- **Avatar Gallery**: Browse and select from pre-designed avatar appearances
- **User Profiles**: Customizable user profiles with bio and preferences
- **Chat History**: Persistent conversation storage and retrieval

## 🏗️ Architecture

The project consists of three main components:

### 1. Backend (`/backend`)
**Technology Stack:**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **AI Integration**: OpenAI GPT-4 API, Whisper, TTS
- **File Processing**: FFmpeg for audio conversion
- **Authentication**: JWT tokens

**Key Features:**
- RESTful API for all client interactions
- Real-time message processing and AI response generation
- Audio file transcription and speech synthesis
- Image upload and processing
- Administrative dashboard for chat monitoring
- Database transaction management

### 2. Frontend Mobile App (`/frontend`)
**Technology Stack:**
- **Framework**: Vue.js 3 with Quasar Framework
- **Mobile**: Capacitor for iOS/Android deployment
- **Styling**: Tailwind CSS
- **State Management**: Reactive Vue composition API
- **HTTP Client**: Axios

**Key Features:**
- Progressive Web App (PWA) capabilities
- Native mobile features (camera, voice recording)
- Responsive design with gradient backgrounds
- Real-time chat interface with message bubbles
- Voice recording and playback
- Image capture and sharing

### 3. Marketing Website (`/website`)
**Technology Stack:**
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Package Manager**: Bun

**Key Features:**
- Modern landing page design
- Product feature showcase
- User journey demonstration
- Download links and testimonials
- Responsive design

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

### Core Tables
- **`userprofile`**: User account information and preferences
- **`avatar`**: AI avatar definitions with personality traits
- **`chatsession`**: Conversation sessions between users and avatars
- **`chatmessage`**: Individual messages with text, images, and voice data
- **`feedback`**: User feedback and support requests

### Key Relationships
- Users can create multiple chat sessions with different avatars
- Each chat session contains a conversation history
- Messages support text, images, and voice recordings
- Avatar personalities influence conversation style and responses

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 12+
- OpenAI API key
- FFmpeg (for audio processing)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Heigen007/AI-avatar-store.git
   cd AI-avatar-store
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with the following variables:
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=postgresql://username:password@localhost:5432/ai_avatar_db
   JWT_SECRET=your_jwt_secret
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database and import schema
   createdb ai_avatar_db
   psql ai_avatar_db < DBSchema.sql
   ```

4. **Frontend Mobile App Setup**
   ```bash
   cd ../frontend
   npm install
   
   # For development
   npm run dev
   
   # For mobile build
   npx cap add android
   npx cap add ios
   npm run build
   npx cap sync
   ```

5. **Marketing Website Setup**
   ```bash
   cd ../website
   bun install
   bun run dev
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:3000
   ```

2. **Start Frontend Development**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:9000
   ```

3. **Start Marketing Website**
   ```bash
   cd website
   bun run dev
   # Website runs on http://localhost:5173
   ```

## 🔧 API Documentation

### Core Endpoints

#### User Management
- `POST /api/user` - Create new user profile
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/:id` - Update user profile

#### Avatar Management
- `POST /api/avatar` - Create new avatar and chat session
- `PUT /api/avatar/:id` - Update avatar properties
- `DELETE /api/avatar/:id` - Delete avatar

#### Chat Operations
- `GET /api/chats/:userId` - Get user's chat sessions
- `GET /api/chat/:chatId/messages` - Get chat history
- `POST /api/chat/:chatId/message` - Send text/image message
- `POST /api/chat/:chatId/voice` - Send voice message

#### Administrative
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/chats` - Chat monitoring dashboard

### File Upload Support
- **Images**: JPEG, PNG, WebP (for avatar photos and message attachments)
- **Voice**: M4A, WebM, WAV (automatically converted for processing)

## 🤖 AI Integration Details

### OpenAI Services
- **GPT-4**: Primary conversation engine with vision capabilities
- **Whisper**: Speech-to-text transcription for voice messages
- **TTS**: Text-to-speech synthesis for avatar voice responses

### Conversation System
- **Context Building**: Dynamic prompt construction based on avatar personality, user profile, and conversation history
- **Memory Management**: Automatic conversation summarization every 20 messages to maintain context
- **Personality Injection**: Character traits influence response style and content
- **Multimodal Support**: Processes text, images, and voice inputs seamlessly

### Voice Features
- **Recording**: Native device recording on mobile, WebRTC on web
- **Processing**: Audio format conversion and optimization
- **Synthesis**: Real-time voice generation with selectable voice models
- **Playback**: Seamless audio playback with status indicators

## 📱 Mobile Features

### Capacitor Integration
- **Camera Access**: Photo capture for message attachments
- **Voice Recording**: Native audio recording capabilities
- **Status Bar**: Platform-specific status bar styling
- **App Icons**: Custom app branding and icons

### Progressive Web App
- **Offline Support**: Basic functionality without internet
- **Install Prompt**: Add to home screen capability
- **Push Notifications**: (Future feature for message alerts)

## 🎨 UI/UX Design

### Design System
- **Color Scheme**: Gradient backgrounds with cyan/blue theme
- **Typography**: Modern, readable font hierarchy
- **Animations**: Smooth transitions and typing indicators
- **Responsive**: Mobile-first design with desktop support

### Chat Interface
- **Message Bubbles**: Distinct styling for user/avatar messages
- **Media Support**: Image previews and voice message players
- **Typing Indicators**: Real-time conversation feedback
- **Voice UI**: Push-to-talk with visual recording indicators

## 🔐 Security & Privacy

### Data Protection
- **User Data**: Encrypted storage of personal information
- **Message History**: Secure conversation storage
- **File Uploads**: Sanitized and validated media files
- **API Security**: JWT-based authentication

### Privacy Features
- **Data Retention**: Configurable message history limits
- **User Control**: Avatar deletion and data management
- **Feedback System**: Anonymous feedback collection

## 📈 Performance Optimization

### Backend Optimization
- **Database Indexing**: Optimized queries for chat history
- **File Management**: Automatic cleanup of temporary files
- **Connection Pooling**: Efficient database connections
- **Error Handling**: Comprehensive error logging and recovery

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive image loading
- **Caching**: Efficient API response caching
- **Bundle Size**: Optimized build configuration

## 🔮 Future Enhancements

### Planned Features
- **Multi-language Support**: Conversation in multiple languages
- **Group Chats**: Multiple avatars in single conversations
- **Avatar Marketplace**: Community-created avatar sharing
- **Advanced Analytics**: Conversation insights and patterns
- **Video Calls**: Real-time video chat with AI avatars
- **Custom Training**: User-specific AI model fine-tuning

### Technical Roadmap
- **Microservices**: Backend service decomposition
- **Real-time Updates**: WebSocket-based live messaging
- **Cloud Deployment**: Scalable infrastructure setup
- **Testing Suite**: Comprehensive automated testing
- **Documentation**: API documentation and developer guides

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain consistent code formatting
3. Write comprehensive tests for new features
4. Update documentation for API changes
5. Follow Git conventional commit messages

### Project Structure
```
AI-avatar-store/
├── backend/          # Node.js/Express API server
├── frontend/         # Vue.js/Quasar mobile app
├── website/          # React marketing website
└── README.md         # This documentation
```

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For questions, bug reports, or feature requests, please create an issue in the project repository or contact the development team.

---

**Built with ❤️ using modern web technologies and AI innovation**
