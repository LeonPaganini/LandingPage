import React from "react";
import { GlassCard, SectionTitle, SectionWave } from "../Primitives";

type TransformationTestimonialsProps = {
  title: string;
  variant: "presencial" | "online";
};

const testimonialCards = [
  {
    quote: "Voltei a ter energia para treinar, trabalhar e viver.",
    img: "https://institutofrancisconi.com.br/wp-content/uploads/2025/11/dep1-900",
  },
  {
    quote: "O protocolo do Dr. Anthony mudou meu corpo e minha disposição.",
    img: "https://institutofrancisconi.com.br/wp-content/uploads/2025/11/dep2-900",
  },
  {
    quote: "Nunca fui tão bem atendido. É outro nível de medicina.",
    img: "https://institutofrancisconi.com.br/wp-content/uploads/2025/11/dep3-900",
  },
];

const TransformationTestimonials: React.FC<TransformationTestimonialsProps> = ({ title, variant }) => (
  <SectionWave className="bg-white">
    <div className="mx-auto max-w-6xl px-6" data-ads-variant={variant}>
      <SectionTitle label={title} />
      <div className="grid gap-5 md:grid-cols-3">
        {testimonialCards.map((item, index) => (
          <GlassCard key={item.img} className="overflow-hidden p-4">
            <img
              src={item.img}
              alt={`Depoimento ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="h-56 w-full rounded-2xl object-cover sm:h-64"
            />
            <div className="mt-4 flex items-center gap-1 text-lg" aria-label="5 estrelas">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <span key={starIndex} aria-hidden>
                  ⭐️
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm italic text-neutral-900">“{item.quote}”</p>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

export default TransformationTestimonials;
