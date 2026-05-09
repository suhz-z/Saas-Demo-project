import { getDomains } from "@/services/search";
import { SearchEngineClient } from "@/components/modules/counselor/SearchEngineClient";
import { getCurrentUser } from "@/lib/auth";

export default async function SearchEnginePage() {
  const [domains, user] = await Promise.all([
    getDomains(),
    getCurrentUser(),
  ]);

  if (!user) {
    return <div className="text-center py-8 text-gray-500">Please log in to use the search engine.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Intelligent Matcher</h1>
        <p className="text-muted-foreground mt-1">Enter student profile details to find perfectly matched courses.</p>
      </div>

      <SearchEngineClient domains={domains} userId={user.userId} />
    </div>
  );
}
