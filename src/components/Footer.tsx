import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo.png" 
                alt="Key Generator Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold">Key Generator</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Generate secure, cryptographically strong keys for your applications. 
              Fast, secure, and completely free to use.
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Key Generator. All rights reserved.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Types</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/random-api-key-generator" className="hover:text-white transition-colors">API Keys</Link></li>
              <li><Link href="/random-jwt-secret-generator" className="hover:text-white transition-colors">JWT Secrets</Link></li>
              <li><Link href="/random-password-generator" className="hover:text-white transition-colors">Passwords</Link></li>
              <li><Link href="/random-uuid-generator" className="hover:text-white transition-colors">UUIDs</Link></li>
              <li><Link href="/next-js-auth-secret-generator" className="hover:text-white transition-colors">Auth Secrets</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="https://github.com/yjgoo/key-generator" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="mailto:contact@key-generator.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            Made with ❤️ for developers worldwide
          </div>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
