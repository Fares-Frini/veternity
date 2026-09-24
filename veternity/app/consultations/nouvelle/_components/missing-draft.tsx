import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StethoscopeIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { STEP_HREFS } from "./consultation-stepper";

/** Affiché quand on arrive sur l'ordonnance ou la facture sans consultation enregistrée (ex : après un rechargement). */
export function MissingDraft({ step }: { step: string }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-5">
        <EmptyState
          icon={StethoscopeIcon}
          title="Aucune consultation en cours"
          description={`Enregistrez d'abord une consultation pour accéder à l'étape ${step}.`}
          className="w-full bg-card py-14"
        />
        <Button asChild>
          <Link href={STEP_HREFS.consultation}>Commencer une consultation</Link>
        </Button>
      </div>
    </div>
  );
}
