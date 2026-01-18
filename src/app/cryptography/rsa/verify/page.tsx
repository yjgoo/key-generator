'use client';

import { useState } from 'react';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';
import { base64ToArrayBuffer, importKeyFromPem } from '@/lib/cryptoUtils';

export default function RsaVerifyPage() {
  const [message, setMessage] = useState('');
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [signature, setSignature] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const verifySignature = async () => {
    setError('');
    setResult(null);
    setIsVerifying(true);
    try {
      const key = await importKeyFromPem(
        publicKeyPem,
        'spki',
        { name: 'RSA-PSS', hash: 'SHA-256' },
        ['verify']
      );
      const data = new TextEncoder().encode(message);
      const signatureBuffer = base64ToArrayBuffer(signature);
      const valid = await crypto.subtle.verify(
        { name: 'RSA-PSS', saltLength: 32 },
        key,
        signatureBuffer,
        data
      );
      setResult(valid ? 'valid' : 'invalid');
    } catch (err) {
      console.error(err);
      setError('Verification failed. Please check inputs and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <CryptoPageShell
      title="RSA Verify"
      description="Verify RSA-PSS signatures using a public key."
      breadcrumbLabel="RSA Verify"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the message to verify"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Public Key (PEM)</label>
          <textarea
            value={publicKeyPem}
            onChange={(e) => setPublicKeyPem(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste RSA-PSS public key"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Signature (Base64)</label>
          <textarea
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste signature"
          />
        </div>

        <button
          onClick={verifySignature}
          disabled={isVerifying || !message || !publicKeyPem || !signature}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60"
        >
          {isVerifying ? 'Verifying...' : 'Verify Signature'}
        </button>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">
            {error}
          </div>
        )}

        {result && (
          <div
            className={`text-sm border rounded-md px-4 py-2 ${
              result === 'valid'
                ? 'text-green-700 bg-green-50 border-green-200'
                : 'text-red-700 bg-red-50 border-red-200'
            }`}
          >
            Signature is {result}.
          </div>
        )}
      </div>
    </CryptoPageShell>
  );
}
