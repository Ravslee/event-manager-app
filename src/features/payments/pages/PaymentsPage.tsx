import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, isPast, isToday } from "date-fns";
import {
  Search,
  SlidersHorizontal,
  Download,
  Plus,
  CreditCard,
  BanknoteArrowDown,
  AlertTriangle,
  Mail,
  MoreVertical,
  Eye,
  FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

import StatCard from "@/features/dashboard/components/StatCard";
import RevenueChart from "@/features/dashboard/components/RevenueChart";
import { weeklyData, monthlyData } from "@/features/dashboard/components/RevenueChart/RevenueChart.constants";

import { getPayments } from "../api/payments.api";
import type { Payment } from "../types/payments.types";

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Failed to load payments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Derived Stats
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pendingAmount = 0;
    let overdueAmount = 0;
    let pendingCount = 0;

    payments.forEach((p) => {
      totalRevenue += p.paidAmount;

      const due = p.totalAmount - p.paidAmount;

      if (due > 0 && (p.status === "Pending" || p.status === "Partial")) {
        pendingAmount += due;
        pendingCount += 1;

        if (p.eventId?.eventDate && isPast(new Date(p.eventId.eventDate)) && !isToday(new Date(p.eventId.eventDate))) {
          overdueAmount += due;
        }
      }
    });

    return { totalRevenue, pendingAmount, pendingCount, overdueAmount };
  }, [payments]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        p.eventId?.title?.toLowerCase().includes(searchLower) ||
        p.eventId?.client?.name?.toLowerCase().includes(searchLower) ||
        p.eventId?.client?.email?.toLowerCase().includes(searchLower);

      // Status Filter
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "Partial":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "Refunded":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
    }
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 pb-8">
      {/* Breadcrumb & Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <span>Finance</span>
            <span>/</span>
            <span className="text-foreground">Payments</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Payments
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage transactions, invoices, and track revenue.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button variant="outline" className="h-10 px-4 text-xs rounded-xl gap-1.5">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3">
        <StatCard
          title="TOTAL REVENUE"
          value={formatCurrency(stats.totalRevenue)}
          icon={CreditCard}
          change={12}
          progress={75}
        />
        <StatCard
          title="PENDING PAYMENTS"
          value={formatCurrency(stats.pendingAmount)}
          icon={BanknoteArrowDown}
          change={-5}
          progress={40}
        />
        <StatCard
          title="OVERDUE AMOUNT"
          value={formatCurrency(stats.overdueAmount)}
          icon={AlertTriangle}
          change={2}
          progress={15}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {/* Main List */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>

              {/* Search & Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8 h-9 w-64 text-xs bg-muted/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs outline-none focus-visible:ring-1"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20 text-xs text-muted-foreground uppercase tracking-wider text-left">
                      <th className="px-6 py-4 font-medium">Client</th>
                      <th className="px-6 py-4 font-medium">Event Title</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          Loading payments...
                        </td>
                      </tr>
                    ) : paginatedPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      paginatedPayments.map((payment) => (
                        <tr
                          key={payment._id}
                          className="hover:bg-muted/10 transition-colors cursor-pointer"
                          onClick={() => navigate(`/payments/${payment.eventId._id}`)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 rounded-md border">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary rounded-md">
                                  {getInitials(payment.eventId?.client?.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-foreground">
                                  {payment.eventId?.client?.name || "Unknown"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {payment.eventId?.client?.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-foreground line-clamp-1 max-w-[200px]">
                              {payment.eventId?.title || "No Title"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-foreground">
                            {formatCurrency(payment.totalAmount)}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">
                            {payment.eventId?.eventDate
                              ? format(new Date(payment.eventId.eventDate), "MMM d, yyyy")
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                              getStatusBadgeClass(payment.status)
                            )}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/payments/${payment.eventId._id}`);
                              }}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {!isLoading && filteredPayments.length > 0 && (
                <div className="border-t p-4 flex items-center justify-between bg-muted/10 text-xs text-muted-foreground rounded-b-2xl">
                  <div>
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPayments.length)} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          <RevenueChart chartData={{ weekly: weeklyData, monthly: monthlyData }} />

          <Card className="rounded-2xl shadow-sm border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.pendingCount > 0 ? (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-200/50">
                  <div className="p-2 bg-amber-500/20 rounded-md shrink-0">
                    <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200 leading-none">
                      {stats.pendingCount} invoices pending
                    </p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                      Follow up with clients to secure payments.
                    </p>
                    <Button variant="outline" size="sm" className="w-full mt-2 h-7 text-xs bg-transparent border-amber-300 hover:bg-amber-500/20">
                      Review Pending
                    </Button>
                  </div>
                </div>
              ) : null}

              {stats.overdueAmount > 0 ? (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-200/50">
                  <div className="p-2 bg-rose-500/20 rounded-md shrink-0">
                    <Mail className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-rose-900 dark:text-rose-200 leading-none">
                      Overdue Reminders
                    </p>
                    <p className="text-xs text-rose-700/80 dark:text-rose-400/80">
                      You have {formatCurrency(stats.overdueAmount)} in overdue payments.
                    </p>
                    <Button variant="outline" size="sm" className="w-full mt-2 h-7 text-xs bg-transparent border-rose-300 hover:bg-rose-500/20">
                      Send Reminders
                    </Button>
                  </div>
                </div>
              ) : null}

              {stats.pendingCount === 0 && stats.overdueAmount === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                    <Check className="h-5 w-5" />
                  </div>
                  You're all caught up!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Temporary Check icon for empty state
const Check = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
