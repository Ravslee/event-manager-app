import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import ServiceCard from "../components/ServiceCard";
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
    const active = services.filter((s) => s.status !== "Inactive").length;
    const inactive = total - active;

    // Calculate revenue potential based on sum of active prices * average booking rate
    const sumActivePrices = services
      .filter((s) => s.status !== "Inactive")
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
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
      {/* Breadcrumb & Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <span>Catalog</span>
            <span>/</span>
            <span className="text-foreground">All Services</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Services Catalog
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor professional services for your upcoming events.
          </p>
        </div>

        <Button onClick={handleOpenAddForm} className="h-10 px-5 gap-1.5 self-start md:self-auto bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm rounded-xl">
          <Plus className="h-4.5 w-4.5" />
          Add New Service
        </Button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Services */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Services
          </span>
          <span className="text-3xl font-extrabold text-foreground">{stats.total}</span>
        </div>

        {/* Active Services */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active
            </span>
          </div>
          <span className="text-3xl font-extrabold text-foreground">{stats.active}</span>
        </div>

        {/* Inactive Services */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Inactive
            </span>
          </div>
          <span className="text-3xl font-extrabold text-foreground">{stats.inactive}</span>
        </div>

        {/* Revenue Potential (Styled Premium Purple Card) */}
        <div className="bg-primary text-primary-foreground p-5 rounded-2xl shadow-md flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="size-24" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80">
              REVENUE POTENTIAL
            </span>
            <p className="text-2xl font-black mt-1">
              ${stats.revenuePotential.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <span className="text-[10px] font-semibold text-primary-foreground/90">
            +12% from last month
          </span>
        </div>
      </div>

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
      ) : (
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
