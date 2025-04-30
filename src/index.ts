import TelegramBot from 'node-telegram-bot-api';
import "dotenv/config"

// Aquí debes poner el token que te da BotFather
const token: string = process.env.TOKEN as string;

const bot: TelegramBot = new TelegramBot(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Inicia el bot y muestra el menú principal' },
  { command: '/menu', description: 'Muestra el menú principal' },
]);

const mainMenu: TelegramBot.SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🎉 BIENVENIDO', callback_data: '🎉 BIENVENIDO' },
        { text: '🤔 QUÉ ES LA COMUNIDAD', callback_data: '🤔 QUÉ ES LA COMUNIDAD' }
      ],
      [
        { text: '💼 EQUIPO PROFIT', callback_data: '💼 EQUIPO PROFIT' },
        { text: '📚 PARA QUÉ SIRVE CADA GRUPO', callback_data: '📚 PARA QUÉ SIRVE CADA GRUPO' }
      ],
      [
        { text: '🖥️ TU PLATAFORMA', callback_data: '🖥️ TU PLATAFORMA' },
        { text: '🌟 JIFU', callback_data: '🌟 JIFU' }
      ],
      [
        { text: '💳 WALLET', callback_data: '💳 WALLET' },
        { text: '📈 BROKER', callback_data: '📈 BROKER' }
      ],
      [
        { text: '🤖 AUTOMATICO', callback_data: '🤖 AUTOMATICO' },
        { text: '📝 MANUAL', callback_data: '📝 MANUAL' }
      ],
      [
        { text: '🎓 BECA JIFU', callback_data: '🎓 BECA JIFU' },
        { text: '🏢 OFICINA', callback_data: '🏢 OFICINA' }
      ],
      [
        { text: '🚪 SALIR', callback_data: '🚪 SALIR' }
      ]
    ]
  }
};

