# To-Do Atlas 📱

A modern, professional React Native to-do application built with Expo and TypeScript. Organize your projects and tasks with a beautiful, gradient-based UI that adapts to light and dark themes.

## ✨ Features

- **Project Management**: Organize tasks into projects with descriptions
- **Smart Progress Tracking**: Visual progress indicators and automatic project completion
- **Modern UI**: Beautiful gradient designs with professional styling
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Local Storage**: All data is stored locally on your device using AsyncStorage
- **Responsive Design**: Optimized for both iOS and Android
- **Smooth Animations**: Fluid interactions with React Native Reanimated

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhavesh149/RN-TO-DO-APP.git
   cd rn-atlas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator, `w` for web

## 📱 App Structure

### Screens

- **Projects Screen**: Main screen showing all projects with progress indicators
- **Project Detail Screen**: Individual project view with task management
- **Dashboard Screen**: Statistics and app information

### Key Components

- **ProjectCard**: Displays project info with gradient styling and progress
- **TaskItem**: Individual task with animated completion states
- **GradientView**: Reusable gradient wrapper component
- **FloatingActionButton**: Animated FAB for adding items
- **AddItemModal**: Modal for creating new projects and tasks

## 🏗️ Architecture

### State Management

- **Context API**: Global app state management
- **Reducer Pattern**: Predictable state updates
- **Local Persistence**: AsyncStorage for data persistence

### File Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Projects Screen
│   ├── explore.tsx        # Dashboard Screen
│   └── _layout.tsx        # Tab Navigation
├── project/
│   └── [id].tsx           # Project Detail Screen
└── _layout.tsx            # Root Layout

components/
├── todo/
│   ├── ProjectCard.tsx    # Project display component
│   └── TaskItem.tsx       # Task display component
├── ui/
│   ├── GradientView.tsx   # Gradient wrapper
│   ├── FloatingActionButton.tsx
│   ├── AddItemModal.tsx   # Add project/task modal
│   └── LoadingScreen.tsx  # Loading state
├── ThemedText.tsx         # Themed text component
└── ThemedView.tsx         # Themed view component

context/
└── AppContext.tsx         # Global state management

models/
└── types.ts              # TypeScript interfaces

constants/
└── Colors.ts             # Theme colors and gradients
```

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset to clean state

### Key Dependencies

- **React Native**: 0.79.5
- **Expo**: ~53.0.17
- **Expo Router**: File-based navigation
- **AsyncStorage**: Local data persistence
- **Linear Gradient**: Gradient backgrounds
- **React Native Reanimated**: Smooth animations
- **TypeScript**: Type safety

## 📊 Data Flow

1. **App Initialization**: Load saved projects from AsyncStorage
2. **State Management**: All operations go through AppContext reducer
3. **Auto-persistence**: Changes automatically saved to AsyncStorage
4. **Project Status**: Auto-updates based on task completion

### Data Models

```typescript
interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  status: 'In Progress' | 'Completed';
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  projectId: string;
}
```

## 🎯 Challenges Faced & Solutions

### 1. **TypeScript Router Types**
- **Challenge**: Expo Router v6 strict typing for dynamic routes
- **Solution**: Used type assertion for dynamic navigation while maintaining type safety

### 2. **Gradient Compatibility**
- **Challenge**: Linear gradient prop types with different React Native versions
- **Solution**: Proper type casting and validation for gradient colors

### 3. **State Synchronization**
- **Challenge**: Keeping project status in sync with task completion
- **Solution**: Automatic status updates in reducer with task operations

### 4. **Performance Optimization**
- **Challenge**: Smooth animations with large task lists
- **Solution**: FlatList for virtualization and optimized re-renders

## 🚀 Potential Improvements

### Short Term
- [ ] Task due dates and reminders
- [ ] Task categories and tags
- [ ] Search and filter functionality
- [ ] Bulk task operations

### Medium Term
- [ ] Cloud synchronization
- [ ] Team collaboration features
- [ ] Task templates
- [ ] Advanced analytics dashboard

### Long Term
- [ ] AI-powered task suggestions
- [ ] Voice input for tasks
- [ ] Integration with calendar apps
- [ ] Web companion app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for continuous innovation
- **Design Inspiration** from modern productivity apps

---

**Made with ❤️ for productivity enthusiasts**

*If you find this project helpful, please give it a ⭐ on GitHub!*
