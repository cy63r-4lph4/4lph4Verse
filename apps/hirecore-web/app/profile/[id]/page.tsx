import ProfileRenderer from "./ProfileRenderer";
export default function Page({ params }: { params: { id: string } }) {
  return <ProfileRenderer id={params.id} />;
}
