'use client';

import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';

export default function DesEncryptionPage() {
  const [plaintext, setPlaintext] = useState('');
  const [keyBase64, setKeyBase64] = useState('');
  const [ivBase64, setIvBase64] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [error, setError] = useState('');

  const generateKeyAndIv = () => {
    const key = CryptoJS.lib.WordArray.random(8);
    const iv = CryptoJS.lib.WordArray.random(8);
    setKeyBase64(CryptoJS.enc.Base64.stringify(key));
    setIvBase64(CryptoJS.enc.Base64.stringify(iv));
  };

  const encrypt = () => {
    setError('');
    try {
      const key = keyBase64 ? CryptoJS.enc.Base64.parse(keyBase64) : CryptoJS.lib.WordArray.random(8);
      const iv = ivBase64 ? CryptoJS.enc.Base64.parse(ivBase64) : CryptoJS.lib.WordArray.random(8);

      const encrypted = CryptoJS.DES.encrypt(plaintext, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      setKeyBase64(CryptoJS.enc.Base64.stringify(key));
      setIvBase64(CryptoJS.enc.Base64.stringify(iv));
      setCiphertext(encrypted.toString());
    } catch (err) {
      console.error(err);
      setError('Encryption failed. Please check inputs.');
    }
  };

  return (
    <CryptoPageShell
      title="DES Encryption"
      description="Encrypt text using DES-CBC with a Base64 key and IV."
      breadcrumbLabel="DES Encryption"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plaintext</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Key (Base64)</label>
            <textarea
              value={keyBase64}
              onChange={(e) => setKeyBase64(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Generate or paste Base64 key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IV (Base64)</label>
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
            disabled={!plaintext}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60"
          >
            Encrypt
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ciphertext (Base64)</label>
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
