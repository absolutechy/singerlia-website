import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

type Faq = { question: string; answer: string };

const FAQSection: React.FC<{ faqs: Faq[] }> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="my-[8rem] rounded-3xl bg-[#F7F7F7] p-6 sm:p-8">
      <div className="text-center">
        <h3 className="text-2xl sm:text-4xl font-bold text-[#000]">Frequently asked questions</h3>
        <p className="mt-1 texl-lg sm:text-2xl font-semibold text-[#121212]">About This Singer</p>
      </div>

      <div className="mt-6 space-y-4 flex flex-col items-center">
        {faqs.map((faq, i) => {
          const active = openIndex === i;
          return (
            <div
              key={i}
              className={
                "w-full group hover:bg-[#2E1B4D] hover:border-transparent max-w-4xl rounded-xl shadow border overflow-hidden " +
                (active ? "bg-[#2E1B4D] border-transparent" : "bg-white border-[#EBE4FF]")
              }
            >
              <button onClick={() => setOpenIndex(active ? null : i)} className="w-full flex items-center justify-between px-5 py-8">
                <span className={"text-lg font-medium group-hover:text-white text-left " + (active ? "text-white" : "text-[#1C1C1C]")}>
                  {faq.question}
                </span>
                <ChevronRight size={18} className={`group-hover:text-white ${active ? "text-white" : " text-[#2E1B4D] "}`} />
              </button>
              {active && (
                <div className={"px-5 pb-5 text-sm " + (active ? "text-white/90" : "text-[#6F5D9E]")}>{faq.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;

