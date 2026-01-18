'use client';

import { useState } from 'react';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';
import { CopyButton } from '@/components/crypto/CopyButton';
import { arrayBufferToBase64, importKeyFromPem } from '@/lib/cryptoUtils';

export default function RsaEncryptionPage() {
  const [plaintext, setPlaintext] = useState('');
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [error, setError] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  const encryptMessage = async () => {
    setError('');
    setIsEncrypting(true);
    try {
      const key = await importKeyFromPem(
        publicKeyPem,
        'spki',
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        ['encrypt']
      );

      const data = new TextEncoder().encode(plaintext);
      const modulusLength = (key.algorithm as RsaHashedKeyAlgorithm).modulusLength;
      const maxBytes = modulusLength / 8 - 2 * 32 - 2;
      if (data.length > maxBytes) {
        throw new Error(`Message too long. Max ${maxBytes} bytes for this key.`);
      }

      const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, data);
      setCiphertext(arrayBufferToBase64(encrypted));
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Encryption failed. Please check the key format and try again.'
      );
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <CryptoPageShell
      title="RSA Encryption"
      description="Encrypt short messages using RSA-OAEP with a public key."
      breadcrumbLabel="RSA Encryption"
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
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Public Key (PEM)</label>
            <CopyButton text={publicKeyPem} label="Copy" />
          </div>
          <textarea
            value={publicKeyPem}
            onChange={(e) => setPublicKeyPem(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste RSA-OAEP public key"
          />
        </div>

        <button
          onClick={encryptMessage}
          disabled={isEncrypting || !plaintext || !publicKeyPem}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt'}
        </button>

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
