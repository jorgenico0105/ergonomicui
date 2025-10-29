# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + Vite frontend for a postural and ergonomic analysis system. This application provides a user interface for uploading images/videos and displaying AI-powered ergonomic analysis results with PDF report generation.

**Key Features:**
- Dual analysis modes: Ergonomic (image-based) and Postural (video-based)
- Drag-and-drop file upload with validation
- Client-side PDF report generation using pdf-lib
- Integration with Flask backend API

## Development Commands

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
# Runs on http://localhost:5173 (default Vite port)
# Hot Module Replacement (HMR) enabled
```

### Build for Production
```bash
npm run build
# Output: dist/ directory
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Backend Dependency

**IMPORTANT:** This frontend requires the Flask backend API running. The API base URL is configured in `src/services/api.js`.

Current configuration:
- Production: `https://ergonomic-poses-2.onrender.com`
- For local development, change `API_BASE_URL` to `http://localhost:5000`

Backend repository: `../analisis-back/`

## Architecture Overview

### Application State Flow

The application uses a single-page architecture with centralized state management in `App.jsx`:

```
App.jsx (State Container)
  ├── currentType: 'ergonomico' | 'postural'
  ├── selectedFile: File | null
  ├── isLoading: boolean
  ├── analysisResults: object | null
  └── showUpload: boolean (controls UI visibility)
```

**Key State Flow:**
1. User selects analysis type → `currentType` updates → File upload resets
2. User uploads file → `selectedFile` populated → Preview shown
3. User clicks "Analizar" → `isLoading=true` → API call → `analysisResults` populated
4. Results displayed → PDF auto-generated → `showUpload=false` hides upload UI
5. "Nuevo Análisis" resets state → `showUpload=true` restores upload UI

### Component Architecture

**Presentational Components:**
- `AnalysisTypeSelector.jsx` - Radio-style analysis type buttons
- `FileUpload.jsx` - Drag-and-drop upload with preview
- `LoadingState.jsx` - Loading spinner during analysis
- `Results.jsx` - Display annotated image and download buttons

**Service Layer:**
- `services/api.js` - Axios-based API client with two endpoints
- `utils/pdfGenerator.js` - Client-side PDF generation

### API Integration Pattern

The application supports two analysis types with different API contracts:

**Ergonomic Analysis** (`analyzeImage`):
- Endpoint: `POST /api/analisis-ergonomico/analyze`
- Request: `FormData` with `image` field
- Response Structure:
  ```javascript
  {
    data: {
      image_url: string,           // Cloudinary URL of annotated image
      ai_analysis: {               // OpenAI Vision analysis
        resumen_ejecutivo: string,
        puntos_criticos: string[],
        recomendaciones_inmediatas: string[],
        recomendaciones_largo_plazo: string[],
        analisis_espacio_trabajo: {
          mobiliario: string,
          equipamiento: string,
          iluminacion_entorno: string
        },
        riesgos_identificados: string[],
        ejercicios_recomendados: string[]
      }
    },
    recommendations: {
      angle_details: [{            // Biomechanical angle data
        segment: string,           // e.g., "Cadera Izquierda"
        optimal_range: string,     // e.g., "90-110°"
        current_angle: number,
        status: 'correcto' | 'incorrecto'
      }]
    }
  }
  ```

**Postural Analysis** (`analyzeVideo`):
- Endpoint: `POST /api/analisis-postural/analizar-postura`
- Request: `FormData` with `video` field
- Response: Frame statistics and processed video URLs

### PDF Generation Architecture

The PDF generator (`pdfGenerator.js`) creates comprehensive ergonomic reports using pdf-lib:

**Key Features:**
- Multi-page layout with automatic pagination
- Fetches and embeds annotated image from Cloudinary URL
- Styled tables for angle measurements
- Color-coded status indicators (green=correct, red=incorrect)
- Text wrapping for long content blocks

**PDF Structure:**
1. Header with title and date
2. Executive Summary (AI analysis)
3. Critical Points
4. Immediate Recommendations
5. Long-term Recommendations
6. Workspace Analysis (furniture, equipment, lighting)
7. Identified Risks
8. Recommended Exercises
9. Annotated Image
10. Angle Measurement Table

**Important:** PDF generation happens twice:
- Once after successful analysis (logged to console)
- Again when user clicks "Descargar Reporte PDF" button

### File Upload and Validation

`FileUpload.jsx` implements comprehensive file handling:

**Features:**
- Drag-and-drop support with visual feedback (`dragover` class)
- File type validation based on analysis type:
  - Ergonomic: `image/*` only
  - Postural: `video/*` only
- File preview using `URL.createObjectURL()`
- Hidden file input triggered by click on upload area

**Validation Logic:**
```javascript
if (currentType === 'ergonomico' && !file.type.startsWith('image/')) {
  alert('Por favor selecciona una imagen');
  return;
}
```

## Important Technical Details

### Vite Configuration

Custom server settings in `vite.config.js`:
- `host: true` - Enables network access (not just localhost)
- `port: 5173` - Fixed port for consistency

### State Management Pattern

The app uses a controlled component pattern with all state in `App.jsx`:
- Props flow down to presentational components
- Event handlers flow up via callbacks (`onTypeChange`, `onFileSelect`, etc.)
- No prop drilling - max 1 level deep

### Error Handling

Current implementation logs errors but shows generic alerts:
```javascript
try {
  results = await analyzeImage(selectedFile);
} catch (error) {
  console.error('Error en el análisis:', error);
  alert('Error al procesar el análisis');
}
```

Error responses are logged but not parsed for user-friendly messages.

### Memory Management

File previews use `URL.createObjectURL()` without cleanup. This creates potential memory leaks on repeated uploads. Best practice would be:
```javascript
useEffect(() => {
  return () => {
    if (selectedFile) URL.revokeObjectURL(objectURL);
  };
}, [selectedFile]);
```

## Common Development Tasks

### Switching Between Local and Production Backend

Edit `src/services/api.js`:
```javascript
// For local development
const API_BASE_URL = 'http://localhost:5000';

// For production
const API_BASE_URL = 'https://ergonomic-poses-2.onrender.com';
```

### Adding New Analysis Types

1. Update `currentType` state type in `App.jsx`
2. Add new button in `AnalysisTypeSelector.jsx`
3. Add new API function in `services/api.js`
4. Add routing logic in `App.jsx` `handleAnalyze()`
5. Update file validation in `FileUpload.jsx`

### Modifying PDF Layout

All PDF generation logic is in `utils/pdfGenerator.js`. Key functions:
- `createPdf(analysisResults)` - Main generation function
- `wrapText(text, maxCharsPerLine)` - Text wrapping utility
- `downloadPdf(pdfBytes, filename)` - Browser download trigger

**Pagination Logic:**
```javascript
if (yPosition < 100) {  // Threshold for new page
  page = pdfDoc.addPage([595, 842]);  // A4 dimensions
  yPosition = height - 50;
}
```

### Updating Result Display

Currently `Results.jsx` only shows the annotated image. To display more analysis data:
1. Access `results.data.ai_analysis` object
2. Access `results.recommendations.angle_details` array
3. Add JSX elements to render desired fields

## Tech Stack Details

- **React 19.1.1** - Latest React with concurrent features
- **Vite 7.1.7** - Build tool with ES modules and HMR
- **Axios 1.13.1** - HTTP client (configured for multipart/form-data)
- **pdf-lib 1.17.1** - Client-side PDF generation (no server needed)
- **ESLint** - Configured with React hooks and React Refresh plugins
