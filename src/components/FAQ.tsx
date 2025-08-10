'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Are the generated keys secure?",
    answer: "Yes, all keys are generated using cryptographically secure random number generators (CSPRNG). The entropy source is your browser's built-in crypto.getRandomValues() function, which is designed for cryptographic use."
  },
  {
    question: "Do you store or track generated keys?",
    answer: "No, we never store, log, or transmit any generated keys. All key generation happens locally in your browser, ensuring complete privacy and security."
  },
  {
    question: "What's the difference between different key types?",
    answer: "Each key type is optimized for specific use cases: API keys for service authentication, JWT secrets for token signing, UUIDs for unique identification, passwords for user authentication, etc. Choose based on your specific requirements."
  },
  {
    question: "Can I use these keys in production?",
    answer: "Absolutely! Our generators use industry-standard cryptographic functions. However, always follow your organization's security policies and consider additional factors like key rotation and secure storage."
  },
  {
    question: "How do I choose the right key length?",
    answer: "Key length depends on your security requirements and the intended use. For most applications: 32-64 characters for general secrets, 256+ bits for cryptographic keys, and follow specific standards for JWT secrets or API keys."
  },
  {
    question: "Is this tool open source?",
    answer: "Yes, this tool is open source and available on GitHub. You can review the code, contribute improvements, or run your own instance for maximum security."
  },
  {
    question: "Can I generate multiple keys at once?",
    answer: "Currently, each generator creates one key at a time to ensure optimal performance and security. You can quickly generate multiple keys by clicking the generate button multiple times."
  },
  {
    question: "What happens if I refresh the page?",
    answer: "Generated keys are not saved and will be lost when you refresh the page. This is by design to ensure privacy. Always copy important keys before leaving the page."
  }
];

function FAQItemComponent({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
        onClick={onToggle}
      >
        <span className="font-medium text-gray-900">{item.question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about our key generation tool.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQItemComponent
              key={index}
              item={item}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
