'use client';

import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';

export default function DesDecryptionPage() {
  const [ciphertext, setCiphertext] = useState('');
  const [keyBase64, setKeyBase64] = useState('');
  const [ivBase64, setIvBase64] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [error, setError] = useState('');

  const decrypt = () => {
    setError('');
    try {
      const key = CryptoJS.enc.Base64.parse(keyBase64);
      const iv = CryptoJS.enc.Base64.parse(ivBase64);
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
      });
      const decrypted = CryptoJS.DES.decrypt(cipherParams, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      const text = decrypted.toString(CryptoJS.enc.Utf8);
      if (!text) {
        throw new Error('Invalid ciphertext or key/IV.');
      }
      setPlaintext(text);
    } catch (err) {
      console.error(err);
      setError('Decryption failed. Please check inputs.');
    }
  };

  return (
    <CryptoPageShell
      title="DES Decryption"
      description="Decrypt DES-CBC ciphertext using a Base64 key and IV."
      breadcrumbLabel="DES Decryption"
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
          disabled={!ciphertext || !keyBase64 || !ivBase64}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60"
        >
          Decrypt
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
