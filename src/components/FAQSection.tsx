import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What size Jindal SS pipes do you stock?",
    answer: "We stock a comprehensive range of Jindal Stainless Steel pipes, starting from 1/2 inch up to 8 inches in diameter. We can also source larger specific sizes on request.",
  },
  {
    question: "Do you offer custom stainless steel fabrication?",
    answer: "Yes! We specialize in custom fabrication including stainless steel gates, balcony railings, staircases, window grills, and commercial signage.",
  },
  {
    question: "What grades of stainless steel do you supply?",
    answer: "We primarily supply premium Grade 304, Grade 316, and JT Grade stainless steel, which offer excellent corrosion resistance suitable for Visakhapatnam's coastal environment.",
  },
  {
    question: "Do you deliver to construction sites in Visakhapatnam?",
    answer: "Yes, we arrange delivery to construction sites across Visakhapatnam and surrounding areas. Delivery terms can be discussed during quotation.",
  },
  {
    question: "Are your Jindal steel products certified?",
    answer: "Absolutely. All our Jindal steel products come with manufacturer test certificates (MTC) ensuring authenticity and quality compliance.",
  },
];

const FAQSection = () => {
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-primary mb-5 leading-tight text-3xl sm:text-4xl font-rozha">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base">
            Common questions about our steel products and fabrication services.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium text-primary hover:text-secondary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
