import { ServiceStatus, type ServiceRequestType } from "@prisma/client";
import { prisma } from "@/infra/prisma/client";

export type ServiceBoView = {
  id: string;
  tableId: string;
  type: ServiceRequestType;
  status: ServiceStatus;
  createdAt: string;
};

export async function listOpenServiceRequests(): Promise<ServiceBoView[]> {
  const rows = await prisma.serviceRequest.findMany({
    where: { status: ServiceStatus.OPEN },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    tableId: r.tableId,
    type: r.type,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));
}

export function serviceTypeLabelFr(type: ServiceRequestType): string {
  switch (type) {
    case "WAITER":
      return "Serveur";
    case "WATER":
      return "Eau";
    case "BILL":
      return "Addition";
    case "OTHER":
      return "Autre";
    default:
      return type;
  }
}
