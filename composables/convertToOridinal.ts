import { numberToWords } from "@persian-tools/persian-tools";

export const useConvertToOridinal = (number: any) => {
  if (number === 1) return 'اول';
  if (number === 2) return 'دوم';
  if (number === 3) return 'سوم';
  if (number >= 4) return numberToWords(number) + 'م';
}
