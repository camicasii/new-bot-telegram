import axios from "axios";
import "dotenv/config";
import QRGenerate from "../QrGenerate";

export const generateLink = async (amount: string,telegramId:string) => {
  try {
    const response = await axios.post(
      `${process.env.API_PAYWAY}/links-apikey` || "",
      {
        amount: amount,
        callbackUrl: 'https://t.me/MinerNewBot', // Add your callback URL here
        description: 'Wallet generation for receiving USDT',
        currencyId:"5b66610f-dd98-431e-95e7-d15e51f844e1",//"USDT",
        metadata: JSON.stringify({
            telegramId:telegramId,
            createdAt: new Date().toISOString(),
            amount: amount,
            description: 'Wallet generation for receiving USDT',
        })
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOKEN_PAYWAY}`,
        },
      }
    );
    const wallet = response.data.destinationAddress;
    const amount_ = response.data.amountParsed;
    const link = await QRGenerate.generateQR(
        `ethereum:${wallet}?amount=${amount_}`
    );
    
    // Crear mensaje en formato Markdown
    const markdownMessage = `
*Detalles del Pago*

📝 *Monto:* \`${response.data.amount} USDT\`
💼 *Wallet:* \`${wallet}\`

_Escanea el código QR o copia la dirección de la wallet para realizar el pago._
`;
    
    return {link, wallet, amount_, markdownMessage};
  } catch (error) {
    console.error("Error generating link preview:", error);
    throw error;
  }
};