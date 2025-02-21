import ModifyItemClientPage from "./ClientPage";

export default function ModifyItemPage({ params }: { params: { id: string } }) {
  return <ModifyItemClientPage itemId={params.id} />;
}
