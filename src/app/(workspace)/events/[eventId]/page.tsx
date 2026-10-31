import Link from "next/link";
import { notFound as nextNotFound } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getEventForUser } from "@/features/events/service";
import { requireAuthenticatedUser } from "@/lib/auth";
import { AppError } from "@/lib/errors";

function formatDateTime(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: timezone,
  }).format(date);
}

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const user = await requireAuthenticatedUser();
  const { eventId } = await params;
  let event: Awaited<ReturnType<typeof getEventForUser>>;

  try {
    event = await getEventForUser(user.id, eventId);
  } catch (error) {
    if (error instanceof AppError && error.code === "NOT_FOUND") {
      nextNotFound();
    }
    throw error;
  }

  return (
    <div className="grid gap-7">
      <div>
        <Link href="/events" className="text-sm font-semibold text-teal-800 hover:underline">
          ← All events
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>{event.status}</Badge>
          <Badge className="bg-teal-50 text-teal-800">{event.role}</Badge>
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{event.title}</h1>
        <p className="mt-2 text-slate-600">
          {formatDateTime(event.startsAt, event.timezone)} · {event.timezone} · {event.currency}
        </p>
        {event.venueText ? <p className="mt-1 text-slate-600">{event.venueText}</p> : null}
      </div>

      <nav aria-label="Event sections" className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2">
        <ul className="flex min-w-max gap-1">
          <li>
            <span aria-current="page" className="inline-flex min-h-11 items-center rounded-xl bg-teal-50 px-4 font-semibold text-teal-900">
              Overview
            </span>
          </li>
          {["Tasks", "Budget", "Guests", "Schedule", "Settings"].map((item) => (
            <li key={item}>
              <span className="inline-flex min-h-11 items-center px-4 text-sm font-medium text-slate-400" title="Available in a later implementation phase">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {event.status === "DRAFT" ? (
        <Alert>
          <p className="font-semibold">This event is a private draft.</p>
          <p>Planning data can be prepared, but invitations and guest responses remain unavailable until the owner starts planning.</p>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm font-semibold text-slate-500">Event window</p>
          <p className="mt-3 font-bold text-slate-950">{formatDateTime(event.startsAt, event.timezone)}</p>
          <p className="mt-1 text-sm text-slate-600">to {formatDateTime(event.endsAt, event.timezone)}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Budget target</p>
          <p className="mt-3 text-2xl font-black text-slate-950">
            {event.budgetLimit ? `${event.currency} ${event.budgetLimit.toFixed(2)}` : "Not set"}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">Capacity</p>
          <p className="mt-3 text-2xl font-black text-slate-950">{event.capacity ?? "Not limited"}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-slate-500">RSVP deadline</p>
          <p className="mt-3 font-bold text-slate-950">
            {event.rsvpDeadline ? formatDateTime(event.rsvpDeadline, event.timezone) : "Not set"}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Default budget categories</h2>
            <p className="mt-1 text-sm text-slate-600">Created atomically with this event.</p>
          </div>
          <Badge>{event.budgetCategories.length} categories</Badge>
        </div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {event.budgetCategories.map((category) => (
            <li key={category.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
              {category.name}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
