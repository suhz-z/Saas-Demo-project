import { getAcademicCycles } from "@/services/intakes";
import { IntakeTable } from "@/components/modules/admin/IntakeTable";

export default async function IntakesPage() {
  const intakes = await getAcademicCycles();

  return (
    <div className="space-y-6">
      <IntakeTable intakes={intakes} />
    </div>
  );
}
