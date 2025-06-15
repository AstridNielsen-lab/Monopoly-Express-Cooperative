import React from 'react';
import { Button } from './ui/Button';
import { Navigation, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface WazeStop {
  latitude: number;
  longitude: number;
  address: string;
  description?: string;
}

interface WazeIntegrationProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  variant?: 'navigate' | 'search' | 'show' | 'multi_stop';
  buttonText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  // Para navegação com múltiplas paradas
  currentLocation?: { latitude: number; longitude: number };
  pickupStop?: WazeStop;
  deliveryStop?: WazeStop;
}

const WazeIntegration: React.FC<WazeIntegrationProps> = ({
  latitude,
  longitude,
  address,
  variant = 'navigate',
  buttonText,
  className = '',
  size = 'md',
  currentLocation,
  pickupStop,
  deliveryStop
}) => {
  const generateWazeUrl = () => {
    const baseUrl = 'https://waze.com/ul';
    const params = new URLSearchParams();
    
    // Adicionar utm_source para identificar nossa aplicação
    params.append('utm_source', 'monopoly_express');
    
    switch (variant) {
      case 'multi_stop':
        // Para múltiplas paradas: criar uma rota com coleta → entrega
        if (pickupStop && deliveryStop) {
          // Usar o endereço de coleta como ponto de partida
          params.append('ll', `${pickupStop.latitude},${pickupStop.longitude}`);
          params.append('navigate', 'yes');
          
          // Adicionar informações adicionais nos comentários da URL
          const routeInfo = {
            from: pickupStop.address,
            to: deliveryStop.address,
            pickup_coords: `${pickupStop.latitude},${pickupStop.longitude}`,
            delivery_coords: `${deliveryStop.latitude},${deliveryStop.longitude}`
          };
          
          // Encode route info as URL fragment para referência
          const routeHash = btoa(JSON.stringify(routeInfo));
          return `${baseUrl}?${params.toString()}#route=${routeHash}`;
        }
        break;
        
      case 'navigate':
        if (latitude && longitude) {
          params.append('ll', `${latitude},${longitude}`);
          params.append('navigate', 'yes');
        } else if (address) {
          params.append('q', encodeURIComponent(address));
          params.append('navigate', 'yes');
        }
        break;
        
      case 'search':
        if (address) {
          params.append('q', encodeURIComponent(address));
        } else if (latitude && longitude) {
          params.append('ll', `${latitude},${longitude}`);
        }
        break;
        
      case 'show':
        if (latitude && longitude) {
          params.append('ll', `${latitude},${longitude}`);
          params.append('z', '17'); // Zoom level
        } else if (address) {
          params.append('q', encodeURIComponent(address));
        }
        break;
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const openWaze = () => {
    const wazeUrl = generateWazeUrl();
    
    if (!wazeUrl.includes('ll=') && !wazeUrl.includes('q=')) {
      toast.error('Endereço ou coordenadas necessários para abrir o Waze');
      return;
    }
    
    try {
      // Tentar abrir o app Waze diretamente (se instalado)
      const wazeAppUrl = wazeUrl.replace('https://waze.com/ul', 'waze://');
      
      // Verificar se está em um dispositivo móvel
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Tentar abrir o app primeiro, depois fallback para web
        const tempLink = document.createElement('a');
        tempLink.href = wazeAppUrl;
        tempLink.click();
        
        // Fallback para versão web após um pequeno delay
        setTimeout(() => {
          window.open(wazeUrl, '_blank');
        }, 100);
      } else {
        // Desktop: abrir versão web diretamente
        window.open(wazeUrl, '_blank');
      }
      
      toast.success('Abrindo Waze...');
    } catch (error) {
      console.error('Erro ao abrir Waze:', error);
      toast.error('Erro ao abrir o Waze');
    }
  };

  const getButtonText = () => {
    if (buttonText) return buttonText;
    
    switch (variant) {
      case 'navigate':
        return 'Navegar no Waze';
      case 'search':
        return 'Buscar no Waze';
      case 'show':
        return 'Ver no Waze';
      default:
        return 'Abrir Waze';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  };

  return (
    <Button
      onClick={openWaze}
      variant="outline"
      size={size}
      className={`flex items-center space-x-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 ${className}`}
    >
      <Navigation className={getIconSize()} />
      <span>{getButtonText()}</span>
      <ExternalLink className="w-3 h-3" />
    </Button>
  );
};

export default WazeIntegration;

