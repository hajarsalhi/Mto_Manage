interface ProductParams {
    productId: number;
    productName: string;
    tauxCommission: number;
    prevTauxCommission : number;
    emails: string;
    active: number;
    applyHour: string;
    decote: number;
    devise: 'USD' | 'EUR';
    libDecote: string;
    productsMethod: 'Aucune' | 'Email' | 'SFTP';
    sendReconciliationReports: boolean;
    reconciliationEmails: string;
  }