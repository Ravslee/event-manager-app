import { useEffect, useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  SlidersHorizontal,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Edit2
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getEvents, deleteEvent } from "../api/event.api";
import { getEventTypes } from "@/features/event-types/api/event-type.api";
import { EventWizard } from "../components/wizard";

export default function EventsPage() {
  const [view, setView] = useState<"list" | "create">("list");
  const [events, setEvents] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-asc");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Details Sheet state
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Delete Dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const fetchEventsData = () => {
    setIsLoading(true);
    // Fetch all events for frontend filtering & stats calculation
    getEvents({ limit: 100 })
      .then((data) => {
        setEvents(data.events || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load events", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEventsData();
    // Load event types for dropdown filter
    getEventTypes()
      .then((data) => setEventTypes(data))
      .catch((err) => console.error("Failed to load event types", err));
  }, []);

  // Stats Calculations
  const stats = useMemo(() => {
    const total = events.length;
    const confirmed = events.filter((e) => e.status === "Confirmed").length;
    const pending = events.filter((e) => e.status === "Pending").length;
    const completed = events.filter((e) => e.status === "Completed").length;
    return { total, confirmed, pending, completed };
  }, [events]);

  // Filtered and Sorted Events
  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.client?.name?.toLowerCase().includes(q) ||
          e.client?.email?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    // Event Type filter
    if (typeFilter !== "all") {
      result = result.filter((e) => {
        const typeId = typeof e.eventTypeId === "object" ? e.eventTypeId?._id : e.eventTypeId;
        return typeId === typeFilter;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      } else if (sortBy === "date-desc") {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      } else if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  }, [events, searchQuery, statusFilter, typeFilter, sortBy]);

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete)
        .then(() => {
          fetchEventsData();
          setEventToDelete(null);
        })
        .catch((err) => console.error("Failed to delete event", err));
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
    }
  };

  const calculateTotalCost = (bookedServices: any[]) => {
    return bookedServices?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
  };

  const formatDateString = (dateVal: string | Date) => {
    try {
      return format(new Date(dateVal), "MMM d, yyyy");
    } catch {
      return new Date(dateVal).toLocaleDateString();
    }
  };

  if (view === "create") {
    return (
      <div className="container mx-auto py-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setView("list");
              setEditingEventId(null);
            }}
            className="text-xs h-8"
          >
            ← Back to Events List
          </Button>
        </div>
        <EventWizard 
          eventId={editingEventId || undefined}
          onSuccess={() => {
            setView("list");
            setEditingEventId(null);
            fetchEventsData();
          }}
          onCancel={() => {
            setView("list");
            setEditingEventId(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Events Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track, configure, and manage upcoming and past production events.
          </p>
        </div>
        <Button 
          onClick={() => setView("create")}
          className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-2 self-start sm:self-center shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-1">
            <span className="text-xs font-medium text-muted-foreground">Total Events</span>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-1">
            <span className="text-xs font-medium text-muted-foreground">Confirmed</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.confirmed}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-1">
            <span className="text-xs font-medium text-muted-foreground">Pending</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-1">
            <span className="text-xs font-medium text-muted-foreground">Completed</span>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.completed}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card/60 shadow-xs sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by event title or client name..."
            className="pl-9 h-10 border-input bg-background/50 focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              className="h-10 rounded-lg border border-input bg-background px-3 py-1 text-xs outline-none focus-visible:ring-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <select
            className="h-10 rounded-lg border border-input bg-background px-3 py-1 text-xs outline-none focus-visible:ring-1"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Event Types</option>
            {eventTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            className="h-10 rounded-lg border border-input bg-background px-3 py-1 text-xs outline-none focus-visible:ring-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-asc">Date (Oldest First)</option>
            <option value="date-desc">Date (Newest First)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl border bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : filteredAndSortedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-card/20 min-h-[300px]">
          <Calendar className="h-12 w-12 text-muted-foreground/60 mb-3" />
          <h3 className="text-lg font-bold text-foreground">No events found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Try adjusting your search query, clearing filters, or create a new event.
          </p>
          <Button onClick={() => setView("create")} className="mt-4 h-9 text-xs">
            Create Event
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedEvents.map((event) => {
            const typeColor = typeof event.eventTypeId === "object" ? event.eventTypeId?.color : "#3B82F6";
            const typeName = typeof event.eventTypeId === "object" ? event.eventTypeId?.name : "Event";
            
            return (
              <div
                key={event._id}
                className="relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:bg-accent/10"
                style={{
                  borderLeft: `5px solid ${typeColor}`,
                }}
              >
                {/* Upper row: title & status */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-foreground line-clamp-1 text-base">{event.title}</h3>
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors",
                      getStatusBadgeClass(event.status)
                    )}>
                      {event.status}
                    </span>
                  </div>

                  {/* Event Type Name */}
                  <span
                    className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${typeColor}15`,
                      color: typeColor,
                    }}
                  >
                    {typeName}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-2 mt-4 text-xs text-muted-foreground border-y border-border/40 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <span>{formatDateString(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <span>{event.startTime} - {event.endTime || "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <span className="line-clamp-1">{event.client?.name || "No Client"}</span>
                  </div>
                  {event.venue?.name && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                      <span className="line-clamp-1">{event.venue.name}</span>
                    </div>
                  )}
                </div>

                {/* Footer section: Details / Trash */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-foreground">
                    {event.bookedServices?.length || 0} services
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingEventId(event._id);
                        setView("create");
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedEvent(event);
                        setDetailsOpen(true);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEventToDelete(event._id);
                        setDeleteOpen(true);
                      }}
                      className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Side Panel Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto p-6">
          {selectedEvent && (
            <div className="h-full flex flex-col space-y-6 pr-1">
              <SheetHeader className="p-0 border-b border-border pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                    getStatusBadgeClass(selectedEvent.status)
                  )}>
                    {selectedEvent.status}
                  </span>
                  <span
                    className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${typeof selectedEvent.eventTypeId === "object" ? selectedEvent.eventTypeId?.color : "#3B82F6"}15`,
                      color: typeof selectedEvent.eventTypeId === "object" ? selectedEvent.eventTypeId?.color : "#3B82F6",
                    }}
                  >
                    {typeof selectedEvent.eventTypeId === "object" ? selectedEvent.eventTypeId?.name : "Event"}
                  </span>
                </div>
                <SheetTitle className="text-xl font-bold text-foreground">{selectedEvent.title}</SheetTitle>
                <SheetDescription className="text-xs mt-1">
                  Event details and booked resource allocations.
                </SheetDescription>
              </SheetHeader>

              {/* Schedule Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Schedule</h4>
                <div className="rounded-lg border bg-card p-3 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Calendar className="h-4 w-4 text-primary/70 shrink-0" />
                    <div>
                      <div className="font-medium">{formatDateString(selectedEvent.eventDate)}</div>
                      <div className="text-xs text-muted-foreground">Date</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm border-t border-border/40 pt-2.5">
                    <Clock className="h-4 w-4 text-primary/70 shrink-0" />
                    <div>
                      <div className="font-medium">{selectedEvent.startTime} - {selectedEvent.endTime || "TBD"}</div>
                      <div className="text-xs text-muted-foreground">Time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client Details</h4>
                <div className="rounded-lg border bg-card p-3 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm">
                    <User className="h-4 w-4 text-primary/70 shrink-0" />
                    <div>
                      <div className="font-medium">{selectedEvent.client?.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">Client Name</div>
                    </div>
                  </div>
                  {selectedEvent.client?.email && (
                    <div className="flex items-center gap-2.5 text-sm border-t border-border/40 pt-2.5">
                      <Mail className="h-4 w-4 text-primary/70 shrink-0" />
                      <div>
                        <div className="font-medium line-clamp-1">{selectedEvent.client.email}</div>
                        <div className="text-xs text-muted-foreground">Email Address</div>
                      </div>
                    </div>
                  )}
                  {selectedEvent.client?.phone && (
                    <div className="flex items-center gap-2.5 text-sm border-t border-border/40 pt-2.5">
                      <Phone className="h-4 w-4 text-primary/70 shrink-0" />
                      <div>
                        <div className="font-medium">{selectedEvent.client.phone}</div>
                        <div className="text-xs text-muted-foreground">Phone Number</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Venue Info */}
              {selectedEvent.venue?.name && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location / Venue</h4>
                  <div className="rounded-lg border bg-card p-3 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-sm">
                      <MapPin className="h-4 w-4 text-primary/70 shrink-0" />
                      <div>
                        <div className="font-medium">{selectedEvent.venue.name}</div>
                        {selectedEvent.venue.address && (
                          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{selectedEvent.venue.address}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Services & Cost Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Booked Services</h4>
                  <span className="text-xs font-medium text-muted-foreground">
                    {selectedEvent.bookedServices?.length || 0} Allocated
                  </span>
                </div>
                
                {selectedEvent.bookedServices && selectedEvent.bookedServices.length > 0 ? (
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <div className="divide-y divide-border/40">
                      {selectedEvent.bookedServices.map((service: any, index: number) => (
                        <div key={index} className="p-3 flex items-center justify-between text-sm gap-2">
                          <div>
                            <div className="font-medium text-foreground">{service.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {service.unit} units
                            </div>
                          </div>
                          <div className="text-right shrink-0 font-medium">
                            ${service.price?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                      <div className="p-3 bg-muted/30 dark:bg-muted/10 flex items-center justify-between text-sm font-bold border-t border-border">
                        <span className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-muted-foreground" />Total Estimated Price</span>
                        <span>${calculateTotalCost(selectedEvent.bookedServices).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border bg-card p-3 text-center text-xs text-muted-foreground py-6">
                    No services booked for this event.
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedEvent.notes && (
                <div className="space-y-3 pb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Event Notes</h4>
                  <div className="rounded-lg border bg-card p-3 text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5">
                    <FileText className="h-4 w-4 text-primary/70 shrink-0 mt-0.5" />
                    <span>{selectedEvent.notes}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone and will permanently remove the event database record."
        confirmText="Delete Event"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
