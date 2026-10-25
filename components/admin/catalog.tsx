import { Archive, ArchiveRestore } from "lucide-react";
import { ConfirmAction } from "./form";
import { setCatalogArchived } from "@/lib/admin/catalog-actions";

/** Botón archivar / restaurar para marcas, categorías y actividades. */
export function CatalogArchiveButton({
  table,
  id,
  archived,
  noun,
}: {
  table: "brands" | "categories" | "activities";
  id: string;
  archived: boolean;
  noun: string;
}) {
  return archived ? (
    <ConfirmAction
      action={setCatalogArchived.bind(null, table, id, false)}
      label="Restaurar"
      icon={<ArchiveRestore size={16} />}
      title={`¿Restaurar ${noun}?`}
      description="Vuelve a estar disponible en los formularios y en el sitio."
      confirmLabel="Restaurar"
    />
  ) : (
    <ConfirmAction
      action={setCatalogArchived.bind(null, table, id, true)}
      label="Archivar"
      icon={<Archive size={16} />}
      variant="danger"
      title={`¿Archivar ${noun}?`}
      description="Deja de ofrecerse al cargar productos y de mostrarse en el sitio. Si la usa algún producto publicado, primero hay que cambiarlo."
      confirmLabel="Archivar"
      danger
    />
  );
}

export function usageCount(n: number, one: string, many: string) {
  return n === 0 ? `Sin ${many}` : `${n} ${n === 1 ? one : many}`;
}
