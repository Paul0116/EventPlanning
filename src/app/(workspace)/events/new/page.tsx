import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CreateEventForm } from "@/features/events/components/create-event-form";

export const metadata = { title: "Create event" };

export default function NewEventPage() {
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <Link href="/events" className="text-sm font-semibold text-teal-800 hover:underline">
          ← All events
        </Link>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Create an event</h1>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          New events begin as private drafts. Gatherly creates the event and its default budget categories
          in one transaction.
        </p>
      </div>
      <Card className="p-5 sm:p-8">
        <CreateEventForm />
      </Card>
    </div>
  );
}
