import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Search,
  Trash2,
  Calendar,
  CalendarDays,
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FloatingActionButton } from "@/components/common/FloatingActionButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { cn, formatCurrency } from "@/lib/utils";
import { getEvents, deleteEvent, updateEvent } from "../api/event.api";
import { getEventTypes } from "@/features/event-types/api/event-type.api";
import { EventWizard } from "../components/wizard";
import EventCategoryGraphic, { getCategoryConfig } from "../components/EventCategoryGraphic";


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

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      await updateEvent(eventId, { status: newStatus });
      if (selectedEvent && selectedEvent._id === eventId) {
        setSelectedEvent((prev: any) => ({ ...prev, status: newStatus }));
      }
      fetchEventsData();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

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
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold";
      case "Pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold";
      case "Completed":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-bold";
      case "Cancelled":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 font-bold";
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
      <div className="container mx-auto max-w-4xl h-[calc(100vh-112px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="mb-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              setView("list");
              setEditingEventId(null);
            }}
            className="text-xs h-7 px-2.5"
          >
            ← Back to Events List
          </Button>
        </div>
        <div className="flex-1 min-h-0">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 pb-24">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Events Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Track, configure, and manage upcoming and past production events.
          </p>
        </div>

      </div>

      <FloatingActionButton
        label="Create Event"
        onClick={() => setView("create")}
      />

      {/* Stats Section: Combined Single Card */}
      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-border/60">
          <div className="flex items-center gap-3.5 md:px-5 first:pl-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Events</p>
              <h3 className="text-base sm:text-xl font-extrabold text-foreground">{stats.total}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3.5 md:px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirmed</p>
              <h3 className="text-base sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.confirmed}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3.5 md:px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending</p>
              <h3 className="text-base sm:text-xl font-extrabold text-amber-600 dark:text-amber-400">{stats.pending}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3.5 md:px-5 last:pr-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</p>
              <h3 className="text-base sm:text-xl font-extrabold text-blue-600 dark:text-blue-400">{stats.completed}</h3>
            </div>
          </div>
        </div>
      </Card>

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
            const categoryConfig = getCategoryConfig(typeName, typeColor);
            const CategoryIcon = categoryConfig.IconComponent;

            return (
              <Card
                key={event._id}
                className="relative h-[250px] sm:h-[270px] overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                {/* Theme-Adaptive Pattern Wallpaper Background Overlay */}
                <EventCategoryGraphic
                  typeName={typeName}
                  typeColor={typeColor}
                  className="absolute inset-0 h-full w-full pointer-events-none"
                />

                {/* Top Badge & Status Header */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div 
                    className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-extrabold shrink-0 shadow-2xs"
                    style={{ 
                      backgroundColor: `${typeColor}18`, 
                      color: typeColor, 
                      borderColor: `${typeColor}35` 
                    }}
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />
                    <span>{typeName}</span>
                  </div>

                  <span className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide transition-colors shrink-0",
                    getStatusBadgeClass(event.status)
                  )}>
                    {event.status}
                  </span>
                </div>

                {/* Bottom Card Info & Action */}
                <div className="relative z-10 space-y-3 pt-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {event.description ? event.description : `${event.client?.name ? `Client: ${event.client.name}` : ''}${event.venue?.name ? ` • Venue: ${event.venue.name}` : ''}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="h-4 w-4 shrink-0 text-foreground" />
                      <span className="font-semibold text-xs sm:text-sm text-foreground">{formatDateString(event.eventDate)}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-8 px-3 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer shadow-2xs"
                      onClick={() => {
                        setSelectedEvent(event);
                        setDetailsOpen(true);
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Details Side Panel Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto p-6 pb-20">
          {selectedEvent && (
            <div className="h-full flex flex-col space-y-6 pr-1">
              <SheetHeader className="pt-5 pr-10 pb-4 border-b border-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedEvent.status}
                      onChange={(e) => handleStatusChange(selectedEvent._id, e.target.value)}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors cursor-pointer bg-background outline-none",
                        getStatusBadgeClass(selectedEvent.status)
                      )}
                    >
                      <option value="Draft" className="bg-background text-foreground">Draft</option>
                      <option value="Confirmed" className="bg-background text-foreground">Confirmed</option>
                      <option value="In-Progress" className="bg-background text-foreground">In-Progress</option>
                      <option value="Completed" className="bg-background text-foreground">Completed</option>
                      <option value="Cancelled" className="bg-background text-foreground">Cancelled</option>
                    </select>
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

                  {/* Top Action Icon Buttons: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit Event"
                      onClick={() => {
                        setDetailsOpen(false);
                        setEditingEventId(selectedEvent._id);
                        setView("create");
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg cursor-pointer transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete Event"
                      onClick={() => {
                        setDetailsOpen(false);
                        setEventToDelete(selectedEvent._id);
                        setDeleteOpen(true);
                      }}
                      className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                            {formatCurrency(service.price || 0)}
                          </div>
                        </div>
                      ))}
                      <div className="p-3 bg-muted/30 dark:bg-muted/10 flex items-center justify-between text-sm font-bold border-t border-border">
                        <span className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-muted-foreground" />Total Estimated Price</span>
                        <span>{formatCurrency(calculateTotalCost(selectedEvent.bookedServices))}</span>
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
                <div className="space-y-3">
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
