# Análisis Postural - React Frontend

React + Vite frontend application for postural and ergonomic analysis. This application interfaces with a Flask backend API to provide:
- **Ergonomic Analysis** - Image-based posture analysis with AI-powered recommendations
- **Postural Analysis** - Video-based posture analysis with frame-by-frame evaluation

## Quick Start

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Access the app at `http://localhost:5173` (default Vite port)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Backend Dependency

This frontend requires the Flask backend API running at `http://localhost:5000`.

To start the backend:
```bash
cd ../analisis-back
source venv/bin/activate
python app.py
```

## Project Structure

```
src/
├── components/
│   ├── AnalysisTypeSelector.jsx  # Analysis type selection buttons
│   ├── FileUpload.jsx            # File upload with drag & drop
│   ├── LoadingState.jsx          # Loading spinner component
│   └── Results.jsx               # Results display component
├── services/
│   └── api.js                    # Backend API integration
├── utils/
│   └── pdfGenerator.js           # PDF report generation
├── App.jsx                       # Main application component
├── App.css                       # Application styles
├── index.css                     # Base styles
└── main.jsx                      # React entry point
```

## Key Features

### Analysis Type Selection
- **Ergonómico**: Upload images for workplace posture analysis
- **Postural**: Upload videos for movement-based posture evaluation

### File Upload
- Drag and drop support
- File type validation (images for ergonomic, videos for postural)
- Live preview of selected files
- Easy file removal

### Analysis Processing
- Real-time loading states with progress indicators
- Automatic API calls based on analysis type
- Comprehensive error handling with user feedback

### PDF Report Generation
- Automatic PDF generation after successful analysis
- Results logged to console for debugging
- Download functionality for complete reports

## Tech Stack

- **React 18** - UI framework with hooks
- **Vite** - Build tool and development server with HMR
- **Axios** - HTTP client for API requests
- **pdf-lib** - Client-side PDF generation

## API Integration

The application integrates with two backend endpoints:

### Ergonomic Analysis
```
POST http://localhost:5000/api/analisis-ergonomico/analyze
- Accepts: multipart/form-data with 'image' field
- Returns: Landmarks, angles, recommendations, AI analysis, annotated image URL
```

### Postural Analysis
```
POST http://localhost:5000/api/analisis-postural/analizar-postura
- Accepts: multipart/form-data with 'video' field
- Returns: Frame statistics, posture percentages, processed video URLs
```

## Development Notes

### Hot Module Replacement (HMR)
Vite provides instant HMR during development - changes are reflected immediately without full page reload.

### Component State Management
Uses React hooks (useState) for state management:
- `currentType`: Selected analysis type ('ergonomico' or 'postural')
- `selectedFile`: Currently selected file for analysis
- `isLoading`: Loading state during API calls
- `analysisResults`: Results from backend analysis

### Error Handling
Comprehensive error handling includes:
- Network errors (backend not reachable)
- API errors (backend error responses)
- File validation errors (wrong file types)

## Browser Compatibility

Modern browsers with ES6+ support required:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

Potential improvements:
- Display detailed results in UI (currently console.log only)
- Historical analysis tracking
- User authentication and saved reports
- Multi-file batch processing
- Real-time video preview during analysis
