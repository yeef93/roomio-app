import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TwoContent from "@/components/TwoContent";
import React from "react";
import faqdata from "@/utils/faq";
import Accordion from "@/components/Accordion";

const HelpCenter: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto pt-16 text-slate-700">
        <div className=" flex justify-center items-center p-10 bg-indigo-500">
          <h1 className=" text-4xl font-bold text-white">Roomio Help Center</h1>
        </div>
        <div className=" px-16">
          <TwoContent title="Frequently Asked Questions">
            <div className="mx-auto grid max-w-xl divide-y divide-neutral-200">
              {faqdata.map((item) => {
                return (
                  <Accordion
                    key={item.id}
                    answer={item.question}
                    question={item.answer}
                  />
                );
              })}
            </div>
          </TwoContent>

          <section className="mb-8 px-20">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you need further assistance, please reach out to our support
              team at{" "}
              <a
                href="mailto:support@roomio.com"
                className="text-blue-500 underline"
              >
                support@roomio.com
              </a>
              . We aim to respond within 24 hours.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;
