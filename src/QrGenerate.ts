import { promises as fs } from 'fs';
import { join } from 'path';
// Reemplazando QRCode por QRCodeStyling
import QRCodeStyling,{Gradient, Options} from "qr-code-styling";
import { JSDOM } from "jsdom";
import { createCanvas, loadImage } from 'canvas';
import  nodeCanvas from 'canvas';


export default class QRGenerate {
    constructor() {
        
    }

    // Función para generar un código QR con texto "Sponsored by PayWay"
static async generateQR(text: string): Promise<string> {
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
      const canvasSize = 400;
      const qrSize = 300; // Tamaño reducido para el QR
      
      const canvas = createCanvas(canvasSize, canvasSize);
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }
      
      // Dibujar el fondo blanco
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      // Crear el QR estilizado
      const qrOptions: Options = {      
        
          "type": "canvas" as const,
          "shape": "square",
          // "width": 350,
          // "height": 350,
          "data": text,
          "margin": 0,
          "qrOptions": {
            // "typeNumber": "9",
            "mode": "Byte",
            "errorCorrectionLevel": "H"
          },
          "imageOptions": {
            "saveAsBlob": true,
            "hideBackgroundDots": true,
            "imageSize": 0.5,
            "margin": 1
          },
         
          "backgroundOptions": {
            "round": 0,
            "color": "#ffffff",
            gradient:{
              type: "linear",
              rotation: 0,
              colorStops: [
                {
                  offset: 0,
                  color: "#ffffff"
                },
                {
                  offset: 1,
                  color: "#ffffff"
                }
              ]
             } as Gradient,          
          },
          "image": "https://s3.magic-api.xyz/miscellaneous/images%20%281%29.png",
          // "image": join(__dirname, '..', 'assets', ''), // Ruta de la imagen

          "dotsOptions": {
            "type": "dots",
            "color": "#6a1a4c",
            "roundSize": true,
            "gradient": {
              "type": "linear",
              "rotation": 0,
              "colorStops": [
                {
                  "offset": 0,
                  "color": "#002e1f"
                },
                {
                  "offset": 1,
                  "color": "#57a617"
                }
              ]
            }
          },
          "cornersSquareOptions": {
            "type": "extra-rounded",
            "color": "#000000",
            gradient: {
              "type": "linear",
              "rotation": 0,            
              "colorStops": [
                {
                  "offset": 0,
                  "color": "#000000"  
                }]
              }
          
          
          
            
            
          },
          "cornersDotOptions": {
            // "type": "",
            "color": "#d32222"
          },      
  
        
      };
      
      // Para canvas type
      const qrCode = new QRCodeStyling({
        jsdom: JSDOM,
        nodeCanvas: nodeCanvas ,
        //@ts-ignore // @ts-ignore
        ...qrOptions,      
      
      });
      
      // Generar el QR como buffer
      const qrBuffer = await new Promise<Buffer>((resolve, reject) => {
        qrCode.getRawData("png")
          .then((blob: any) => resolve(Buffer.from(blob)))
          .catch((error: any) => reject(error));
      });
      
      // Cargar el buffer como imagen
      const qrImage = await loadImage(qrBuffer);
      
      // Dibujar el QR en un costado
      ctx.drawImage(qrImage, (canvasSize-qrSize)/2, (canvasSize - qrSize) / 2); // Posicionado a la izquierda
      
      // Añadir el texto "Sponsored by PayWay"
      ctx.fillStyle = '#000000';
      ctx.font = '16px DejaVu Sans';
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
}