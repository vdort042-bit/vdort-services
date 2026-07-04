import Hero from '../components/home/Hero';
import WhyChooseVdort from '../components/home/WhyChooseVdort';
import ServicesOverview from '../components/home/ServicesOverview';
import CandidateServices from '../components/home/CandidateServices';
import IndustriesGrid from '../components/home/IndustriesGrid';
import AIRecruitmentPreview from '../components/home/AIRecruitmentPreview';
import StatsSection from '../components/home/StatsSection';
import SuccessStories from '../components/home/SuccessStories';
import Testimonials from '../components/home/Testimonials';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseVdort />
      <ServicesOverview />
      <CandidateServices />
      <IndustriesGrid />
      <AIRecruitmentPreview />
      <StatsSection />
      <SuccessStories />
      <Testimonials />
      <ContactSection />
    </>
  );
}
