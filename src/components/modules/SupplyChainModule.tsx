import React, { useEffect, useState } from 'react';
import { useHive } from '../../context/HiveContext';
import { apiService } from '../../services/api';
import type { SupplyChainEvent } from '../../types';

export const SupplyChainModule: React.FC = () => {
  const { batches, selectedBatchId, showToast, refreshData } = useHive();
  const batch = batches.find(b => b.batchId === selectedBatchId) || batches[0];
  const id = batch?.id;
  const [events, setEvents] = useState<SupplyChainEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setEvents([]); setError(''); setLoading(Boolean(id));
    if (id) apiService.getBatchTimeline(id).then(data => {
      if (active) setEvents([...data].sort((a,b) => Date.parse(a.timestamp)-Date.parse(b.timestamp)));
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'Unable to load timeline'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, revision]);
  const latest = events[events.length - 1];
  const sender = latest?.toParticipant || batch?.beekeeperName || '';
  const qty = Number(quantity);
  const canTransfer = Boolean(batch && sender && recipient.trim() && recipient.trim() !== sender && location.trim() && Number.isFinite(qty) && qty > 0 && qty <= batch.remainingKg && !loading && !error && !busy);
  async function transfer(e: React.FormEvent) {
    e.preventDefault();
    if (!batch || !canTransfer) return;
    setBusy(true);
    try {
      await apiService.transferBatch(batch.id, { fromParticipant: sender, toParticipant: recipient.trim(), location: location.trim(), quantityKg: qty });
      setRecipient(''); setLocation(''); setQuantity('');
      setRevision(v => v + 1);
      showToast('Transfer recorded', 'success');
      await refreshData();
    } catch (e) { showToast(e instanceof Error ? e.message : 'Unable to record transfer', 'warning'); }
    finally { setBusy(false); }
  }
  const input = 'w-full rounded-lg border border-stone-600 bg-stone-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500';
  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 text-stone-100">
      <header>
        <h1 className="text-2xl font-semibold">Living Chain</h1>
        <p className="mt-1 text-sm text-stone-400">Track honey batches and custody handovers.</p>
      </header>
      {!batch ? <p>No honey batches available.</p> : <>
        <div className="grid gap-4 rounded-xl border border-stone-700 bg-stone-900 p-5 sm:grid-cols-3">
          <div><p className="text-sm text-stone-400">Batch</p><p className="font-semibold">{batch.batchId}</p></div>
          <div><p className="text-sm text-stone-400">Status</p><p>{batch.status.replace(/_/g, ' ')}</p></div>
          <div><p className="text-sm text-stone-400">Remaining quantity</p><p>{batch.remainingKg} kg</p></div>
        </div>
        <p className="text-sm text-stone-400">Prototype records from the application API. Recorded hashes and status flags are not independent blockchain verification.</p>
        <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-xl border border-stone-700 bg-stone-900 p-5">
            <h2 className="mb-4 text-lg font-semibold">Custody history</h2>
            {loading ? <p role="status">Loading records…</p> : error ? <div role="alert"><p>{error}</p><button className="mt-2 underline" onClick={() => setRevision(v => v + 1)}>Retry</button></div> : !events.length ? <p className="text-stone-400">No custody events recorded yet.</p> :
              <ol className="ml-2 border-l border-stone-600">
                {events.map(event => <li key={event.id} className="relative pb-6 pl-5 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-amber-500" />
                  <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-medium">{event.stage}</h3><span className="rounded border border-stone-600 px-2 py-1 text-xs">{event.status}</span></div>
                  <p className="mt-1 text-sm">{event.fromParticipant} → {event.toParticipant}</p>
                  <p className="text-sm text-stone-400">{event.location} · {event.quantityKg} kg</p>
                  <time className="text-xs text-stone-400" dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString()}</time>
                  {event.notes && <p className="mt-2 text-sm text-stone-300">{event.notes}</p>}
                  {event.txHash && <details className="mt-2 text-xs text-stone-400"><summary className="cursor-pointer">Recorded transaction reference</summary><p className="mt-1 break-all">{event.txHash}</p></details>}
                </li>)}
              </ol>}
          </div>
          <form onSubmit={transfer} className="space-y-4 rounded-xl border border-stone-700 bg-stone-900 p-5">
            <h2 className="text-lg font-semibold">Record handover</h2>
            <p className="text-sm text-stone-400">Sender: {loading ? 'Loading…' : sender || 'Unknown'}</p>
            <label className="block space-y-1 text-sm"><span>Recipient</span><input required className={input} value={recipient} onChange={e => setRecipient(e.target.value)} /></label>
            <label className="block space-y-1 text-sm"><span>Location</span><input required className={input} value={location} onChange={e => setLocation(e.target.value)} /></label>
            <label className="block space-y-1 text-sm"><span>Quantity (kg)</span><input required type="number" min="0.01" step="0.01" max={batch.remainingKg} className={input} value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
            <button disabled={!canTransfer} className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 disabled:opacity-40">{busy ? 'Recording…' : 'Record transfer'}</button>
          </form>
        </div>
      </>}
    </section>
  );
};
