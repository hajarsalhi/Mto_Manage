export interface TresoProduct {
  productId: number;
  productName: string;
  productMethod: string;
  active: number;
  facilite: number;
  movingAvg: number;
  deblock: boolean;
  maWarning: number;
  maBlock: number;
  productDeviseFx: string;
  decote: number;
  libDecote: string;
  notif: string;
  dateNotif: string; // LocalTime in Java, string in TypeScript
  email: string;
  updatedBy: string;
  sftpServer: string;
  sftpPort: number;
  sftpUsername: string;
  sftpPassword: string;
  fileNameSuffix: string;
  fileNamePrefix: string;
  localDirectoryName: string;
  remoteDirectoryName: string;
  useClientCertificate: boolean;
  sendReconciliationFile: boolean;
  emailReconciliation: string;
  applyDay: number;
  applyHour: string; // LocalTime in Java, string in TypeScript
  faciliteTemp: number;
  dateFaciliteTemp: string; // LocalDateTime in Java, string in TypeScript
  blocked: boolean;
  balanceProductId: number;
  
  // Relationships - these will be populated when needed
  transactions?: any[]; // TresoTransactions[]
  notifications?: any[]; // TresoNotifications[]
  balances?: any[]; // TresoBalance[]
  compensations?: any[]; // TresoCompensation[]
  commissions?: any[]; // TresoCommission[]
  product?: any; // Product
  currentBalance?: any; // TresoCurrentBalance
  balanceProduct?: TresoProduct;
  relatedProducts?: TresoProduct[];
  riskValues?: any[]; // TresoRiskValue[]
}