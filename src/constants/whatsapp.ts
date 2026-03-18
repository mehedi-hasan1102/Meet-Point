export const RESTAURANT_NAME = 'Meet Point Cafe & Restaurant';
export const WHATSAPP_NUMBER = '8801747874773';
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
  return `tel:+${WHATSAPP_NUMBER}`;
};
