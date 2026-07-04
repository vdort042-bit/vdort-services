// ATS Scorer — uses application form data + job description keywords
// (PDF text extraction removed for stability; resume stored for client download)

// ── ATS Scoring ───────────────────────────────────────────────────────────────
export function computeATSScore(job, application) {
  let total = 0;
  const breakdown = {};

  const appText = (
    (application?.message || '') + ' ' +
    (application?.name || '') + ' ' +
    (application?.experience ? `${application.experience} years experience` : '')
  ).toLowerCase();

  // 1. Skills match — 40 points
  const skills = (job?.skills || []).map((s) => String(s).toLowerCase());
  if (skills.length > 0) {
    const matched = skills.filter((s) => appText.includes(s));
    const pts = Math.round((matched.length / skills.length) * 40);
    breakdown.skills = { score: pts, max: 40, matched, total: skills.length };
    total += pts;
  } else {
    breakdown.skills = { score: 20, max: 40, matched: [], total: 0 };
    total += 20;
  }

  // 2. Job description keyword match — 25 points
  const desc = (
    (job?.description || '') + ' ' + (job?.title || '') + ' ' + (job?.industry || '')
  ).toLowerCase();
  const descWords = [...new Set(desc.split(/\W+/).filter((w) => w.length > 4))];
  if (descWords.length > 0) {
    const matched = descWords.filter((w) => appText.includes(w));
    const pts = Math.min(Math.round((matched.length / descWords.length) * 25), 25);
    breakdown.description = { score: pts, max: 25 };
    total += pts;
  } else {
    breakdown.description = { score: 12, max: 25 };
    total += 12;
  }

  // 3. Experience match — 20 points
  const reqExpNums = (job?.experience || '').match(/\d+/g) || [];
  const minExp = reqExpNums.length ? parseInt(reqExpNums[0]) : 0;
  const candExp = parseInt(application?.experience) || 0;
  let expPts = 0;
  if (candExp >= minExp)         expPts = 20;
  else if (candExp >= minExp - 2) expPts = 14;
  else if (candExp > 0)          expPts = 8;
  breakdown.experience = { score: expPts, max: 20, required: minExp, found: candExp };
  total += expPts;

  // 4. Profile completeness — 15 points
  let compPts = 0;
  if (application?.name)    compPts += 4;
  if (application?.email)   compPts += 3;
  if (application?.phone)   compPts += 3;
  if (application?.resumeUrl) compPts += 3;
  if ((application?.message || '').length > 50) compPts += 2;
  breakdown.completeness = { score: compPts, max: 15 };
  total += compPts;

  const score = Math.min(Math.round(total), 100);

  return {
    score,
    label: scoreLabel(score),
    breakdown,
    matchedSkills: breakdown.skills.matched || [],
    totalSkills: breakdown.skills.total || 0,
  };
}

function scoreLabel(score) {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Needs Review';
}
