import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useSecurityLogs() {
  const queryClient = useQueryClient();
  const queryKey = [api.securityLogs.list.path];

  useEffect(() => {
    const channel = supabase
      .channel('logs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'security_logs' },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(api.securityLogs.list.path);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return api.securityLogs.list.responses[200].parse(await res.json());
    },
  });
}
