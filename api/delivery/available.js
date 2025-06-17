// API de entregas disponíveis para Vercel
export default function handler(req, res) {
  // Mock data para demonstração das novas funcionalidades
  const mockDeliveries = [
    {
      id: '1',
      user_id: 'user1',
      pickup_address: 'Rua das Flores, 123 - Centro, São Paulo',
      pickup_latitude: -23.550520,
      pickup_longitude: -46.633308,
      delivery_address: 'Av. Paulista, 1000 - Bela Vista, São Paulo',
      delivery_latitude: -23.561414,
      delivery_longitude: -46.656166,
      description: 'Documentos importantes - urgente',
      price: 18.00,
      distance: 5.2,
      status: 'pending',
      created_at: new Date(Date.now() - 300000).toISOString(),
      updated_at: new Date().toISOString(),
      user_name: 'João Silva',
      user_phone: '(11) 99999-1111'
    },
    {
      id: '2',
      user_id: 'user2',
      pickup_address: 'Shopping Center Norte - Santana, São Paulo',
      pickup_latitude: -23.518800,
      pickup_longitude: -46.627500,
      delivery_address: 'Rua Augusta, 500 - Consolação, São Paulo',
      delivery_latitude: -23.555800,
      delivery_longitude: -46.661500,
      description: 'Compras do shopping - 2 sacolas',
      price: 25.00,
      distance: 8.1,
      status: 'pending',
      created_at: new Date(Date.now() - 600000).toISOString(),
      updated_at: new Date().toISOString(),
      user_name: 'Maria Santos',
      user_phone: '(11) 98888-2222'
    },
    {
      id: '3',
      user_id: 'user3',
      pickup_address: 'Mercado Municipal - Centro, São Paulo',
      pickup_latitude: -23.542800,
      pickup_longitude: -46.630500,
      delivery_address: 'Vila Madalena - Rua Harmonia, 200, São Paulo',
      delivery_latitude: -23.562000,
      delivery_longitude: -46.690000,
      description: 'Produtos gourmet - frágil',
      price: 22.50,
      distance: 6.8,
      status: 'pending',
      created_at: new Date(Date.now() - 120000).toISOString(),
      updated_at: new Date().toISOString(),
      user_name: 'Pedro Costa',
      user_phone: '(11) 97777-3333'
    },
    {
      id: '4',
      user_id: 'user4',
      pickup_address: 'Farmácia São Paulo - Vila Olímpia, São Paulo',
      pickup_latitude: -23.596200,
      pickup_longitude: -46.686500,
      delivery_address: 'Rua Vergueiro, 1200 - Paraíso, São Paulo',
      delivery_latitude: -23.580000,
      delivery_longitude: -46.641000,
      description: 'Medicamentos - prioridade',
      price: 15.00,
      distance: 4.1,
      status: 'pending',
      created_at: new Date(Date.now() - 180000).toISOString(),
      updated_at: new Date().toISOString(),
      user_name: 'Ana Oliveira',
      user_phone: '(11) 96666-4444'
    },
    {
      id: '5',
      user_id: 'user5',
      pickup_address: 'Rua da Consolação, 300 - Centro, São Paulo',
      pickup_latitude: -23.555000,
      pickup_longitude: -46.660000,
      delivery_address: 'Rua Oscar Freire, 800 - Jardins, São Paulo',
      delivery_latitude: -23.562200,
      delivery_longitude: -46.669800,
      description: 'Comida japonesa - quente',
      price: 12.50,
      distance: 3.2,
      status: 'pending',
      created_at: new Date(Date.now() - 90000).toISOString(),
      updated_at: new Date().toISOString(),
      user_name: 'Carlos Ferreira',
      user_phone: '(11) 95555-5555'
    }
  ];

  // Filtrar por coordenadas se fornecidas
  const { motoboyLat, motoboyLng, maxDistance = 20 } = req.query;
  
  let filteredDeliveries = mockDeliveries;
  
  if (motoboyLat && motoboyLng) {
    const motoboyCoords = {
      lat: parseFloat(motoboyLat),
      lng: parseFloat(motoboyLng)
    };
    
    // Calcular distância para cada entrega
    filteredDeliveries = mockDeliveries.map(delivery => {
      const pickupCoords = {
        lat: delivery.pickup_latitude,
        lng: delivery.pickup_longitude
      };
      
      // Fórmula haversine simplificada
      const R = 6371; // Raio da Terra em km
      const dLat = (pickupCoords.lat - motoboyCoords.lat) * Math.PI / 180;
      const dLng = (pickupCoords.lng - motoboyCoords.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(motoboyCoords.lat * Math.PI / 180) * Math.cos(pickupCoords.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distanceFromMotoboy = R * c;
      
      return {
        ...delivery,
        distanceFromMotoboy: Math.round(distanceFromMotoboy * 100) / 100,
        formattedPrice: `R$ ${delivery.price.toFixed(2)}`
      };
    }).filter(delivery => delivery.distanceFromMotoboy <= parseFloat(maxDistance));
  } else {
    filteredDeliveries = mockDeliveries.map(delivery => ({
      ...delivery,
      formattedPrice: `R$ ${delivery.price.toFixed(2)}`
    }));
  }
  
  res.status(200).json({
    deliveries: filteredDeliveries,
    total: filteredDeliveries.length,
    message: 'Fila central de entregas - todas as solicitações dos clientes disponíveis para qualquer motoboy'
  });
}

