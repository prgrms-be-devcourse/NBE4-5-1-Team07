import ClientPage from "./ClientPage";

export default function Page({ params }: { params: { id: number } }) {
  return (
    <>
      <ClientPage id={params.id} />
    </>
  );
}
