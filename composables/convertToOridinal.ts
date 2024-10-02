import { numberToWords } from "@persian-tools/persian-tools";

export const useConvertToOridinal = (number: any) => {
  if (number === 1) return 'اول';
  if (number === 2) return 'دوم';
  if (number === 3) return 'سوم';
  if (number >= 4 && number <= 9) return numberToWords(number) + 'م';
  if (number >= 10 && number <= 12) return numberToWords(number) + 'م';

  // برای اعداد بالای 12 که به 3 تقسیم می‌شوند
  const lastDigit = number % 10;

  // اعداد استثنا
  const exceptions = [3]; // اعداد استثنا که باید "سوم" استفاده شود

  // بررسی اعداد خاص
  if (lastDigit === 0) {
    return numberToWords(number) + 'م'; // برای اعداد مثل 10، 20، 30 و ...
  }

  if (lastDigit === 3 && !exceptions.includes(number)) {
    return numberToWords(number) + 'م'; // برای اعداد 13، 23 و ...
  }

  // برای اعداد بالاتر از 12
  const tens = Math.floor(number / 10);
  if (tens > 0) {
    const tensWord = tens === 1 ? 'دهم' : (tens + 'م');
    return tensWord + ' و ' + (lastDigit === 1 ? 'اول' : lastDigit === 2 ? 'دوم' : lastDigit === 3 ? 'سوم' : lastDigit + 'م');
  }

  return numberToWords(number) + 'م';

}
