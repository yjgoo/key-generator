'use client';

import { useState } from 'react';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';
import { CopyButton } from '@/components/crypto/CopyButton';
import { arrayBufferToBase64, base64ToArrayBuffer } from '@/lib/cryptoUtils';

export default function AesEncryptionPage() {
  const [plaintext, setPlaintext] = useState('');
  const [keyBase64, setKeyBase64] = useState('');
  const [ivBase64, setIvBase64] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [error, setError] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  const generateKeyAndIv = () => {
    const keyBytes = crypto.getRandomValues(new Uint8Array(32));
    const ivBytes = crypto.getRandomValues(new Uint8Array(12));
    setKeyBase64(arrayBufferToBase64(keyBytes));
    setIvBase64(arrayBufferToBase64(ivBytes));
  };

  const encrypt = async () => {
    setError('');
    setIsEncrypting(true);
    try {
      const keyBytes = new Uint8Array(base64ToArrayBuffer(keyBase64));
      if (![16, 24, 32].includes(keyBytes.length)) {
        throw new Error('Key must be 16, 24, or 32 bytes (Base64).');
      }
      const ivBytes = new Uint8Array(base64ToArrayBuffer(ivBase64));
      if (ivBytes.length !== 12) {
        throw new Error('IV must be 12 bytes (Base64) for AES-GCM.');
      }

      const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt']);
      const encoded = new TextEncoder().encode(plaintext);
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: ivBytes }, key, encoded);
      setCiphertext(arrayBufferToBase64(encrypted));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Encryption failed.');
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <CryptoPageShell
      title="AES Encryption"
      description="Encrypt text using AES-GCM with a 128/192/256-bit key."
      breadcrumbLabel="AES Encryption"
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Plaintext</label>
            <CopyButton text={plaintext} label="Copy" />
          </div>
          <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text to encrypt"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Key (Base64)</label>
              <CopyButton text={keyBase64} label="Copy" />
            </div>
            <textarea
              value={keyBase64}
              onChange={(e) => setKeyBase64(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Generate or paste Base64 key"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">IV (Base64)</label>
              <CopyButton text={ivBase64} label="Copy" />
            </div>
            <textarea
              value={ivBase64}
              onChange={(e) => setIvBase64(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Generate or paste Base64 IV"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={generateKeyAndIv}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Generate Key & IV
          </button>
          <button
            onClick={encrypt}
            disabled={isEncrypting || !plaintext || !keyBase64 || !ivBase64}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt'}
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">
            {error}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Ciphertext (Base64)</label>
            <CopyButton text={ciphertext} label="Copy" />
          </div>
          <textarea
            value={ciphertext}
            readOnly
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-xs"
            placeholder="Ciphertext will appear here"
          />
        </div>
      </div>
    </CryptoPageShell>
  );
}
