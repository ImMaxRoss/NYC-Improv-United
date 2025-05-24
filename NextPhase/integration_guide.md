# Live Practice Mode - Integration Guide

## 🎯 What We Built

A complete **Live Practice Mode** that transforms your coaching platform from lesson planning into an active, real-time coaching tool. This includes:

### Core Features Delivered:
- ✅ **Pre-Practice Setup** with attendance taking
- ✅ **Live Timer** with play/pause/reset controls  
- ✅ **Exercise Navigation** with progress tracking
- ✅ **Dynamic Evaluation System** with 2 rubric types
- ✅ **Real-time Stats** dashboard
- ✅ **Visual Progress** tracking throughout

## 📂 File Structure Added

```
src/
├── pages/
│   └── LivePractice.tsx                    # Main live practice page
├── components/LivePractice/
│   ├── PracticeTimer.tsx                   # Timer with controls
│   ├── AttendanceSelector.tsx              # Performer attendance
│   ├── SceneEvaluationModal.tsx            # Dynamic evaluation form
│   ├── PracticeStats.tsx                   # Real-time statistics
│   ├── ExerciseProgressBar.tsx             # Exercise timeline
│   └── QuickNotes.tsx                      # Practice note-taking
├── api/modules/
│   └── practice.ts                         # Practice session API calls
├── utils/
│   └── practiceHelpers.ts                  # Utility functions
└── types/
    └── index.ts                            # Enhanced with new types
```

## 🚀 Installation Steps

### 1. Install Dependencies
```bash
npm install react-router-dom @types/react-router-dom
```

### 2. Add New Files
Copy all the components and utilities from the artifacts above into your project structure.

### 3. Update Existing Files
- Replace `src/App.tsx` with the routing version
- Replace `src/pages/Dashboard.tsx` with the enhanced version  
- Update `src/types/index.ts` with the new types
- Enhanced `src/api/mockData.ts` with detailed lesson data

### 4. Update Your API Service
Use the enhanced `src/api/service.ts` that includes better error handling and logging.

## 🧪 Testing Guide

### Test Flow 1: Basic Practice Session
1. **Start**: Navigate to dashboard
2. **Select**: Click "Start Practice" on any upcoming lesson
3. **Setup**: Take attendance by selecting performers
4. **Practice**: Click "Start Practice" to begin
5. **Navigate**: Use previous/next to move between exercises  
6. **Timer**: Test play/pause/reset functionality
7. **Evaluate**: Click "Evaluate Scene" to open evaluation modal
8. **Complete**: Navigate through all exercises and end practice

### Test Flow 2: Evaluation System
1. **Open Modal**: Click "Evaluate Scene" during practice
2. **Rubric Toggle**: Switch between "Base Reality" and "Game of Scene"
3. **Performers**: Select which performers were in the scene
4. **Scoring**: Test 1-4 scoring with color coding:
   - 4 = Green (Excellent)
   - 3 = Yellow (Good)  
   - 2 = Orange (Needs Improvement)
   - 1 = Red (Unsatisfactory)
5. **Notes**: Add coaching feedback
6. **Save**: Verify evaluation appears in sidebar

### Test Flow 3: Timer & Navigation
1. **Timer Controls**: Test play/pause/reset during exercise
2. **Overtime**: Let timer run past planned duration (shows red)
3. **Exercise Navigation**: Move between exercises
4. **Progress Tracking**: Verify progress bar updates
5. **Stats**: Check real-time statistics update

## 🎨 Visual Features

### Color-Coded Scoring System
- **Green (4)**: Excellent performance
- **Yellow (3)**: Good performance  
- **Orange (2)**: Needs improvement
- **Red (1)**: Unsatisfactory performance

### Progress Indicators
- **Exercise Timeline**: Shows completed, current, and upcoming
- **Session Progress**: Real-time completion percentage
- **Timer Progress**: Visual countdown with overtime warning

