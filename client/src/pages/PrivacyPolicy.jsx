import { motion } from 'framer-motion';
import { COMPANY } from '../utils/constants';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function PrivacyPolicy() {
  return (
    <>
      <section className="relative pt-32 pb-16 gradient-hero">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            className="font-heading font-bold text-4xl md:text-5xl text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-surface-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Last updated: January 1, 2025
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-16 bg-white">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
            <h2 className="font-heading text-navy-900">1. Information We Collect</h2>
            <p>At {COMPANY.fullName}, we collect information you provide directly, such as when you fill out a contact form, apply for a job, or subscribe to our newsletter. This may include your name, email address, phone number, resume, and professional details.</p>

            <h2 className="font-heading text-navy-900">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our recruitment and staffing services</li>
              <li>Match candidates with appropriate job opportunities</li>
              <li>Communicate with you about our services and opportunities</li>
              <li>Send newsletters and industry insights (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="font-heading text-navy-900">3. Information Sharing</h2>
            <p>We may share your information with prospective employers when you apply for positions through our platform. We do not sell your personal information to third parties. We may share aggregated, non-identifiable data for analytical purposes.</p>

            <h2 className="font-heading text-navy-900">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of electronic transmission is 100% secure.</p>

            <h2 className="font-heading text-navy-900">5. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Candidate data is retained for up to 3 years unless you request deletion.</p>

            <h2 className="font-heading text-navy-900">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time by clicking the unsubscribe link or contacting us directly.</p>

            <h2 className="font-heading text-navy-900">7. Cookies</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings.</p>

            <h2 className="font-heading text-navy-900">8. Contact Us</h2>
            <p>For questions about this Privacy Policy, please contact us at <a href={`mailto:${COMPANY.email}`} className="text-brand-500">{COMPANY.email}</a> or call <a href={`tel:${COMPANY.phone}`} className="text-brand-500">{COMPANY.phone}</a>.</p>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
