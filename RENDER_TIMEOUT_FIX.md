# Solución para Timeouts en Render

## Problema
Render Free Tier tiene un timeout de **30 segundos** para peticiones HTTP. El análisis con OpenAI Vision puede tardar más, causando errores `ERR_NETWORK`.

## Soluciones

### Opción 1: Configurar Gunicorn con Timeout Largo (RECOMENDADO)

En el backend (`analisis-back`), crea o modifica el archivo que ejecuta gunicorn:

**Crear `analisis-back/gunicorn_config.py`:**
```python
# Configuración de Gunicorn para Render
workers = 2
worker_class = 'sync'
timeout = 300  # 5 minutos
keepalive = 2
bind = '0.0.0.0:5000'
```

**Actualizar el comando de inicio en Render Dashboard:**
```bash
gunicorn -c gunicorn_config.py app:app
```

O si usas el archivo directo:
```bash
gunicorn --timeout 300 --workers 2 app:app
```

### Opción 2: Usar Web Service (no Web Server) en Render

En el Render Dashboard:
1. Ve a tu servicio
2. Settings → Build & Deploy
3. Cambia el tipo de servicio a "Web Service"
4. Esto permite timeouts más largos

### Opción 3: Actualizar a Render Paid Tier

El tier pagado permite:
- Timeouts de hasta 300 segundos (5 minutos)
- Sin sleep mode (el servidor siempre está activo)
- Mejor performance

### Opción 4: Implementar Processing Asíncrono (SOLUCIÓN AVANZADA)

Cambia la arquitectura para evitar timeouts:

1. **Endpoint para iniciar análisis:**
   ```python
   @app.route('/api/analisis-ergonomico/start', methods=['POST'])
   def start_analysis():
       task_id = str(uuid.uuid4())
       # Guardar imagen y task_id en BD o Redis
       # Iniciar procesamiento en background (Celery/RQ)
       return {'task_id': task_id, 'status': 'processing'}
   ```

2. **Endpoint para consultar estado:**
   ```python
   @app.route('/api/analisis-ergonomico/status/<task_id>')
   def check_status(task_id):
       # Consultar estado del task
       return {'status': 'completed', 'result': {...}}
   ```

3. **Frontend con polling:**
   ```javascript
   // 1. Iniciar análisis
   const { task_id } = await startAnalysis(file);

   // 2. Polling cada 3 segundos
   const interval = setInterval(async () => {
     const status = await checkStatus(task_id);
     if (status.status === 'completed') {
       clearInterval(interval);
       setResults(status.result);
     }
   }, 3000);
   ```

## Verificar Configuración Actual

**En el backend (`analisis-back`), verifica estos archivos:**

1. **Procfile o render.yaml** - Debe tener el comando de gunicorn
2. **requirements.txt** - Debe incluir gunicorn
3. **app.py** - El servidor de desarrollo Flask NO debe usarse en producción

**Ejemplo de render.yaml correcto:**
```yaml
services:
  - type: web
    name: ergonomic-poses-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn --timeout 300 --workers 2 --bind 0.0.0.0:$PORT app:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.11
      - key: FLASK_ENV
        value: production
```

## Diagnóstico

Ejecuta el script de prueba desde el frontend:
```bash
cd analisis-front-react
node test-backend.js
```

Esto te dirá si:
- El servidor está en sleep mode
- Los endpoints responden
- Hay problemas de configuración

## Configuración de CORS

Si cambias timeouts, asegúrate que CORS permita las peticiones largas.

En `analisis-back/app/__init__.py`:
```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "max_age": 3600
    }
})
```

## Monitoreo

Agrega logs para detectar timeouts:

```python
import time
import logging

@app.route('/api/analisis-ergonomico/analyze', methods=['POST'])
def analyze():
    start_time = time.time()
    logging.info(f"Analysis started at {start_time}")

    try:
        # ... proceso de análisis ...
        duration = time.time() - start_time
        logging.info(f"Analysis completed in {duration:.2f} seconds")
    except Exception as e:
        duration = time.time() - start_time
        logging.error(f"Analysis failed after {duration:.2f} seconds: {str(e)}")
        raise
```

## Recomendación Final

Para producción con Render Free Tier:
1. Usa **Opción 1** (gunicorn timeout 300)
2. Si sigue fallando, implementa **Opción 4** (procesamiento asíncrono)
3. Para la mejor experiencia, actualiza a **Render Paid Tier** ($7/mes)
