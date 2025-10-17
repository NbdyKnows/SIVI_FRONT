import userManual from "../data/manual_usuario.txt?raw";
import systemManual from "../data/manual_sistema.txt?raw";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function getChatResponse(userMessage, attempt = 1) {
  try {
    if (!GROQ_API_KEY) {
      console.error("Falta la API Key de Groq en el archivo .env");
      return "No puedo responder porque falta la clave de conexión con Groq. Contacta al administrador.";
    }

    console.log(`Enviando mensaje a Groq (intento ${attempt}):`, userMessage.substring(0, 50) + "...");

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `Eres Roblecito, el asistente virtual del sistema SIVI (Sistema de Inventario y Ventas Integrado).
            Eres un experto en el sistema SIVI y puedes ayudar con cualquier pregunta sobre su funcionamiento.

            === MANUAL DE USUARIO ===
            ${userManual}

            === MANUAL DEL SISTEMA ===
            ${systemManual}

            INSTRUCCIONES:
            - Responde en español.
            - Sé amable, conciso y útil.
            - Explica paso a paso cuando sea necesario.
            - Si no sabes algo, sugiere consultar la documentación.`,
          },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error de Groq API:", response.status, errText);

      if (response.status === 401) {
        return "Error de autenticación con Groq. Verifica la API key.";
      } else if (response.status === 429 && attempt < 3) {
        console.warn(`Limite de solicitudes (429). Esperando 5 segundos antes del intento ${attempt + 1}...`);
        await new Promise(res => setTimeout(res, 5000));
        return await getChatResponse(userMessage, attempt + 1);
      } else if (response.status === 429) {
        return "Has alcanzado el limite de solicitudes por ahora. Espera un momento antes de intentarlo otra vez.";
      } else {
        return "Error al conectar con el servicio de IA. Inténtalo más tarde.";
      }
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      console.warn("Respuesta vacía de Groq");
      return "No pude generar una respuesta en este momento. ¿Puedes reformular tu pregunta?";
    }

    console.log("Respuesta de Roblecito:", reply.substring(0, 80) + "...");
    return reply;

  } catch (error) {
    console.error("Error en getChatResponse:", error);
    return "Ups... tuve un problema al comunicarme con Roblecito. Verifica tu conexión a internet e inténtalo de nuevo.";
  }
}
