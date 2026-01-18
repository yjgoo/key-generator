'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { CryptoPageShell } from '@/components/crypto/CryptoPageShell';
import { CopyButton } from '@/components/crypto/CopyButton';
import { exportKeyToPem } from '@/lib/cryptoUtils';

export default function RsaKeyGeneratorPage() {
  const [algorithm, setAlgorithm] = useState<'RSA-OAEP' | 'RSA-PSS'>('RSA-OAEP');
  const [modulusLength, setModulusLength] = useState(2048);
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toRawPem = (pem: string) =>
    pem.replace(/-----BEGIN [^-]+-----/g, '').replace(/-----END [^-]+-----/g, '').replace(/\s+/g, '');

  const rawPublicKey = toRawPem(publicKeyPem);
  const rawPrivateKey = toRawPem(privateKeyPem);

  const downloadTextFile = (filename: string, content: string) => {
    if (!content) {
      return;
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadZip = async () => {
    if (!publicKeyPem || !privateKeyPem) {
      return;
    }
    const zip = new JSZip();
    zip.file('public-key.pem', publicKeyPem);
    zip.file('private-key.pem', privateKeyPem);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rsa-key-pair.zip';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const generateKeys = async () => {
    setError('');
    setIsGenerating(true);
    try {
      const algo = {
        name: algorithm,
        modulusLength,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      } as const;

      const usages: KeyUsage[] = algorithm === 'RSA-OAEP' ? ['encrypt', 'decrypt'] : ['sign', 'verify'];
      const keyPair = await crypto.subtle.generateKey(algo, true, usages);
      const publicPem = await exportKeyToPem(keyPair.publicKey, 'spki', 'PUBLIC KEY');
      const privatePem = await exportKeyToPem(keyPair.privateKey, 'pkcs8', 'PRIVATE KEY');
      setPublicKeyPem(publicPem);
      setPrivateKeyPem(privatePem);
    } catch (err) {
      console.error(err);
      setError('Key generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <CryptoPageShell
      title="RSA Key Generator"
      description="Generate RSA public/private key pairs for encryption (RSA-OAEP) or signing (RSA-PSS)."
      breadcrumbLabel="RSA Key Generator"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as 'RSA-OAEP' | 'RSA-PSS')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="RSA-OAEP">RSA-OAEP (Encrypt/Decrypt)</option>
              <option value="RSA-PSS">RSA-PSS (Sign/Verify)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Modulus Length</label>
            <select
              value={modulusLength}
              onChange={(e) => setModulusLength(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2048}>2048-bit (recommended)</option>
              <option value={3072}>3072-bit</option>
              <option value={4096}>4096-bit</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateKeys}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60"
        >
          {isGenerating ? 'Generating...' : 'Generate RSA Key Pair'}
        </button>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">Public Key (PEM)</label>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton text={publicKeyPem} label="Copy PEM" />
                <CopyButton
                  text={rawPublicKey}
                  label="Copy Raw Public Key"
                  title="Copy raw public key (no headers or line breaks)"
                />
                <button
                  type="button"
                  onClick={() => downloadTextFile('public-key.pem', publicKeyPem)}
                  disabled={!publicKeyPem}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download PEM
                </button>
              </div>
            </div>
            <textarea
              value={publicKeyPem}
              readOnly
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-xs"
              placeholder="Your public key will appear here"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">Private Key (PEM)</label>
              <div className="flex flex-wrap items-center gap-2">
                <CopyButton text={privateKeyPem} label="Copy PEM" />
                <CopyButton
                  text={rawPrivateKey}
                  label="Copy Raw Private Key"
                  title="Copy raw private key (no headers or line breaks)"
                />
                <button
                  type="button"
                  onClick={() => downloadTextFile('private-key.pem', privateKeyPem)}
                  disabled={!privateKeyPem}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download PEM
                </button>
              </div>
            </div>
            <textarea
              value={privateKeyPem}
              readOnly
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-xs"
              placeholder="Your private key will appear here"
            />
          </div>
          <div className="flex">
            <button
              type="button"
              onClick={downloadZip}
              disabled={!publicKeyPem || !privateKeyPem}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download Key Pair (ZIP)
            </button>
          </div>
        </div>
      </div>
    </CryptoPageShell>
  );
}
