export function Introduction() {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Use Our Key Generator?
          </h2>
          <p className="text-lg text-gray-600">
            Secure, fast, and reliable key generation for all your development needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cryptographically Secure</h3>
            <p className="text-gray-600">
              All keys are generated using cryptographically secure random number generators, 
              ensuring maximum security for your applications.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Generate keys instantly in your browser. No server requests, no waiting time, 
              no dependencies - just pure speed.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-gray-600">
              Your keys are generated locally in your browser. We never store, transmit, 
              or have access to any generated keys.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600">
              Support for various key formats including API keys, JWT secrets, UUIDs, 
              passwords, and more specialized formats.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customizable</h3>
            <p className="text-gray-600">
              Adjust key length, character sets, and other parameters to match your 
              specific requirements and security policies.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Works perfectly on all devices. Generate keys on your phone, tablet, 
              or desktop with the same great experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
