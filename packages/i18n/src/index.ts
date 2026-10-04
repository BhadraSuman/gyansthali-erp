import en from '../messages/en.json';
import hi from '../messages/hi.json';

export const messages = {
  en,
  hi,
} as const;

export type SupportedLocale = keyof typeof messages;
export type Messages = typeof en;

export function getMessages(locale: string): Messages {
  if (locale === 'hi') return hi as unknown as Messages;
  return en;
}

export default messages;
