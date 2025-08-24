import RenderUiDesign from "@/components/RenderUiDesign";

// Use 'any' for props to avoid Next.js build type error
export default function Page(props: any) {
  const designId = props?.params?.designId;
  return <RenderUiDesign designId={designId} />;
}
