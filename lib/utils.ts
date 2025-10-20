import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertByte(size: string | number) {
  if (!size) return "-";
  if (typeof size == "string") size = parseInt(size);

  if (size >= 1_000_000_000) return `${(size / 1_000_000_000).toFixed(2)}GB`;
  if (size >= 1_000_000) return `${(size / 1_000_000).toFixed(2)}MB`;
  if (size >= 10_000) return `${(size / 10_000).toFixed(2)}KB`;
  return `${size}B`;
}

export function getFileIcon(type: string) {
  switch (type) {
    case "apk":
      return "/static/icons/002-apk.svg";
    case "css":
      return "/static/icons/003-css.svg";
    case "doc":
      return "/static/icons/005-doc.svg";
    case "xls":
      return "/static/icons/006-excel.svg";
    case "woff":
      return "/static/icons/007-font file.svg";
    case "iso":
      return "/static/icons/008-iso.svg";
    case "js":
      return "/static/icons/009-javascript.svg";
    case "png":
      return "/static/icons/010-image.svg";
    case "jpg":
      return "/static/icons/010-image.svg";
    case "jpeg":
      return "/static/icons/010-image.svg";
    case "mp3":
      return "/static/icons/013-mp3.svg";
    case "video":
      return "/static/icons/014-video.svg";
    case "pdf":
      return "/static/icons/016-pdf.svg";
    case "php":
      return "/static/icons/016-php.svg";
    case "ppt":
      return "/static/icons/018-powerpoint.svg";
    case "sql":
      return "/static/icons/022-sql.svg";
    case "svg":
      return "/static/icons/023-svg.svg";
    case "ttf":
      return "/static/icons/025-ttf.svg";
    case "txt":
      return "/static/icons/026-text.svg";
    case "zip":
      return "/static/icons/032-zip.svg";
    default:
      return "/static/icons/024-text.svg";
  }
}
