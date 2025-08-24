"use client";
import React, { useEffect, useState } from "react";
import RenderWidget from "@/components/ui-desing/RenderWidget";

export default function WidgetPage(props: any) {
  const designId = props?.params?.designId;
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/get-ui-design?designId=${designId}&type=widget`
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
      <div className="text-white text-xl p-12">Widget config not found.</div>
    );

  return <RenderWidget config={config} />;
}
