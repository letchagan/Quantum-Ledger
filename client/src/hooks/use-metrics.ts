import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useSystemMetrics() {
  const queryClient = useQueryClient();
  const queryKey = [api.systemMetrics.latest.path];

  useEffect(() => {
    const channel = supabase
      .channel('metrics-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_metrics' },
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
      const res = await fetch(api.systemMetrics.latest.path);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return api.systemMetrics.latest.responses[200].parse(await res.json());
    },
  });
}
