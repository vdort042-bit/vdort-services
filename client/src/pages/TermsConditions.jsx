import { motion } from 'framer-motion';
import { COMPANY } from '../utils/constants';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function TermsConditions() {
  return (
    <>
      <section className="relative pt-32 pb-16 gradient-hero">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            className="font-heading font-bold text-4xl md:text-5xl text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Terms & Conditions
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
            <h2 className="font-heading text-navy-900">1. Acceptance of Terms</h2>
            <p>By accessing and using the {COMPANY.fullName} website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.</p>

            <h2 className="font-heading text-navy-900">2. Services Description</h2>
            <p>{COMPANY.fullName} provides recruitment, staffing, and talent acquisition services. Our services include IT staffing, contract staffing, permanent placement, executive search, RPO, and AI-powered recruitment solutions.</p>

            <h2 className="font-heading text-navy-900">3. User Obligations</h2>
            <p>When using our services, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Not misrepresent your qualifications or experience</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use our platform for unauthorized or unlawful purposes</li>
            </ul>

            <h2 className="font-heading text-navy-900">4. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and software, is the property of {COMPANY.fullName} and is protected by intellectual property laws. You may not reproduce or distribute any content without prior written consent.</p>

            <h2 className="font-heading text-navy-900">5. Candidate Representations</h2>
            <p>Candidates submitting resumes and applications represent that all information provided is truthful and accurate. {COMPANY.fullName} reserves the right to verify all credentials and may reject applications containing false information.</p>

            <h2 className="font-heading text-navy-900">6. Client Agreements</h2>
            <p>Corporate clients engaging our staffing services will be subject to separate service agreements outlining specific terms, fees, guarantees, and obligations. These Terms serve as a general framework.</p>

            <h2 className="font-heading text-navy-900">7. Limitation of Liability</h2>
            <p>{COMPANY.fullName} shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the fees paid for the specific service in question.</p>

            <h2 className="font-heading text-navy-900">8. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Dehradun, Uttarakhand.</p>

            <h2 className="font-heading text-navy-900">9. Contact</h2>
            <p>For questions regarding these Terms, contact us at <a href={`mailto:${COMPANY.email}`} className="text-brand-500">{COMPANY.email}</a>.</p>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