const subMenus: Record<string, TelegramBot.SendMessageOptions> = {
  '🌟 JIFU': {
    reply_markup: {
      keyboard: [
        [{ text: 'PASEO POR LA PLATAFORMA' },{ text: 'BÁSICOS DE PAULO VAZ' }],        
        [{ text: 'JIFU CONECT' },{ text: 'TAP TO TRADE' }],
        
      ],      
      inline_keyboard: [
        [
          { text: '🛤️ PASEO POR LA PLATAFORMA', callback_data: '🛤️ PASEO POR LA PLATAFORMA' },
          { text: '📖 BÁSICOS DE PAULO VAZ', callback_data: '📖 BÁSICOS DE PAULO VAZ' }
        ],
        [
          { text: '🔗 JIFU CONECT', callback_data: '🔗 JIFU CONECT' },
          { text: '📲 TAP TO TRADE', callback_data: '📲 TAP TO TRADE' }
        ],
        [
          { text: '📊 ENTIENDE EL TRADING', callback_data: '📊 ENTIENDE EL TRADING' },
          { text: '📋 METATRADER/COPIAR Y PEGAR SEÑALES', callback_data: '📋 METATRADER/COPIAR Y PEGAR SEÑALES' }
        ],
        [
          { text: '🎯 TP/SL/OPERACIONES PROGRAMADAS', callback_data: '🎯 TP/SL/OPERACIONES PROGRAMADAS' },
          { text: '🛡️ CÓMO ASEGURAR ESTRATEGIAS', callback_data: '🛡️ CÓMO ASEGURAR ESTRATEGIAS' }
        ],
        [
          { text: '🔙 VOLVER', callback_data: '🔙 VOLVER' }
        ]
      ]
    }
  },
  '💳 WALLET': {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '💼 QUÉ ES UNA WALLET', callback_data: '💼 QUÉ ES UNA WALLET' },
          { text: '💵 ABRE Y RECARGA BINANCE LATAM', callback_data: '💵 ABRE Y RECARGA BINANCE LATAM' }
        ],
        [
          { text: '💶 ABRE Y RECARGA BINANCE/KUCOIN EUROPA', callback_data: '💶 ABRE Y RECARGA BINANCE/KUCOIN EUROPA' },
          { text: '💸 RETIRA BINANCE LATAM', callback_data: '💸 RETIRA BINANCE LATAM' }
        ],
        [
          { text: '💳 RETIRA BINANCE/KUCOIN EUR', callback_data: '💳 RETIRA BINANCE/KUCOIN EUR' },
          { text: '🔙 VOLVER', callback_data: '🔙 VOLVER' }
        ]
      ]
    }
  },
  '📈 BROKER': {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📊 QUÉ ES UN BROKER', callback_data: '📊 QUÉ ES UN BROKER' },
          { text: '📂 ABRE TU CUENTA', callback_data: '📂 ABRE TU CUENTA' }
        ],
        [
          { text: '🏦 MULTIBANK', callback_data: '🏦 MULTIBANK' },
          { text: '💰 CÓMO INGRESAR EN MULTIBANK', callback_data: '💰 CÓMO INGRESAR EN MULTIBANK' }
        ],
        [
          { text: '💸 CÓMO RETIRAR EN MULTIBANK', callback_data: '💸 CÓMO RETIRAR EN MULTIBANK' },
          { text: '🔙 VOLVER', callback_data: '🔙 VOLVER' }
        ]
      ]
    }
  },
  '🤖 AUTOMATICO': {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '⚙️ ELIGE TU MANERA DE GENERAR AUTOMÁTICO', callback_data: '⚙️ ELIGE TU MANERA DE GENERAR AUTOMÁTICO' },
          { text: '📈 CÓMO FUNCIONA EL AUTOMÁTICO', callback_data: '📈 CÓMO FUNCIONA EL AUTOMÁTICO' }
        ],
        [
          { text: '🔗 CONECTA AL AUTOMÁTICO', callback_data: '🔗 CONECTA AL AUTOMÁTICO' },
          { text: '💵 FONDEO', callback_data: '💵 FONDEO' }
        ],
        [
          { text: '🔙 VOLVER', callback_data: '🔙 VOLVER' }
        ]
      ]
    }
  },
  '💵 FONDEO': {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📂 ABRE TU CUENTA DE FONDEO', callback_data: '📂 ABRE TU CUENTA DE FONDEO' },
          { text: '📊 ELIGE LA CUENTA QUE MÁS TE GUSTE (FTMO/5TERS/AXI)', callback_data: '📊 ELIGE LA CUENTA QUE MÁS TE GUSTE (FTMO/5TERS/AXI)' }
        ],
        [
          { text: '📈 QUÉ ES ESTRATEGIA', callback_data: '📈 QUÉ ES ESTRATEGIA' },
          { text: '📋 ELIJO PARA FONDEARME', callback_data: '📋 ELIJO PARA FONDEARME' }
        ],
        [
          { text: '📐 QUÉ LOTAJE TENGO QUE UTILIZAR', callback_data: '📐 QUÉ LOTAJE TENGO QUE UTILIZAR' },
          { text: '🔙 VOLVER', callback_data: '🔙 VOLVER' }
        ]
      ]
    }
  },
  '📝 MANUAL': {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📋 CÓMO LLEVAR TU CUENTA MANUAL', callback_data: '📋 CÓMO LLEVAR TU CUENTA MANUAL' },
          { text: '📐 CÓMO CALCULAR LOTAJE (WEB FXBOOK)', callback_data: '📐 CÓMO CALCULAR LOTAJE (WEB FXBOOK)' }
        ],
        [
          { text: '🔙 VOLVER', callback_data: '🔙 VOLVER' }
        ]
      ]
    }
  },
  '🎓 BECA JIFU': {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🎉 BENEFICIOS DE LA BECA JIFU', callback_data: '🎉 BENEFICIOS DE LA BECA JIFU' },
          { text: '📝 CÓMO HACER UNA LISTA', callback_data: '📝 CÓMO HACER UNA LISTA' }
        ],
        [
          { text: '📈 CÓMO SUBIR HISTORIAS CON RESULTADOS', callback_data: '📈 CÓMO SUBIR HISTORIAS CON RESULTADOS' },
          { text: '🔙 VOLVER', callback_data: '🔙 VOLVER' }
        ]
      ]
    }
  },
  '🏢 OFICINA': {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📨 CÓMO INVITAR', callback_data: '📨 CÓMO INVITAR' },
          { text: '🔗 CÓMO SACAR TU LINK DE REGISTRO', callback_data: '🔗 CÓMO SACAR TU LINK DE REGISTRO' }
        ],
        [
          { text: '🔄 CÓMO RENOVAR', callback_data: '🔄 CÓMO RENOVAR' },
          { text: '📊 CÓMO POSICIONAR', callback_data: '📊 CÓMO POSICIONAR' }
        ],
        [
          { text: '🔙 VOLVER', callback_data: '🔙 VOLVER' }
        ]
      ]
    }
  }
};

