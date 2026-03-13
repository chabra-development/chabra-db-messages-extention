/**
 * Re-exporta os enums do Prisma como constantes locais para uso em
 * Client Components, evitando o import direto de @prisma/client no browser.
 */

export const MessageDirection = {
  SENT:     "SENT",
  RECEIVED: "RECEIVED",
} as const;

export type MessageDirection = (typeof MessageDirection)[keyof typeof MessageDirection];
