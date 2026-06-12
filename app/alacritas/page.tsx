"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import "./alacritas.css";

type FoodItem = {
  name?: string;
  portion?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
};

type AnalyzeResult = {
  isFood?: boolean;
  mealName?: string;
  items?: FoodItem[];
  totalCalories?: number;
  confidence?: "low" | "medium" | "high" | string;
  notes?: string;
};

const EXAMPLES = [
  "One glazed donut and an iced coffee with milk",
  "Brownie slice, small portion",
  "Two donuts and a sweet iced coffee",
];

function roundNumber(value: unknown) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
}

export default function AlacritasPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [mealText, setMealText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const canAnalyze = Boolean(imageData || mealText.trim());


  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
    setCameraLoading(false);
  }

  async function startCamera() {
    if (loading || cameraLoading) return;

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not available in this browser. Use the upload/take-photo button instead.");
      return;
    }

    setCameraLoading(true);
    setError(null);
    setResult(null);

    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);

      setTimeout(async () => {
        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch {
          // Some browsers wait for the user to interact again.
        }
      }, 0);
    } catch (err) {
      setCameraOpen(false);
      setError(
        err instanceof Error
          ? `Camera could not be opened: ${err.message}`
          : "Camera could not be opened. Check browser permission or use upload instead."
      );
    } finally {
      setCameraLoading(false);
    }
  }

  function capturePhoto() {
    const video = videoRef.current;

    if (!video) {
      setError("Camera is not ready yet. Try again in a second.");
      return;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setError("Could not capture the camera image. Use upload instead.");
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreview(dataUrl);
    setImageData(dataUrl.split(",")[1] || null);
    setMediaType("image/jpeg");
    setError(null);
    setResult(null);
    stopCamera();
  }

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function handleFile(file?: File) {
    if (!file) return;

    stopCamera();

    if (!file.type.startsWith("image/")) {
      setError("Please upload a food photo or image file.");
      return;
    }

    setError(null);
    setResult(null);
    setMediaType(file.type || "image/jpeg");

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setPreview(dataUrl);
      setImageData(dataUrl.split(",")[1] || null);
    };
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!canAnalyze || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageData,
          mediaType,
          mealText: mealText.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      if (data.isFood === false) {
        setError("No food detected. Try a clearer photo or describe the meal in the notes box.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    stopCamera();
    setPreview(null);
    setImageData(null);
    setMediaType(null);
    setMealText("");
    setResult(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const items = Array.isArray(result?.items) ? result.items : [];

  const totals = useMemo(() => {
    if (!items.length) return null;

    return items.reduce(
      (acc, item) => ({
        protein: acc.protein + Number(item.protein_g || 0),
        carbs: acc.carbs + Number(item.carbs_g || 0),
        fat: acc.fat + Number(item.fat_g || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  }, [items]);

  return (
    <>
      <ScrollProgress />
      <Nav activeLink="alacritas" />

      <main className="alacritas-page">
      <div className="alacritas-backbar">
        <Link href="/" className="alacritas-back">← Back to Nueva</Link>
        <span>AI Lab · Café Division</span>
      </div>

      <section className="alacritas-hero" aria-label="Alacritas introduction">
        <div className="alacritas-fig">Nueva · FIG.09 · Food Tech</div>
        <div className="alacritas-hero-grid">
          <div>
            <p className="alacritas-eyebrow">Photo calorie estimator</p>
            <h1>Alacritas</h1>
            <p className="alacritas-copy">
              Snap a meal, add a quick note, and get a clean calorie and macro estimate for the food in front of you.
            </p>
            <div className="alacritas-pills" aria-label="Alacritas features">
              <span>Photo + notes</span>
              <span>Café-aware</span>
              <span>Fast estimates</span>
            </div>
          </div>

          <div className="alacritas-responsible" aria-label="Responsible estimate note">
            <div className="alacritas-card-title">Estimate, not diagnosis</div>
            <p>
              Alacritas is for food awareness at the business fair. Portions from photos are approximate, so results should not be treated as medical advice.
            </p>
          </div>
        </div>
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <section className="alacritas-workbench" aria-label="Meal analysis workbench">
        <div
          className={`alacritas-dropzone ${preview ? "has-preview" : ""} ${cameraOpen ? "is-camera-open" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            if (!cameraOpen) fileInputRef.current?.click();
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !cameraOpen) {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          {cameraOpen ? (
            <div className="alacritas-camera-live" onClick={(e) => e.stopPropagation()}>
              <video
                ref={videoRef}
                className="alacritas-video"
                autoPlay
                playsInline
                muted
              />
              <div className="alacritas-camera-controls">
                <button type="button" className="alacritas-primary mini" onClick={capturePhoto}>
                  Capture plate
                </button>
                <button type="button" className="alacritas-ghost mini" onClick={stopCamera}>
                  Close camera
                </button>
              </div>
            </div>
          ) : preview ? (
            <img src={preview} alt="Selected meal" className="alacritas-preview" />
          ) : (
            <div className="alacritas-dropzone-copy">
              <div className="alacritas-camera">◎</div>
              <h2>Photograph your plate</h2>
              <p>Open the live camera, take a mobile photo, upload an image, or drag one here.</p>
              <div className="alacritas-camera-choice">
                <button
                  type="button"
                  className="alacritas-primary mini"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  disabled={cameraLoading}
                >
                  {cameraLoading ? "Opening…" : "Open camera"}
                </button>
                <button
                  type="button"
                  className="alacritas-ghost mini"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Upload / mobile camera
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="alacritas-panel">
          <label className="alacritas-label" htmlFor="meal-notes">
            Optional meal notes
          </label>
          <textarea
            id="meal-notes"
            value={mealText}
            onChange={(e) => {
              setMealText(e.target.value);
              setError(null);
            }}
            placeholder="e.g. iced coffee with milk and sugar, small brownie, one glazed donut..."
            rows={6}
          />

          <div className="alacritas-examples" aria-label="Example prompts">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                className="alacritas-chip"
                onClick={() => setMealText(example)}
              >
                {example}
              </button>
            ))}
          </div>

          <div className="alacritas-actions">
            <button type="button" className="alacritas-ghost" onClick={reset} disabled={loading}>
              Reset
            </button>
            <button type="button" className="alacritas-primary" onClick={analyze} disabled={!canAnalyze || loading}>
              {loading && <span className="alacritas-spinner" aria-hidden="true" />}
              {loading ? "Estimating…" : "Estimate meal"}
            </button>
          </div>
        </div>
      </section>

      {error && <div className="alacritas-error" role="alert">{error}</div>}

      {result && (
        <section className="alacritas-receipt" aria-label="Nutrition estimate">
          <div className="alacritas-receipt-head">
            <div>
              <div className="alacritas-kicker">Alacritas receipt</div>
              <div className="alacritas-meal-name">{result.mealName || "Meal estimate"}</div>
            </div>
            <div className="alacritas-confidence">{result.confidence || "low"} confidence</div>
          </div>

          {items.map((item, i) => (
            <div className="alacritas-line-item" key={`${item.name || "item"}-${i}`}>
              <div>
                <div className="alacritas-food">{item.name || "Food item"}</div>
                <div className="alacritas-portion">{item.portion || "estimated portion"}</div>
              </div>
              <div className="alacritas-kcal">{roundNumber(item.calories)} kcal</div>
            </div>
          ))}

          <div className="alacritas-total-row">
            <div className="alacritas-total-label">Estimated total</div>
            <div className="alacritas-total-value">
              {roundNumber(result.totalCalories)} <em>kcal</em>
            </div>
          </div>

          {totals && (
            <div className="alacritas-macros">
              <div className="alacritas-macro">
                <div className="alacritas-num">{roundNumber(totals.protein)}g</div>
                <div className="alacritas-lbl">protein</div>
              </div>
              <div className="alacritas-macro">
                <div className="alacritas-num">{roundNumber(totals.carbs)}g</div>
                <div className="alacritas-lbl">carbs</div>
              </div>
              <div className="alacritas-macro">
                <div className="alacritas-num">{roundNumber(totals.fat)}g</div>
                <div className="alacritas-lbl">fat</div>
              </div>
            </div>
          )}

          {result.notes && <p className="alacritas-notes">{result.notes}</p>}
        </section>
      )}
      </main>

      <Footer subtitle="Alacritas · Café food-tech prototype" />
    </>
  );
}