### Focus Area Tags
- **Color-coded** by improv skill area
- **Tooltips** with descriptions
- **Filtering** capabilities for exercise selection

## 🔧 Configuration Options

### Rubric Types
**Base Reality (UCB Manual - 8 criteria):**
- Yes And, Agreement, Who/What/Where
- Physicality, Listening, Commitment
- Avoidance of Denial, Efficiency

**Game of Scene (Advanced - 9 criteria):**
- Game Identification, Resting, Heightening
- Exploration, Top of Intelligence, Justification
- Framing, Labeling, Emotional Truth

### Timer Settings
- **Default Duration**: Uses exercise planned duration
- **Overtime Warning**: Visual and color changes
- **Controls**: Play/pause/reset with animations

## 🎭 Coach Experience Features

### During Practice Setup:
- View lesson overview with exercise list
- Take attendance with performer checkboxes
- See estimated duration and exercise count
- Start practice with one-click

### During Active Practice:
- **Current Exercise**: Name, description, focus areas, notes
- **Timer**: Large display with progress bar
- **Navigation**: Previous/next exercise controls
- **Sidebar**: Present performers, recent evaluations
- **Stats**: Real-time session statistics

### During Evaluation:
- **Rubric Selection**: Toggle between evaluation types
- **Performer Selection**: Multi-select checkboxes
- **Visual Scoring**: Color-coded 1-4 rating system
- **Notes**: Free-form coaching feedback
- **History**: Track all evaluations in sidebar

## 📱 Mobile Responsiveness

The Live Practice mode is fully responsive:
- **Phone**: Single column layout with collapsible sidebar
- **Tablet**: Two-column layout optimized for portrait/landscape
- **Desktop**: Full three-column layout with all panels visible

## 🔗 API Integration

### Mock Data Fallbacks
The system includes comprehensive mock data for development:
- Detailed lesson data with exercises
- Performer roster with experience levels
- Focus areas with color coding
- Evaluation templates

### Real API Endpoints
When ready, integrate with these endpoints:
- `POST /lessons/{id}/start-practice` - Start practice session
- `PUT /practice-sessions/{id}/current-exercise` - Update current exercise  
- `POST /evaluations` - Save scene evaluations
- `GET /practice-sessions/{id}/stats` - Real-time statistics

## 🎪 Comedy-Themed Design Elements

Maintaining your "playful professionalism" philosophy:
- **Emoji Reactions**: 🎭 for practice, 🦉 for empty states
- **Warm Colors**: Yellow/mustard accents throughout
- **Smooth Animations**: Transitions between practice phases
- **Encouraging Copy**: "Great work today!" completion messages
- **Visual Hierarchy**: Clear focus on current action

## 🐛 Known Limitations

1. **No Browser Storage**: Uses in-memory state (restarts on refresh)
2. **Mock Performers**: Real teams would come from API
3. **Offline Mode**: No offline capability yet
4. **Voice Recording**: Video/audio capture not implemented
5. **Report Generation**: PDF export not yet available

## 🚀 Next Steps

### Immediate Enhancements:
- [ ] Connect to real API endpoints
- [ ] Add localStorage persistence for sessions
- [ ] Implement team/performer management
- [ ] Add practice session history

### Future Features:
- [ ] Video recording integration
- [ ] PDF report generation  
- [ ] Advanced analytics dashboard
- [ ] Custom rubric creation
- [ ] Multi-coach collaboration

## 🎯 Success Metrics

**For Coaches:**
- Reduced practice setup time (< 2 minutes)
- Increased evaluation frequency
- Better exercise timing
- Improved feedback quality

**For Performers:**  
- More specific feedback
- Clear progress tracking
- Consistent evaluation criteria
- Better practice structure

---

## 🎭 Ready to Coach Live!

Your Live Practice Mode is now ready for improv coaching sessions. The system provides everything needed to run engaging, well-structured practice sessions with real-time evaluation and feedback.

**Start testing with:** `/live-practice/1` or click "Start Practice" from the dashboard!