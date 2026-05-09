import { Suspense } from "react";
import { getSavedCourses } from "@/services/shortlist";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import { SavedCoursesClient } from "@/components/modules/counselor/SavedCoursesClient";

export default async function SavedCoursesPage() {
  const user = await requireAuth();
  const savedCourses = await getSavedCourses(user.userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Shortlisted Courses</h1>
        <p className="text-muted-foreground mt-1">Manage and download your saved course matches.</p>
      </div>

      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <SavedCoursesClient courses={savedCourses} />
      </Suspense>
    </div>
  );
}
