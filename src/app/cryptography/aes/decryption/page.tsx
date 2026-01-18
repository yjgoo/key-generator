'use client';

import { useState } from 'react';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';
import { base64ToArrayBuffer } from '@/lib/cryptoUtils';

export default function AesDecryptionPage() {
  const [ciphertext, setCiphertext] = useState('');
  const [keyBase64, setKeyBase64] = useState('');
  const [ivBase64, setIvBase64] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [error, setError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const decrypt = async () => {
    setError('');
    setIsDecrypting(true);
    try {
      const keyBytes = new Uint8Array(base64ToArrayBuffer(keyBase64));
      if (![16, 24, 32].includes(keyBytes.length)) {
        throw new Error('Key must be 16, 24, or 32 bytes (Base64).');
      }
      const ivBytes = new Uint8Array(base64ToArrayBuffer(ivBase64));
      if (ivBytes.length !== 12) {
        throw new Error('IV must be 12 bytes (Base64) for AES-GCM.');
      }

      const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt']);
      const cipherBytes = base64ToArrayBuffer(ciphertext);
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivBytes }, key, cipherBytes);
      setPlaintext(new TextDecoder().decode(decrypted));
    } catch (err) {
      console.error(err);
      setError('Decryption failed. Please check inputs.');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <CryptoPageShell
      title="AES Decryption"
      description="Decrypt AES-GCM ciphertext with a Base64 key and IV."
      breadcrumbLabel="AES Decryption"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ciphertext (Base64)</label>
          <textarea
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste Base64 ciphertext"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key (Base64)</label>
            <textarea
              value={keyBase64}
              onChange={(e) => setKeyBase64(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste Base64 key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IV (Base64)</label>
            <textarea
              value={ivBase64}
              onChange={(e) => setIvBase64(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste Base64 IV"
            />
          </div>
        </div>

        <button
          onClick={decrypt}
          disabled={isDecrypting || !ciphertext || !keyBase64 || !ivBase64}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60"
        >
          {isDecrypting ? 'Decrypting...' : 'Decrypt'}
        </button>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plaintext</label>
          <textarea
            value={plaintext}
            readOnly
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            placeholder="Decrypted text will appear here"
          />
        </div>
      </div>
    </CryptoPageShell>
  );
}
