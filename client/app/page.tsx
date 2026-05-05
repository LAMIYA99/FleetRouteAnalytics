"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

// --- Types ---
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
  violations?: { type: string; severity: string; time: string; location?: any }[];
}

// --- Helpers ---
const getScoreSeverity = (score: number) => {
  if (score >= 80) return { label: "Excellent", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
  if (score >= 60) return { label: "Average", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
  return { label: "High Risk", cls: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" };
};

const formatNum = (n: number | undefined) => (n !== undefined ? n.toFixed(1) : "—");

// --- Components ---
function RouteMapPlaceholder() {
  return (
    <div className="w-full h-full min-h-[180px] bg-slate-50 flex flex-col items-center justify-center gap-3 border border-dashed border-slate-200 rounded-xl transition-colors hover:bg-slate-100/50">
      <div className="p-3 bg-white rounded-full shadow-sm">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-slate-400">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
        </svg>
      </div>
      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Route View Placeholder</span>
    </div>
  );
}

function TripCard({ trip, index }: { trip: Trip; index: number }) {
  const sev = getScoreSeverity(trip.score);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex-wrap">
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">TRIP #{index + 1}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 text-white rounded overflow-hidden">
             <span className="text-[9px] font-black px-1.5 py-0.5 bg-blue-600">AZ</span>
             <span className="text-xs font-bold px-2 py-0.5">{trip.plate || "—"}</span>
          </div>
        </div>
        <span className="text-sm font-semibold text-slate-700">{trip.driver}</span>
        
        <div className="ml-auto flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold ${sev.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot} animate-pulse`} />
            {sev.label}
          </div>
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Safety Score</span>
            <span className={`text-2xl font-black ${trip.score >= 60 ? "text-slate-900" : "text-rose-600"}`}>
              {trip.score}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Route Details</h4>
              <div className="space-y-3">
                {[
                  { label: "Date", value: trip.date },
                  { label: "Timeline", value: `${trip.startTime} → ${trip.endTime}` },
                  { label: "From", value: trip.from, isDim: true },
                  { label: "To", value: trip.to, isDim: true },
                  { label: "Distance", value: `${formatNum(trip.distanceKm)} km`, isBold: true },
                  { label: "Duration", value: `${trip.durationMin} min`, isBold: true },
                  { label: "Result", value: trip.result, badge: true },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm items-baseline border-b border-slate-50 pb-1">
                    <span className="text-slate-400 text-xs">{item.label}</span>
                    <span className={`${item.isDim ? "text-slate-500 text-xs italic" : "text-slate-800 font-medium"} ${item.isBold ? "text-blue-600" : ""} ${item.badge ? "bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold" : ""}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Telemetry Metrics</h4>
              <div className="space-y-3 mb-6">
                 {[
                  { label: "Idle Time", value: `${trip.idlingSec} sec` },
                  { label: "Avg / Max Speed", value: `${formatNum(trip.avgSpeedKmh)} / ${formatNum(trip.maxSpeedKmh)} km/h` },
                  { label: "Fuel Est.", value: trip.fuelLiters ? `${formatNum(trip.fuelLiters)} L` : "—" },
                  { label: "Wait Time", value: trip.waitDuration },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm items-baseline border-b border-slate-50 pb-1">
                    <span className="text-slate-400 text-xs">{item.label}</span>
                    <span className="text-slate-800 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              {trip.violations && trip.violations.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Safety Events</h4>
                  <div className="space-y-2">
                    {trip.violations.map((v, i) => {
                      const vc = v.severity === "High" ? "text-rose-600 bg-rose-50" : v.severity === "Medium" ? "text-amber-600 bg-amber-50" : "text-slate-500 bg-slate-50";
                      return (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-slate-50 text-[11px]">
                          <span className="text-slate-400 tabular-nums">{v.time}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${vc}`}>{v.severity}</span>
                          <span className="font-semibold text-slate-700">{v.type}</span>
                          {v.location && <span className="ml-auto text-slate-400 truncate max-w-[100px]">{v.location}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-80 bg-slate-50/50 p-4 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-3">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase">Trajectory Map</h4>
             <button className="text-[10px] text-blue-600 font-bold hover:underline">View Fullscreen</button>
          </div>
          <div className="flex-1">
            <RouteMapPlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HTML Export Builder ---
function buildExportHtml(trips: Trip[], meta: { driver: string; generated: string }): string {
  const totalDist = trips.reduce((s, t) => s + t.distanceKm, 0);
  const avgScore = trips.length ? Math.round(trips.reduce((s, t) => s + t.score, 0) / trips.length) : 0;

  const tripBlocks = trips.map((t, i) => `
    <div class="trip-card">
      <div class="trip-header">
        <div class="trip-id">TRIP #${i + 1}</div>
        <div class="plate">AZ ${t.plate}</div>
        <div class="driver-name">${t.driver}</div>
        <div class="trip-score">
          <span class="score-label">SCORE</span>
          <span class="score-val ${t.score < 60 ? "critical" : ""}">${t.score}</span>
        </div>
      </div>
      <div class="trip-grid">
        <div class="col">
          <h3>Route Info</h3>
          <div class="row"><span>Date</span><strong>${t.date}</strong></div>
          <div class="row"><span>From</span><strong>${t.from}</strong></div>
          <div class="row"><span>To</span><strong>${t.to}</strong></div>
          <div class="row"><span>Distance</span><strong>${t.distanceKm.toFixed(1)} km</strong></div>
        </div>
        <div class="col">
          <h3>Telemetry</h3>
          <div class="row"><span>Start / End</span><strong>${t.startTime} - ${t.endTime}</strong></div>
          <div class="row"><span>Duration</span><strong>${t.durationMin} min</strong></div>
          <div class="row"><span>Max Speed</span><strong>${t.maxSpeedKmh ?? "—"} km/h</strong></div>
          <div class="row"><span>Fuel Est.</span><strong>${t.fuelLiters ? t.fuelLiters.toFixed(1) + " L" : "—"}</strong></div>
        </div>
      </div>
      ${t.violations?.length ? `
      <div class="violations">
        <h3>Safety Events</h3>
        <ul>
          ${t.violations.map(v => `<li><span class="sev-${v.severity.toLowerCase()}">${v.severity}</span> ${v.time} — ${v.type}</li>`).join("")}
        </ul>
      </div>` : ""}
    </div>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Fleet Analytics Report — ${meta.driver || "All Drivers"}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f1f5f9; color: #1e293b; padding: 40px; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px; }
    .company { font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    h1 { margin: 8px 0; font-size: 32px; color: #0f172a; }
    .meta { font-size: 12px; color: #94a3b8; }
    .summary-grid { display: flex; gap: 20px; margin-bottom: 40px; }
    .stat { flex: 1; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; }
    .stat label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 8px; }
    .stat span { font-size: 24px; font-weight: 800; color: #0f172a; }
    .trip-card { border: 1px solid #f1f5f9; border-radius: 12px; margin-bottom: 24px; overflow: hidden; page-break-inside: avoid; }
    .trip-header { background: #f8fafc; padding: 12px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f1f5f9; }
    .trip-id { font-size: 10px; font-weight: 800; color: #94a3b8; }
    .plate { background: #0f172a; color: white; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
    .driver-name { font-size: 14px; font-weight: 600; }
    .trip-score { margin-left: auto; text-align: right; }
    .score-label { font-size: 9px; color: #94a3b8; font-weight: 800; display: block; }
    .score-val { font-size: 20px; font-weight: 800; color: #059669; }
    .score-val.critical { color: #dc2626; }
    .trip-grid { display: flex; padding: 20px; gap: 40px; }
    .col { flex: 1; }
    h3 { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
    .row span { color: #64748b; }
    .violations { padding: 0 20px 20px; border-top: 1px solid #f8fafc; }
    .violations ul { list-style: none; padding: 0; margin: 0; }
    .violations li { font-size: 12px; margin-bottom: 4px; color: #475569; }
    .sev-high { color: #dc2626; font-weight: 700; }
    .sev-medium { color: #d97706; font-weight: 700; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
    @media print { body { padding: 0; background: white; } .container { box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="company">GeekBro MMC</div>
        <h1>Fleet Analytics Report</h1>
        <div class="meta">Subject: ${meta.driver || "Full Fleet Analysis"}</div>
      </div>
      <div style="text-align: right">
        <div class="meta">Report ID: GB-${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
        <div class="meta">Generated: ${meta.generated}</div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="stat"><label>Total Routes</label><span>${trips.length}</span></div>
      <div class="stat"><label>Total Distance</label><span>${totalDist.toFixed(1)} km</span></div>
      <div class="stat"><label>Avg Safety Score</label><span>${avgScore}</span></div>
    </div>

    ${tripBlocks}

    <div class="footer">
      GeekBro AI Fleet Telematics System &copy; 2026. This report is automatically generated for authorized personnel only.
    </div>
  </div>
</body>
</html>
  `;
}

// --- Main Component ---
export default function FleetAnalytics() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reportUrl, setReportUrl] = useState("https://dev-app.geekbro.ai/be-service/drivers/45fc54d7-2325-486a-b34e-46ab27461190/trips?page=0&size=100");
  const [token, setToken] = useState("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsYW1peWVhbGl6YWRlIiwiY29tcGFueUlkIjoiYzM5ODM1YWUtNTQwOC00YmQ1LTg4N2EtNjZkNWZhNzhkZWZiIiwicm9sZSI6IlRFQ0hfQURNSU4iLCJleHAiOjE3Nzc5OTQwNDl9.PxnA5kd2bLJ8eGvVghlf3JywL_BOGTOt5AZ0VjoVr6c");
  
  const [driverFilter, setDriverFilter] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [isApiDown, setIsApiDown] = useState(false);

  useEffect(() => {
    if (token) {
       setIsLoggedIn(true);
    }
  }, [token]);

  const handleLogout = () => {
    setToken("");
    setIsLoggedIn(false);
    setTrips([]);
  };

  const loadMockData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsApiDown(false);
    try {
      const params = new URLSearchParams();
      if (driverFilter) params.append("driver", driverFilter);
      const res = await fetch(`/api/mock?${params.toString()}`);
      const result = await res.json();
      setTrips(result.data || []);
      setLastFetched(new Date().toLocaleString("en-GB", { dateStyle: 'medium', timeStyle: 'short' }) + " (mock)");
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setIsApiDown(false);
    try {
      // Extract driver ID from URL if possible, otherwise use default from curl
      const driverIdMatch = reportUrl.match(/\/drivers\/([^\/]+)\//);
      const driverId = driverIdMatch ? driverIdMatch[1] : "45fc54d7-2325-486a-b34e-46ab27461190";

      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: reportUrl,
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: {
            id: driverId,
            movementAtFrom: 1777838400000,
            movementAtTill: 1778011199999
          }
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          setErrorMsg("Token expired or invalid. Please provide a fresh token.");
          return;
        }
        if (response.status === 504) {
          setIsApiDown(true);
          setErrorMsg("The GeekBro API is not responding (timeout). Use mock data to preview the dashboard.");
          return;
        }
        throw new Error(result.error || result.details?.error || `Fetch failed: ${response.statusText}`);
      }

      // --- Robust Data Parsing ---
      let rawTrips: any[] | null = null;

      // 1. Check if direct array
      if (Array.isArray(result)) {
        rawTrips = result;
      } 
      // 2. Check common fields
      else if (Array.isArray(result.data)) {
        rawTrips = result.data;
      }
      else if (Array.isArray(result.trips)) {
        rawTrips = result.trips;
      }
      else if (Array.isArray(result.items)) {
        rawTrips = result.items;
      }
      // 3. Recursive search for any array in the response (max depth 2)
      else {
        const findArray = (obj: any): any[] | null => {
          if (!obj || typeof obj !== 'object') return null;
          // Check top level
          const topArr = Object.values(obj).find(v => Array.isArray(v));
          if (topArr) return topArr as any[];
          
          // Check one level deeper
          for (const key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
              const innerArr = Object.values(obj[key]).find(v => Array.isArray(v));
              if (innerArr) return innerArr as any[];
            }
          }
          return null;
        };
        rawTrips = findArray(result);
      }

      if (!rawTrips) {
        console.error("API Response Structure:", result);
        throw new Error(`Data format error: Received JSON but couldn't find an array of trips. Keys found: ${Object.keys(result).join(", ")}`);
      }

      console.log("GeekBro API Response:", result);
      setTrips(rawTrips);
      setLastFetched(new Date().toLocaleString("en-GB", { dateStyle: 'medium', timeStyle: 'short' }));
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const html = buildExportHtml(safeTrips as any, {
      driver: driverFilter,
      generated: lastFetched || new Date().toLocaleString(),
    });
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GeekBro-FleetReport-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const safeTrips = (trips || []).map((t: any) => {
    // Helper to extract value from potential string/number
    const num = (v: any): number => {
      if (typeof v === 'number') return isNaN(v) ? 0 : v;
      if (typeof v === 'string') {
        const p = parseFloat(v);
        return isNaN(p) ? 0 : p;
      }
      return 0;
    };
    
    // Helper to format address objects safely
    const addr = (v: any): string => {
      if (!v) return "—";
      if (typeof v === 'string') return v;
      if (typeof v === 'object') {
        try {
          if (v.fullAddress) return String(v.fullAddress);
          if (v.address) return typeof v.address === 'object' ? addr(v.address) : String(v.address);
          const parts = [v.city, v.settlement, v.street, v.house].filter(p => p && typeof p === 'string');
          if (parts.length > 0) return parts.join(", ");
          return JSON.stringify(v);
        } catch (e) {
          return "Address Error";
        }
      }
      return String(v);
    };

    const driverName = t.driver?.name || t.driver?.fullName || "Driver #" + (reportUrl.match(/\/drivers\/([^\/]+)\//)?.[1]?.slice(-4) || "0000");
    const plateVal = t.vehicle?.plateNumber || t.vehicle?.plate || t.vehicle_plate || "—";

    return {
      ...t,
      driver: String(driverName),
      plate: String(plateVal),
      score: num(t.currentScoring || t.totalScore || 0),
      distanceKm: num(t.km || t.distanceKm || t.distance || 0),
      durationMin: num(t.time || t.durationMin || t.duration || 0),
      idlingSec: num(t.idling || t.idlingSec || 0),
      startTime: t.startGpsPoint?.timestamp ? new Date(t.startGpsPoint.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—",
      endTime: t.finishGpsPoint?.timestamp ? new Date(t.finishGpsPoint.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—",
      date: t.startGpsPoint?.timestamp ? new Date(t.startGpsPoint.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—",
      from: addr(t.startAddress || t.from),
      to: addr(t.finishAddress || t.to),
      result: t.result || (t.indicator === false ? "Success" : "Completed"),
      violations: (t.penalties > 0 && !t.violations) ? [{ type: "Safety Violation", severity: "High", time: "During Trip", location: "See Map" }] : (t.violations || []).map((v: any) => ({
        ...v,
        type: String(v.type || "Violation"),
        severity: String(v.severity || "High"),
        time: String(v.time || "—"),
        location: addr(v.location || v.address)
      }))
    };
  });

  const totalDist = safeTrips.reduce((s, t) => s + (t.distanceKm || 0), 0);
  const avgScore = safeTrips.length ? Math.round(safeTrips.reduce((s, t) => s + (t.score || 0), 0) / safeTrips.length) : 0;
  const highRiskCount = safeTrips.filter(t => (t.score || 0) < 60).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <Image src="/logo.png" width={64} height={64} alt="GeekBro" className="object-contain" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Telemetry Engine</h2>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[0.9]">
                  Fleet Analytics <span className="text-slate-400">Reports</span>
                </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Active</p>
               <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 Connected
               </p>
             </div>
             <button 
                onClick={handleLogout}
                className="bg-white border border-slate-200 p-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-slate-400 hover:text-rose-600"
                title="Update Token"
             >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                   <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </button>
          </div>
        </header>

        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 mb-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none" />
           
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
              <div className="lg:col-span-8 space-y-6">
                 <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Report API Configuration</label>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          value={reportUrl} 
                          onChange={(e) => setReportUrl(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          placeholder="API Endpoint"
                       />
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Host: {new URL(reportUrl).hostname}</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Auth: Token Active</span>
                 </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-end gap-3">
                 <button 
                    onClick={fetchData}
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                 >
                    {isLoading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (
                      <>
                        <span>RUN ANALYTICS ENGINE</span>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
                           <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                 </button>
                 
                 {trips.length > 0 && (
                   <div className="flex flex-col gap-2">
                     <button 
                        onClick={handleDownload}
                        className="w-full bg-white border-2 border-blue-600 text-blue-600 font-black py-3.5 rounded-2xl hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                     >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        DOWNLOAD PDF REPORT
                     </button>
                     <button 
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(trips, null, 2));
                          alert("JSON copied to clipboard!");
                        }}
                        className="w-full bg-slate-100 text-slate-600 font-bold py-2 rounded-xl hover:bg-slate-200 transition-all text-xs flex items-center justify-center gap-2"
                     >
                        COPY RAW DATA
                     </button>
                   </div>
                 )}
              </div>
           </div>

           {errorMsg && (
             <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
               <div className="flex items-start gap-3 text-rose-600 text-sm font-bold">
                 <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" className="shrink-0 mt-0.5">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                 </svg>
                 <span>{errorMsg}</span>
               </div>
               {isApiDown && (
                 <button
                   onClick={loadMockData}
                   className="mt-3 ml-8 bg-rose-600 text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-rose-700 transition-all"
                 >
                   LOAD MOCK DATA INSTEAD →
                 </button>
               )}
             </div>
           )}
        </section>

        {trips.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: "Analyzed Trips", val: trips.length, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" },
                 { label: "Total Distance", val: `${totalDist.toFixed(1)} km`, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                 { label: "Avg Safety Score", val: avgScore, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                 { label: "High Risk Flags", val: highRiskCount, icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", color: highRiskCount > 0 ? 'text-rose-600' : '' },
               ].map((s, i) => (
                 <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                       <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-slate-300">
                          <path d={s.icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                    <p className={`text-2xl font-black ${s.color || 'text-slate-900'}`}>{s.val}</p>
                 </div>
               ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                  Trip Execution Logs
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black rounded uppercase">Live Feed</span>
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sync: {lastFetched}</p>
              </div>

              
              <div className="grid grid-cols-1 gap-0">
                {safeTrips.map((trip, idx) => (
                  <TripCard key={trip.id || idx} trip={trip as any} index={idx} />
                ))}
              </div>
            </div>
          </div>
        ) : !isLoading && (
          <div className="py-24 text-center">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-slate-300">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Process Data</h3>
             <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
               Click the button above to start the analytics engine and fetch real-time trip reports using your secure token.
             </p>
          </div>
        )}

        <footer className="mt-24 pt-8 border-t border-slate-200 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
             GeekBro MMC &copy; 2026 AI Fleet Telematics System
           </p>
        </footer>

      </div>
    </div>
  );
}
