import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertTransactionSchema } from "@shared/schema";
import { useCreateTransaction } from "@/hooks/use-transactions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Extend schema for form usage (decimals as strings initially)
const formSchema = insertTransactionSchema.extend({
  amount: z.coerce.number().min(0.00000001, "Amount must be greater than 0"),
});

type FormValues = z.infer<typeof formSchema>;

export function TransactionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createTx = useCreateTransaction();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      currency: "QBIT",
      sender: "0xWALLET...",
      receiver: "0xTARGET...",
      status: "pending",
      hash: `0x${Math.random().toString(16).slice(2)}`,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Generate a fresh hash for visual effect each submission
    const submitData = {
      ...data,
      amount: data.amount.toString(), // Convert back to string for decimal column
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    };

    createTx.mutate(submitData as any, {
      onSuccess: () => {
        setOpen(false);
        toast({
          title: "Transaction Initiated",
          description: `Quantum signature verified for ${data.amount} ${data.currency}`,
          className: "bg-black border-primary text-primary font-mono",
        });
        form.reset();
      },
      onError: (err) => {
        toast({
          title: "Transaction Failed",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary/20 text-primary hover:bg-primary/40 border border-primary/50 font-mono tracking-wider uppercase text-glow">
          <Plus className="w-4 h-4 mr-2" /> Initiate Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-primary/50 text-foreground font-mono">
        <DialogHeader>
          <DialogTitle className="text-primary tracking-widest uppercase text-xl">New Quantum Transaction</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input {...form.register("currency")} className="cyber-input" />
              {form.formState.errors.currency && (
                <span className="text-destructive text-xs">{form.formState.errors.currency.message}</span>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input type="number" step="0.00000001" {...form.register("amount")} className="cyber-input" />
              {form.formState.errors.amount && (
                <span className="text-destructive text-xs">{form.formState.errors.amount.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender">Sender Address</Label>
            <Input {...form.register("sender")} className="cyber-input text-xs" />
             {form.formState.errors.sender && (
                <span className="text-destructive text-xs">{form.formState.errors.sender.message}</span>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver">Receiver Address</Label>
            <Input {...form.register("receiver")} className="cyber-input text-xs" />
             {form.formState.errors.receiver && (
                <span className="text-destructive text-xs">{form.formState.errors.receiver.message}</span>
              )}
          </div>

          <Button 
            type="submit" 
            disabled={createTx.isPending}
            className="w-full mt-6 bg-primary text-black hover:bg-primary/80 font-bold tracking-widest"
          >
            {createTx.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            EXECUTE
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
