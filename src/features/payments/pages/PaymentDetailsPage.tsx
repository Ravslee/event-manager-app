import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  ArrowLeft,
  Download,
  Mail,
  RefreshCw,
  Building,
  User,
  MapPin,
  Phone,
  Clock,
  Plus,
  Trash2,
  DollarSign
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn, formatCurrency } from "@/lib/utils";

import { getPaymentByEventId, createPaymentTransaction, deleteTransaction } from "../api/payments.api";
import type { Payment, CreateTransactionPayload } from "../types/payments.types";

export default function PaymentDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Transaction Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, setValue } = useForm<CreateTransactionPayload>();

  useEffect(() => {
    if (eventId) {
      fetchPayment();
    }
  }, [eventId]);

  const fetchPayment = async () => {
    try {
      setIsLoading(true);
      if (eventId) {
        const data = await getPaymentByEventId(eventId);
        setPayment(data);
      }
    } catch (error) {
      console.error("Failed to load payment details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Partial":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Refunded":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const onSubmitTransaction = async (data: CreateTransactionPayload) => {
    try {
      setIsSubmitting(true);
      if (eventId) {
        data.amount = Number(data.amount);
        await createPaymentTransaction(eventId, data);
        await fetchPayment();
        setIsModalOpen(false);
        reset();
      }
    } catch (error) {
      console.error("Failed to add transaction", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (payment?._id) {
      try {
        await deleteTransaction(payment._id, transactionId);
        await fetchPayment();
      } catch (error) {
        console.error("Failed to delete transaction", error);
      }
    }
  };

  const openTransactionModal = () => {
    const dueAmount = payment ? payment.totalAmount - payment.paidAmount : 0;
    setValue("amount", dueAmount);
    setValue("paymentMethod", "Card");
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[500px]">
        <div className="text-muted-foreground animate-pulse text-lg">Loading payment details...</div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container mx-auto py-10">
        <Button variant="ghost" onClick={() => navigate("/payments")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Payments
        </Button>
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-card/20 min-h-[300px]">
          <h3 className="text-xl font-bold mb-2">Payment Not Found</h3>
          <p className="text-muted-foreground mb-6 text-sm max-w-md text-center">
            We couldn't find a payment record associated with this event. Ensure the event ID is correct.
          </p>
          <Button onClick={() => navigate("/payments")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const dueAmount = payment.totalAmount - payment.paidAmount;
  // Calculate Tax (Simulated 5% VAT) for visual breakdown purposes if we want, or just show booked services total.
  // The backend uses totalAmount as the definitive sum. We will just show services sum.
  const servicesTotal = payment.eventId?.bookedServices?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
  const tax = Math.max(0, payment.totalAmount - servicesTotal); // If totalAmount > servicesTotal, show diff as tax/fees

  return (
    <div className="container mx-auto pb-10 space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button variant="outline" size="icon" onClick={() => navigate("/payments")} className="shrink-0 h-10 w-10">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground line-clamp-1">
              Payment details
            </h1>
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", getStatusBadgeClass(payment.status))}>
              {payment.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            Associated with event <span className="font-medium text-foreground">{payment.eventId?.title}</span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" className="h-10 text-xs">
            <Download className="mr-2 h-4 w-4" />
            Invoice
          </Button>
          {dueAmount > 0 && (
            <Button className="h-10 text-xs" onClick={openTransactionModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overview & Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="rounded-2xl shadow-sm border-0 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Amount</div>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    {formatCurrency(payment.totalAmount)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Remaining Due</div>
                  <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    {formatCurrency(dueAmount)}
                  </div>
                </div>
              </div>

              <div className="h-3 w-full rounded-full bg-primary/10 overflow-hidden mb-2">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(100, Math.max(0, (payment.paidAmount / payment.totalAmount) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>{formatCurrency(payment.paidAmount)} paid</span>
                <span>{((payment.paidAmount / payment.totalAmount) * 100).toFixed(0)}% completed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg">Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {payment.eventId?.bookedServices?.map((service, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4">
                    <div>
                      <div className="font-medium text-foreground">{service.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{service.unit} units</div>
                    </div>
                    <div className="font-medium text-foreground">
                      {formatCurrency(service.price)}
                    </div>
                  </div>
                ))}
                
                {tax > 0 && (
                  <div className="flex justify-between items-center p-4 bg-muted/10">
                    <div className="text-sm font-medium text-muted-foreground">Taxes & Fees</div>
                    <div className="font-medium text-muted-foreground">{formatCurrency(tax)}</div>
                  </div>
                )}
                
                <div className="flex justify-between items-center p-4 bg-muted/20">
                  <div className="font-bold text-foreground">Grand Total</div>
                  <div className="font-bold text-foreground text-lg">{formatCurrency(payment.totalAmount)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Info Card */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0"><Building className="h-4 w-4" /></div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-0.5">Organization / Name</div>
                  <div className="text-sm font-medium">{payment.eventId?.client?.name}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0"><Mail className="h-4 w-4" /></div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-0.5">Email Address</div>
                  <div className="text-sm font-medium">{payment.eventId?.client?.email || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0"><Phone className="h-4 w-4" /></div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-0.5">Phone Number</div>
                  <div className="text-sm font-medium">{payment.eventId?.client?.phone || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0"><MapPin className="h-4 w-4" /></div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-0.5">Event Venue</div>
                  <div className="text-sm font-medium line-clamp-1">{payment.eventId?.venue?.name || "N/A"}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{payment.eventId?.venue?.address}</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Timeline & Notes */}
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Payment Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex-1 overflow-y-auto">
              <div className="relative pl-6 border-l border-muted-foreground/20 space-y-8 pb-4">
                {/* Event Creation Entry */}
                <div className="relative">
                  <div className="absolute -left-[31px] bg-background border-2 border-primary/20 rounded-full p-1.5 shrink-0">
                    <Plus className="h-3.5 w-3.5 text-primary/60" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Invoice Created</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(payment.createdAt), "MMM d, yyyy h:mm a")}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1">Generated automatically on event creation.</p>
                  </div>
                </div>

                {/* Transactions */}
                {payment.transactions.map((txn) => (
                  <div key={txn._id} className="relative group">
                    <div className="absolute -left-[31px] bg-background border-2 border-emerald-500/20 rounded-full p-1.5 shrink-0">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Payment Received</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(txn.transactionDate), "MMM d, yyyy h:mm a")}
                        </p>
                        <div className="text-xs text-muted-foreground/80 mt-1.5 p-2 bg-muted/30 rounded-md border border-border/40 space-y-1">
                          <div><span className="font-medium text-foreground">Amount:</span> {formatCurrency(txn.amount)}</div>
                          <div><span className="font-medium text-foreground">Method:</span> {txn.paymentMethod}</div>
                          {txn.referenceNumber && <div><span className="font-medium text-foreground">Ref:</span> {txn.referenceNumber}</div>}
                          {txn.notes && <div><span className="font-medium text-foreground">Notes:</span> {txn.notes}</div>}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteTransaction(txn._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            {dueAmount > 0 && (
              <CardFooter className="p-4 bg-muted/10 border-t border-border/50">
                <Button className="w-full text-xs" onClick={openTransactionModal}>
                  Mark as Paid Manually
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-bold">Add Payment Transaction</SheetTitle>
            <SheetDescription className="text-xs">
              Record a new manual payment towards the invoice. The remaining balance is {formatCurrency(dueAmount)}.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmitTransaction)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={dueAmount}
                className="h-10"
                {...register("amount", { required: true, max: dueAmount })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select
                id="paymentMethod"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("paymentMethod", { required: true })}
              >
                <option value="Card">Credit / Debit Card</option>
                <option value="Bank Transfer">Bank Transfer (Wire)</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Stripe">Stripe / Online</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referenceNumber">Reference Number (Optional)</Label>
              <Input
                id="referenceNumber"
                placeholder="e.g. TXN-123456"
                className="h-10"
                {...register("referenceNumber")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes (Optional)</Label>
              <textarea
                id="notes"
                placeholder="Add any context for this payment..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("notes")}
              />
            </div>

            <div className="pt-4 flex gap-3 justify-end border-t border-dashed mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Payment"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

    </div>
  );
}
