"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createEventAction, initialCreateEventState } from "@/features/events/actions";
import { eventTypes, supportedCurrencies } from "@/features/events/constants";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldShell, Input, Select, Textarea } from "@/components/ui/form-field";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Creating event…" : "Create draft event"}
    </Button>
  );
}

export function CreateEventForm() {
  const [state, action] = useActionState(createEventAction, initialCreateEventState);
  const error = (field: string) => state.fieldErrors?.[field]?.[0];

  return (
    <form action={action} className="grid gap-8" noValidate>
      {state.status === "error" ? (
        <Alert>
          <p className="font-semibold">We could not create the event.</p>
          <p>{state.message}</p>
        </Alert>
      ) : null}

      <fieldset className="grid gap-5">
        <legend className="mb-3 text-lg font-bold text-slate-950">Event details</legend>
        <FieldShell id="title" label="Event title" error={error("title")}>
          <Input
            id="title"
            name="title"
            autoComplete="off"
            maxLength={160}
            required
            aria-invalid={Boolean(error("title"))}
            aria-describedby={error("title") ? "title-error" : undefined}
          />
        </FieldShell>
        <FieldShell id="eventType" label="Event type" error={error("eventType")}>
          <Select id="eventType" name="eventType" defaultValue="OTHER" required>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </FieldShell>
        <FieldShell id="description" label="Description (optional)" error={error("description")}>
          <Textarea id="description" name="description" maxLength={5000} />
        </FieldShell>
        <FieldShell id="venueText" label="Venue (optional)" error={error("venueText")}>
          <Input id="venueText" name="venueText" maxLength={500} />
        </FieldShell>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-bold text-slate-950 sm:col-span-2">
          Date, time, and locale
        </legend>
        <FieldShell id="startsAt" label="Starts" error={error("startsAt")}>
          <Input id="startsAt" name="startsAt" type="datetime-local" required />
        </FieldShell>
        <FieldShell id="endsAt" label="Ends" error={error("endsAt")}>
          <Input id="endsAt" name="endsAt" type="datetime-local" required />
        </FieldShell>
        <FieldShell
          id="timezone"
          label="Event time zone"
          hint="Use an IANA zone such as Asia/Manila."
          error={error("timezone")}
        >
          <Input id="timezone" name="timezone" list="timezone-options" defaultValue="Asia/Manila" required />
          <datalist id="timezone-options">
            <option value="Asia/Manila" />
            <option value="Asia/Singapore" />
            <option value="Asia/Hong_Kong" />
            <option value="Australia/Sydney" />
            <option value="Europe/London" />
            <option value="America/New_York" />
          </datalist>
        </FieldShell>
        <FieldShell id="currency" label="Currency" error={error("currency")}>
          <Select id="currency" name="currency" defaultValue="PHP" required>
            {supportedCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        </FieldShell>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-3">
        <legend className="mb-3 text-lg font-bold text-slate-950 sm:col-span-3">
          Planning targets (optional)
        </legend>
        <FieldShell id="budgetLimit" label="Budget target" error={error("budgetLimit")}>
          <Input id="budgetLimit" name="budgetLimit" inputMode="decimal" placeholder="50000.00" />
        </FieldShell>
        <FieldShell id="capacity" label="Capacity" error={error("capacity")}>
          <Input id="capacity" name="capacity" type="number" min={1} max={1_000_000} />
        </FieldShell>
        <FieldShell
          id="rsvpDeadline"
          label="RSVP deadline"
          error={error("rsvpDeadline")}
        >
          <Input id="rsvpDeadline" name="rsvpDeadline" type="datetime-local" />
        </FieldShell>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Button type="reset" variant="secondary">
          Reset
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
