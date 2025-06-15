import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation, calculateDistance } from '../hooks/useGeolocation';
import { DeliveryRequest } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import WazeIntegration from '../components/WazeIntegration';
import WazeDeliveryRoute from '../components/WazeDeliveryRoute';
import { MapPin, Navigation, Truck, DollarSign, Clock, Star, LogOut, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MotoboyApp: React.FC = () => {
  const { user, logout } = useAuth();
  const { location, error: locationError, requestLocation } = useGeolocation();
  const navigate = useNavigate();

  const [availableDeliveries, setAvailableDeliveries] = useState<DeliveryRequest[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryRequest | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'time'>('price');

  // Estatísticas do motoboy
  const [stats] = useState({
    rating: 4.8,
    totalDeliveries: 127,
    todayEarnings: 89.50,
    weeklyEarnings: 450.30
  });

  useEffect(() => {
    if (isOnline) {
      loadAvailableDeliveries();
      // Simular atualização em tempo real
      const interval = setInterval(loadAvailableDeliveries, 30000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, [isOnline]);

  const loadAvailableDeliveries = () => {
    if (!location) return;

    // Simulação de entregas disponíveis
    const mockDeliveries: DeliveryRequest[] = [
      {
        id: '1',
        user_id: 'user1',
        pickup_address: 'Rua das Flores, 123 - Centro',
        pickup_latitude: -23.550520,
        pickup_longitude: -46.633308,
        delivery_address: 'Av. Paulista, 1000 - Bela Vista',
        delivery_latitude: -23.561414,
        delivery_longitude: -46.656166,
        description: 'Documentos importantes',
        price: 18.00,
        distance: 5.2,
        status: 'pending',
        created_at: new Date(Date.now() - 300000).toISOString(), // 5 min atrás
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: 'user2',
        pickup_address: 'Shopping Center Norte - Santana',
        pickup_latitude: -23.518800,
        pickup_longitude: -46.627500,
        delivery_address: 'Rua Augusta, 500 - Consolação',
        delivery_latitude: -23.555800,
        delivery_longitude: -46.661500,
        description: 'Compras do shopping',
        price: 25.00,
        distance: 8.1,
        status: 'pending',
        created_at: new Date(Date.now() - 600000).toISOString(), // 10 min atrás
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        user_id: 'user3',
        pickup_address: 'Rua da Consolação, 300',
        pickup_latitude: -23.555000,
        pickup_longitude: -46.660000,
        delivery_address: 'Vila Madalena - Rua Harmonia, 200',
        delivery_latitude: -23.562000,
        delivery_longitude: -46.690000,
        description: 'Comida japonesa',
        price: 12.50,
        distance: 3.2,
        status: 'pending',
        created_at: new Date(Date.now() - 120000).toISOString(), // 2 min atrás
        updated_at: new Date().toISOString()
      }
    ];

    // Calcular distância do motoboy para cada entrega
    const deliveriesWithDistance = mockDeliveries.map(delivery => ({
      ...delivery,
      distanceFromMotoboy: calculateDistance(
        location.latitude,
        location.longitude,
        delivery.pickup_latitude,
        delivery.pickup_longitude
      )
    }));

    // Ordenar conforme preferência
    const sortedDeliveries = deliveriesWithDistance.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price; // Maior preço primeiro
        case 'distance':
          return (a.distanceFromMotoboy || 0) - (b.distanceFromMotoboy || 0); // Menor distância primeiro
        case 'time':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Mais recente primeiro
        default:
          return 0;
      }
    });

    setAvailableDeliveries(sortedDeliveries);
  };

  const toggleOnlineStatus = () => {
    if (!location) {
      toast.error('Ative sua localização primeiro');
      return;
    }

    setIsOnline(!isOnline);
    toast.success(isOnline ? 'Você ficou offline' : 'Você está online e pode receber entregas!');
    
    if (!isOnline) {
      loadAvailableDeliveries();
    } else {
      setAvailableDeliveries([]);
    }
  };

  const acceptDelivery = async (delivery: DeliveryRequest) => {
    setIsLoading(true);
    
    try {
      // Simulação da aceitação
      const updatedDelivery = {
        ...delivery,
        status: 'accepted' as const,
        motoboy_id: user?.id,
        updated_at: new Date().toISOString()
      };
      
      setActiveDelivery(updatedDelivery);
      setAvailableDeliveries(prev => prev.filter(d => d.id !== delivery.id));
      setIsOnline(false); // Fica offline quando aceita uma entrega
      
      toast.success('Entrega aceita! Dirija-se ao local de coleta.');
    } catch (error) {
      toast.error('Erro ao aceitar entrega');
    } finally {
      setIsLoading(false);
    }
  };

  const startDelivery = () => {
    if (activeDelivery) {
      const updatedDelivery = {
        ...activeDelivery,
        status: 'in_progress' as const,
        updated_at: new Date().toISOString()
      };
      setActiveDelivery(updatedDelivery);
      toast.success('Entrega iniciada!');
    }
  };

  const completeDelivery = () => {
    if (activeDelivery) {
      const updatedDelivery = {
        ...activeDelivery,
        status: 'completed' as const,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Simular atualização dos ganhos
      toast.success(`Entrega concluída! Você ganhou R$ ${activeDelivery.price.toFixed(2)}`);
      setActiveDelivery(null);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aceita - Ir para coleta';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Motoboy</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status Online/Offline */}
              <button
                onClick={toggleOnlineStatus}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isOnline
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full inline-block mr-2 ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                {isOnline ? 'Online' : 'Offline'}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">{stats.rating}</div>
            <div className="text-sm text-gray-500">Avaliação</div>
          </Card>
          <Card className="p-4 text-center">
            <Truck className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">{stats.totalDeliveries}</div>
            <div className="text-sm text-gray-500">Entregas</div>
          </Card>
          <Card className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">R$ {stats.todayEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Hoje</div>
          </Card>
          <Card className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-lg font-semibold text-gray-900">R$ {stats.weeklyEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Semana</div>
          </Card>
        </div>

        {/* Localização */}
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Navigation className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-medium text-gray-900">Sua localização</h3>
                {location ? (
                  <p className="text-sm text-gray-500">
                    Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-red-500">Localização não detectada</p>
                )}
              </div>
            </div>
            {!location && (
              <Button onClick={requestLocation} size="sm">
                Ativar GPS
              </Button>
            )}
          </div>
          {locationError && (
            <p className="text-sm text-red-500 mt-2">{locationError}</p>
          )}
        </Card>

        {/* Entrega Ativa */}
        {activeDelivery && (
          <Card className="mb-6 p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Entrega Ativa</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeDelivery.status)}`}>
                {getStatusText(activeDelivery.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Coleta</p>
                  <p className="text-sm text-gray-600">{activeDelivery.pickup_address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Entrega</p>
                  <p className="text-sm text-gray-600">{activeDelivery.delivery_address}</p>
                </div>
              </div>
              {activeDelivery.description && (
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Item</p>
                    <p className="text-sm text-gray-600">{activeDelivery.description}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-lg font-semibold text-gray-900">
                  R$ {activeDelivery.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {activeDelivery.distance.toFixed(1)} km
                </div>
              </div>
            </div>

            {/* Rota Completa no Waze */}
            {activeDelivery.status === 'accepted' && (
              <div className="mt-4">
                <WazeDeliveryRoute
                  pickupAddress={activeDelivery.pickup_address}
                  pickupLatitude={activeDelivery.pickup_latitude}
                  pickupLongitude={activeDelivery.pickup_longitude}
                  deliveryAddress={activeDelivery.delivery_address}
                  deliveryLatitude={activeDelivery.delivery_latitude}
                  deliveryLongitude={activeDelivery.delivery_longitude}
                  description={activeDelivery.description}
                  price={activeDelivery.price}
                  currentLocation={location || undefined}
                />
              </div>
            )}
            
            {/* Navegação Individual quando em andamento */}
            {activeDelivery.status === 'in_progress' && (
              <div className="flex space-x-2 mt-4">
                <WazeIntegration
                  latitude={activeDelivery.pickup_latitude}
                  longitude={activeDelivery.pickup_longitude}
                  address={activeDelivery.pickup_address}
                  variant="show"
                  buttonText="Ver Coleta"
                  size="sm"
                  className="flex-1"
                />
                <WazeIntegration
                  latitude={activeDelivery.delivery_latitude}
                  longitude={activeDelivery.delivery_longitude}
                  address={activeDelivery.delivery_address}
                  variant="navigate"
                  buttonText="Ir para Entrega"
                  size="sm"
                  className="flex-1"
                />
              </div>
            )}

            <div className="flex space-x-3 mt-3">
              {activeDelivery.status === 'accepted' && (
                <Button onClick={startDelivery} className="flex-1">
                  Iniciar Entrega
                </Button>
              )}
              {activeDelivery.status === 'in_progress' && (
                <Button onClick={completeDelivery} className="flex-1">
                  Concluir Entrega
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Fila de Entregas Disponíveis */}
        {!activeDelivery && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Entregas Disponíveis</h2>
              
              <div className="flex items-center space-x-3">
                {/* Filtros */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'distance' | 'time')}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="price">Maior preço</option>
                  <option value="distance">Mais próximo</option>
                  <option value="time">Mais recente</option>
                </select>
                
                <button
                  onClick={loadAvailableDeliveries}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isOnline ? (
              <Card className="p-8 text-center">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Você está offline</p>
                <p className="text-sm text-gray-400 mt-1">Ative o status online para ver entregas disponíveis</p>
                <Button onClick={toggleOnlineStatus} className="mt-4">
                  Ficar Online
                </Button>
              </Card>
            ) : availableDeliveries.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma entrega disponível</p>
                <p className="text-sm text-gray-400 mt-1">Novas entregas aparecerão aqui automaticamente</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {availableDeliveries.map((delivery) => (
                  <Card key={delivery.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {getTimeAgo(delivery.created_at)} atrás
                          </span>
                          {(delivery as any).distanceFromMotoboy && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">
                                {(delivery as any).distanceFromMotoboy.toFixed(1)} km de você
                              </span>
                            </>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{delivery.pickup_address}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{delivery.delivery_address}</span>
                          </div>
                          {delivery.description && (
                            <div className="flex items-start space-x-2">
                              <div className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{delivery.description}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          R$ {delivery.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          {delivery.distance.toFixed(1)} km
                        </div>
                        <Button
                          onClick={() => acceptDelivery(delivery)}
                          disabled={isLoading}
                          size="sm"
                        >
                          {isLoading ? 'Aceitando...' : 'Aceitar'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MotoboyApp;

