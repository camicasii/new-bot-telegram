import TelegramBot from 'node-telegram-bot-api';
import "dotenv/config";
import { promises as fs } from 'fs';
import { join } from 'path';
import QRCode from 'qrcode';
// qr-code-styling no es compatible directamente con Node.js ya que depende del DOM
// vamos a instalar canvas para hacerlo funcionar en Node.js
import { createCanvas, loadImage } from 'canvas';

// Aquí debes poner el token que te da BotFather
const token: string = process.env.TOKEN as string;

const bot: TelegramBot = new TelegramBot(token, { polling: true });

// Definir comandos disponibles
bot.setMyCommands([
  { command: '/start', description: 'Envía un mensaje de bienvenida' },
  { command: '/pagar', description: 'Muestra una imagen de pago' },
  { command: '/qr', description: 'Genera un código QR' }
]);

// Menú principal con tres botones
const mainMenu: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '👋 Hola', callback_data: 'hola' },
        { text: '💰 Pagar', callback_data: 'pagar' }
      ],
      [
        { text: '📱 Generar QR', callback_data: 'qr' }
      ]
    ]
  }
};

// Función para generar un código QR con texto "Sponsored by PayWay"
async function generateQR(text: string): Promise<string> {
  const tempDir = join(__dirname, '..', 'temp');
  
  // Asegurarse de que el directorio temporal existe
  try {
    await fs.mkdir(tempDir, { recursive: true });
  } catch (error) {
    console.error('Error al crear directorio temporal:', error);
  }
  
  const finalFilePath = join(tempDir, `qr-final-${Date.now()}.png`);
  
  try {
    // Crear un canvas personalizado con el texto "Sponsored by PayWay"
    const canvasSize = 350;
    // Reducir el tamaño del QR para que sea más pequeño
    const qrSize = 350; // Reducido de 300 a 150 para hacerlo más pequeño
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }
    
    // Generar el código QR
    const qrCanvas = createCanvas(qrSize, qrSize);
    await QRCode.toCanvas(qrCanvas, text, {
      errorCorrectionLevel: 'L',
      scale: 10,
      width: qrSize,
    });
    
    // Dibujar el fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Dibujar el QR en un costado en lugar del centro
    ctx.drawImage(qrCanvas, 0,0 ); // Posicionado a la izquierda
    
    // Añadir el texto "Sponsored by PayWay"
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Sponsored by PayWay', canvasSize / 2, canvasSize - 20);
    
    // Convertir el canvas a un buffer de imagen PNG
    const buffer = canvas.toBuffer('image/png');
    
    // Guardar el buffer como archivo
    await fs.writeFile(finalFilePath, buffer);
    
    console.log(`QR generado: ${finalFilePath}`);
    return finalFilePath;
  } catch (error) {
    console.error('Error al generar el código QR:', error);
    throw error;
  }
}

// Manejador de mensajes
bot.on('message', async (msg: TelegramBot.Message) => {
  const chatId: number = msg.chat.id;
  const text: string = msg.text?.trim() || '';

  // Manejo de comandos
  if (text === '/start') {
    bot.sendMessage(chatId, 'Selecciona una opción:', mainMenu);
    return;
  }

  if (text === '/pagar') {
    bot.sendPhoto(chatId, 'https://placehold.co/600x400');
    return;
  }
  
  if (text === '/qr') {
    await handleQRRequest(chatId);
    return;
  }
  // console.log(`Mensaje recibido
  // : ${text}`,msmsg.reply_to_messagg);
  console.log(msg.reply_to_message?.text);
  
  
  // Verificar si el mensaje es en respuesta a una solicitud de QR
  if (msg.reply_to_message) {
    
    const replyMarkup = msg.reply_to_message;
    console.log(JSON.stringify(replyMarkup),JSON.stringify(replyMarkup).includes('código QR'));
    
    if (replyMarkup && JSON.stringify(replyMarkup).includes('código QR')) {
      await generateAndSendQR(chatId, text);
      // handleQRRequest(chatId);
      return;
    }
  }
});

// Función para manejar la solicitud de QR
async function handleQRRequest(chatId: number): Promise<void> {
  bot.sendMessage(chatId, '¿Qué texto o URL quieres convertir en código QR? Responde a este mensaje:', {
    reply_markup: {
      force_reply: true,
      input_field_placeholder: 'Ejemplo: https://telegram.org',
      selective: true,
    },
  });
  // bot.once('message', async  (msg) => {
  //   const text = msg.text?.trim() || '';
  //   if (text) {
  //     // bot.sendMessage(chatId, 'Generando QR, espera un momento...');
  //     generateAndSendQR(chatId, text);
  //   } else {
  //     bot.sendMessage(chatId, 'Por favor, envía un texto o URL válido.');
  //   }
  // });
}

// Función para generar y enviar el código QR
async function generateAndSendQR(chatId: number, text: string): Promise<void> {
  try {
    bot.sendMessage(chatId, 'Generando QR, espera un momento...');
    
    const qrPath = await generateQR(text);
    console.log(`QR generado: ${qrPath}`);
    
    
    // Enviar el QR como foto
    await bot.sendPhoto(chatId, qrPath, {
      caption: `QR generado para: ${text}`
    });
    
    // Eliminar el archivo temporal
    try {
      await fs.unlink(qrPath);
    } catch (error) {
      console.error('Error al eliminar archivo temporal:', error);
    }
  } catch (error) {
    console.error('Error al generar QR:', error);
    bot.sendMessage(chatId, 'Hubo un error al generar el código QR. Por favor, intenta nuevamente.');
  }
}

// Manejador de callbacks (botones inline)
bot.on('callback_query', async (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (!message || !data) return;

  const chatId = message.chat.id;

  switch (data) {
    case 'hola':
      bot.sendMessage(chatId, 'hola');
      break;
    case 'pagar':
      bot.sendPhoto(chatId, 'https://placehold.co/600x400');
      break;
    case 'qr':
      await handleQRRequest(chatId);
      break;
  }
});

bot.on('polling_error', (error) => {
  console.error(`Polling error: ${error} - ${error.message}`);
});

process.on('SIGINT', () => {
  console.log('Bot stopped');
  bot.stopPolling();
  process.exit();
});

