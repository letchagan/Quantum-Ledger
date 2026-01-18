import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useSystemMetrics() {
  return useQuery({
    queryKey: [api.systemMetrics.latest.path],
    queryFn: async () => {
      const res = await fetch(api.systemMetrics.latest.path);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return api.systemMetrics.latest.responses[200].parse(await res.json());
    },
    refetchInterval: 2000, // Fast polling for "real-time" feel
  });
}
