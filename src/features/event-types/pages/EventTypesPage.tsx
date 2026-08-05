import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Trash2, Edit2, Star, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { cn } from "@/lib/utils";
import { getEventTypes, deleteEventType } from "../api/event-type.api";
import { EventTypeDialog } from "../components/EventTypeDialog";
import type { EventType } from "../types/event-type.types";

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Edit/Create Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<string | undefined>(undefined);

  // Delete Confirm Dialog State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | undefined>(undefined);

  const fetchEventTypes = () => {
    setIsLoading(true);
    getEventTypes()
      .then((data) => {
        setEventTypes(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load event types", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  // Stats Calculations
  const stats = useMemo(() => {
    const total = eventTypes.length;
    const active = eventTypes.filter((t) => t.isActive).length;
    const defaultType = eventTypes.find((t) => t.isDefault)?.name || "None";
    return { total, active, defaultType };
  }, [eventTypes]);

  // Filtered and Sorted Event Types
  const filteredAndSortedTypes = useMemo(() => {
    let result = [...eventTypes];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((t) => t.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((t) => !t.isActive);
    }

    // Sort options
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "default-first") {
      // isDefault: true first
      result.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));
    } else {
      // default: newest first (reverse of api response or using createdAt)
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [eventTypes, searchQuery, statusFilter, sortBy]);

  // Handlers
  const handleOpenAdd = () => {
    setSelectedTypeId(undefined);
    setDialogOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setSelectedTypeId(id);
    setDialogOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setTypeToDelete(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (typeToDelete) {
      deleteEventType(typeToDelete)
        .then(() => {
          fetchEventTypes();
          setTypeToDelete(undefined);
        })
        .catch((err) => {
          console.error("Failed to delete event type", err);
        });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <span>Settings</span>
            <span>/</span>
            <span className="text-foreground">Event Types</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Event Types
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure custom categories and styling tags for your booking workflow.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="h-10 px-5 gap-1.5 self-start md:self-auto bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm rounded-xl"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Event Type
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Event Types */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Types
          </span>
          <span className="text-3xl font-extrabold text-foreground">{stats.total}</span>
        </div>

        {/* Active Types */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Types
            </span>
          </div>
          <span className="text-3xl font-extrabold text-foreground">{stats.active}</span>
        </div>

        {/* Default Type */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
          <div className="flex items-center gap-2 text-primary">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Default Type
            </span>
          </div>
          <span className="text-lg font-bold text-foreground truncate">{stats.defaultType}</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-border bg-card p-3 rounded-2xl gap-3 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search event types..."
            className="pl-9 h-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border">
            <SlidersHorizontal className="h-4 w-4" />
            <select
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-foreground"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border">
            <select
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-foreground"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="name-asc">A to Z</option>
              <option value="name-desc">Z to A</option>
              <option value="default-first">Default First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event Types Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading event types...</span>
        </div>
      ) : filteredAndSortedTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed rounded-2xl py-12 text-center bg-card p-6">
          <div className="p-3 bg-muted rounded-full text-muted-foreground mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-foreground">No Event Types Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Try adjusting your search queries or add your very first custom Event Type configuration.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTypes.map((type) => (
            <div
              key={type._id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-4.5 rounded-full border shadow-inner shrink-0"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="font-bold text-foreground text-sm">{type.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {type.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        DEFAULT
                      </span>
                    )}
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                        type.isActive
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                      )}
                    >
                      {type.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {type.description || "No description provided."}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-end gap-2 border-t pt-4 mt-5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenEdit(type._id)}
                  className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                  title="Edit Type"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenDelete(type._id)}
                  className="size-8 rounded-lg text-destructive hover:bg-destructive/5"
                  title="Delete Type"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog Component */}
      <EventTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        eventTypeId={selectedTypeId}
        onSuccess={fetchEventTypes}
      />

      {/* Confirmation Dialog Component */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Event Type"
        description="Are you absolutely sure you want to delete this event type? This action cannot be undone."
        confirmText="Delete Type"
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
