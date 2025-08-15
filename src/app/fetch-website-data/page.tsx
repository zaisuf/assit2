"use client";

import React, { useState } from "react";

const FetchWebsiteDataPage: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch("/api/generate-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch data");
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Fetch Website Data</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter website URL (https://...)"
          className="flex-1 px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {results && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Pages Crawled: {results.metadata?.pagesCrawled}</h2>
          <div className="mb-4 text-sm text-gray-600">Base URL: {results.metadata?.baseUrl}</div>
          <ul className="mb-6">
            {results.responses?.map((item: any, idx: number) => (
              <li key={idx} className="mb-4 p-4 border rounded bg-gray-50">
                <div className="font-bold text-blue-700">{item.source}</div>
                <div className="text-xs text-gray-500 mb-1">Intent: {item.intent}</div>
                <div className="text-gray-800 whitespace-pre-line">{item.text}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FetchWebsiteDataPage;
