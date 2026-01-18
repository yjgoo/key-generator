import * as bcrypt from 'bcryptjs';

export interface KeyGenerator {
  id: string;
  title: string;
  description: string;
  defaultOptions?: Record<string, number | string | boolean>;
}

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  noDuplicates: boolean;
  startWithLetter: boolean;
  customSymbols: string;
}

export const defaultPasswordOptions: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: true,
  excludeAmbiguous: false,
  noDuplicates: false,
  startWithLetter: false,
  customSymbols: '',
};

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

const secureRandomInt = (max: number): number => {
  if (max <= 0) return 0;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    const maxUint32 = 0xffffffff;
    const limit = Math.floor(maxUint32 / max) * max;
    let value = 0;
    do {
      window.crypto.getRandomValues(array);
      value = array[0];
    } while (value >= limit);
    return value % max;
  }
  return Math.floor(Math.random() * max);
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

const DEFAULT_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS_SYMBOLS = '{}[]()/\\\'"`~,;:.<>';
const SIMILAR_CHARS = 'O0oIl1S5Z2B8G6';
const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';

const uniqueChars = (input: string): string[] => Array.from(new Set(input.split('')));

const filterChars = (chars: string[], excluded: Set<string>): string[] =>
  chars.filter(char => !excluded.has(char));

const buildPasswordCharsets = (options: PasswordOptions) => {
  const similarSet = new Set(SIMILAR_CHARS.split(''));
  const ambiguousSet = new Set(AMBIGUOUS_SYMBOLS.split(''));

  let uppercase = uniqueChars(UPPERCASE_CHARS);
  let lowercase = uniqueChars(LOWERCASE_CHARS);
  let numbers = uniqueChars(NUMBER_CHARS);
  const symbolsSource = options.customSymbols.trim().length > 0 ? options.customSymbols : DEFAULT_SYMBOLS;
  let symbols = uniqueChars(symbolsSource);

  if (options.excludeSimilar) {
    uppercase = filterChars(uppercase, similarSet);
    lowercase = filterChars(lowercase, similarSet);
    numbers = filterChars(numbers, similarSet);
    symbols = filterChars(symbols, similarSet);
  }

  if (options.excludeAmbiguous) {
    symbols = filterChars(symbols, ambiguousSet);
  }

  const combined = uniqueChars(
    (options.includeUppercase ? uppercase.join('') : '') +
    (options.includeLowercase ? lowercase.join('') : '') +
    (options.includeNumbers ? numbers.join('') : '') +
    (options.includeSymbols ? symbols.join('') : '')
  );

  return { uppercase, lowercase, numbers, symbols, combined };
};

export const getPasswordCharsetInfo = (options: Partial<PasswordOptions>) => {
  const merged = { ...defaultPasswordOptions, ...options };
  const { uppercase, lowercase, numbers, symbols, combined } = buildPasswordCharsets(merged);
  return {
    charsetSize: combined.length,
    letters: [...uppercase, ...lowercase],
    uppercase,
    lowercase,
    numbers,
    symbols,
    combined,
    options: merged,
  };
};

const shuffleInPlace = (items: string[]): void => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
};

export const generatePassword = (options: Partial<PasswordOptions> = {}): string => {
  const merged = { ...defaultPasswordOptions, ...options };
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    noDuplicates,
    startWithLetter,
  } = merged;

  const { uppercase, lowercase, numbers, symbols, combined } = buildPasswordCharsets(merged);

  const selectedSets: { name: string; chars: string[] }[] = [];
  if (includeUppercase) selectedSets.push({ name: 'uppercase', chars: uppercase });
  if (includeLowercase) selectedSets.push({ name: 'lowercase', chars: lowercase });
  if (includeNumbers) selectedSets.push({ name: 'numbers', chars: numbers });
  if (includeSymbols) selectedSets.push({ name: 'symbols', chars: symbols });

  if (selectedSets.length === 0) {
    throw new Error('Select at least one character set.');
  }

  const emptySet = selectedSets.find(set => set.chars.length === 0);
  if (emptySet) {
    throw new Error(`The ${emptySet.name} set is empty after exclusions.`);
  }

  if (length < selectedSets.length) {
    throw new Error(`Length must be at least ${selectedSets.length} to include all selected types.`);
  }

  if (noDuplicates && length > combined.length) {
    throw new Error('Length exceeds the number of unique characters available.');
  }

  const availableSet = new Set(combined);
  const pickFromSet = (chars: string[]): string => {
    const pool = noDuplicates ? chars.filter(char => availableSet.has(char)) : chars;
    if (pool.length === 0) {
      throw new Error('No available characters after exclusions.');
    }
    const char = pool[secureRandomInt(pool.length)];
    if (noDuplicates) {
      availableSet.delete(char);
    }
    return char;
  };

  const passwordChars: string[] = [];

  selectedSets.forEach(set => {
    passwordChars.push(pickFromSet(set.chars));
  });

  while (passwordChars.length < length) {
    const pool = noDuplicates ? Array.from(availableSet) : combined;
    const char = pool[secureRandomInt(pool.length)];
    if (noDuplicates) {
      availableSet.delete(char);
    }
    passwordChars.push(char);
  }

  shuffleInPlace(passwordChars);

  if (startWithLetter) {
    const letters = new Set([...uppercase, ...lowercase]);
    if (letters.size === 0) {
      throw new Error('Enable uppercase or lowercase to start with a letter.');
    }
    const letterIndex = passwordChars.findIndex(char => letters.has(char));
    if (letterIndex === -1) {
      throw new Error('Unable to place a letter as the first character.');
    }
    if (letterIndex !== 0) {
      [passwordChars[0], passwordChars[letterIndex]] = [passwordChars[letterIndex], passwordChars[0]];
    }
  }

  return passwordChars.join('');
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
    id: 'bcrypt',
    title: 'Bcrypt Hash Generator',
    description: 'Generate Bcrypt password hashes',
    defaultOptions: { rounds: 10 },
  },
  {
    id: 'jwt-secret-key',
    title: 'Random JWT Secret Key Generator',
    description: 'Generate secure secret keys for JWT token signing',
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
      return generatePassword(options);

    case 'bcrypt':
      const rounds = getNumberOption('rounds', 10);
      const password = generateRandomString(12, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
      const hash = bcrypt.hashSync(password, rounds);
      return `Password: ${password}\nHash: ${hash}`;

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

    case 'jwt-secret-key':
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
    'bcrypt': '/bcrypt-hash-generator',
    'jwt-secret-key': '/random-jwt-secret-key-generator',
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
