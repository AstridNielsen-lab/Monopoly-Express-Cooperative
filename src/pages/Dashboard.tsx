import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardStats, DeliveryRequest, User, Motoboy } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { 
  Users, 
  Truck, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Star,
  MapPin,
  LogOut,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_motoboys: 0,
    total_deliveries: 0,
    pending_deliveries: 0,
    completed_deliveries: 0,
    total_revenue: 0,
    active_motoboys: 0
  });
  
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'deliveries' | 'users' | 'motoboys'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulação de dados - aqui você faria as consultas reais
      
      // Estatísticas
      const mockStats: DashboardStats = {
        total_users: 1247,
        total_motoboys: 89,
        total_deliveries: 3421,
        pending_deliveries: 23,
        completed_deliveries: 3398,
        total_revenue: 45670.80,
        active_motoboys: 34
      };
      setStats(mockStats);

      // Entregas recentes
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
          status: 'in_progress',
          motoboy_id: 'moto1',
          created_at: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
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
          status: 'completed',
          motoboy_id: 'moto2',
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1h atrás
          updated_at: new Date(Date.now() - 300000).toISOString(),
          completed_at: new Date(Date.now() - 300000).toISOString()
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
          created_at: new Date(Date.now() - 600000).toISOString(), // 10 min atrás
          updated_at: new Date().toISOString()
        }
      ];
      setDeliveries(mockDeliveries);

      // Usuários
      const mockUsers: User[] = [
        {
          id: 'user1',
          email: 'cliente1@email.com',
          name: 'João Silva',
          phone: '(11) 99999-1111',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'user2',
          email: 'cliente2@email.com',
          name: 'Maria Santos',
          phone: '(11) 99999-2222',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setUsers(mockUsers);

      // Motoboys
      const mockMotoboys: Motoboy[] = [
        {
          id: 'moto1',
          email: 'motoboy1@email.com',
          name: 'Carlos Oliveira',
          phone: '(11) 98888-1111',
          cpf: '123.456.789-01',
          cnh: '12345678901',
          vehicle_type: 'moto',
          vehicle_plate: 'ABC-1234',
          is_active: true,
          rating: 4.8,
          total_deliveries: 156,
          latitude: -23.550520,
          longitude: -46.633308,
          created_at: new Date(Date.now() - 604800000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'moto2',
          email: 'motoboy2@email.com',
          name: 'Ana Costa',
          phone: '(11) 98888-2222',
          cpf: '987.654.321-02',
          cnh: '98765432109',
          vehicle_type: 'moto',
          vehicle_plate: 'XYZ-5678',
          is_active: false,
          rating: 4.6,
          total_deliveries: 89,
          created_at: new Date(Date.now() - 1209600000).toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setMotoboys(mockMotoboys);
      
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'accepted': return 'Aceita';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.delivery_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMotoboys = motoboys.filter(motoboy =>
    motoboy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motoboy.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard Administrativo</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadDashboardData}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw className="w-5 h-5" />
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
              { id: 'deliveries', label: 'Entregas', icon: Package },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'motoboys', label: 'Motoboys', icon: Truck }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total_users.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Motoboys</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total_motoboys}</p>
                    <p className="text-sm text-green-600">{stats.active_motoboys} ativos</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total de Entregas</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total_deliveries.toLocaleString()}</p>
                    <p className="text-sm text-yellow-600">{stats.pending_deliveries} pendentes</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Deliveries */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Entregas Recentes</h3>
                <div className="space-y-4">
                  {deliveries.slice(0, 5).map(delivery => (
                    <div key={delivery.id} className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {delivery.pickup_address.split(' - ')[0]}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(delivery.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(delivery.price)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {getStatusText(delivery.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Motoboys */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Melhores Motoboys</h3>
                <div className="space-y-4">
                  {motoboys
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
                    .map(motoboy => (
                      <div key={motoboy.id} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{motoboy.name}</p>
                          <p className="text-xs text-gray-500">{motoboy.total_deliveries} entregas</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900">
                              {motoboy.rating.toFixed(1)}
                            </span>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            motoboy.is_active ? 'bg-green-400' : 'bg-gray-300'
                          }`} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === 'deliveries' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por endereço ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">Todos os status</option>
                    <option value="pending">Pendente</option>
                    <option value="accepted">Aceita</option>
                    <option value="in_progress">Em andamento</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Deliveries List */}
            <div className="space-y-4">
              {filteredDeliveries.map(delivery => (
                <Card key={delivery.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                          {getStatusText(delivery.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ID: {delivery.id}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Coleta</p>
                              <p className="text-sm text-gray-600">{delivery.pickup_address}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Entrega</p>
                              <p className="text-sm text-gray-600">{delivery.delivery_address}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Descrição</p>
                            <p className="text-sm text-gray-600">{delivery.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Distância</p>
                              <p className="text-sm text-gray-600">{delivery.distance.toFixed(1)} km</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Valor</p>
                              <p className="text-sm text-gray-600">{formatCurrency(delivery.price)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Criado em:</span>
                            <span className="ml-2 text-gray-900">{formatDate(delivery.created_at)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Atualizado em:</span>
                            <span className="ml-2 text-gray-900">{formatDate(delivery.updated_at)}</span>
                          </div>
                          {delivery.completed_at && (
                            <div>
                              <span className="text-gray-500">Concluído em:</span>
                              <span className="ml-2 text-gray-900">{formatDate(delivery.completed_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredDeliveries.length === 0 && (
                <Card className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma entrega encontrada</p>
                  <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros de busca</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search */}
            <Card className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar usuários por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </Card>

            {/* Users List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <Card key={user.id} className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Telefone:</span>
                      <span className="text-sm text-gray-900">{user.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Membro desde:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {filteredUsers.length === 0 && (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum usuário encontrado</p>
                <p className="text-sm text-gray-400 mt-1">Tente ajustar o termo de busca</p>
              </Card>
            )}
          </div>
        )}

        {/* Motoboys Tab */}
        {activeTab === 'motoboys' && (
          <div className="space-y-6">
            {/* Search */}
            <Card className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar motoboys por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </Card>

            {/* Motoboys List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMotoboys.map(motoboy => (
                <Card key={motoboy.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Truck className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{motoboy.name}</h3>
                        <p className="text-sm text-gray-500">{motoboy.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{motoboy.rating.toFixed(1)}</span>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        motoboy.is_active ? 'bg-green-400' : 'bg-gray-300'
                      }`} title={motoboy.is_active ? 'Ativo' : 'Inativo'} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="text-sm text-gray-900">{motoboy.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Veículo</p>
                      <p className="text-sm text-gray-900 capitalize">{motoboy.vehicle_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Placa</p>
                      <p className="text-sm text-gray-900">{motoboy.vehicle_plate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Entregas</p>
                      <p className="text-sm text-gray-900">{motoboy.total_deliveries}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Membro desde:</span>
                      <span className="text-gray-900">
                        {new Date(motoboy.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {filteredMotoboys.length === 0 && (
              <Card className="p-8 text-center">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum motoboy encontrado</p>
                <p className="text-sm text-gray-400 mt-1">Tente ajustar o termo de busca</p>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

