"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { studioConfig } from "@/config/studio.config";
import type { ProjectTypology } from "@/types/project";

type FormState = {
  client_name: string; email: string; project_typology: ProjectTypology | "";
  estimated_area_sqm: string; location: string; message: string; budget_tier: string | null; budget_choice: string;
  acknowledgement: boolean; website: string; turnstileToken: string;
};
const empty: FormState = { client_name: "", email: "", project_typology: "", estimated_area_sqm: "", location: "", message: "", budget_tier: null, budget_choice: "", acknowledgement: false, website: "", turnstileToken: "" };
const typologies: { value: ProjectTypology; note: string }[] = [
  { value: "Residential", note: "A place to live" }, { value: "Commercial", note: "Work / exchange" },
  { value: "Cultural", note: "Public / collective" }, { value: "Interior", note: "An existing space" }, { value: "Urban", note: "A wider setting" },
];
const stepNames = ["Project type", "Scope", "Budget", "Your details", "Review"];

declare global { interface Window { turnstile?: { render: (el: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string; remove: (id: string) => void } } }

function TurnstileField({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const render = () => {
    if (!box.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(box.current, { sitekey: siteKey, callback: onToken, "expired-callback": () => onToken(""), "error-callback": () => onToken("") });
  };
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={render} /><div ref={box} className="turnstile-box" /></>;
}

export function InquiryConfigurator({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const [data, setData] = useState<FormState>(empty);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receipt, setReceipt] = useState<FormState | null>(null);
  const submitLock = useRef(false);
  const openedAt = useRef<number | null>(null);
  useEffect(() => { openedAt.current = Date.now(); }, []);
  const change = <K extends keyof FormState>(key: K, value: FormState[K]) => setData((current) => ({ ...current, [key]: value }));

  const validate = (index: number) => {
    if (index === 0 && !data.project_typology) return "Choose the project type that feels closest.";
    if (index === 1) {
      if (data.estimated_area_sqm && (!/^\d+(?:\.\d{1,2})?$/.test(data.estimated_area_sqm) || Number(data.estimated_area_sqm) <= 0 || Number(data.estimated_area_sqm) > 1_000_000_000)) return "Enter a positive area in square metres, or leave it blank.";
      if (data.location.trim().length > 180) return "Keep the location under 180 characters.";
      if (data.message.trim().length < 10) return "Tell us a little about the project (at least 10 characters).";
      if (data.message.length > 10000) return "Keep the project description under 10,000 characters.";
    }
    if (index === 3) {
      if (data.client_name.trim().length < 2 || data.client_name.trim().length > 160) return "Enter your name (2–160 characters).";
      if (data.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) return "Enter a valid email address.";
    }
    if (index === 4 && !data.acknowledgement) return "Please confirm the project details are accurate before submitting.";
    return "";
  };
  const forward = () => { const issue = validate(step); setError(issue); if (!issue && step < 4) setStep((value) => value + 1); };
  const submit = async () => {
    const issue = validate(4); if (issue) { setError(issue); return; }
    if (submitLock.current) return;
    submitLock.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
        client_name: data.client_name, email: data.email, project_typology: data.project_typology,
        estimated_area_sqm: data.estimated_area_sqm || null, budget_tier: data.budget_tier,
        location: data.location.trim() || null, message: data.message.trim(), acknowledgement: data.acknowledgement,
        website: data.website, turnstileToken: data.turnstileToken, elapsedMs: openedAt.current === null ? 0 : Date.now() - openedAt.current,
      }) });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn’t send your inquiry. Please try again.");
      setReceipt(data); setSuccess(true); setData(empty);
    } catch (err) {
      setError(err instanceof Error ? err.message : "A network interruption prevented submission. Your details are still here; please try again.");
    } finally { submitLock.current = false; setBusy(false); }
  };

  if (success && receipt) return <section className="inquiry-success" aria-live="polite"><span className="success-mark"><Check size={22} /></span><p className="mono">INQUIRY RECEIVED</p><h2>Thank you.<br /><em>A conversation begins.</em></h2><p>Your project brief has been submitted successfully. The summary below is a copy of what you sent.</p><dl className="review-list"><div><dt>PROJECT</dt><dd>{receipt.project_typology || "Project inquiry"} · {receipt.location || "Location not specified"}{receipt.estimated_area_sqm ? ` · ${receipt.estimated_area_sqm} m²` : ""}</dd></div><div><dt>PROJECT NOTE</dt><dd>{receipt.message}</dd></div><div><dt>CONTACT</dt><dd>{receipt.client_name} · {receipt.email}</dd></div></dl><Link href="/#home">Return to Reel Archer <ArrowUpRight size={15} /></Link></section>;

  return <section className="inquiry-shell" aria-labelledby="contact-title">
    <div className="inquiry-sidebar"><p className="mono">PROJECT BRIEF / 01—05</p><h1 id="contact-title">Begin with<br /><em>a question.</em></h1><p>Share what you are considering. The details can be refined as the conversation develops.</p><span className="mono inquiry-note">NO FEE OR BUDGET ASSUMPTIONS</span></div>
    <div className="inquiry-main">
      <div className="inquiry-progress" aria-label={`Step ${step + 1} of ${stepNames.length}`}><div className="inquiry-progress-top"><span className="mono">STEP {String(step + 1).padStart(2, "0")} / 05</span><span className="mono">{stepNames[step].toUpperCase()}</span></div><div className="progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step + 1}><i style={{ width: `${((step + 1) / stepNames.length) * 100}%` }} /></div><div className="step-ticks" aria-hidden="true">{stepNames.map((label, index) => <span key={label} className={index <= step ? "is-complete" : ""}>{String(index + 1).padStart(2, "0")}</span>)}</div></div>
      <div className="inquiry-step" key={step} aria-live="polite">
        {step === 0 && <><p className="mono step-kicker">01 / PROJECT TYPE</p><h2>What are you imagining?</h2><p className="step-help">Choose the closest typology to begin.</p><div className="typology-options">{typologies.map((item, index) => <button type="button" key={item.value} className={`typology-option${data.project_typology === item.value ? " is-selected" : ""}`} aria-pressed={data.project_typology === item.value} onClick={() => { change("project_typology", item.value); setError(""); }}><span className="mono">0{index + 1}</span><strong>{item.value}</strong><small>{item.note}</small><i aria-hidden="true">{data.project_typology === item.value ? "SELECTED" : "SELECT"}</i></button>)}</div></>}
        {step === 1 && <><p className="mono step-kicker">02 / PROJECT SCOPE</p><h2>Set the scene.</h2><p className="step-help">An early outline is enough. You can leave area unknown.</p><label className="field-label">Project location <input value={data.location} maxLength={180} onChange={(event) => change("location", event.target.value)} autoComplete="address-level2" placeholder="City, region or site" /></label><label className="field-label">Estimated area <span className="field-unit">m² / OPTIONAL</span><input type="number" min="0.01" max="1000000000" step="0.01" value={data.estimated_area_sqm} onChange={(event) => change("estimated_area_sqm", event.target.value)} placeholder="Not yet known" /></label><label className="field-label">A few words about the project<textarea value={data.message} minLength={10} maxLength={10000} rows={4} onChange={(event) => change("message", event.target.value)} placeholder="What would you like to explore or change?" /></label></>}
        {step === 2 && <><p className="mono step-kicker">03 / PROJECT BUDGET</p><h2>Budget can be a conversation.</h2><p className="step-help">No currency or fee assumptions are made here. Sharing an early budget is optional.</p>{studioConfig.inquiry.budgetOptions.map((option) => <label key={option.id} className={`budget-option${data.budget_choice === option.id ? " is-selected" : ""}`}><input type="radio" name="budget" checked={data.budget_choice === option.id} onChange={() => { change("budget_tier", option.value); change("budget_choice", option.id); }} /><span><strong>{option.label}</strong><small>This choice is recorded as no budget tier in the inquiry record.</small></span></label>)}<button type="button" className="text-action" onClick={() => { change("budget_tier", null); change("budget_choice", ""); }}>Leave this unanswered</button></>}
        {step === 3 && <><p className="mono step-kicker">04 / YOUR DETAILS</p><h2>Where can we reach you?</h2><p className="step-help">Only your name and email are needed to receive this inquiry.</p><label className="field-label">Name <input required minLength={2} maxLength={160} autoComplete="name" value={data.client_name} onChange={(event) => change("client_name", event.target.value)} placeholder="Your name" /></label><label className="field-label">Email address <input required type="email" maxLength={254} autoComplete="email" value={data.email} onChange={(event) => change("email", event.target.value)} placeholder="you@example.com" /></label></>}
        {step === 4 && <><p className="mono step-kicker">05 / REVIEW & SEND</p><h2>Check the brief.</h2><p className="step-help">You can return to any step to make a change.</p><dl className="review-list">{[
          ["PROJECT TYPE", data.project_typology || "—", 0], ["AREA", data.estimated_area_sqm ? `${data.estimated_area_sqm} m²` : "Not specified", 1], ["LOCATION", data.location || "Not specified", 1], ["PROJECT NOTE", data.message || "—", 1], ["BUDGET", data.budget_choice ? studioConfig.inquiry.budgetOptions.find((option) => option.id === data.budget_choice)?.label || "Not specified" : "Not specified", 2], ["NAME", data.client_name || "—", 3], ["EMAIL", data.email || "—", 3],
        ].map(([label, value, edit]) => <div key={String(label)}><dt>{label}</dt><dd>{value}</dd><button type="button" onClick={() => { setStep(Number(edit)); setError(""); }}>EDIT</button></div>)}</dl><label className="acknowledgement"><input type="checkbox" checked={data.acknowledgement} onChange={(event) => change("acknowledgement", event.target.checked)} /><span>{studioConfig.inquiry.acknowledgement}</span></label>
          <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={data.website} onChange={(event) => change("website", event.target.value)} /></label></div>
          {turnstileSiteKey && <div className="turnstile-wrap"><p className="mono">SUBMISSION CHECK</p><TurnstileField siteKey={turnstileSiteKey} onToken={(token) => change("turnstileToken", token)} /></div>}
        </>}
      </div>
      {error && <p className="inquiry-error" role="alert">{error}</p>}
      <div className="inquiry-actions">{step > 0 ? <button type="button" className="inquiry-back" disabled={busy} onClick={() => { setStep((value) => value - 1); setError(""); }}><ArrowLeft size={15} /> BACK</button> : <span />}{step < 4 ? <button type="button" className="inquiry-next" onClick={forward}>CONTINUE <ArrowRight size={15} /></button> : <button type="button" className="inquiry-next" disabled={busy} onClick={submit}>{busy ? "SENDING…" : "SEND PROJECT BRIEF"} <ArrowRight size={15} /></button>}</div>
      {busy && <p className="mono submission-status" role="status" aria-live="polite">SENDING YOUR PROJECT BRIEF…</p>}
    </div>
  </section>;
}
