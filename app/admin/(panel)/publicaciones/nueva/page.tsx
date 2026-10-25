import { requireAdminPage } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { PostForm } from "../PostForm";

export const metadata = { title: "Nueva publicación" };

export default async function NewPostPage() {
  await requireAdminPage();
  return (
    <>
      <PageHeader title="Nueva publicación" back={{ href: "/admin/publicaciones", label: "ECOtrips y ECOtips" }} />
      <PostForm post={null} />
    </>
  );
}
