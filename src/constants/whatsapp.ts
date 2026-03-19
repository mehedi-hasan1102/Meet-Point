import { siteContact } from '@/constants/site-contact';

export const RESTAURANT_NAME = siteContact.restaurant.name;
export const WHATSAPP_NUMBER = siteContact.contact.whatsappNumber;
export const WHATSAPP_ORDER_MESSAGE = `Hi, I want to place an order from ${RESTAURANT_NAME}.`;

export const getWhatsAppOrderUrl = () => {
  const encodedMessage = encodeURIComponent(WHATSAPP_ORDER_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const getWhatsAppUrlWithMessage = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const getDirectCallUrl = () => {
  return `tel:${siteContact.contact.phoneDial}`;
};
