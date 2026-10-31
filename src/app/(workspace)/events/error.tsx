"use client";

import { Button } from "@/components/ui/button";

export default function EventsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto grid min-h-72 max-w-xl place-items-center rounded-2xl border border-red-200 bg-white p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">We could not load this workspace</h1>
        <p className="mt-3 text-slate-600">Try again. If the problem continues, use the request details in the server logs without sharing private event data.</p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </div>
  );
}
