'use client';

import { useState } from 'react';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';
import { arrayBufferToBase64, importKeyFromPem } from '@/lib/cryptoUtils';

export default function RsaSignPage() {
  const [message, setMessage] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const signMessage = async () => {
    setError('');
    setIsSigning(true);
    try {
      const key = await importKeyFromPem(
        privateKeyPem,
        'pkcs8',
        { name: 'RSA-PSS', hash: 'SHA-256' },
        ['sign']
      );
      const data = new TextEncoder().encode(message);
      const signatureBuffer = await crypto.subtle.sign(
        { name: 'RSA-PSS', saltLength: 32 },
        key,
        data
      );
      setSignature(arrayBufferToBase64(signatureBuffer));
    } catch (err) {
      console.error(err);
      setError('Signing failed. Please check the key format and try again.');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <CryptoPageShell
      title="RSA Sign"
      description="Sign data using RSA-PSS with a private key."
      breadcrumbLabel="RSA Sign"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the message to sign"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Private Key (PEM)</label>
          <textarea
            value={privateKeyPem}
            onChange={(e) => setPrivateKeyPem(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste RSA-PSS private key"
          />
        </div>

        <button
          onClick={signMessage}
          disabled={isSigning || !message || !privateKeyPem}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60"
        >
          {isSigning ? 'Signing...' : 'Sign Message'}
        </button>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Signature (Base64)</label>
          <textarea
            value={signature}
            readOnly
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-xs"
            placeholder="Signature will appear here"
          />
        </div>
      </div>
    </CryptoPageShell>
  );
}
