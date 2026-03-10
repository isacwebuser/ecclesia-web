import api from './api';

export interface AuditLog {
  id: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  beforeSnapshot?: Record<string, any>;
  afterSnapshot?: Record<string, any>;
  changedFields?: Record<string, any>;
  changedByUserId?: string;
  changedByLogin?: string;
  changedAt: string;
  sourceIp?: string;
  correlationId?: string;
}

export interface AuditLogsResponse {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const auditService = {
  getLogs: async (page = 0, size = 20, filters?: any) => {
    const response = await api.get<AuditLogsResponse>('/finance/audit/logs', {
      params: { page, size, ...filters }
    });
    return response.data;
  },

  exportReport: async (type: 'CSV' | 'PDF', filters?: any) => {
    const response = await api.get(`/finance/audit/export`, {
      params: { type, ...filters },
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-auditoria-${new Date().getTime()}.${type.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
