/**
 * Estructura de datos para el formulario de contacto
 */
export interface FormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Estado del formulario de contacto 
 */
export interface FormStatus {
  success?: boolean;
  message?: string;
}