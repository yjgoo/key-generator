'use client';

import { useState } from 'react';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';
import { CopyButton } from '@/components/crypto/CopyButton';
import { base64ToArrayBuffer, importKeyFromPem } from '@/lib/cryptoUtils';

export default function RsaDecryptionPage() {
  const [ciphertext, setCiphertext] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [error, setError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const decryptMessage = async () => {
    setError('');
    setIsDecrypting(true);
    try {
      const key = await importKeyFromPem(
        privateKeyPem,
        'pkcs8',
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        ['decrypt']
      );
      const cipherBuffer = base64ToArrayBuffer(ciphertext);
      const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, cipherBuffer);
      setPlaintext(new TextDecoder().decode(decrypted));
    } catch (err) {
      console.error(err);
      setError('Decryption failed. Please check inputs and try again.');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <CryptoPageShell
      title="RSA Decryption"
      description="Decrypt RSA-OAEP ciphertext using a private key."
      breadcrumbLabel="RSA Decryption"
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Ciphertext (Base64)</label>
            <CopyButton text={ciphertext} label="Copy" />
          </div>
          <textarea
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste RSA-OAEP ciphertext"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Private Key (PEM)</label>
            <CopyButton text={privateKeyPem} label="Copy" />
          </div>
          <textarea
            value={privateKeyPem}
            onChange={(e) => setPrivateKeyPem(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste RSA-OAEP private key"
          />
        </div>

        <button
          onClick={decryptMessage}
          disabled={isDecrypting || !ciphertext || !privateKeyPem}
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Plaintext</label>
            <CopyButton text={plaintext} label="Copy" />
          </div>
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
