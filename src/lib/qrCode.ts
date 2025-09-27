import QRCode from 'qrcode';
import { QRCodeData } from '@/types';

export const generateQRCode = async (data: QRCodeData): Promise<string> => {
  const qrData = JSON.stringify(data);
  return await QRCode.toDataURL(qrData, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
};

export const parseQRCode = (qrData: string): QRCodeData | null => {
  try {
    return JSON.parse(qrData);
  } catch (error) {
    console.error('Error parsing QR code data:', error);
    return null;
  }
};

export const downloadQRCode = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
