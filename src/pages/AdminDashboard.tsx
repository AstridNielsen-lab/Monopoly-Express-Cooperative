import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  UserCheck, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  BarChart3,
  Clock,
  DollarSign
} from 'lucide-react';
import { authService, userService, deliveryService, subscriptionService } from '../services/api';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalUsers: number;
  totalMotoboys: number;
  pendingMotoboys: number;
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

interface PendingMotoboy {
  id: string;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  cnh: string;
  vehicle_type: string;
  vehicle_plate: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMotoboys: 0,
    pendingMotoboys: 0,
    totalDeliveries: 0,
    completedDeliveries: 0,
    pendingDeliveries: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });
  const [pendingMotoboys, setPendingMotoboys] = useState<PendingMotoboy[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'motoboys' | 'subscriptions' | 'deliveries'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se o usuário é admin
  if (!user || user.user_type !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Carregar motoboys pendentes
      const pendingMotoboyData = await authService.getPendingMotoboys();
      setPendingMotoboys(pendingMotoboyData);

      // Carregar estatísticas de assinaturas
      const subscriptionData = await subscriptionService.listSubscriptions();
      
      // Simular outras estatísticas (implementar APIs específicas depois)
      setStats({
        totalUsers: 156, // Mock
        totalMotoboys: 89, // Mock
        pendingMotoboys: pendingMotoboyData.length,
        totalDeliveries: 2340, // Mock
        completedDeliveries: 2180, // Mock
        pendingDeliveries: 45, // Mock
        totalRevenue: 46780.50, // Mock
        activeSubscriptions: subscriptionData.total || 0
      });

      console.log('✅ Dados do dashboard carregados');
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const approveMotoboy = async (motoboyId: string) => {
    try {
      await authService.approveMotoboy(motoboyId);
      toast.success('Motoboy aprovado com sucesso!');
      
      // Remover da lista de pendentes
      setPendingMotoboys(prev => prev.filter(m => m.id !== motoboyId));
      
      // Atualizar estatísticas
      setStats(prev => ({
        ...prev,
        pendingMotoboys: prev.pendingMotoboys - 1,
        totalMotoboys: prev.totalMotoboys + 1
      }));
    } catch (error) {
      console.error('❌ Erro ao aprovar motoboy:', error);
      toast.error('Erro ao aprovar motoboy');
    }
  };

  const rejectMotoboy = async (motoboyId: string) => {
    try {
      await authService.rejectMotoboy(motoboyId);
      toast.success('Motoboy rejeitado');
      
      // Remover da lista de pendentes
      setPendingMotoboys(prev => prev.filter(m => m.id !== motoboyId));
      
      // Atualizar estatísticas
      setStats(prev => ({
        ...prev,
        pendingMotoboys: prev.pendingMotoboys - 1
      }));
    } catch (error) {
      console.error('❌ Erro ao rejeitar motoboy:', error);
      toast.error('Erro ao rejeitar motoboy');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    change?: string;
  }> = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1">{change}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          change="+12% este mês"
        />
        <StatCard
          title="Motoboys Ativos"
          value={stats.totalMotoboys}
          icon={<UserCheck className="h-6 w-6 text-white" />}
          color="bg-green-500"
          change="+8% este mês"
        />
        <StatCard
          title="Entregas Realizadas"
          value={stats.completedDeliveries.toLocaleString()}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          change="+15% este mês"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
          change="+23% este mês"
        />
      </div>

      {/* Alertas e ações rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={() => setSelectedTab('motoboys')}
              className="w-full flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <span className="text-orange-700 font-medium">
                {stats.pendingMotoboys} motoboys pendentes
              </span>
              <Clock className="h-5 w-5 text-orange-500" />
            </button>
            <button
              onClick={() => setSelectedTab('deliveries')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-blue-700 font-medium">
                {stats.pendingDeliveries} entregas pendentes
              </span>
              <Package className="h-5 w-5 text-blue-500" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status do Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Backend</span>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Mercado Pago</span>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Conectado</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email SMTP</span>
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">Funcionando</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assinaturas</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ativas</span>
              <span className="font-semibold text-green-600">{stats.activeSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Receita Mensal</span>
              <span className="font-semibold text-green-600">
                R$ {(stats.activeSubscriptions * 19.90).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMotoboys = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Motoboys Pendentes de Aprovação ({pendingMotoboys.length})
          </h2>
        </div>
        
        {pendingMotoboys.length === 0 ? (
          <div className="p-6 text-center">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum motoboy pendente de aprovação</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motoboy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingMotoboys.map((motoboy) => (
                  <tr key={motoboy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{motoboy.name}</div>
                        <div className="text-sm text-gray-500">{motoboy.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {motoboy.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">CPF: {motoboy.cpf}</div>
                      <div className="text-sm text-gray-500">CNH: {motoboy.cnh}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{motoboy.vehicle_type}</div>
                      <div className="text-sm text-gray-500">{motoboy.vehicle_plate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(motoboy.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => approveMotoboy(motoboy.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejectMotoboy(motoboy.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      );
    }

    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'motoboys':
        return renderMotoboys();
      case 'subscriptions':
        return <div className="p-6">Página de assinaturas em desenvolvimento...</div>;
      case 'deliveries':
        return <div className="p-6">Página de entregas em desenvolvimento...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Bem-vindo, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-800 text-sm font-medium">Administrador</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex space-x-8 mb-6">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              selectedTab === 'overview'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Visão Geral
          </button>
          <button
            onClick={() => setSelectedTab('motoboys')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              selectedTab === 'motoboys'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Motoboys
            {stats.pendingMotoboys > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {stats.pendingMotoboys}
              </span>
            )}
          </button>
          <button
            onClick={() => setSelectedTab('subscriptions')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              selectedTab === 'subscriptions'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Assinaturas
          </button>
          <button
            onClick={() => setSelectedTab('deliveries')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              selectedTab === 'deliveries'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="h-4 w-4 mr-2" />
            Entregas
          </button>
        </nav>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;

