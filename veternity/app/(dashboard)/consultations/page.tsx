import { StethoscopeIcon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/ui/empty-state";

export default function ConsultationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Consultations</h1>
        <p className="text-sm text-muted-foreground">Historique et suivi des consultations médicales</p>
      </div>

      <EmptyState
        icon={StethoscopeIcon}
        title="Consultations"
        description="Cette section est en cours de développement."
      />
    </div>
  );
}
