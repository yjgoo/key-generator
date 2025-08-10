export interface KeyGenerator {
  id: string;
  title: string;
  description: string;
  defaultOptions?: Record<string, number | string | boolean>;
}

// Browser-compatible utility functions for key generation
const generateRandomString = (length: number, charset: string): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

const generateSecureRandom = (length: number): string => {
  // Browser-compatible secure random generation
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto.getRandomValues
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const generateBase64Random = (length: number): string => {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto.getRandomValues
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return btoa(String.fromCharCode(...array));
};

const generateUUID = (): string => {
  // Browser-compatible UUID v4 generation
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Key generators configuration
export const keyGenerators: KeyGenerator[] = [
  {
    id: 'nextjs-auth',
    title: 'Next.js Auth Secret Generator',
    description: 'Generate secure authentication secrets for Next.js applications',
  },
  {
    id: 'secure-key',
    title: 'Secure & Strong Secret Key Generator',
    description: 'Generate cryptographically secure secret keys with customizable length',
    defaultOptions: { length: 32 },
  },
  {
    id: 'api-key',
    title: 'Random API Key Generator',
    description: 'Generate random API keys for your applications',
  },
  {
    id: 'password',
    title: 'Random Password Generator',
    description: 'Generate strong random passwords with mixed characters',
    defaultOptions: { length: 16 },
  },
  {
    id: 'jwt-secret',
    title: 'Random JWT Secret Generator',
    description: 'Generate secure secrets for JWT token signing',
    defaultOptions: { length: 64 },
  },
  {
    id: 'uuid',
    title: 'Random UUID Generator',
    description: 'Generate RFC 4122 compliant universally unique identifiers',
  },
  {
    id: 'random-string',
    title: 'Random String Generator',
    description: 'Generate random strings for various purposes',
    defaultOptions: { length: 20 },
  },
  {
    id: 'hex-color',
    title: 'Random Hex Color Generator',
    description: 'Generate random hexadecimal color codes',
  },
  {
    id: 'base64',
    title: 'Random Base64 String Generator',
    description: 'Generate random Base64 encoded strings',
    defaultOptions: { length: 24 },
  },
  {
    id: 'alphanumeric',
    title: 'Random Alphanumeric String Generator',
    description: 'Generate random strings with letters and numbers only',
    defaultOptions: { length: 16 },
  },
  {
    id: 'numeric',
    title: 'Random Numeric String Generator',
    description: 'Generate random numeric strings',
    defaultOptions: { length: 12 },
  },
  {
    id: 'mac-address',
    title: 'Random MAC Address Generator',
    description: 'Generate random MAC addresses in standard format',
  },

];

// Client-side key generation function
export const generateKey = (id: string, options?: Record<string, number | string | boolean>): string => {
  const getNumberOption = (key: string, defaultValue: number): number => {
    const value = options?.[key];
    return typeof value === 'number' ? value : defaultValue;
  };

  switch (id) {
    case 'nextjs-auth':
      return generateBase64Random(32);

    case 'secure-key':
      return generateSecureRandom(getNumberOption('length', 32));

    case 'api-key':
      const prefix = 'sk-';
      const key = generateRandomString(48, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
      return prefix + key;

    case 'password':
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      return generateRandomString(getNumberOption('length', 16), charset);

    case 'random-string':
      const stringCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return generateRandomString(getNumberOption('length', 20), stringCharset);

    case 'uuid':
      return generateUUID();

    case 'hex-color':
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    case 'base64':
      return generateBase64Random(getNumberOption('length', 24));

    case 'alphanumeric':
      const alphanumericCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return generateRandomString(getNumberOption('length', 16), alphanumericCharset);

    case 'numeric':
      const numericCharset = '0123456789';
      return generateRandomString(getNumberOption('length', 12), numericCharset);

    case 'mac-address':
      const hexChars = '0123456789ABCDEF';
      let mac = '';
      for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 2 === 0) mac += ':';
        mac += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
      }
      return mac;

    case 'jwt-secret':
      // Generate cryptographically secure JWT secret using hex encoding
      // Similar to require('crypto').randomBytes(32).toString('hex')
      // Length in characters (hex chars), so bytes = length / 2
      const length = getNumberOption('length', 64);
      const bytesNeeded = Math.ceil(length / 2);
      return generateSecureRandom(bytesNeeded).substring(0, length);

    default:
      return 'Invalid generator ID';
  }
};

// Get the primary generator (first one)
export const getPrimaryGenerator = (): KeyGenerator => keyGenerators[0];

// Get a specific generator by ID
export const getGenerator = (id: string): KeyGenerator | undefined => {
  return keyGenerators.find(gen => gen.id === id);
};

// URL path mapping for each generator
export const getGeneratorPath = (id: string): string => {
  const pathMap: Record<string, string> = {
    'nextjs-auth': '/next-js-auth-secret-generator',
    'secure-key': '/secure-strong-secret-key-generator',
    'api-key': '/random-api-key-generator',
    'password': '/random-password-generator',
    'jwt-secret': '/random-jwt-secret-generator',
    'uuid': '/random-uuid-generator',
    'random-string': '/random-string-generator',
    'hex-color': '/random-hex-color-generator',
    'base64': '/random-base64-string-generator',
    'alphanumeric': '/random-alphanumeric-string-generator',
    'numeric': '/random-numeric-string-generator',
    'mac-address': '/random-mac-address-generator',
  };
  
  return pathMap[id] || '/';
};
