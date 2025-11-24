import authService from './authService';
import { API_BASE_URL } from '../config/appConfig'; 

const CHAT_API_URL = `${API_BASE_URL}/chat`;

/**
 * @param {string} userMessage El mensaje del usuario.
 * @returns {Promise<string>} La respuesta del chatbot.
 */
export async function getChatResponse(userMessage) {
  try {
    if (!userMessage || userMessage.trim() === "") {
      return "Por favor, escribe un mensaje.";
    }

    const token = authService.getAccessToken();

    if (!token || token === 'local_token') {
      if (token === 'local_token') {
        return "Roblecito no está disponible en modo de prueba local. Inicia sesión contra el servidor.";
      }
      console.error("Error de chatService: No se proporcionó token.");
      return "Error de autenticación. Por favor, inicia sesión de nuevo.";
    }
    
    console.log("Enviando mensaje a nuestro backend:", userMessage.substring(0, 50) + "...");

    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt: userMessage 
      }),
    });

    if (response.status === 401 || response.status === 403) {
        console.error("Error 401/403: Token inválido o expirado.");
        return "Tu sesión ha expirado. Por favor, refresca la página e inicia sesión.";
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error del backend:", response.status, errText);
      return "Error al conectar con el servidor. Inténtalo más tarde.";
    }

    const data = await response.json();
    const reply = data.reply;

    if (!reply) {
      console.warn("Respuesta vacía del backend");
      return "No pude generar una respuesta en este momento. ¿Puedes reformular tu pregunta?";
    }

    console.log("Respuesta de Roblecito (desde backend):", reply.substring(0, 80) + "...");
    return reply;

  } catch (error) {
    console.error("Error en getChatResponse:", error);
    return "Ups... tuve un problema de conexión. Verifica tu internet e inténtalo de nuevo.";
  }
}