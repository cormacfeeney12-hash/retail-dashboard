"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { rds } from "@/lib/rds";
import { C, fmt } from "@/lib/utils";
import { STORE_LABELS, STORE_COLORS } from "@/components/DashboardNav";
import { useStore } from "@/contexts/StoreContext";

/* ───── types ───── */

interface ProductResult {
  name: string;
  lv_code: string;
  category: string;
  subcategory: string;
  store_number: string;
  yd_margin_pct: number | null;
  l7d_margin_pct: number | null;
  ytd_margin_pct: number | null;
  yd_qty: number | null;
  l7d_qty: number | null;
  ytd_qty: number | null;
  yd_sales: number | null;
  l7d_sales: number | null;
  ytd_sales: number | null;
  yd_margin: number | null;
  l7d_margin: number | null;
  ytd_margin: number | null;
}

interface CpuRow {
  invoice_cpu: number | null;
  rsp: number | null;
}

interface PriceCheck {
  id: number;
  created_at: string;
  product_name: string;
  lv_code: string | null;
  store_number: string | null;
  competitor_name: string;
  our_price: number | null;
  their_price: number;
  our_cost: number | null;
  our_margin_pct: number | null;
  their_margin_pct: number | null;
  margin_impact: number | null;
  recommendation: string | null;
  category: string | null;
  photo_key: string | null;
}

interface Idea {
  id: number;
  created_at: string;
  category: string;
  store_number: string;
  description: string;
  priority: string;
  status: string;
}

interface PhotoMeta {
  id: number;
  created_at: string;
  title: string;
  category: string;
  store_number: string;
  s3_key: string;
  product_name: string | null;
  lv_code: string | null;
  url?: string | null;
}

const IDEA_CATEGORIES = [
  "D0024 GROCERY IMPULSE",
  "D0025 GROCERY EDIBLE",
  "D0026 NON FOOD",
  "D0027 BABY & KIDS",
  "D0028 PERSONAL CARE",
  "D0029 BWS",
  "D0031 TOBACCO",
  "D0032 PRODUCE",
  "D0033 MEAT POULTRY FISH",
  "D0034 DAIRY",
  "D0035 BREAD AND CAKES",
  "D0036 DELI AND FOOD TO GO",
  "D0037 PROVISIONS",
  "D0038 FROZEN",
  "D0039 NON FOOD RETAIL",
  "D0046 NEWS AND MAGS",
  "D0047 INSTORE SERVICES",
];

const PRIORITY_OPTIONS = [
  { value: "high", label: "High", color: "#ef4444" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "low", label: "Low", color: "#22c55e" },
];

type ActiveTab = "price-check" | "ideas-photos";

/* ───── helpers ───── */

const num = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
  return 0;
};

const normPct = (v: number | null | undefined): number => {
  const n = num(v);
  return Math.abs(n) < 1 && n !== 0 ? n * 100 : n;
};

const pillBtn = (active: boolean, color?: string, theme?: string): React.CSSProperties => {
  const c = color && active ? color : active ? (theme ?? C.accent) : undefined;
  return {
    padding: "5px 12px",
    borderRadius: "6px",
    border: `1px solid ${c ?? C.border}`,
    background: c ? `${c}22` : "transparent",
    color: c ?? C.textDim,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: active ? 600 : 400,
    transition: "all 0.15s",
  };
};

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: `1px solid ${C.border}`,
  background: C.bg,
  color: C.text,
  fontSize: "14px",
  outline: "none",
  width: "100%",
};

const marginColor = (pct: number) => {
  if (pct >= 30) return C.green;
  if (pct >= 20) return C.amber;
  return C.red;
};

/* ───── component ───── */

