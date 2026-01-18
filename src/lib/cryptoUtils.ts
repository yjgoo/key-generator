export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const sanitized = base64.replace(/\s+/g, '');
  const binary = atob(sanitized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function formatPem(base64: string, label: string): string {
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

export function pemToArrayBuffer(pem: string): ArrayBuffer {
  const sanitized = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');
  return base64ToArrayBuffer(sanitized);
}

export async function exportKeyToPem(
  key: CryptoKey,
  format: 'spki' | 'pkcs8',
  label: 'PUBLIC KEY' | 'PRIVATE KEY'
): Promise<string> {
  const exported = await crypto.subtle.exportKey(format, key);
  const base64 = arrayBufferToBase64(exported);
  return formatPem(base64, label);
}

export async function importKeyFromPem(
  pem: string,
  format: 'spki' | 'pkcs8',
  algorithm: AlgorithmIdentifier | RsaHashedImportParams,
  usages: KeyUsage[]
): Promise<CryptoKey> {
  const keyData = pemToArrayBuffer(pem);
  return crypto.subtle.importKey(format, keyData, algorithm, true, usages);
}
