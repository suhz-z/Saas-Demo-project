# SACDMS - Remaining PRD Tasks

This document tracks the partial and incomplete features required to reach 100% compliance with the Product Requirements Document (PRD) for the Study Abroad Course Discovery & Management System.

## 🟡 Partially Complete (Needs Refinement)

### 1. Counselor Search Engine UI (PRD Section 4.1)
- **Current State**: We have a functional, single-page search form that outputs a Match % and mismatch penalties.
- **Required Updates**:
  - **Step-Based Search Flow**: Refactor the search UI into a multi-step wizard:
    - *Step 1*: Select Study Level (Mandatory).
    - *Step 2*: Enter Academic Details (Dynamic based on Step 1: e.g. +2 Marks vs Grad Marks, IELTS).
    - *Step 3*: Preferences (Budget, Duration, Domain).
  - **Visual Status Tags**: Explicitly render status badges on results based on the Match Score:
    - `Eligible ✅` (e.g., 100% score / no penalties)
    - `Borderline ⚠️` (e.g., 70-99% score / minor budget or IELTS penalty)
    - `Not Eligible ❌` (e.g., <70% score / strict academic mismatch)

## ❌ Incomplete (Needs to be Built)

### 2. Bulk Upload System (PRD Sections 4.2, 4.3, 7)
- **Current State**: Admins can only add Universities and Courses one-by-one via forms.
- **Required Updates**:
  - Build a CSV/Excel file parser.
  - Create a "Data Import" UI in the Admin Dashboard.
  - Implement bulk validation logic (duplicate detection, mandatory field checks).
  - Ensure the server action can safely scale to handle 350+ universities and 5000+ courses.

### 3. Eligibility Management UI (PRD Section 4.4)
- **Current State**: The `EligibilityRule` table exists in the PostgreSQL database, but there is no UI to manage it.
- **Required Updates**:
  - Build an interface within the Admin Course Management page to define complex eligibility rules for specific courses.
  - Fields must include: Min 10th Marks, Min 12th Marks, Min Grad Marks, Min IELTS (Overall + Bands), Max Backlogs, and Experience.

### 4. Shortlisting & PDF Export (PRD Section 4.7)
- **Current State**: Counselors can view courses but cannot save them to a specific student's profile.
- **Required Updates**:
  - Add a "Save/Shortlist" button to the course search results.
  - Create a UI to view a Student's "Saved/Shortlisted" courses.
  - Implement a "Generate Report" button that builds and downloads a customized **PDF** or **Excel** sheet of the shortlisted courses for the student to take home.

### 5. Admin Extras: User & Academic Cycles Management (PRD Sections 3.1 & 4.5)
- **Current State**: Only the seeded admin account exists; intake cycles are treated as raw text strings.
- **Required Updates**:
  - **User Management**: Create a UI for the Admin to invite, add, and revoke new Counselor accounts.
  - **Academic Cycles**: Create a UI to manage standardized Intakes (e.g., "Fall 2026") with specific application deadlines, rather than relying on manual text entry.

---

*Once these items are complete, the SACDMS application will fully satisfy the provided MVP PRD.*
