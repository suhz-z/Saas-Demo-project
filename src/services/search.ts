"use server";

import { prisma } from "@/lib/prisma";
import { StudyLevel } from "@prisma/client";

export interface StudentProfile {
  studyLevel?: StudyLevel | "";
  domainId?: string;
  maxBudget?: number;
  maxDuration?: number;
  marks10th?: number;
  marks12th?: number;
  marks12thEnglish?: number;
  gradMarks?: number;
  ieltsOverall?: number;
  experienceMonths?: number;
  backlogs?: number;
  query?: string;
}

export async function searchCourses(profile: StudentProfile) {
  const { studyLevel, domainId, maxBudget, maxDuration, marks10th, marks12th, marks12thEnglish, gradMarks, ieltsOverall, experienceMonths, backlogs, query } = profile;

  const where: any = {};

  if (studyLevel) where.studyLevel = studyLevel;
  if (domainId) where.domainId = domainId;
  
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { university: { name: { contains: query, mode: "insensitive" } } }
    ];
  }

  // Soft match criteria (pulled into JS for scoring instead of strict DB exclusion if we want fuzzy matching)
  // But for duration we can strictly filter to avoid useless results
  if (maxDuration) where.duration = { lte: maxDuration };

  const courses = await prisma.course.findMany({
    where,
    include: {
      university: {
        include: { country: true }
      },
      domain: true,
      eligibilityRules: true,
    },
    take: 100, // Hard limit for MVP
  });

  // Calculate Match Score
  const results = courses.map(course => {
    let score = 100;
    const penalties: string[] = [];
    
    // For simplicity, grab the first eligibility rule if it exists
    const rule = course.eligibilityRules[0];

    // 10th marks evaluation (for +2 levels)
    if (marks10th && rule?.min10thMarks) {
      if (marks10th < rule.min10thMarks) {
        score -= 30;
        penalties.push(`10th Marks too low (Requires ${rule.min10thMarks}%)`);
      }
    }

    // 12th marks evaluation
    if (marks12th && rule?.min12thMarks) {
      if (marks12th < rule.min12thMarks) {
        score -= 30;
        penalties.push(`12th Marks too low (Requires ${rule.min12thMarks}%)`);
      }
    }

    // Graduation marks evaluation
    if (gradMarks && rule?.minGradMarks) {
      if (gradMarks < rule.minGradMarks) {
        score -= 40;
        penalties.push(`Graduation Marks/CGPA too low (Requires ${rule.minGradMarks})`);
      }
    }
    
    // IELTS evaluation
    if (ieltsOverall && rule?.minIeltsOverall) {
      if (ieltsOverall < rule.minIeltsOverall) {
        score -= 20;
        penalties.push(`IELTS too low (Requires ${rule.minIeltsOverall})`);
      }
    }

    // Experience evaluation (for PG)
    if (experienceMonths !== undefined && rule?.minExperience) {
      if (experienceMonths < rule.minExperience) {
        score -= 25;
        penalties.push(`Insufficient Experience (Requires ${rule.minExperience} months)`);
      }
    }

    // Backlogs evaluation
    if (backlogs !== undefined && rule?.maxBacklogs !== null) {
      if (backlogs > rule.maxBacklogs!) {
        score -= 20;
        penalties.push(`Too many backlogs (Max allowed: ${rule.maxBacklogs})`);
      }
    }

    // Budget evaluation (Soft match)
    if (maxBudget && course.tuitionFees > maxBudget) {
      const overage = course.tuitionFees - maxBudget;
      if (overage > 5000) {
         score -= 30; // Heavily penalize
         penalties.push(`Significantly over budget`);
      } else {
         score -= 10;
         penalties.push(`Slightly over budget`);
      }
    }

    // Omit eligibilityRules from result to avoid type complexity at UI level
    const { eligibilityRules, ...rest } = course;

    return {
      ...rest,
      matchScore: Math.max(0, score),
      penalties
    };
  });

  // Sort by highest match score
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export async function getDomains() {
  return await prisma.domain.findMany({ orderBy: { name: 'asc' } });
}
