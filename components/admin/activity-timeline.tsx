type Event = {
  id: string
  event_type: string
  payload: Record<string, unknown> | null
  created_at: string
}

export function ActivityTimeline({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex gap-3">
          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
          <div>
            <p className="text-sm font-medium capitalize text-foreground">
              {event.event_type.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(event.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
