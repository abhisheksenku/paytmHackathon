"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, FileText, Database, RefreshCw, AlertCircle, Download } from "lucide-react";
import { apiEndpoints } from "@/lib/api";

interface IngestTabProps {
  onRefreshData: () => void;
}

export const IngestTab: React.FC<IngestTabProps> = ({ onRefreshData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/v1/ingest/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message || "File uploaded successfully!");
        onRefreshData();
      } else {
        setError(data.detail || "Failed to process statement.");
      }
    } catch (err: any) {
      setError(err.message || "Network error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    setMessage(null);
    setError(null);
    try {
      const res = await apiEndpoints.seedDemoData();
      if (res.data?.success) {
        setMessage("Demo store re-seeded with 5,499 realistic transactions!");
        onRefreshData();
      } else {
        setError(res.data?.error || "Error running seeder.");
      }
    } catch (e: any) {
      setError("Failed to run seed script.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
            Multi-Tier Ingestion
          </span>
          <span className="text-xs text-slate-500">• Supports Raw Paytm UPI Statements & POS Bills</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1120]">
          Data Ingestion & Dataset Manager
        </h2>
        <p className="text-xs text-slate-500">
          Upload real transaction CSVs or reset to the pre-loaded 180-day Hyderabad Kirana dataset.
        </p>
      </div>

      {/* Notifications */}
      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center space-x-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center space-x-3 text-xs text-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Upload Box + Demo Re-seeder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Custom Statement */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0A1120] uppercase tracking-wider mb-2 flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-[#002E6E]" />
              Upload Transaction CSV / Excel
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Upload any raw Paytm statement or accounting export. Automatically detects Amount, Date, and Payer references.
            </p>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#002E6E] transition cursor-pointer bg-slate-50">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="statement-upload"
                />
                <label htmlFor="statement-upload" className="cursor-pointer">
                  <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs font-semibold text-slate-700 block">
                    {file ? file.name : "Choose CSV or XLSX file"}
                  </span>
                  <span className="text-[12px] text-slate-400 mt-1 block">
                    Click to browse files
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full rounded-xl bg-[#002E6E] py-2.5 text-xs font-bold text-white hover:bg-[#002456] transition active:scale-95 disabled:opacity-50"
              >
                {uploading ? "Validating & Ingesting..." : "Process & Import Records"}
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sample statement file:</span>
            <a
              href="/data/sample_paytm_statement.csv"
              download
              className="text-[#002E6E] font-bold hover:underline flex items-center gap-1"
            >
              <Download className="h-3 w-3" /> sample_paytm_statement.csv
            </a>
          </div>
        </div>

        {/* Demo Dataset Quick Seed */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#002E6E] uppercase tracking-wider flex items-center gap-2">
                <Database className="h-4 w-4 text-[#00BAF2]" />
                Demo Store Sandbox
              </h3>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[12px] font-bold px-2 py-0.5">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Pre-loaded with a realistic 180-day Indian Kirana store dataset (*Sharma General Store, Hyderabad*):
            </p>

            <div className="space-y-2 rounded-xl bg-white border border-slate-200 p-4 text-xs font-medium text-slate-700">
              <div className="flex justify-between">
                <span>Transactions Recorded:</span>
                <strong className="text-[#002E6E] font-mono">5,499 txns</strong>
              </div>
              <div className="flex justify-between">
                <span>Unique Customer VPAs:</span>
                <strong className="text-[#002E6E] font-mono">600 profiles</strong>
              </div>
              <div className="flex justify-between">
                <span>FMCG Product Catalog:</span>
                <strong className="text-[#002E6E] font-mono">35 SKUs</strong>
              </div>
              <div className="flex justify-between">
                <span>Total 6-Month Volume:</span>
                <strong className="text-emerald-700 font-mono">₹28.9 Lakhs</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleSeedDemo}
            disabled={seeding}
            className="mt-6 w-full rounded-xl border border-blue-300 bg-white py-2.5 text-xs font-bold text-[#002E6E] hover:bg-blue-50 transition active:scale-95 flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${seeding ? "animate-spin" : ""}`} />
            <span>{seeding ? "Refreshing Store Data..." : "Re-Seed 5,000-Txn Demo Store"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