// Funciones que responden a mensaje (aquí debes personalizar los textos que quieras enviar)
function getResponse(text: string): string {
  switch(text) {
    case '🎉 BIENVENIDO':
      return '¡Bienvenido! Aquí encontrarás toda la información para operar con éxito.';
    case '🤔 QUÉ ES LA COMUNIDAD':
      return 'Nuestra comunidad está enfocada en ayuda y crecimiento conjunto en trading.';
    case '💼 EQUIPO PROFIT':
      return 'Nuestro equipo Profit está compuesto por expertos en estrategias de trading.';
    case '📚 PARA QUÉ SIRVE CADA GRUPO':
      return 'Cada grupo tiene un propósito específico, desde formación hasta ejecución.';
    case '🖥️ TU PLATAFORMA':
      return 'Aquí te guiamos para sacar el mayor provecho de tu plataforma de trading.';
    case '🛤️ PASEO POR LA PLATAFORMA':
      return 'Te mostraremos las secciones clave de la plataforma JIFU.';
    case '📖 BÁSICOS DE PAULO VAZ':
      return 'Fundamentos esenciales dados por Paulo Vaz para un trading sólido.';
    case '🔗 JIFU CONECT':
      return 'JIFU Conect es una funcionalidad para conectar tus cuentas de trading.';
    case '📲 TAP TO TRADE':
      return 'Funcionalidad para ejecutar operaciones rápidamente con un toque.';
    case '📊 ENTIENDE EL TRADING':
      return 'Conceptos básicos para entender el trading y sus riesgos.';
    case '📋 METATRADER/COPIAR Y PEGAR SEÑALES':
      return 'Guía para usar Metatrader y copiar señales fácilmente.';
    case '🎯 TP/SL/OPERACIONES PROGRAMADAS':
      return 'Explicación de Take Profit, Stop Loss y operaciones programadas.';
    case '🛡️ CÓMO ASEGURAR ESTRATEGIAS':
      return 'Aprende a proteger tus estrategias para minimizar pérdidas.';
    case '💼 QUÉ ES UNA WALLET':
      return 'Una wallet es una billetera digital para almacenar criptomonedas.';
    case '💵 ABRE Y RECARGA BINANCE LATAM':
      return 'Pasos para abrir y recargar tu cuenta Binance LATAM.';
    case '💶 ABRE Y RECARGA BINANCE/KUCOIN EUROPA':
      return 'Cómo abrir y recargar en Binance o Kucoin para Europa.';
    case '💸 RETIRA BINANCE LATAM':
      return 'Procedimiento para retirar fondos de Binance LATAM.';
    case '💳 RETIRA BINANCE/KUCOIN EUR':
      return 'Procedimiento para retirar fondos de Binance o Kucoin EUR.';
    case '📊 QUÉ ES UN BROKER':
      return 'Un broker es una entidad que facilita la compra y venta en mercados.';
    case '📂 ABRE TU CUENTA':
      return 'Guía para abrir tu cuenta con un broker.';
    case '🏦 MULTIBANK':
      return 'Información acerca de MultiBank para tus operaciones.';
    case '💰 CÓMO INGRESAR EN MULTIBANK':
      return 'Paso a paso para ingresar fondos en MultiBank.';
    case '💸 CÓMO RETIRAR EN MULTIBANK':
      return 'Aquí aprenderás a retirar fondos en MultiBank.';
    case '⚙️ ELIGE TU MANERA DE GENERAR AUTOMÁTICO':
      return 'Opciones para generar ganancias automáticas.';
    case '📈 CÓMO FUNCIONA EL AUTOMÁTICO':
      return 'Explicamos el funcionamiento del trading automático.';
    case '🔗 CONECTA AL AUTOMÁTICO':
      return 'Instrucciones para conectar sistemas automáticos.';
    case '💵 FONDEO':
      return 'Aquí puedes conocer más sobre cuentas de fondeo.';
    case '📂 ABRE TU CUENTA DE FONDEO':
      return 'Cómo abrir una cuenta de fondeo para operar.';
    case '📊 ELIGE LA CUENTA QUE MÁS TE GUSTE (FTMO/5TERS/AXI)':
      return 'Comparativa de cuentas de fondeo disponibles.';
    case '📈 QUÉ ES ESTRATEGIA':
      return 'Concepto de estrategia en trading.';
    case '📋 ELIJO PARA FONDEARME':
      return 'Consejos para elegir estrategia para fondearte.';
    case '📐 QUÉ LOTAJE TENGO QUE UTILIZAR':
      return 'Guía para determinar el lotaje correcto.';
    case '📋 CÓMO LLEVAR TU CUENTA MANUAL':
      return 'Consejos para el manejo manual de tu cuenta.';
    case '📐 CÓMO CALCULAR LOTAJE (WEB FXBOOK)':
      return 'Uso de Web FXBook para calcular lotaje.';
    case '🎉 BENEFICIOS DE LA BECA JIFU':
      return 'Beneficios que ofrece la beca JIFU.';
    case '📝 CÓMO HACER UNA LISTA':
      return 'Pasos para hacer una lista efectiva.';
    case '📈 CÓMO SUBIR HISTORIAS CON RESULTADOS':
      return 'Cómo subir tus resultados en historias.';
    case '📨 CÓMO INVITAR':
      return 'Forma correcta para invitar personas.';
    case '🔗 CÓMO SACAR TU LINK DE REGISTRO':
      return 'Generar tu link de registro personalizado.';
    case '🔄 CÓMO RENOVAR':
      return 'Pasos para renovar tu membresía o cuenta.';
    case '📊 CÓMO POSICIONAR':
      return 'Estrategias para posicionarte dentro de la comunidad.';
    default:
      return "No tengo información sobre ese tema. Por favor, selecciona una opción válida.";
  }
}

bot.on('message', (msg: TelegramBot.Message) => {
  const chatId: number = msg.chat.id;
  const text: string = msg.text?.trim() || '';

  // Comando para iniciar desde menú principal
  if (text === '/start' || text === '/menu') {
    bot.sendMessage(chatId, 'Selecciona una opción del menú:', mainMenu);
    return;
  }

  // Revisar si el texto coincide con un submenu para desplegarlo
  if (subMenus[text]) {
    bot.sendMessage(chatId, `Sub menú: ${text}`, subMenus[text]);
    return;
  }

  // Responder con el texto correspondiente
  const response: string = getResponse(text);
  bot.sendMessage(chatId, response);
});

bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (!message || !data) return;

  const chatId = message.chat.id;

  if (data === '🚪 SALIR' || data === '🔙 VOLVER') {
    bot.sendMessage(chatId, 'Selecciona una opción del menú:', mainMenu);
    return;
  }

  if (subMenus[data]) {
    bot.sendMessage(chatId, `Sub menú: ${data}`, subMenus[data]);
    return;
  }

  const response = getResponse(data);
  bot.sendMessage(chatId, response);
});
