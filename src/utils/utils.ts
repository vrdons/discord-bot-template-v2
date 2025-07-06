export function flatten(obj: Record<string, any>, prefix = ""): Record<string, any> {
  return Object.keys(obj).reduce(
    (acc: Record<string, any>, k) => {
      const pre = prefix.length ? prefix + "." : "";
      if (typeof obj[k] === "object") Object.assign(acc, flatten(obj[k], pre + k));
      else acc[pre + k] = obj[k];
      return acc;
    },
    {} as Record<string, any>
  );
}

export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
export const arrayToMap = <T>(arr: T[], keyFn: (i: T) => string) => new Map(arr.map((i) => [keyFn(i), i]));
export function checkInHere(userID: string, array: string[]) {
  return array.includes(userID);
}

/**
 * Belirtilen yüzdeye göre Discord emoji tabanlı bir yükleme çubuğu oluşturur.
 *
 * @param percentage - Gösterilecek ilerleme yüzdesi (0-100 arası)
 * @param size - Yükleme çubuğunun toplam genişliği (varsayılan: 10)
 * @param options - Özelleştirme seçenekleri
 * @returns Oluşturulan emoji yükleme çubuğu metni
 */
export function emojiLoadingBar(
  percentage: number,
  size: number = 10,
  options: {
    showPercentage?: boolean;
  } = {},
  icons: {
    fillStart: string;
    fillMiddle: string;
    fillEnd: string;
    empty: string;
    emptyEnd: string;
  }
): string {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const { showPercentage = true } = options;
  const { fillStart, fillMiddle, fillEnd, empty, emptyEnd } = icons;

  const filledBars = Math.round((clampedPercentage / 100) * size);

  if (filledBars === 0) {
    let bar = empty.repeat(size - 1) + emptyEnd;
    return showPercentage ? `${bar} ${Math.round(clampedPercentage)}%` : bar;
  } else if (filledBars === size) {
    let bar = fillStart + fillMiddle.repeat(size - 2) + fillEnd;
    return showPercentage ? `${bar} ${Math.round(clampedPercentage)}%` : bar;
  } else {
    let bar = fillStart;
    if (filledBars > 1) {
      bar += fillMiddle.repeat(filledBars - 1);
    }
    if (size - filledBars > 0) {
      bar += empty.repeat(size - filledBars - 1) + emptyEnd;
    }

    return showPercentage ? `${bar} ${Math.round(clampedPercentage)}%` : bar;
  }
}

/**
 * Bir parçanın toplama göre yüzdesini hesaplar.
 *
 * @param part - Hesaplanacak parça değeri
 * @param total - Toplam değer
 * @param options - Hesaplama seçenekleri
 * @returns Hesaplanan yüzde değeri
 */
export function calculatePercentage(
  part: number,
  total: number,
  options: {
    decimals?: number;
    clamp?: boolean;
  } = {}
): number {
  const { decimals = 2, clamp = true } = options;
  if (total === 0) {
    return 0;
  }
  let percentage = (part / total) * 100;
  percentage = Number(percentage.toFixed(decimals));
  return clamp ? Math.max(0, Math.min(100, percentage)) : percentage;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
