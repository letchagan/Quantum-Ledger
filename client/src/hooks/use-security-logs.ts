import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useSecurityLogs() {
  return useQuery({
    queryKey: [api.securityLogs.list.path],
    queryFn: async () => {
      const res = await fetch(api.securityLogs.list.path);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return api.securityLogs.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000,
  });
}
