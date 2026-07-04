import { useEffect, useState } from 'react';
import { testimonials as staticTestimonials } from '../../data/testimonials';
import api from '../../services/api';
import SectionHeading from '../ui/SectionHeading';
import TestimonialCarousel from '../ui/TestimonialCarousel';
import ScrollReveal from '../ui/ScrollReveal';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(staticTestimonials);

  useEffect(() => {
    api.testimonials.list(true)
      .then((res) => { if (res.data?.length) setTestimonials(res.data); })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Testimonials"
          title="Voices of Trust"
          subtitle="Hear from the clients and candidates who have experienced the VDORT difference."
        />

        <div className="mt-16">
          <ScrollReveal>
            <TestimonialCarousel testimonials={testimonials} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
