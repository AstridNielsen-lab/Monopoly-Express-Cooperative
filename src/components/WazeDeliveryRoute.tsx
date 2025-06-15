import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Navigation, ExternalLink, MapPin, Package, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeliveryRouteProps {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  currentLocation?: { latitude: number; longitude: number };
  description?: string;
  price: number;
  className?: string;
}

const WazeDeliveryRoute: React.FC<DeliveryRouteProps> = ({
  pickupAddress,
  pickupLatitude,
  pickupLongitude,
  deliveryAddress,
  deliveryLatitude,
  deliveryLongitude,
  currentLocation,
  description,
  price,
  className = ''
}) => {
  const [showRouteInfo, setShowRouteInfo] = useState(false);

  const generateCompleteRouteUrl = () => {
    const baseUrl = 'https://waze.com/ul';
    const params = new URLSearchParams();
    
    // Adicionar utm_source para identificar nossa aplicação
    params.append('utm_source', 'monopoly_express_delivery_route');
    
    // Navegar primeiro para o local de coleta
    params.append('ll', `${pickupLatitude},${pickupLongitude}`);
    params.append('navigate', 'yes');
    
    return `${baseUrl}?${params.toString()}`;
  };

  const generateDeliveryUrl = () => {
    const baseUrl = 'https://waze.com/ul';
    const params = new URLSearchParams();
    
    params.append('utm_source', 'monopoly_express_delivery_final');
    params.append('ll', `${deliveryLatitude},${deliveryLongitude}`);
    params.append('navigate', 'yes');
    
    return `${baseUrl}?${params.toString()}`;
  };

  const openCompleteRoute = () => {
    const pickupUrl = generateCompleteRouteUrl();
    const deliveryUrl = generateDeliveryUrl();
    
    try {
      // Verificar se está em um dispositivo móvel
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Abrir primeiro o local de coleta
        const tempLink1 = document.createElement('a');
        tempLink1.href = pickupUrl.replace('https://waze.com/ul', 'waze://');
        tempLink1.click();
        
        // Fallback para web
        setTimeout(() => {
          window.open(pickupUrl, '_blank');
        }, 100);
      } else {
        // Desktop: abrir versão web
        window.open(pickupUrl, '_blank');
      }
      
      // Mostrar informações da rota
      setShowRouteInfo(true);
      
      toast.success('Rota aberta no Waze! Primeiro vá para a coleta.');
      
      // Opcional: abrir também a URL de entrega em uma nova aba para referência
      setTimeout(() => {
        if (confirm('Deseja abrir também o endereço de entrega em outra aba para referência?')) {
          window.open(deliveryUrl, '_blank');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao abrir rota no Waze:', error);
      toast.error('Erro ao abrir rota no Waze');
    }
  };

  const copyRouteInfo = () => {
    const routeInfo = `
📦 ROTA DE ENTREGA - Monopoly Express

📍 COLETA:
${pickupAddress}
Coords: ${pickupLatitude}, ${pickupLongitude}

🏠 ENTREGA:
${deliveryAddress}
Coords: ${deliveryLatitude}, ${deliveryLongitude}

📦 ITEM: ${description || 'N/A'}
💰 VALOR: R$ ${price.toFixed(2)}

🗺️ WAZE COLETA: ${generateCompleteRouteUrl()}
🗺️ WAZE ENTREGA: ${generateDeliveryUrl()}
    `;
    
    navigator.clipboard.writeText(routeInfo).then(() => {
      toast.success('Informações da rota copiadas!');
    }).catch(() => {
      toast.error('Erro ao copiar informações');
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Botão principal */}
      <Button
        onClick={openCompleteRoute}
        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
        size="lg"
      >
        <Navigation className="w-5 h-5" />
        <span>Iniciar Rota Completa no Waze</span>
        <ExternalLink className="w-4 h-4" />
      </Button>

      {/* Informações da rota */}
      {showRouteInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-blue-900 flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Rota de Entrega</span>
            </h4>
            <button
              onClick={() => setShowRouteInfo(false)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">1º COLETA:</p>
                <p className="text-gray-700">{pickupAddress}</p>
                <p className="text-xs text-gray-500">Coords: {pickupLatitude}, {pickupLongitude}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">2º ENTREGA:</p>
                <p className="text-gray-700">{deliveryAddress}</p>
                <p className="text-xs text-gray-500">Coords: {deliveryLatitude}, {deliveryLongitude}</p>
              </div>
            </div>
            
            {description && (
              <div className="flex items-start space-x-2">
                <Package className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Item:</p>
                  <p className="text-gray-700">{description}</p>
                </div>
              </div>
            )}
            
            <div className="pt-2 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-700">Valor: R$ {price.toFixed(2)}</span>
                <Button
                  onClick={copyRouteInfo}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Copiar Info
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={() => window.open(generateCompleteRouteUrl(), '_blank')}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Waze Coleta
            </Button>
            <Button
              onClick={() => window.open(generateDeliveryUrl(), '_blank')}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Waze Entrega
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WazeDeliveryRoute;

