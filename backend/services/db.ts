export interface Batch {
  batchId: string;
  productName: string;
  line: string;
  status: "Released" | "Pending" | "Rejected" | "In Progress";
  quantity: number;
  unit: string;
  startDate: string;
  endDate: string;
}

export interface Equipment {
  equipmentId: string;
  name: string;
  type: string;
  status: "Running" | "Idle" | "Maintenance" | "Offline";
  utilizationRate: number;
  line: string;
}

export interface ProductionPlan {
  planId: string;
  productName: string;
  line: string;
  plannedQuantity: number;
  actualQuantity: number;
  plannedDate: string;
  status: "Completed" | "In Progress" | "Delayed" | "Pending";
}

export interface Order {
  orderId: string;
  productName: string;
  quantity: number;
  dueDate: string;
  fulfillmentStatus: "Fulfilled" | "Partial" | "Pending";
  line: string;
}

const mockBatchData: Batch[] = [
  { batchId: "B001", productName: "Aspirin 100mg", line: "Line A", status: "Released", quantity: 50000, unit: "tablets", startDate: "2026-02-15", endDate: "2026-02-17" },
  { batchId: "B002", productName: "Ibuprofen 200mg", line: "Line A", status: "Released", quantity: 45000, unit: "tablets", startDate: "2026-02-17", endDate: "2026-02-19" },
  { batchId: "B003", productName: "Paracetamol 500mg", line: "Line B", status: "In Progress", quantity: 60000, unit: "tablets", startDate: "2026-02-20", endDate: "2026-02-22" },
  { batchId: "B004", productName: "Amoxicillin 250mg", line: "Line B", status: "Pending", quantity: 30000, unit: "capsules", startDate: "2026-02-22", endDate: "2026-02-24" },
  { batchId: "B005", productName: "Metformin 500mg", line: "Line A", status: "Released", quantity: 40000, unit: "tablets", startDate: "2026-02-19", endDate: "2026-02-21" },
  { batchId: "B006", productName: "Atorvastatin 20mg", line: "Line C", status: "Rejected", quantity: 35000, unit: "tablets", startDate: "2026-02-18", endDate: "2026-02-20" },
  { batchId: "B007", productName: "Omeprazole 20mg", line: "Line C", status: "Released", quantity: 25000, unit: "capsules", startDate: "2026-02-20", endDate: "2026-02-22" },
  { batchId: "B008", productName: "Lisinopril 10mg", line: "Line B", status: "In Progress", quantity: 50000, unit: "tablets", startDate: "2026-02-21", endDate: "2026-02-23" },
];

const mockEquipmentData: Equipment[] = [
  { equipmentId: "EQ001", name: "Tablet Press A1", type: "Tablet Press", status: "Running", utilizationRate: 92, line: "Line A" },
  { equipmentId: "EQ002", name: "Coating Machine A1", type: "Coater", status: "Running", utilizationRate: 85, line: "Line A" },
  { equipmentId: "EQ003", name: "Blister Machine A2", type: "Blister", status: "Idle", utilizationRate: 45, line: "Line A" },
  { equipmentId: "EQ004", name: "Capsule Filler B1", type: "Capsule Filler", status: "Running", utilizationRate: 88, line: "Line B" },
  { equipmentId: "EQ005", name: "Tablet Press B2", type: "Tablet Press", status: "Maintenance", utilizationRate: 30, line: "Line B" },
  { equipmentId: "EQ006", name: "Packaging Line C1", type: "Packaging", status: "Running", utilizationRate: 95, line: "Line C" },
  { equipmentId: "EQ007", name: "Metal Detector C2", type: "Detector", status: "Offline", utilizationRate: 0, line: "Line C" },
  { equipmentId: "EQ008", name: "Vision Inspector A3", type: "Inspector", status: "Running", utilizationRate: 78, line: "Line A" },
];

