import { z } from 'zod';
import { insertTransactionSchema, insertSecurityLogSchema, insertSystemMetricSchema, transactions, securityLogs, systemMetrics } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/transactions',
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/transactions',
      input: insertTransactionSchema,
      responses: {
        201: z.custom<typeof transactions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  securityLogs: {
    list: {
      method: 'GET' as const,
      path: '/api/security-logs',
      responses: {
        200: z.array(z.custom<typeof securityLogs.$inferSelect>()),
      },
    },
  },
  systemMetrics: {
    latest: {
      method: 'GET' as const,
      path: '/api/system-metrics/latest',
      responses: {
        200: z.array(z.custom<typeof systemMetrics.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
