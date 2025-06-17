// API Health Check para Vercel
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0',
    environment: 'production',
    features: {
      bicycleOptionalCNH: true,
      centralDeliveryQueue: true,
      smartValidation: true,
      concurrencyHandling: true
    }
  });
}