export default function PriceTrackerPage() {
  const { store, setStore, themeColor } = useStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("price-check");

  // Search state
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Selected product
  const [selected, setSelected] = useState<ProductResult | null>(null);
  const [cpuData, setCpuData] = useState<CpuRow | null>(null);

  // Other store's data (for "both" mode)
  const [otherStoreProduct, setOtherStoreProduct] = useState<ProductResult | null>(null);

  // Competitor input
  const [competitorName, setCompetitorName] = useState("");
  const [competitorPrice, setCompetitorPrice] = useState("");
  // Photo upload (price check)
  const [photoFileObj, setPhotoFileObj] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Track whether user has saved this comparison
  const [saved, setSaved] = useState(false);

  // History
  const [history, setHistory] = useState<PriceCheck[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);

  // Ideas
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [ideaCategory, setIdeaCategory] = useState(IDEA_CATEGORIES[0]);
  const [ideaDesc, setIdeaDesc] = useState("");
  const [ideaStore, setIdeaStore] = useState<"2064" | "2056" | "both">("2064");
  const [ideaPriority, setIdeaPriority] = useState("medium");
  const [ideaSaving, setIdeaSaving] = useState(false);

  // Photos tab
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photoStore, setPhotoStore] = useState<"2064" | "2056">("2064");
  const [photoCat, setPhotoCat] = useState(IDEA_CATEGORIES[0]);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoUploadFile, setPhotoUploadFile] = useState<File | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  // Photo product link
  const [photoProductQuery, setPhotoProductQuery] = useState("");
  const [photoProductResults, setPhotoProductResults] = useState<ProductResult[]>([]);
  const [photoProductSearching, setPhotoProductSearching] = useState(false);
  const [photoShowDropdown, setPhotoShowDropdown] = useState(false);
  const [photoLinkedProduct, setPhotoLinkedProduct] = useState<{ name: string; lv_code: string } | null>(null);

  /* ── load history ── */
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    const { data, error } = await rds.query<PriceCheck>(
      "SELECT * FROM price_checks ORDER BY created_at DESC LIMIT 50"
    );
    if (error) {
      console.error("History load error:", error);
      setTableExists(false);
    } else {
      setHistory(data || []);
      setTableExists(true);
    }
    setHistoryLoading(false);
  }, []);

  /* ── load ideas ── */
  const loadIdeas = useCallback(async () => {
    setIdeasLoading(true);
    const { data, error } = await rds.query<Idea>(
      "SELECT * FROM store_ideas ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END, created_at DESC LIMIT 100"
    );
    if (!error) setIdeas(data || []);
    setIdeasLoading(false);
  }, []);

  /* ── load photos ── */
  const loadPhotos = useCallback(async () => {
    setPhotosLoading(true);
    try {
      const res = await fetch(`/api/photos?store_number=${photoStore}`);
      const { data } = await res.json();
      setPhotos(data || []);
    } catch (err) {
      console.error("Photos load error:", err);
    }
    setPhotosLoading(false);
  }, [photoStore]);

  useEffect(() => {
    loadHistory();
    loadIdeas();
  }, [loadHistory, loadIdeas]);

  useEffect(() => {
    if (activeTab === "ideas-photos") loadPhotos();
  }, [activeTab, loadPhotos]);

  /* ── submit idea ── */
  const submitIdea = async () => {
    if (!ideaDesc.trim()) return;
    setIdeaSaving(true);
    const storeVal = ideaStore === "both" ? "both" : ideaStore;
    const { error } = await rds.insert("store_ideas", {
      category: ideaCategory,
      store_number: storeVal,
      description: ideaDesc.trim(),
      priority: ideaPriority,
    });
    if (!error) {
      setIdeaDesc("");
      loadIdeas();
    }
    setIdeaSaving(false);
  };

  /* ── photo product search ── */
  useEffect(() => {
    if (photoProductQuery.length < 2) {
      setPhotoProductResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setPhotoProductSearching(true);
      const words = photoProductQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const cols = "name,lv_code,category,subcategory,store_number,yd_margin_pct,l7d_margin_pct,ytd_margin_pct,yd_qty,l7d_qty,ytd_qty,yd_sales,l7d_sales,ytd_sales,yd_margin,l7d_margin,ytd_margin";
      const nameConditions = words.map((_, i) => `name ILIKE $${i + 2}`).join(" AND ");
      const nameParams: unknown[] = [photoStore, ...words.map((w) => `%${w}%`)];
      const { data } = await rds.query<ProductResult>(
        `SELECT ${cols} FROM top_sellers WHERE store_number = $1 AND ${nameConditions} LIMIT 10`,
        nameParams
      );
      setPhotoProductResults(data || []);
      setPhotoShowDropdown(true);
      setPhotoProductSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [photoProductQuery, photoStore]);

  /* ── upload photo to S3 ── */
  const uploadPhotoToS3 = async (file: File, storeNumber: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/s3-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, storeNumber }),
      });
      const { presignedUrl, key } = await res.json();
      if (!presignedUrl) return null;
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      return key as string;
    } catch (err) {
      console.error("Photo upload error:", err);
      return null;
    }
  };

  /* ── upload photo (photos tab) ── */
  const handlePhotoUpload = async () => {
    if (!photoUploadFile || !photoTitle.trim()) return;
    setPhotoUploading(true);
    const s3Key = await uploadPhotoToS3(photoUploadFile, photoStore);
    if (s3Key) {
      await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: photoTitle.trim(),
          category: photoCat,
          store_number: photoStore,
          s3_key: s3Key,
          product_name: photoLinkedProduct?.name ?? null,
          lv_code: photoLinkedProduct?.lv_code ?? null,
        }),
      });
      setPhotoTitle("");
      setPhotoUploadFile(null);
      setPhotoLinkedProduct(null);
      setPhotoProductQuery("");
      loadPhotos();
    }
    setPhotoUploading(false);
  };

  /* ── search products (fuzzy multi-word) ── */
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const cols = "name,lv_code,category,subcategory,store_number,yd_margin_pct,l7d_margin_pct,ytd_margin_pct,yd_qty,l7d_qty,ytd_qty,yd_sales,l7d_sales,ytd_sales,yd_margin,l7d_margin,ytd_margin";
      let nameData: ProductResult[] | null;
      let codeData: ProductResult[] | null;
      if (store === "both") {
        const nameConditions = words.map((_, i) => `name ILIKE $${i + 1}`).join(" AND ");
        const nameParams: unknown[] = words.map((w) => `%${w}%`);
        ({ data: nameData } = await rds.query<ProductResult>(
          `SELECT ${cols} FROM top_sellers WHERE ${nameConditions} LIMIT 30`, nameParams
        ));
        ({ data: codeData } = await rds.query<ProductResult>(
          `SELECT ${cols} FROM top_sellers WHERE lv_code ILIKE $1 LIMIT 10`, [`%${query.trim()}%`]
        ));
      } else {
        const nameConditions = words.map((_, i) => `name ILIKE $${i + 2}`).join(" AND ");
        const nameParams: unknown[] = [store, ...words.map((w) => `%${w}%`)];
        ({ data: nameData } = await rds.query<ProductResult>(
          `SELECT ${cols} FROM top_sellers WHERE store_number = $1 AND ${nameConditions} LIMIT 15`, nameParams
        ));
        ({ data: codeData } = await rds.query<ProductResult>(
          `SELECT ${cols} FROM top_sellers WHERE store_number = $1 AND lv_code ILIKE $2 LIMIT 5`,
          [store, `%${query.trim()}%`]
        ));
      }
      const seen = new Set<string>();
      const merged: ProductResult[] = [];
      for (const row of [...(nameData || []), ...(codeData || [])]) {
        const key = `${row.lv_code}-${row.store_number}`;
        if (!seen.has(key)) { seen.add(key); merged.push(row); }
      }
      setSearchResults(merged.slice(0, 15));
      setShowDropdown(true);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, store]);

  /* ── select product ── */
  const selectProduct = async (product: ProductResult) => {
    setSelected(product);
    setShowDropdown(false);
    setQuery(product.name);
    setSaved(false);
    setOtherStoreProduct(null);
    const { data } = await rds.query<CpuRow>(
      "SELECT invoice_cpu, rsp FROM cpu_comparisons WHERE lv_code = $1 ORDER BY created_at DESC LIMIT 1",
      [product.lv_code]
    );
    if (data && data.length > 0) {
      setCpuData(data[0]);
    } else {
      const qty = num(product.l7d_qty) || num(product.yd_qty);
      const sales = num(product.l7d_sales) || num(product.yd_sales);
      const marginPctRaw = product.l7d_margin_pct ?? product.yd_margin_pct;
      const marginPct = normPct(marginPctRaw) / 100;
      if (qty > 0 && sales > 0) {
        const derivedRsp = sales / qty;
        const derivedCost = derivedRsp * (1 - marginPct);
        setCpuData({ invoice_cpu: derivedCost, rsp: derivedRsp });
      } else {
        setCpuData(null);
      }
    }
    if (store === "both") {
      const otherStore = product.store_number === "2064" ? "2056" : "2064";
      const cols = "name,lv_code,category,subcategory,store_number,yd_margin_pct,l7d_margin_pct,ytd_margin_pct,yd_qty,l7d_qty,ytd_qty,yd_sales,l7d_sales,ytd_sales,yd_margin,l7d_margin,ytd_margin";
      const { data: otherData } = await rds.query<ProductResult>(
        `SELECT ${cols} FROM top_sellers WHERE lv_code = $1 AND store_number = $2 LIMIT 1`,
        [product.lv_code, otherStore]
      );
      setOtherStoreProduct(otherData?.[0] ?? null);
    }
  };

  /* ── live comparison ── */
  const liveCalc = useMemo(() => {
    const theirPrice = parseFloat(competitorPrice);
    if (!selected || isNaN(theirPrice) || theirPrice <= 0) return null;
    const rsp = cpuData?.rsp ?? 0;
    const cost = cpuData?.invoice_cpu ?? 0;
    const theirMarginPct = cost > 0 && theirPrice > 0 ? ((theirPrice - cost) / theirPrice) * 100 : 0;
    const ourCurrentMarginPct = normPct(selected.l7d_margin_pct ?? selected.yd_margin_pct);
    const marginPctDiff = theirMarginPct - ourCurrentMarginPct;
    const marginImpactPerUnit = theirPrice - rsp;
    let recommendation: string;
    let recColor: string;
    let impactLabel: string;
    if (theirPrice > rsp) {
      recommendation = "We are cheaper";
      recColor = "#38bdf8";
      impactLabel = "Potential margin gain if you raise price to match";
    } else if (rsp - theirPrice < rsp * 0.03) {
      recommendation = "Price is competitive";
      recColor = C.green;
      impactLabel = "Price is within 3% — minimal impact";
    } else {
      recommendation = "Consider reviewing";
      recColor = C.red;
      impactLabel = "Margin lost if you lower price to match";
    }
    const ydQ = num(selected.yd_qty);
    const l7dQ = num(selected.l7d_qty) || ydQ;
    const ytdQ = num(selected.ytd_qty) || l7dQ;
    const priceDiffPerUnit = theirPrice - rsp;
    const periodImpacts = [
      { label: "Yesterday", qty: ydQ, impact: priceDiffPerUnit * ydQ },
      { label: "Last 7 Days", qty: l7dQ, impact: priceDiffPerUnit * l7dQ },
      { label: "YTD", qty: ytdQ, impact: priceDiffPerUnit * ytdQ },
    ];
    return { theirMarginPct, ourCurrentMarginPct, marginPctDiff, marginImpactPerUnit, recommendation, recColor, impactLabel, periodImpacts };
  }, [selected, competitorPrice, cpuData]);

  /* ── save to history ── */
  const saveCheck = async () => {
    if (!selected || !liveCalc || !competitorName.trim()) return;
    const theirPrice = parseFloat(competitorPrice);
    if (isNaN(theirPrice) || theirPrice <= 0) return;
    setUploading(true);
    const rsp = cpuData?.rsp ?? 0;
    const cost = cpuData?.invoice_cpu ?? 0;
    let photoKey: string | null = null;
    if (photoFileObj) {
      photoKey = await uploadPhotoToS3(photoFileObj, selected.store_number);
    }
    if (tableExists) {
      const row: Record<string, unknown> = {
        product_name: selected.name,
        lv_code: selected.lv_code,
        store_number: selected.store_number,
        competitor_name: competitorName.trim(),
        our_price: rsp,
        their_price: theirPrice,
        our_cost: cost,
        our_margin_pct: normPct(selected.l7d_margin_pct ?? selected.yd_margin_pct),
        their_margin_pct: liveCalc.theirMarginPct,
        margin_impact: liveCalc.marginImpactPerUnit,
        recommendation: liveCalc.recommendation,
        category: selected.category,
      };
      if (photoKey) row.photo_key = photoKey;
      const { error } = await rds.insert("price_checks", row);
      if (!error) { setSaved(true); loadHistory(); }
    }
    setUploading(false);
  };

  /* ── reset ── */
  const reset = () => {
    setQuery("");
    setSelected(null);
    setCpuData(null);
    setOtherStoreProduct(null);
    setCompetitorName("");
    setCompetitorPrice("");
    setPhotoFileObj(null);
    setSaved(false);
    setSearchResults([]);
  };

  const ourRsp = cpuData?.rsp ?? 0;
  const ourCost = cpuData?.invoice_cpu ?? 0;
  const currentMarginPct = normPct(selected?.l7d_margin_pct ?? selected?.yd_margin_pct);

  /* ── tab button style ── */
  const tabBtn = (tab: ActiveTab): React.CSSProperties => ({
    padding: "10px 20px",
    border: "none",
    borderBottom: activeTab === tab ? `2px solid ${themeColor}` : "2px solid transparent",
    background: activeTab === tab ? C.card : "transparent",
    color: activeTab === tab ? C.text : C.textDim,
    fontSize: "13px",
    fontWeight: activeTab === tab ? 600 : 400,
    cursor: "pointer",
    borderRadius: "6px 6px 0 0",
    transition: "all 0.15s",
  });

  /* ── section heading style ── */
  const sectionHeading: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: themeColor,
    marginBottom: "16px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  return (
    <>
      {/* Store toggle */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
        {(
          [
            { key: "2064" as const, label: STORE_LABELS["2064"] },
            { key: "2056" as const, label: STORE_LABELS["2056"] },
            { key: "both" as const, label: STORE_LABELS["both"] },
          ]
        ).map((s) => (
          <button key={s.key} onClick={() => { setStore(s.key); reset(); }} style={pillBtn(store === s.key, STORE_COLORS[s.key], themeColor)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "16px", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={() => setActiveTab("price-check")} style={tabBtn("price-check")}>Price Check</button>
        <button onClick={() => setActiveTab("ideas-photos")} style={tabBtn("ideas-photos")}>Ideas &amp; Photos</button>
      </div>

      {/* ═══════════════════════════ PRICE CHECK TAB ═══════════════════════════ */}
      {activeTab === "price-check" && (
        <>
          {/* ─── PRODUCT SEARCH ─── */}
          <div
            style={{
              background: C.card,
              borderRadius: "10px",
              padding: "24px",
              border: `1px solid ${C.border}`,
              borderTop: `2px solid ${themeColor}`,
              marginBottom: "16px",
              position: "relative",
            }}
          >
            <h3 style={sectionHeading}>Product Search</h3>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search by product name or LV code..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(null); setSaved(false); }}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                style={inputStyle}
              />
              {searching && (
                <div style={{ position: "absolute", right: "14px", top: "12px", fontSize: "12px", color: C.textDim }}>
                  Searching...
                </div>
              )}
              {showDropdown && searchResults.length > 0 && (
                <div
                  style={{
                    position: "absolute", top: "100%", left: 0, right: 0,
                    background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px",
                    marginTop: "4px", maxHeight: "300px", overflowY: "auto", zIndex: 100,
                  }}
                >
                  {searchResults.map((r, i) => (
                    <button
                      key={`${r.lv_code}-${i}`}
                      onClick={() => selectProduct(r)}
                      style={{
                        display: "block", width: "100%", padding: "10px 14px", border: "none",
                        borderBottom: i < searchResults.length - 1 ? `1px solid ${C.border}` : "none",
                        background: "transparent", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "13px",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{r.name}</span>
                      <span style={{ color: C.textDim, marginLeft: "8px", fontSize: "12px" }}>
                        {r.lv_code} · {r.category}
                        {store === "both" && (
                          <span style={{ color: themeColor, marginLeft: "6px", fontWeight: 600 }}>
                            {STORE_LABELS[r.store_number] ?? r.store_number}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected product details */}
            {selected && (
              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Product Name</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>
                      {selected.name}
                      {store === "both" && (
                        <span style={{ color: themeColor, fontSize: "12px", marginLeft: "8px", fontWeight: 500 }}>
                          {STORE_LABELS[selected.store_number] ?? selected.store_number}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Current Margin %</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: marginColor(currentMarginPct) }}>
                      {currentMarginPct.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Category</div>
                    <div style={{ fontSize: "14px", color: C.text }}>{selected.category}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Our Cost (Invoice CPU)</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                      {ourCost > 0 ? fmt(ourCost) : "—"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Our Selling Price (RSP)</div>
                    <div style={{ fontSize: "18px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                      {ourRsp > 0 ? fmt(ourRsp) : "—"}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>LV Code</div>
                      <div style={{ fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", color: C.textDim }}>
                        {selected.lv_code}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other store comparison (both mode) */}
                {store === "both" && otherStoreProduct && (() => {
                  const otherSales = num(otherStoreProduct.l7d_sales) || num(otherStoreProduct.yd_sales);
                  const otherQty = num(otherStoreProduct.l7d_qty) || num(otherStoreProduct.yd_qty);
                  const otherMarginPct = normPct(otherStoreProduct.l7d_margin_pct ?? otherStoreProduct.yd_margin_pct);
                  const otherRsp = otherQty > 0 ? otherSales / otherQty : 0;
                  return (
                    <div style={{ marginTop: "16px", padding: "16px", background: C.bg, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: themeColor, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                        {STORE_LABELS[otherStoreProduct.store_number] ?? otherStoreProduct.store_number} — Same Product
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        <div>
                          <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>RSP</div>
                          <div style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                            {otherRsp > 0 ? fmt(otherRsp) : "—"}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>Margin %</div>
                          <div style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: marginColor(otherMarginPct) }}>
                            {otherMarginPct.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>L7D Sales</div>
                          <div style={{ fontSize: "16px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: C.text }}>
                            {fmt(otherSales)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                {store === "both" && !otherStoreProduct && selected && (
                  <div style={{ marginTop: "12px", fontSize: "12px", color: C.textMuted, fontStyle: "italic" }}>
                    Not stocked in the other store
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── COMPETITOR PRICE SECTION ─── */}
          {selected && (
            <div style={{ background: C.card, borderRadius: "10px", padding: "24px", border: `1px solid ${C.border}`, marginBottom: "16px" }}>
              <h3 style={sectionHeading}>Competitor Price Check</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
                <div>
                  <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Competitor Store</div>
                  <input type="text" placeholder="e.g. Tesco, Dunnes..." value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Their Price &euro;</div>
                  <input type="number" step="0.01" placeholder="0.00" value={competitorPrice} onChange={(e) => { setCompetitorPrice(e.target.value); setSaved(false); }} style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Photo (optional)</div>
                  <label style={{ ...inputStyle, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: photoFileObj ? C.text : C.textDim }}>
                    <span>{photoFileObj ? photoFileObj.name : "Upload photo..."}</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; setPhotoFileObj(f ?? null); }} />
                  </label>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={saveCheck}
                    disabled={!competitorName.trim() || !liveCalc || saved || uploading}
                    style={{
                      padding: "10px 24px", borderRadius: "8px", border: "none",
                      background: saved ? C.green : themeColor, color: "#fff", fontSize: "14px", fontWeight: 600,
                      cursor: !competitorName.trim() || !liveCalc || saved || uploading ? "not-allowed" : "pointer",
                      opacity: !competitorName.trim() || !liveCalc || saved || uploading ? 0.6 : 1, whiteSpace: "nowrap",
                    }}
                  >
                    {uploading ? "Saving..." : saved ? "Saved" : "Save Check"}
                  </button>
                  <button onClick={reset} style={{ padding: "10px 16px", borderRadius: "8px", border: `1px solid ${C.green}`, background: "transparent", color: C.green, fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── CALCULATION RESULTS ─── */}
          {liveCalc && (
            <div style={{ background: C.card, borderRadius: "10px", padding: "24px", border: `1px solid ${C.border}`, borderTop: `3px solid ${liveCalc.recColor}`, marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ ...sectionHeading, marginBottom: 0 }}>Comparison Results</h3>
                <div style={{ padding: "6px 16px", borderRadius: "20px", background: `${liveCalc.recColor}22`, color: liveCalc.recColor, fontSize: "13px", fontWeight: 700 }}>
                  {liveCalc.recommendation}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {[
                  { label: "Their Margin % (at our cost)", value: `${liveCalc.theirMarginPct.toFixed(2)}%`, color: marginColor(liveCalc.theirMarginPct) },
                  { label: "Our Current Margin %", value: `${liveCalc.ourCurrentMarginPct.toFixed(2)}%`, color: marginColor(liveCalc.ourCurrentMarginPct) },
                  { label: "Margin % Difference", value: `${liveCalc.marginPctDiff > 0 ? "+" : ""}${liveCalc.marginPctDiff.toFixed(2)}%`, color: liveCalc.marginPctDiff > 0 ? C.green : liveCalc.marginPctDiff < 0 ? C.red : C.text },
                  { label: "€ Impact / Unit", value: `${liveCalc.marginImpactPerUnit > 0 ? "+" : ""}${fmt(liveCalc.marginImpactPerUnit)}`, color: liveCalc.marginImpactPerUnit > 0 ? C.green : liveCalc.marginImpactPerUnit < 0 ? C.red : C.text },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontSize: "22px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── PERIOD IMPACT TABLE ─── */}
          {liveCalc && liveCalc.periodImpacts.length > 0 && (
            <div style={{ background: C.card, borderRadius: "10px", padding: "24px", border: `1px solid ${C.border}`, marginBottom: "16px" }}>
              <h3 style={{ ...sectionHeading, marginBottom: "4px" }}>Period Impact — If We Matched Their Price</h3>
              <div style={{ fontSize: "12px", color: liveCalc.marginImpactPerUnit > 0 ? C.green : liveCalc.marginImpactPerUnit < 0 ? C.red : C.textDim, marginBottom: "16px" }}>
                {liveCalc.impactLabel}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr>
                      {["Period", "Units Sold", "€ Impact"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: h === "Period" ? "left" : "right", fontSize: "11px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `2px solid ${themeColor}` }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {liveCalc.periodImpacts.map((p) => (
                      <tr key={p.label}>
                        <td style={{ padding: "12px", fontWeight: 600, color: themeColor, borderBottom: `1px solid ${C.border}` }}>{p.label}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: C.text, borderBottom: `1px solid ${C.border}` }}>{p.qty.toLocaleString()}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: p.impact > 0 ? C.green : p.impact < 0 ? C.red : C.text, borderBottom: `1px solid ${C.border}` }}>
                          {p.impact > 0 ? "+" : ""}{fmt(p.impact)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── PRICE CHECK HISTORY ─── */}
          <div style={{ background: C.card, borderRadius: "10px", padding: "24px", border: `1px solid ${C.border}` }}>
            <h3 style={sectionHeading}>Price Check History</h3>
            {historyLoading ? (
              <div style={{ color: C.textDim, fontSize: "13px", padding: "40px 0", textAlign: "center" }}>Loading...</div>
            ) : !tableExists || history.length === 0 ? (
              <div style={{ color: C.textMuted, fontSize: "13px", padding: "40px 0", textAlign: "center" }}>No price checks yet</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr>
                      {["Date", "Product", "Our Price", "Competitor", "Their Price", "Margin Impact"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `2px solid ${themeColor}` }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row) => (
                      <tr key={row.id}>
                        <td style={{ padding: "10px 12px", color: C.textDim, borderBottom: `1px solid ${C.border}` }}>
                          {new Date(row.created_at).toLocaleDateString("en-IE")}
                        </td>
                        <td style={{ padding: "10px 12px", color: C.text, fontWeight: 500, borderBottom: `1px solid ${C.border}` }}>
                          {row.product_name}
                          {row.lv_code && <span style={{ color: C.textDim, fontSize: "11px", marginLeft: "6px" }}>{row.lv_code}</span>}
                        </td>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", color: C.text, borderBottom: `1px solid ${C.border}` }}>{fmt(row.our_price)}</td>
                        <td style={{ padding: "10px 12px", color: C.text, borderBottom: `1px solid ${C.border}` }}>{row.competitor_name}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", color: C.text, borderBottom: `1px solid ${C.border}` }}>{fmt(row.their_price)}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: num(row.margin_impact) < 0 ? C.red : C.green, borderBottom: `1px solid ${C.border}` }}>
                          {num(row.margin_impact) >= 0 ? "+" : ""}{fmt(row.margin_impact)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════ IDEAS & PHOTOS TAB ═══════════════════════════ */}
      {activeTab === "ideas-photos" && (
        <>
          {/* ─── Ideas Section ─── */}
          <div style={{ background: C.card, borderRadius: "10px", padding: "24px", border: `1px solid ${C.border}`, borderTop: `2px solid ${themeColor}`, marginBottom: "16px" }}>
            <h3 style={sectionHeading}>Ideas</h3>

            {/* Add idea form */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Category</div>
                <select value={ideaCategory} onChange={(e) => setIdeaCategory(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  {IDEA_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Description</div>
                <input type="text" placeholder="Describe your idea..." value={ideaDesc} onChange={(e) => setIdeaDesc(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitIdea()} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "end", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Store</div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {(["2064", "2056", "both"] as const).map((s) => (
                    <button key={s} onClick={() => setIdeaStore(s)} style={pillBtn(ideaStore === s, STORE_COLORS[s], themeColor)}>
                      {STORE_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Priority</div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {PRIORITY_OPTIONS.map((p) => (
                    <button key={p.value} onClick={() => setIdeaPriority(p.value)} style={pillBtn(ideaPriority === p.value, p.color)}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={submitIdea}
                disabled={!ideaDesc.trim() || ideaSaving}
                style={{
                  padding: "8px 20px", borderRadius: "8px", border: "none", background: themeColor,
                  color: "#fff", fontSize: "13px", fontWeight: 600,
                  cursor: !ideaDesc.trim() || ideaSaving ? "not-allowed" : "pointer",
                  opacity: !ideaDesc.trim() || ideaSaving ? 0.6 : 1, whiteSpace: "nowrap",
                }}
              >
                {ideaSaving ? "Saving..." : "Add Idea"}
              </button>
            </div>

            {/* Ideas list */}
            {ideasLoading ? (
              <div style={{ color: C.textDim, fontSize: "13px", padding: "30px 0", textAlign: "center" }}>Loading...</div>
            ) : ideas.length === 0 ? (
              <div style={{ color: C.textMuted, fontSize: "13px", padding: "30px 0", textAlign: "center" }}>No ideas yet — add one above</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {ideas.map((idea) => {
                  const pColor = PRIORITY_OPTIONS.find((p) => p.value === idea.priority)?.color ?? C.textDim;
                  return (
                    <div key={idea.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: C.bg, borderRadius: "8px", border: `1px solid ${C.border}`, borderLeft: `3px solid ${pColor}` }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: pColor, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", color: C.text, fontWeight: 500 }}>{idea.description}</div>
                        <div style={{ fontSize: "11px", color: C.textDim, marginTop: "4px" }}>
                          {idea.category} · {STORE_LABELS[idea.store_number] ?? idea.store_number} · {new Date(idea.created_at).toLocaleDateString("en-IE")}
                        </div>
                      </div>
                      <div style={{ padding: "3px 8px", borderRadius: "4px", background: `${pColor}22`, color: pColor, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", flexShrink: 0 }}>
                        {idea.priority}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── Add Photo Section ─── */}
          <div style={{ background: C.card, borderRadius: "10px", padding: "24px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Store</div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {(["2064", "2056"] as const).map((s) => (
                    <button key={s} onClick={() => setPhotoStore(s)} style={pillBtn(photoStore === s, STORE_COLORS[s], themeColor)}>
                      {STORE_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Category</div>
                <select value={photoCat} onChange={(e) => setPhotoCat(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  {IDEA_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Title / Description</div>
                <input type="text" placeholder="Photo title..." value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Link to Product (optional)</div>
                {photoLinkedProduct ? (
                  <div style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: C.text, fontSize: "13px" }}>
                      {photoLinkedProduct.name} <span style={{ color: C.textDim, fontSize: "11px" }}>{photoLinkedProduct.lv_code}</span>
                    </span>
                    <button onClick={() => { setPhotoLinkedProduct(null); setPhotoProductQuery(""); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "14px" }}>&#10005;</button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Search product..."
                      value={photoProductQuery}
                      onChange={(e) => { setPhotoProductQuery(e.target.value); setPhotoLinkedProduct(null); }}
                      onFocus={() => photoProductResults.length > 0 && setPhotoShowDropdown(true)}
                      style={inputStyle}
                    />
                    {photoProductSearching && (
                      <div style={{ position: "absolute", right: "14px", top: "32px", fontSize: "12px", color: C.textDim }}>Searching...</div>
                    )}
                    {photoShowDropdown && photoProductResults.length > 0 && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: "8px", marginTop: "4px", maxHeight: "200px", overflowY: "auto", zIndex: 100 }}>
                        {photoProductResults.map((r, i) => (
                          <button
                            key={`${r.lv_code}-${i}`}
                            onClick={() => { setPhotoLinkedProduct({ name: r.name, lv_code: r.lv_code }); setPhotoShowDropdown(false); setPhotoProductQuery(r.name); }}
                            style={{ display: "block", width: "100%", padding: "8px 14px", border: "none", borderBottom: i < photoProductResults.length - 1 ? `1px solid ${C.border}` : "none", background: "transparent", cursor: "pointer", textAlign: "left", color: C.text, fontSize: "12px" }}
                          >
                            <span style={{ fontWeight: 600 }}>{r.name}</span>
                            <span style={{ color: C.textDim, marginLeft: "6px", fontSize: "11px" }}>{r.lv_code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "end", marginBottom: "24px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>Photo File</div>
                <label style={{ ...inputStyle, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: photoUploadFile ? C.text : C.textDim }}>
                  <span>{photoUploadFile ? photoUploadFile.name : "Choose photo..."}</span>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; setPhotoUploadFile(f ?? null); }} />
                </label>
              </div>
              <button
                onClick={handlePhotoUpload}
                disabled={!photoUploadFile || !photoTitle.trim() || photoUploading}
                style={{
                  padding: "10px 24px", borderRadius: "8px", border: "none", background: themeColor,
                  color: "#fff", fontSize: "14px", fontWeight: 600,
                  cursor: !photoUploadFile || !photoTitle.trim() || photoUploading ? "not-allowed" : "pointer",
                  opacity: !photoUploadFile || !photoTitle.trim() || photoUploading ? 0.6 : 1, whiteSpace: "nowrap",
                }}
              >
                {photoUploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>

            {/* Photo gallery */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "20px" }}>
              <h4 style={{ fontSize: "12px", fontWeight: 600, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
                Gallery — {STORE_LABELS[photoStore]}
              </h4>
              {photosLoading ? (
                <div style={{ color: C.textDim, fontSize: "13px", padding: "40px 0", textAlign: "center" }}>Loading photos...</div>
              ) : photos.length === 0 ? (
                <div style={{ color: C.textMuted, fontSize: "13px", padding: "40px 0", textAlign: "center" }}>No photos uploaded yet</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
                  {photos.map((photo) => (
                    <div key={photo.id} style={{ background: C.bg, borderRadius: "8px", border: `1px solid ${C.border}`, overflow: "hidden" }}>
                      {photo.url ? (
                        <div style={{ width: "100%", height: "160px", background: C.card, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          <img
                            src={photo.url}
                            alt={photo.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                      ) : (
                        <div style={{ width: "100%", height: "160px", background: C.card, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: C.textMuted, fontSize: "12px" }}>No preview</span>
                        </div>
                      )}
                      <div style={{ padding: "12px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: C.text, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {photo.title}
                        </div>
                        <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "6px" }}>
                          {photo.category}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{
                            padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: 600,
                            background: `${STORE_COLORS[photo.store_number] ?? themeColor}22`,
                            color: STORE_COLORS[photo.store_number] ?? themeColor,
                          }}>
                            {STORE_LABELS[photo.store_number] ?? photo.store_number}
                          </span>
                          <span style={{ fontSize: "10px", color: C.textMuted }}>
                            {new Date(photo.created_at).toLocaleDateString("en-IE")}
                          </span>
                        </div>
                        {photo.product_name && (
                          <div style={{ fontSize: "11px", color: C.textDim, marginTop: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {photo.product_name} <span style={{ color: C.textMuted }}>{photo.lv_code}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
