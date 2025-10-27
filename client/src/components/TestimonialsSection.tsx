import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Chris B.",
      date: "October 10, 2025",
      text: "Marjorie spends more time and a more holistic approach to psychiatric care than any other practitioner I have worked with. She works with you to find the best personal treatment.",
      rating: 5
    },
    {
      name: "Cindy K.",
      date: "October 1, 2025",
      text: "Empathy Health Clinic is great! From Chantal in the office to the Medication Managers Tony & Monique, to the quality therapists, especially Christine Orr, I would highly recommend Empathy to anyone.",
      rating: 5
    },
    {
      name: "Louise",
      date: "September 3, 2025",
      text: "Excellent psych medical management. Depression and anxiety are so much more manageable, fewer episodes, finally sleeping through the night. Alex provides exceptional care.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-center mb-4">
          Trusted by 100+ Patients
        </h2>
        <p className="text-lg text-center text-muted-foreground mb-12 md:mb-16">
          See what our patients are saying
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl border border-card-border bg-background p-6 md:p-8"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-foreground mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
