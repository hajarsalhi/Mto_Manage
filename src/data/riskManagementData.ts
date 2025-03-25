
export const mtoData = {
  remitly: {
    name: "Remitly",
    currency: "EUR",
    balance: 326709.94,
    currentRisk: 50000,
    maxRisk: 50000, // Just the risk value
    threshold: 25000,
    isBlocked: false
  },
  westernunion: {
    name: "Western Union",
    currency: "USD",
    balance: 125780.45,
    currentRisk: 50000,
    maxRisk: 50000, // Just the risk value
    threshold: 25000,
    isBlocked: false
  },
  moneygram: {
    name: "MoneyGram",
    currency: "EUR",
    balance: 87650.20,
    currentRisk: 35000,
    maxRisk: 35000, // Just the risk value
    threshold: 20000,
    isBlocked: false
  },
  ria: {
    name: "Ria Money Transfer",
    currency: "EUR",
    balance: -1240.75,
    currentRisk: 20000,
    maxRisk: 20000, // Just the risk value
    threshold: 10000,
    isBlocked: false // Not blocked since maxRisk > 0
  }
};

export const riskHistoryData = {
  remitly: [
    {
      id: 1,
      value: 50000,
      currency: "EUR",
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-04-15'),
      isActive: false,
      createdBy: "John Doe",
      createdAt: new Date('2024-03-15')
    },
    {
      id: 2,
      value: 75000,
      currency: "EUR",
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-05-15'),
      isActive: false,
      createdBy: "Jane Smith",
      createdAt: new Date('2024-04-15')
    },
    {
      id: 3,
      value: 50000,
      currency: "EUR",
      startDate: new Date('2024-05-15'),
      endDate: null,
      isActive: true,
      createdBy: "Mike Johnson",
      createdAt: new Date('2024-05-15')
    }
  ],
  westernunion: [
    {
      id: 1,
      value: 40000,
      currency: "USD",
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-03-10'),
      isActive: false,
      createdBy: "Sarah Wilson",
      createdAt: new Date('2024-02-10')
    },
    {
      id: 2,
      value: 50000,
      currency: "USD",
      startDate: new Date('2024-03-10'),
      endDate: null,
      isActive: true,
      createdBy: "Robert Brown",
      createdAt: new Date('2024-03-10')
    }
  ],
  moneygram: [
    {
      id: 1,
      value: 30000,
      currency: "EUR",
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-03-20'),
      isActive: false,
      createdBy: "Emily Davis",
      createdAt: new Date('2024-01-20')
    },
    {
      id: 2,
      value: 35000,
      currency: "EUR",
      startDate: new Date('2024-03-20'),
      endDate: null,
      isActive: true,
      createdBy: "Daniel Taylor",
      createdAt: new Date('2024-03-20')
    }
  ],
  ria: [
    {
      id: 1,
      value: 15000,
      currency: "EUR",
      startDate: new Date('2024-02-05'),
      endDate: new Date('2024-04-05'),
      isActive: false,
      createdBy: "Anna Martinez",
      createdAt: new Date('2024-02-05')
    },
    {
      id: 2,
      value: 20000,
      currency: "EUR",
      startDate: new Date('2024-04-05'),
      endDate: null,
      isActive: true,
      createdBy: "Thomas Garcia",
      createdAt: new Date('2024-04-05')
    }
  ]
};
