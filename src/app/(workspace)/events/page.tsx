import Link from "next/link";
import { openEventAction } from "@/features/events/actions";
import { listAccessibleEvents } from "@/features/events/service";
import { requireAuthenticatedUser } from "@/lib/auth";
import { parsePagination } from "@/lib/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Events" };

function eventDate(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(date);
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string; limit?: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const query = await searchParams;
  const pagination = parsePagination(query);
  const result = await listAccessibleEvents(user.id, pagination);

  return (
    <div className="grid gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Your workspace</p>
          <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-950">Events</h1>
          <p className="mt-2 text-slate-600">Owned and shared events, protected by event-level access checks.</p>
        </div>
        <Link
          href="/events/new"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Create event
        </Link>
      </div>

      {result.items.length === 0 ? (
        <Card className="grid min-h-72 place-items-center text-center">
          <div className="max-w-md">
            <div aria-hidden="true" className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-teal-50 text-3xl">
              ✦
            </div>
            <h2 className="text-2xl font-bold text-slate-950">Create your first gathering</h2>
            <p className="mt-2 leading-7 text-slate-600">
              Start with the date, time zone, currency, and planning targets. Invitations stay off while
              the event is a draft.
            </p>
            <Link
              href="/events/new"
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-4 font-semibold text-white"
            >
              Create an event
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {result.items.map((event) => (
            <Card key={event.id} className="flex min-h-64 flex-col">
              <div className="flex items-start justify-between gap-3">
                <Badge>{event.status}</Badge>
                <Badge className="bg-teal-50 text-teal-800">{event.role}</Badge>
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">{event.title}</h2>
              <dl className="mt-4 grid gap-2 text-sm text-slate-600">
                <div>
                  <dt className="sr-only">Starts</dt>
                  <dd>{eventDate(event.startsAt, event.timezone)}</dd>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <dt className="sr-only">Locale</dt>
                  <dd>{event.timezone}</dd>
                  <dd aria-hidden="true">·</dd>
                  <dd>{event.currency}</dd>
                </div>
              </dl>
              <form action={openEventAction.bind(null, event.id)} className="mt-auto pt-6">
                <Button type="submit" variant="secondary" className="w-full">
                  Open event
                </Button>
              </form>
            </Card>
          ))}
        </div>
      )}

      {result.nextCursor ? (
        <div className="flex justify-center">
          <Link
            href={`/events?cursor=${encodeURIComponent(result.nextCursor)}&limit=${pagination.limit}`}
            className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 font-semibold text-slate-800"
          >
            Load more
          </Link>
        </div>
      ) : null}
    </div>
  );
}
