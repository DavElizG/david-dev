/**
 * Cliente base para realizar peticiones
 * Actualmente simula peticiones cargando archivos JSON locales
 * En el futuro se puede reemplazar por fetch/axios manteniendo la misma interfaz
 */

// Función genérica para obtener datos con tipado fuerte
export async function fetchData<T>(dataFile: string): Promise<T> {
  try {
    // Simulación de latencia de red (opcional, solo para testing)
    // await new Promise(resolve => setTimeout(resolve, 300));
    
    // En producción se reemplazaría por fetch real:
    // return fetch(`/api/${dataFile}`).then(res => res.json());
    
    // Importación dinámica de archivos JSON locales
    const data = await import(`../data/${dataFile}.json`);
    return data.default || data;
  } catch (error) {
    console.error(`Error fetching ${dataFile}:`, error);
    throw new Error(`Failed to fetch ${dataFile}`);
  }
}