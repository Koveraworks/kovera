// Coordinator desk
export const WHATSAPP_NUMBER = '918053123817';
export const PHONE_DISPLAY = '+91 80531 23817';
export const PHONE_TEL = 'tel:+918053123817';

export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
