
import { Award } from "lucide-react";

export function CertificateEmptyState() {
  return (
    <div className="py-8 text-center">
      <Award className="mx-auto h-12 w-12 text-gray-300" />
      <h3 className="mt-2 text-base font-semibold text-gray-900">No certificates</h3>
      <p className="mt-1 text-sm text-gray-500">
        There are no certificates issued for this event yet.
      </p>
    </div>
  );
}
