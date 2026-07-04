// ATS (Applicant Tracking System) Score Calculator
// Scores resume based on keywords, experience, skills, and completeness

const COMMON_KEYWORDS = {
  senior: 5,
  lead: 5,
  manager: 4,
  specialist: 4,
  developer: 3,
  engineer: 3,
  architect: 5,
  expert: 4,
  skilled: 2,
  experienced: 3,
  proficient: 2,
  certified: 3,
  degree: 4,
  bachelor: 3,
  master: 4,
  phd: 5,
  aws: 4,
  azure: 4,
  gcp: 3,
  kubernetes: 4,
  docker: 3,
  react: 3,
  angular: 3,
  vue: 3,
  nodejs: 3,
  python: 3,
  java: 3,
  typescript: 3,
  sql: 2,
  mongodb: 2,
  api: 2,
  rest: 2,
  graphql: 3,
  agile: 2,
  scrum: 2,
  git: 2,
  cicd: 3,
  devops: 4,
  microservices: 4,
  machine: 3,
  learning: 2,
  ai: 3,
  ml: 3,
  data: 2,
  analytics: 2,
  communication: 2,
  leadership: 3,
  teamwork: 1,
  problem: 2,
  solving: 2,
};

// calculateATSScore(application, job?)
// job is optional — pass job object for job-specific scoring
export const calculateATSScore = (application, job = null) => {
  let score = 0;

  const appText = (
    (application.message || '') + ' ' + (application.name || '')
  ).toLowerCase();

  // 1. Skills match against job (40 pts) or general keywords (30 pts)
  const jobSkills = (job?.skills || []).map(s => s.toLowerCase());
  if (jobSkills.length > 0) {
    const matched = jobSkills.filter(s => appText.includes(s));
    score += Math.round((matched.length / jobSkills.length) * 40);
  } else {
    // Fallback: general keyword matching
    let keywordScore = 0;
    for (const [keyword, points] of Object.entries(COMMON_KEYWORDS)) {
      if (appText.includes(keyword)) keywordScore += points;
    }
    score += Math.min(keywordScore * 0.5, 30);
  }

  // 2. Job description keyword match (20 pts)
  if (job?.description) {
    const descWords = [...new Set(job.description.toLowerCase().split(/\W+/).filter(w => w.length > 4))];
    if (descWords.length > 0) {
      const matched = descWords.filter(w => appText.includes(w));
      score += Math.min(Math.round((matched.length / descWords.length) * 20), 20);
    }
  }

  // 3. Experience match (20 pts)
  const experience = parseInt(application.experience) || 0;
  const reqExp = parseInt((job?.experience || '').match(/\d+/)?.[0]) || 0;
  if (reqExp > 0) {
    if (experience >= reqExp) score += 20;
    else if (experience >= reqExp - 2) score += 14;
    else if (experience > 0) score += 7;
  } else {
    if (experience >= 5) score += 20;
    else if (experience >= 3) score += 15;
    else if (experience >= 1) score += 10;
    else if (experience > 0) score += 5;
  }

  // 4. Resume + completeness (20 pts)
  if (application.resumeUrl) score += 10;
  if (application.name) score += 3;
  if (application.email) score += 2;
  if (application.phone) score += 2;
  if ((application.message || '').length > 100) score += 3;

  return Math.min(Math.round(score), 100);
};

export const getATSBadgeColor = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-700'; // Excellent
  if (score >= 60) return 'bg-blue-100 text-blue-700'; // Good
  if (score >= 40) return 'bg-amber-100 text-amber-700'; // Fair
  return 'bg-red-100 text-red-700'; // Poor
};

export const getATSLabel = (score) => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Needs Review';
};
