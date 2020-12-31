import { decodeURIComponent } from '@lunjs/decode-uri-component'

export function getKeywordFromKBBIURL (url: string): string {
  return decodeURIComponent(url
    .replace('https://kbbi.kemdikbud.go.id/', '')
    .replace('entri/', '')
    .replace('cari/hasil?frasa=', '')) || ''
}