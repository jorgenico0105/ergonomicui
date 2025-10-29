// Script para probar la conectividad con el backend
// Ejecuta: node test-backend.js

const axios = require('axios');

const API_BASE_URL = 'https://ergonomic-poses-2.onrender.com';

async function testBackend() {
  console.log('🔍 Probando conexión con el backend...\n');

  // Test 1: Health check
  try {
    console.log('1️⃣ Probando /health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 10000
    });
    console.log('✅ Health check OK:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check falló:', error.message);
    if (error.code === 'ECONNABORTED') {
      console.log('   → El servidor tardó más de 10 segundos (probablemente está en sleep)');
    }
  }

  console.log('\n');

  // Test 2: Ergonomic module
  try {
    console.log('2️⃣ Probando /api/analisis-ergonomico/test endpoint...');
    const ergoResponse = await axios.get(`${API_BASE_URL}/api/analisis-ergonomico/test`, {
      timeout: 10000
    });
    console.log('✅ Módulo ergonómico OK:', ergoResponse.data);
  } catch (error) {
    console.log('❌ Módulo ergonómico falló:', error.message);
  }

  console.log('\n');

  // Test 3: Postural module
  try {
    console.log('3️⃣ Probando /api/analisis-postural/test endpoint...');
    const posturalResponse = await axios.get(`${API_BASE_URL}/api/analisis-postural/test`, {
      timeout: 10000
    });
    console.log('✅ Módulo postural OK:', posturalResponse.data);
  } catch (error) {
    console.log('❌ Módulo postural falló:', error.message);
  }

  console.log('\n📊 Resumen de diagnóstico:\n');
  console.log('Si todos los tests fallaron:');
  console.log('  → El servidor de Render está dormido (sleep mode)');
  console.log('  → Espera 30-60 segundos y vuelve a intentar');
  console.log('  → Considera actualizar a Render paid tier para evitar sleep mode\n');

  console.log('Si solo el health funciona pero los módulos fallan:');
  console.log('  → Hay un problema en la configuración de blueprints del backend\n');

  console.log('Si todo funciona pero el análisis falla:');
  console.log('  → El timeout de 30 segundos de Render está cortando la petición');
  console.log('  → Necesitas configurar gunicorn con timeout más largo en render.yaml');
}

testBackend().catch(console.error);
