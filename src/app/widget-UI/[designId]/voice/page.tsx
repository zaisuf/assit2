"use client";
import React, { useEffect, useState } from "react";
import RenderVoice from "@/components/ui-desing/RenderVoice";

export default function VoicePage(props: any) {
  const designId = props?.params?.designId;
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/get-ui-design?designId=${designId}&type=voice`
        );
        const data = await res.json();
        setConfig(data.config || null);
      } catch (err) {
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };
    if (designId) fetchConfig();
  }, [designId]);

  if (loading)
    return <div className="text-white text-xl p-12">Loading...</div>;
  if (!config)
    return (
      <div className="text-white text-xl p-12">Voice bot config not found.</div>
    );

  return <RenderVoice config={config} />;
}
