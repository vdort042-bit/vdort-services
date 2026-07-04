import {
  Monitor, FileText, UserCheck, Award, Settings, Users,
} from 'lucide-react';

export const services = [
  {
    id: 'it-staffing',
    icon: Monitor,
    title: 'IT Staffing',
    shortDesc: 'Access top-tier technology professionals across all stacks and domains.',
    description: 'We provide highly skilled IT professionals for contract, contract-to-hire, and full-time positions. Our deep network spans software engineers, architects, data scientists, cloud specialists, and more.',
    benefits: [
      'Pre-vetted candidates with verified skills',
      'Rapid deployment within 48-72 hours',
      'Flexible engagement models',
      'Dedicated account management',
    ],
    process: ['Requirement Analysis', 'Talent Sourcing', 'Screening & Assessment', 'Client Interview', 'Onboarding'],
  },
  {
    id: 'contract-staffing',
    icon: FileText,
    title: 'Contract Staffing',
    shortDesc: 'Flexible workforce solutions for project-based and seasonal needs.',
    description: 'Scale your workforce up or down with our contract staffing solutions. We handle payroll, compliance, and HR administration while you focus on project delivery.',
    benefits: [
      'Cost-effective workforce scaling',
      'Reduced overhead and liability',
      'Full compliance management',
      'Seamless contract extensions',
    ],
    process: ['Scope Definition', 'Talent Matching', 'Contract Setup', 'Deployment', 'Ongoing Support'],
  },
  {
    id: 'permanent-staffing',
    icon: UserCheck,
    title: 'Permanent Staffing',
    shortDesc: 'Find the perfect long-term hires who align with your culture and goals.',
    description: 'Our permanent placement services ensure you hire candidates who are not just technically qualified but also culturally aligned with your organization for long-term success.',
    benefits: [
      'Comprehensive cultural fit assessment',
      'Replacement guarantee',
      'Executive-level screening',
      'Long-term retention focus',
    ],
    process: ['Role Profiling', 'Sourcing Strategy', 'Multi-stage Assessment', 'Offer Management', 'Post-placement Support'],
  },
  {
    id: 'executive-hiring',
    icon: Award,
    title: 'Executive Hiring',
    shortDesc: 'C-suite and senior leadership recruitment with utmost discretion.',
    description: 'We specialize in identifying and attracting top executive talent. Our confidential search process ensures the right leadership fit for your organization\'s strategic goals.',
    benefits: [
      'Confidential executive search',
      'Board-level assessment frameworks',
      'Leadership potential evaluation',
      'Succession planning support',
    ],
    process: ['Strategic Briefing', 'Market Mapping', 'Confidential Approach', 'Assessment Center', 'Negotiation & Onboarding'],
  },
  {
    id: 'rpo',
    icon: Settings,
    title: 'RPO Solutions',
    shortDesc: 'End-to-end recruitment process outsourcing for enterprise scale.',
    description: 'Our RPO solutions embed dedicated recruitment teams within your organization, taking ownership of the entire hiring lifecycle while reducing costs and improving quality.',
    benefits: [
      'Up to 40% cost reduction',
      'Scalable recruitment capacity',
      'Advanced analytics & reporting',
      'Employer branding enhancement',
    ],
    process: ['Process Audit', 'Solution Design', 'Team Deployment', 'Technology Integration', 'Continuous Optimization'],
  },
  {
    id: 'talent-acquisition',
    icon: Users,
    title: 'Talent Acquisition',
    shortDesc: 'Strategic talent pipelines to fuel your organization\'s growth.',
    description: 'Beyond reactive hiring, our talent acquisition service builds proactive talent pipelines. We leverage AI-powered sourcing, employer branding, and market intelligence.',
    benefits: [
      'Proactive talent pipeline building',
      'Employer brand development',
      'Market intelligence reports',
      'Diversity & inclusion strategies',
    ],
    process: ['Workforce Planning', 'Brand Strategy', 'Pipeline Development', 'Engagement Campaigns', 'Hire & Measure'],
  },
];

export const candidateServices = [
  {
    title: 'Resume Optimization',
    description: 'ATS-friendly resume formatting and content enhancement to maximize interview callbacks.',
  },
  {
    title: 'LinkedIn Branding',
    description: 'Professional LinkedIn profile optimization to attract recruiters and build your personal brand.',
  },
  {
    title: 'Career Marketing',
    description: 'Strategic career positioning and personal branding to stand out in competitive job markets.',
  },
  {
    title: 'Interview Preparation',
    description: 'Mock interviews, behavioral coaching, and technical preparation with industry experts.',
  },
  {
    title: 'Job Placement Assistance',
    description: 'Direct access to exclusive job opportunities through our extensive employer network.',
  },
];
