import RenderChat from "@/components/ui-desing/RenderChat";
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ designId: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.designId) {
    notFound();
  }

  const designId = resolvedParams.designId;

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <RenderChat designId={designId} />
    </div>
  );
}
