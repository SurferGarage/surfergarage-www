import { SG_VIS_PILL, type SgVisPillId } from "@/lib/sg-vis";

export function SgVisPill({ id }: { id: SgVisPillId }) {
  const pill = SG_VIS_PILL[id];
  return (
    <span
      className={`sg-vis-pill ${pill.className}`}
      aria-hidden
    >
      {pill.label}
    </span>
  );
}
