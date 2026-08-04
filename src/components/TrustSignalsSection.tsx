import React from "react";
import { Award, ShieldCheck, Clock } from "lucide-react";

const TrustSignalsSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-muted/30 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-secondary uppercase tracking-[0.45em] font-bold mb-3 text-xs sm:text-sm">
            Why Choose Us
          </p>
          <h2 className="text-primary mb-5 leading-tight text-3xl sm:text-4xl md:text-5xl font-rozha">
            Trusted by Visakhapatnam
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            With decades of experience and a commitment to quality, we are proud to be the premier supplier of Jindal Stainless Steel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Experience */}
          <div className="bg-background p-8 rounded-sm shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary">15+ Years Experience</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Serving the Visakhapatnam region with premium steel products and expert fabrication services since 2010.
            </p>
          </div>

          {/* Quality */}
          <div className="bg-background p-8 rounded-sm shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary">Certified Quality</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We exclusively stock certified Jindal Stainless Steel (Grades 316, 304 & JT), guaranteeing authentic and durable materials.
            </p>
          </div>

          {/* Satisfaction */}
          <div className="bg-background p-8 rounded-sm shadow-sm border border-border/50 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary">1000+ Happy Clients</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              From residential gates to large-scale commercial pipelines, our track record of customer satisfaction speaks for itself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalsSection;
