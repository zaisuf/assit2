import RenderUiDesign from "@/components/RenderUiDesign";

export default function Page({ params }: { params: { designId: string } }) {
  return <RenderUiDesign designId={params.designId} />;
}
