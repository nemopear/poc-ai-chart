export interface RevenueData {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface ProductSales {
  product: string;
  sales: number;
  category: string;
}

export interface CustomerData {
  month: string;
  newCustomers: number;
  churnedCustomers: number;
  totalCustomers: number;
}

const mockRevenueData: RevenueData[] = [
  { month: "January", revenue: 120000, cost: 80000, profit: 40000 },
  { month: "February", revenue: 135000, cost: 85000, profit: 50000 },
  { month: "March", revenue: 150000, cost: 90000, profit: 60000 },
  { month: "April", revenue: 142000, cost: 88000, profit: 54000 },
  { month: "May", revenue: 165000, cost: 95000, profit: 70000 },
  { month: "June", revenue: 180000, cost: 100000, profit: 80000 },
  { month: "July", revenue: 195000, cost: 105000, profit: 90000 },
  { month: "August", revenue: 210000, cost: 110000, profit: 100000 },
  { month: "September", revenue: 225000, cost: 115000, profit: 110000 },
  { month: "October", revenue: 240000, cost: 120000, profit: 120000 },
  { month: "November", revenue: 280000, cost: 140000, profit: 140000 },
  { month: "December", revenue: 320000, cost: 160000, profit: 160000 },
];

const mockProductSales: ProductSales[] = [
  { product: "Widget Pro", sales: 450000, category: "Electronics" },
  { product: "Gadget Plus", sales: 380000, category: "Electronics" },
  { product: "Service Plan", sales: 250000, category: "Services" },
  { product: "Accessory Pack", sales: 180000, category: "Accessories" },
  { product: "Premium Support", sales: 150000, category: "Services" },
  { product: "Basic Package", sales: 120000, category: "Software" },
];

const mockCustomerData: CustomerData[] = [
  { month: "January", newCustomers: 120, churnedCustomers: 30, totalCustomers: 1500 },
  { month: "February", newCustomers: 145, churnedCustomers: 25, totalCustomers: 1620 },
  { month: "March", newCustomers: 160, churnedCustomers: 35, totalCustomers: 1745 },
  { month: "April", newCustomers: 138, churnedCustomers: 28, totalCustomers: 1855 },
  { month: "May", newCustomers: 175, churnedCustomers: 22, totalCustomers: 2008 },
  { month: "June", newCustomers: 190, churnedCustomers: 30, totalCustomers: 2168 },
];

export function queryRevenueData(): RevenueData[] {
  return mockRevenueData;
}

export function queryProductSales(): ProductSales[] {
  return mockProductSales;
}

export function queryCustomerData(): CustomerData[] {
  return mockCustomerData;
}

export function queryDataByType(type: string): unknown[] {
  switch (type) {
    case "revenue":
      return queryRevenueData();
    case "product":
      return queryProductSales();
    case "customer":
      return queryCustomerData();
    default:
      return [];
  }
}

export function determineDataType(question: string): string {
  const lower = question.toLowerCase();
  if (lower.includes("revenue") || lower.includes("profit") || lower.includes("cost")) {
    return "revenue";
  }
  if (lower.includes("product") || lower.includes("sale")) {
    return "product";
  }
  if (lower.includes("customer") || lower.includes("churn")) {
    return "customer";
  }
  return "revenue";
}
