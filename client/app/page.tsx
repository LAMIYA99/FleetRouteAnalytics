"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";


interface Trip {
  id: string | number;
  driver: string;
  plate: string;
  date: string;
  startTime: string;
  endTime: string;
  waitDuration: string;
  from: string;
  to: string;
  score: number;
  distanceKm: number;
  durationMin: number;
  idlingSec: number;
  result: string;
  maxSpeedKmh?: number;
  avgSpeedKmh?: number;
  fuelLiters?: number;
  violations?: { type: string; severity: string; time: string; location?: string }[];
}


const severity = (score: number) => {
  if (score >= 80) return { label: "Low", cls: "bg-green-100 text-green-700 border-green-300" };
  if (score >= 60) return { label: "Medium", cls: "bg-orange-100 text-orange-600 border-orange-300" };
  return { label: "High risk", cls: "bg-red-100 text-red-600 border-red-300" };
};

const fmt = (n: number) => n.toFixed(1);

function RouteMapPlaceholder() {
  return (
    <div className="w-full h-full min-h-[160px] bg-gray-50 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200 rounded">
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-gray-300">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
      </svg>
      <span className="text-xs text-gray-400">Route map placeholder</span>
    </div>
  );
}


function TripCard({ trip, index }: { trip: Trip; index: number }) {
  const sev = severity(trip.score);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-5">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white flex-wrap">
        <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
        <div className="flex items-center gap-1">
          <span className="bg-gray-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">AZ</span>
          <span className="bg-gray-100 text-gray-800 text-sm font-bold px-2 py-0.5 border border-gray-300 rounded-sm">
            {trip.plate || "—"}
          </span>
        </div>
        <span className="text-sm text-gray-700 font-medium">{trip.driver}</span>
        <div className="ml-auto flex items-center gap-3 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${sev.cls}`}>{sev.label}</span>
          <span className="text-xs text-gray-400">Safety score</span>
          <span className={`text-2xl font-bold ${trip.score >= 60 ? "text-gray-800" : "text-red-600"}`}>
            {trip.score}
          </span>
        </div>
      </div>

      <div className="flex bg-white flex-col md:flex-row">
        <div className="flex-1 p-4">
          <div className="flex gap-6 mb-5 flex-wrap">
            <div className="flex-1 min-w-[180px]">
              <p className="text-sm font-semibold text-gray-800 mb-2">Route</p>
              <table className="w-full text-xs">
                <tbody>
                  {[
                    ["Date", trip.date],
                    ["Start time", trip.startTime],
                    ["End time", trip.endTime],
                    ["From", trip.from],
                    ["To", trip.to],
                    ["Distance", `${fmt(trip.distanceKm)} km`],
                    ["Duration", `${trip.durationMin} min`],
                    ["Result", trip.result],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="text-gray-400 py-0.5 pr-3 whitespace-nowrap">{k}</td>
                      <td className="text-gray-800 font-medium">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex-1 min-w-[180px]">
              <p className="text-sm font-semibold text-gray-800 mb-2">Performance</p>
              <table className="w-full text-xs">
                <tbody>
                  {[
                    ["Wait duration", trip.waitDuration],
                    ["Avg / max speed", `${trip.avgSpeedKmh ?? "—"} / ${trip.maxSpeedKmh ?? "—"} km/h`],
                    ["Idle time", `${trip.idlingSec} sec`],
                    ["Fuel impact", trip.fuelLiters != null ? `${fmt(trip.fuelLiters)} L` : "—"],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="text-gray-400 py-0.5 pr-3 whitespace-nowrap">{k}</td>
                      <td className="text-gray-800 font-medium text-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {trip.violations && trip.violations.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Events &amp; Violations</p>
                  <div className="space-y-1">
                    {trip.violations.map((v, i) => {
                      const vc =
                        v.severity === "High"
                          ? "bg-red-100 text-red-600 border-red-300"
                          : v.severity === "Medium"
                          ? "bg-orange-100 text-orange-500 border-orange-300"
                          : "bg-gray-100 text-gray-500 border-gray-300";
                      return (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                          <span className="text-gray-400">{v.time}</span>
                          <span className={`inline-block px-2 py-0.5 rounded border text-xs font-medium ${vc}`}>
                            {v.severity}
                          </span>
                          <span className="font-medium text-gray-700">{v.type}</span>
                          {v.location && <span className="ml-auto text-gray-400">{v.location}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-gray-100 p-3">
          <p className="text-[10px] text-gray-400 mb-2">Route map + violation markers</p>
          <RouteMapPlaceholder />
        </div>
      </div>
    </div>
  );
}


function buildHtml(trips: Trip[], meta: { from: string; to: string; generated: string }): string {
  const tripRows = trips
    .map(
      (t, i) => `
    <div class="card">
      <div class="card-header">
        <span class="idx">#${i + 1}</span>
        <span class="plate">AZ ${t.plate}</span>
        <span class="driver">${t.driver}</span>
        <span class="score-label">Safety score</span>
        <span class="score ${t.score < 60 ? "score-bad" : ""}">${t.score}</span>
      </div>
      <div class="card-body">
        <table>
          <tr><td class="k">Date</td><td>${t.date}</td><td class="k">Start</td><td>${t.startTime}</td></tr>
          <tr><td class="k">End</td><td>${t.endTime}</td><td class="k">Wait</td><td>${t.waitDuration}</td></tr>
          <tr><td class="k">From</td><td>${t.from}</td><td class="k">To</td><td>${t.to}</td></tr>
          <tr><td class="k">Distance</td><td>${t.distanceKm.toFixed(1)} km</td><td class="k">Duration</td><td>${t.durationMin} min</td></tr>
          <tr><td class="k">Idle time</td><td>${t.idlingSec} sec</td><td class="k">Result</td><td>${t.result}</td></tr>
          ${t.maxSpeedKmh != null ? `<tr><td class="k">Avg/Max speed</td><td>${t.avgSpeedKmh ?? "—"}/${t.maxSpeedKmh} km/h</td><td class="k">Fuel</td><td>${t.fuelLiters != null ? t.fuelLiters.toFixed(1) + " L" : "—"}</td></tr>` : ""}
        </table>
        ${
          t.violations && t.violations.length > 0
            ? `<div class="violations"><strong>Events &amp; Violations:</strong><ul>${t.violations
                .map((v) => `<li><span class="sev sev-${v.severity.toLowerCase()}">${v.severity}</span> ${v.time} — ${v.type}${v.location ? " · " + v.location : ""}</li>`)
                .join("")}</ul></div>`
            : ""
        }
        <div class="map-placeholder">[ Route map placeholder ]</div>
      </div>
    </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GeekBro MMC — Fleet Route Analytics Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 32px; }
    .header { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; margin-bottom: 24px; }
    .header-left h1 { font-size: 26px; font-weight: 800; color: #111; margin: 4px 0 2px; }
    .header-left .company { font-size: 13px; color: #6b7280; }
    .header-left .sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
    .header-right { text-align: right; font-size: 12px; color: #6b7280; }
    .header-right .date-range { font-weight: 600; color: #374151; }
    .section-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 16px; }
    .total { font-size: 12px; color: #9ca3af; margin-bottom: 20px; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px; page-break-inside: avoid; }
    .card-header { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid #e5e7eb; background: #fff; flex-wrap: wrap; }
    .idx { font-size: 11px; color: #9ca3af; font-weight: 700; }
    .plate { background: #1f2937; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; }
    .driver { font-size: 13px; color: #374151; font-weight: 600; }
    .score-label { margin-left: auto; font-size: 11px; color: #9ca3af; }
    .score { font-size: 22px; font-weight: 800; color: #1a1a1a; }
    .score-bad { color: #dc2626; }
    .card-body { padding: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 10px; }
    td { padding: 3px 6px; vertical-align: top; }
    td.k { color: #9ca3af; width: 90px; }
    .violations { margin-top: 10px; font-size: 11px; }
    .violations strong { display: block; margin-bottom: 4px; color: #374151; }
    .violations ul { list-style: none; display: flex; flex-direction: column; gap: 3px; }
    .sev { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px; font-weight: 600; }
    .sev-high { background: #fee2e2; color: #dc2626; }
    .sev-medium { background: #ffedd5; color: #ea580c; }
    .sev-low { background: #f0fdf4; color: #16a34a; }
    .map-placeholder { margin-top: 12px; height: 80px; border: 1px dashed #d1d5db; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #d1d5db; font-size: 11px; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; }
    @media print { body { padding: 16px; } .card { break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="company">GeekBro MMC</div>
      <h1>Fleet Route Analytics Report</h1>
      <div class="sub">Client: Full Company Name · AI fleet telematics</div>
    </div>
    <div class="header-right">
      <div class="date-range">${meta.from} — ${meta.to}</div>
      <div>Generated: ${meta.generated}</div>
    </div>
  </div>

  <div class="section-title">Driver Trips (${trips.length} routes)</div>
  <div class="total">Total trips in selected period: ${trips.length}</div>

  ${tripRows}

  <div class="footer">Generated by GeekBro MMC AI fleet telematics system · ${meta.generated}</div>
</body>
</html>`;
}


export default function FleetReport() {
  const [apiUrl, setApiUrl] = useState("/api/mock");
  const [token, setToken] = useState("");
  const [driver, setDriver] = useState("");

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  async function fetchReport() {
    setLoading(true);
    setError(null);
    setTrips([]);

    try {
      const params = new URLSearchParams();
      if (driver) params.append("driver", driver);

      const targetUrl = `${apiUrl}?${params.toString()}`;
      const isLocal = apiUrl.startsWith('/');
      
      let res;
      if (isLocal) {
        res = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      } else {
        res = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetUrl,
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        });
      }

      if (!res.ok) {
        let errDetails = res.statusText;
        try {
          const errData = await res.json();
          errDetails = errData.error || errData.details?.error || errDetails;
        } catch (e) {}
        throw new Error(`HTTP ${res.status}: ${errDetails}`);
      }

      const json = await res.json();

    
      const raw: Trip[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.trips)
        ? json.trips
        : Array.isArray(json.routes)
        ? json.routes
        : [];

      if (raw.length === 0) {
        setError("API returned no trips for the selected period.");
      } else {
        setTrips(raw);
        setFetchedAt(new Date().toLocaleString("en-GB"));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  // ── download HTML ──
  function downloadHtml() {
    const html = buildHtml(trips, {
      from: "—",
      to: "—",
      generated: fetchedAt ?? new Date().toLocaleString("en-GB"),
    });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fleet-report-all_all.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── stats ──
  const totalKm = trips.reduce((s, t) => s + t.distanceKm, 0);
  const avgScore = trips.length
    ? Math.round(trips.reduce((s, t) => s + t.score, 0) / trips.length)
    : 0;
  const highRisk = trips.filter((t) => t.score < 60).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" width={80} height={80} alt="GeekBro logo" />
            <div>
              <p className="text-sm text-gray-500 font-medium">GeekBro MMC</p>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                Fleet Route Analytics Report
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Client: Full Company Name · Fleet group: Logistics / Baku
              </p>
            </div>
          </div>
          <div className="text-right">
            {fetchedAt && (
              <p className="text-sm text-gray-600 font-medium">
                All dates
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">AI fleet telematics</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* ── API CONFIG FORM ── */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Report Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">API Endpoint URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://dev-app.geekbro.ai/api/reports/driver-trips"
                className="w-full border border-gray-200 rounded px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Bearer Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGci..."
                className="w-full border border-gray-200 rounded px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Driver (optional)</label>
              <input
                type="text"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                placeholder="Driver name or ID"
                className="w-full border border-gray-200 rounded px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              id="btn-generate-report"
              onClick={fetchReport}
              disabled={loading}
              className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Fetching…" : "Generate Report"}
            </button>

            {trips.length > 0 && (
              <button
                id="btn-download-html"
                onClick={downloadHtml}
                className="px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-500 transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M12 16l-5-5h3V4h4v7h3l-5 5z" fill="currentColor"/>
                  <path d="M5 20h14v-2H5v2z" fill="currentColor"/>
                </svg>
                Download HTML
              </button>
            )}
          </div>

          {error && (
            <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* ── EXECUTIVE SUMMARY (shown after data loads) ── */}
        {trips.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-800 mb-0.5">Executive summary</h2>
              <p className="text-xs text-gray-400 mb-4">
                Fetched {trips.length} trips · Generated: {fetchedAt}
              </p>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden divide-x divide-gray-200 flex-wrap">
                {[
                  { label: "Trips", value: String(trips.length), sub: `${highRisk} high-risk` },
                  { label: "Distance", value: `${totalKm.toFixed(0)} km`, sub: "total" },
                  { label: "Avg safety score", value: String(avgScore), sub: "fleet benchmark" },
                  { label: "High risk", value: String(highRisk), sub: "score < 60" },
                  {
                    label: "Total idle",
                    value: `${Math.round(trips.reduce((s, t) => s + t.idlingSec, 0) / 60)} min`,
                    sub: "across all trips",
                  },
                ].map((s) => (
                  <div key={s.label} className="flex-1 min-w-[120px] px-4 py-3">
                    <p className="text-[11px] text-gray-500 mb-0.5">{s.label}</p>
                    <p className="text-2xl font-bold text-gray-900 leading-tight">{s.value}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── TRIP CARDS ── */}
            <div ref={reportRef}>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-base font-bold text-gray-800">Trip details</h2>
              </div>

              {trips.map((trip, i) => (
                <TripCard key={trip.id ?? i} trip={trip} index={i} />
              ))}
            </div>
          </>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && trips.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-gray-200 mb-4">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
            </svg>
            <p className="text-sm text-gray-400 font-medium">No data yet</p>
            <p className="text-xs text-gray-300 mt-1">Fill in the form above and click "Generate Report"</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Fetching trip data…</p>
          </div>
        )}

      </div>
    </div>
  );
}
