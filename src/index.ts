import TelegramBot from 'node-telegram-bot-api';
import "dotenv/config";
import { promises as fs } from 'fs';
import QRGenerate from './QrGenerate';
import { generateLink } from './assets/generateLink';
import path, { join } from 'path';

// Aquí debes poner el token que te da BotFather
const token: string = process.env.TOKEN as string;

const bot: TelegramBot = new TelegramBot(token, { polling: true });

// Definir comandos disponibles
bot.setMyCommands([
  { command: '/start', description: 'Envía un mensaje de bienvenida' },
  // { command: '/pagar', description: 'Muestra una imagen de pago' },
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
  
  
  // Verificar si el mensaje es en respuesta a una solicitud de QR
  if (msg.reply_to_message) {
    
    const replyMarkup = msg.reply_to_message;
    console.log(JSON.stringify(replyMarkup),JSON.stringify(replyMarkup).includes('código QR'));
    
    if (replyMarkup &&( JSON.stringify(replyMarkup).includes('Ingrese el monto que desea agregar')
    || JSON.stringify(replyMarkup).includes('Por favor, ingresa un monto válido') )) {    
     const amount = text.replace(/[^0-9]/g, ''); 
     if (amount && !isNaN(Number(amount))) {
      //  const link = await QRGenerate.generateQR(amount, msg.chat.id);    
      const {link, wallet, amount_, markdownMessage} = await generateLink(amount, msg.chat.id.toString());
      
      // Primero enviamos la foto del QR
const data_  =await fs.readFile(path.join(link))
      
      const photo = await bot.sendPhoto(chatId, data_, {
        
        caption: 'Escanea el código QR o copia la dirección de la wallet para realizar el pago.',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💰 Pagar', url: `https://t.me/MinerNewBot?start=${wallet}` }
            ]
          ]
        }
      },{filename: 'qr.png',
        contentType: 'image/png',
      });
      fs.unlink(link)
      // Luego enviamos el mensaje en Markdown con los detalles
      await bot.sendMessage(chatId, markdownMessage, {
        parse_mode: 'Markdown'
      });
     }
     else{
        bot.sendMessage(chatId, 'Por favor, ingresa un monto válido.');
     }
    }
    
  }
});

// Función para manejar la solicitud de QR
async function handleQRRequest(chatId: number): Promise<void> {
  bot.sendMessage(chatId, 
    'Ingrese el monto que desea agregar', {
    reply_markup: {
      force_reply: true,
      input_field_placeholder: 'Ejemplo: 100$',
      selective: true,
    },
  });
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
  bot.closeWebHook();
  process.exit();
});

