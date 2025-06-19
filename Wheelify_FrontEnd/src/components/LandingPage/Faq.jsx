import React, { useState } from 'react';

const faqData = [
  {
    question: 'How do I rent a bike?',
    answer:
      'You can rent a bike by browsing available listings, selecting a time and date, and completing the booking with payment.',
  },
  {
    question: 'What if I need to cancel my booking?',
    answer:
      'You can cancel before pickup through your account dashboard. Refund policies may apply based on timing.',
  },
  {
    question: 'Are helmets included?',
    answer:
      'Helmets may be available depending on the bike provider. Check the listing or contact support for more info.',
  },
  {
    question: 'Is there a deposit?',
    answer:
      'Some rentals may require a refundable deposit. This will be shown during the checkout process if applicable.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-[#f0f9f4] py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl
        shadow-[10px_0_15px_rgba(0,0,0,0.1),_-10px_0_15px_rgba(0,0,0,0.1),_0_10px_20px_rgba(0,0,0,0.1)]">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Frequently Asked Questions</h2>

        <div className="space-y-6">
          {faqData.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-md">
              <button
                className="w-full text-left px-4 py-3 font-medium text-gray-800 flex justify-between items-center"
                onClick={() => toggle(idx)}
              >
                {item.question}
                <span className="text-xl">
                  {activeIndex === idx ? '-' : '+'}
                </span>
              </button>
              {activeIndex === idx && (
                <div className="px-4 pb-4 text-gray-600">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;