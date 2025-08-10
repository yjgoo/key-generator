# Key Generator

A secure, fast, and user-friendly key generation tool built with Next.js and TypeScript. Generate various types of cryptographically secure keys, passwords, and tokens for your applications.

## 🚀 Features

- **12 Different Key Types**: API keys, JWT secrets, UUIDs, passwords, and more
- **Cryptographically Secure**: Uses browser's crypto.getRandomValues() for maximum security
- **Privacy First**: All generation happens locally in your browser
- **Customizable**: Adjust key length and other parameters
- **Responsive Design**: Works perfectly on desktop and mobile
- **Copy to Clipboard**: One-click copying for generated keys
- **Auto-generation**: Automatically generates a key on page load

## 🔑 Supported Key Types

1. **Next.js Auth Secret** - Authentication secrets for Next.js applications
2. **Secure Secret Key** - Customizable length cryptographic keys (default: 32 characters)
3. **Random API Key** - API keys with standard prefixes
4. **Random Password** - Strong passwords with mixed characters
5. **Random String** - General-purpose random strings
6. **Random UUID** - RFC 4122 compliant UUIDs
7. **Random Hex Color** - Hexadecimal color codes
8. **Random Base64 String** - Base64 encoded random data
9. **Random Alphanumeric String** - Letters and numbers only
10. **Random Numeric String** - Numbers only
11. **Random MAC Address** - Network interface identifiers
12. **Random JWT Secret** - JSON Web Token signing secrets

## 🛠️ Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Node.js Crypto** - Secure random number generation

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yjgoo/key-generator.git
cd key-generator
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security

- All key generation happens client-side using secure random number generators
- No generated keys are ever stored, logged, or transmitted
- Uses the Web Crypto API for cryptographically secure randomness
- Follows security best practices for key generation

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Support

If you find this tool useful, please give it a star on GitHub!