const mockProductionPlanData: ProductionPlan[] = [
  { planId: "P001", productName: "Aspirin 100mg", line: "Line A", plannedQuantity: 50000, actualQuantity: 50000, plannedDate: "2026-02-15", status: "Completed" },
  { planId: "P002", productName: "Ibuprofen 200mg", line: "Line A", plannedQuantity: 45000, actualQuantity: 45000, plannedDate: "2026-02-17", status: "Completed" },
  { planId: "P003", productName: "Paracetamol 500mg", line: "Line B", plannedQuantity: 60000, actualQuantity: 58000, plannedDate: "2026-02-20", status: "In Progress" },
  { planId: "P004", productName: "Amoxicillin 250mg", line: "Line B", plannedQuantity: 30000, actualQuantity: 0, plannedDate: "2026-02-22", status: "Pending" },
  { planId: "P005", productName: "Metformin 500mg", line: "Line A", plannedQuantity: 40000, actualQuantity: 40000, plannedDate: "2026-02-19", status: "Completed" },
  { planId: "P006", productName: "Atorvastatin 20mg", line: "Line C", plannedQuantity: 40000, actualQuantity: 35000, plannedDate: "2026-02-18", status: "Delayed" },
  { planId: "P007", productName: "Omeprazole 20mg", line: "Line C", plannedQuantity: 25000, actualQuantity: 25000, plannedDate: "2026-02-20", status: "Completed" },
  { planId: "P008", productName: "Lisinopril 10mg", line: "Line B", plannedQuantity: 50000, actualQuantity: 42000, plannedDate: "2026-02-21", status: "In Progress" },
];

const mockOrderData: Order[] = [
  { orderId: "ORD001", productName: "Aspirin 100mg", quantity: 50000, dueDate: "2026-02-20", fulfillmentStatus: "Fulfilled", line: "Line A" },
  { orderId: "ORD002", productName: "Ibuprofen 200mg", quantity: 40000, dueDate: "2026-02-22", fulfillmentStatus: "Fulfilled", line: "Line A" },
  { orderId: "ORD003", productName: "Paracetamol 500mg", quantity: 60000, dueDate: "2026-02-25", fulfillmentStatus: "Partial", line: "Line B" },
  { orderId: "ORD004", productName: "Amoxicillin 250mg", quantity: 30000, dueDate: "2026-02-28", fulfillmentStatus: "Pending", line: "Line B" },
  { orderId: "ORD005", productName: "Metformin 500mg", quantity: 35000, dueDate: "2026-02-23", fulfillmentStatus: "Fulfilled", line: "Line A" },
  { orderId: "ORD006", productName: "Atorvastatin 20mg", quantity: 40000, dueDate: "2026-02-24", fulfillmentStatus: "Partial", line: "Line C" },
  { orderId: "ORD007", productName: "Omeprazole 20mg", quantity: 25000, dueDate: "2026-02-26", fulfillmentStatus: "Fulfilled", line: "Line C" },
  { orderId: "ORD008", productName: "Lisinopril 10mg", quantity: 50000, dueDate: "2026-02-27", fulfillmentStatus: "Pending", line: "Line B" },
];

export function queryBatchData(): Batch[] {
  return mockBatchData;
}

export function queryEquipmentData(): Equipment[] {
  return mockEquipmentData;
}

export function queryProductionPlanData(): ProductionPlan[] {
  return mockProductionPlanData;
}

export function queryOrderData(): Order[] {
  return mockOrderData;
}

export function queryDataByType(type: string): unknown[] {
  switch (type) {
    case "batch":
      return queryBatchData();
    case "equipment":
      return queryEquipmentData();
    case "plan":
      return queryProductionPlanData();
    case "order":
      return queryOrderData();
    default:
      return queryBatchData();
  }
}

export function determineDataType(question: string): string {
  const lower = question.toLowerCase();
  if (lower.includes("batch") || lower.includes("release") || lower.includes("released")) {
    return "batch";
  }
  if (lower.includes("equipment") || lower.includes("utilization") || lower.includes("machine")) {
    return "equipment";
  }
  if (lower.includes("plan") || lower.includes("planned") || lower.includes("actual")) {
    return "plan";
  }
  if (lower.includes("order") || lower.includes("fulfillment") || lower.includes("fulfill")) {
    return "order";
  }
  return "batch";
}
