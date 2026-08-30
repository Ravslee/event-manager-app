import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown, Edit2, Trash2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FloatingActionButton } from "@/components/common/FloatingActionButton";
import ServiceCard, { getServiceIcon } from "../components/ServiceCard";
import { getServices, deleteService } from "../api/service.api";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Delete Confirm Dialog State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | undefined>(undefined);

  // Fetch Services
  const fetchServicesData = () => {
    setIsLoading(true);
    getServices()
      .then((data: any) => {
        setServices(data);
        setIsLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to load services", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  // Stats Calculations
  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.isActive).length;
    const inactive = total - active;

    // Calculate revenue potential based on sum of active prices * average booking rate
    const sumActivePrices = services
      .filter((s) => s.isActive)
      .reduce((sum, s) => sum + s.price, 0);
    const revenuePotential = sumActivePrices * 78 || 0; // standard business multiplier

    return { total, active, inactive, revenuePotential };
  }, [services]);

  // Categories list
  const categories = useMemo(() => {
    const list = new Set<string>();
    services.forEach((s) => {
      if (s.category) list.add(s.category);
    });
    return ["All", ...Array.from(list)];
  }, [services]);

  // Filtered and Sorted Services
  const filteredAndSortedServices = useMemo(() => {
    let result = [...services];

    // Filter
    if (categoryFilter !== "All") {
      result = result.filter((s) => s.category === categoryFilter);
    }

    // Sort
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // default newest: newest first (using createdAt or array position)
      result.reverse();
    }

    return result;
  }, [services, categoryFilter, sortBy]);

  // CRUD Handlers
  const handleOpenAddForm = () => {
    navigate("/services/new");
  };

  const handleOpenEditForm = (service: any) => {
    navigate(`/services/${service._id}`);
  };



  const handleOpenDeleteConfirm = (id: string) => {
    setServiceToDelete(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete)
        .then(() => {
          setDeleteOpen(false);
          setServiceToDelete(undefined);
          fetchServicesData();
        })
        .catch((err: any) => console.error(err));
    }
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 pb-24">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Services Catalog
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor professional services for your upcoming events.
          </p>
        </div>

      </div>

      <FloatingActionButton
        label="Add New Service"
        onClick={handleOpenAddForm}
      />

      {/* KPI Stats Row: Combined Single Card */}
      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-border/60">
          <div className="flex items-center gap-3.5 sm:px-5 first:pl-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Services</p>
              <h3 className="text-base sm:text-xl font-extrabold text-foreground">{stats.total}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Services</p>
              <h3 className="text-base sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.active}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:px-5 last:pr-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0">
              <span className="h-3 w-3 rounded-full bg-orange-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inactive Services</p>
              <h3 className="text-base sm:text-xl font-extrabold text-orange-600 dark:text-orange-400">{stats.inactive}</h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue Potential (Styled Premium Purple Card) */}
      {/* <div className="bg-primary text-primary-foreground p-5 rounded-2xl shadow-md flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="size-24" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80">
              REVENUE POTENTIAL
            </span>
            <p className="text-2xl font-black mt-1">
              {formatCurrency(stats.revenuePotential)}
            </p>
          </div>
          <span className="text-[10px] font-semibold text-primary-foreground/90">
            +12% from last month
          </span>
        </div> */}

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-border bg-card p-3 rounded-2xl gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border border-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            <select
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-foreground"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order Dropdown */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border border-transparent">
            <ArrowUpDown className="h-4 w-4" />
            <select
              className="bg-transparent text-xs font-semibold outline-none cursor-pointer text-foreground"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="name-asc">Sort: Name A-Z</option>
              <option value="price-asc">Sort: Price Low-High</option>
              <option value="price-desc">Sort: Price High-Low</option>
            </select>
          </div>
        </div>

        {/* Layout Mode Switcher */}
        <div className="flex items-center gap-1 border-l border-border pl-0 sm:pl-3 self-end sm:self-auto">
          <Button
            size="icon"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 rounded-lg"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === "list" ? "secondary" : "ghost"}
            onClick={() => setViewMode("list")}
            className="h-8 w-8 rounded-lg"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid List displaying Services */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 border rounded-2xl bg-card" />
          ))}
        </div>
      ) : filteredAndSortedServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-3xl bg-card text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-lg">
            🔍
          </div>
          <h3 className="font-bold text-lg text-foreground">No Services Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {categoryFilter !== "All"
              ? `No services registered under category "${categoryFilter}".`
              : "Start by registering your services to populate the catalog and booking schedules."}
          </p>
          <Button onClick={handleOpenAddForm} variant="outline" className="mt-2">
            Create a Service
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onEdit={handleOpenEditForm}
              onDelete={handleOpenDeleteConfirm}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border/60 overflow-hidden shadow-sm">
          {filteredAndSortedServices.map((service) => {
            const pricingText =
              service.pricingModel === "flat"
                ? "flat"
                : service.pricingModel === "per_guest"
                  ? "per guest"
                  : "hr";

            const IconComponent = getServiceIcon(service.category, service.name);
            const cardColor = service.color || "#6366F1";

            return (
              <div
                key={service._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/20 transition-colors duration-150"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div 
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-border/50"
                    style={{ backgroundColor: `${cardColor}15`, color: cardColor }}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-foreground text-sm tracking-tight truncate">
                        {service.name}
                      </h3>
                      <span
                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: `${service.color}15`, color: service.color }}
                      >
                        {service.category}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-xl">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0 pl-16 sm:pl-0">
                  <span className="text-sm font-extrabold text-primary shrink-0 min-w-[90px] text-right">
                    {formatCurrency(service.price)}/{pricingText}
                  </span>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
                      service.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        service.isActive ? "bg-emerald-500" : "bg-orange-500"
                      )}
                    />
                    {service.isActive ? "Active" : "Inactive"}
                  </span>



                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenEditForm(service)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenDeleteConfirm(service._id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}



      {/* Confirm Delete modal */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone and will remove it from future event selection."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
