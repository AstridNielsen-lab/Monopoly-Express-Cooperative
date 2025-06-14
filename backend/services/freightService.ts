interface Coordinates {
  lat: number;
  lng: number;
}

interface DistanceResult {
  distance: number;
  duration: number;
  success: boolean;
  error?: string;
}

interface FreightCalculation {
  basePrice: number;
  distancePrice: number;
  totalPrice: number;
  distance: number;
  estimatedDuration: number;
}

export class FreightService {
  private static instance: FreightService;
  
  // Configurações de preço
  private readonly BASE_PRICE = 8.0; // Preço base em reais
  private readonly PRICE_PER_KM = 2.5; // Preço por quilômetro
  private readonly MIN_PRICE = 10.0; // Preço mínimo
  private readonly MAX_PRICE = 150.0; // Preço máximo
  
  // Multiplicadores por tipo de veículo
  private readonly VEHICLE_MULTIPLIERS = {
    'bicicleta': 0.8,
    'moto': 1.0,
    'carro': 1.3
  };
  
  // Multiplicadores por horário (pico/normal)
  private readonly TIME_MULTIPLIERS = {
    'normal': 1.0,
    'pico': 1.4, // 40% a mais no horário de pico
    'noturno': 1.2 // 20% a mais no período noturno
  };

  private constructor() {}

  public static getInstance(): FreightService {
    if (!FreightService.instance) {
      FreightService.instance = new FreightService();
    }
    return FreightService.instance;
  }

  /**
   * Calcula a distância entre duas coordenadas usando a API do OpenStreetMap
   */
  async calculateDistance(origin: Coordinates, destination: Coordinates): Promise<DistanceResult> {
    try {
      // Usar OSRM (Open Source Routing Machine) para cálculo de rota real
      const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
      
      const response = await fetch(osrmUrl);
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distance: route.distance / 1000, // Converter metros para quilômetros
          duration: route.duration / 60, // Converter segundos para minutos
          success: true
        };
      } else {
        // Fallback para cálculo de distância euclidiana
        return this.calculateEuclideanDistance(origin, destination);
      }
    } catch (error) {
      console.error('Erro ao calcular distância via OSRM:', error);
      // Fallback para cálculo de distância euclidiana
        return this.calculateEuclideanDistance(origin, destination);
    }
  }

  /**
   * Cálculo de distância euclidiana como fallback
   */
  private calculateEuclideanDistance(origin: Coordinates, destination: Coordinates): DistanceResult {
    const R = 6371; // Raio da Terra em quilômetros
    const dLat = this.deg2rad(destination.lat - origin.lat);
    const dLng = this.deg2rad(destination.lng - origin.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(origin.lat)) * Math.cos(this.deg2rad(destination.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Estimar duração (assumindo velocidade média de 30 km/h no trânsito urbano)
    const duration = (distance / 30) * 60; // em minutos
    
    return {
      distance,
      duration,
      success: true
    };
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Calcula o preço do frete baseado na distância e outros fatores
   */
  calculateFreight(
    distance: number,
    vehicleType: 'bicicleta' | 'moto' | 'carro' = 'moto',
    time?: Date
  ): FreightCalculation {
    // Preço base
    let basePrice = this.BASE_PRICE;
    
    // Preço por distância
    let distancePrice = distance * this.PRICE_PER_KM;
    
    // Aplicar multiplicador do veículo
    const vehicleMultiplier = this.VEHICLE_MULTIPLIERS[vehicleType] || 1.0;
    
    // Aplicar multiplicador de horário
    const timeMultiplier = this.getTimeMultiplier(time);
    
    // Calcular preço total
    let totalPrice = (basePrice + distancePrice) * vehicleMultiplier * timeMultiplier;
    
    // Aplicar limites mínimo e máximo
    totalPrice = Math.max(this.MIN_PRICE, Math.min(this.MAX_PRICE, totalPrice));
    
    // Arredondar para 2 casas decimais
    totalPrice = Math.round(totalPrice * 100) / 100;
    
    return {
      basePrice,
      distancePrice,
      totalPrice,
      distance,
      estimatedDuration: (distance / 30) * 60 // Estimativa em minutos
    };
  }

  /**
   * Determina o multiplicador baseado no horário
   */
  private getTimeMultiplier(time?: Date): number {
    if (!time) time = new Date();
    
    const hour = time.getHours();
    const dayOfWeek = time.getDay(); // 0 = domingo, 6 = sábado
    
    // Horário noturno (22h às 6h)
    if (hour >= 22 || hour <= 6) {
      return this.TIME_MULTIPLIERS.noturno;
    }
    
    // Fins de semana (multiplicador normal)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return this.TIME_MULTIPLIERS.normal;
    }
    
    // Horário de pico em dias úteis (7-9h e 17-19h)
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return this.TIME_MULTIPLIERS.pico;
    }
    
    // Horário normal
    return this.TIME_MULTIPLIERS.normal;
  }

  /**
   * Converte endereço em coordenadas usando Nominatim
   */
  async geocodeAddress(address: string): Promise<Coordinates | null> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&countrycodes=br&limit=1`;
      
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'MonopolyExpress/1.0'
        }
      });
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
      return null;
    }
  }

  /**
   * Calcula o frete completo a partir de endereços
   */
  async calculateFreightFromAddresses(
    pickupAddress: string,
    deliveryAddress: string,
    vehicleType: 'bicicleta' | 'moto' | 'carro' = 'moto',
    time?: Date
  ): Promise<FreightCalculation & { coordinates?: { pickup: Coordinates, delivery: Coordinates } }> {
    try {
      // Geocodificar endereços
      const [pickupCoords, deliveryCoords] = await Promise.all([
        this.geocodeAddress(pickupAddress),
        this.geocodeAddress(deliveryAddress)
      ]);
      
      if (!pickupCoords || !deliveryCoords) {
        throw new Error('Não foi possível encontrar as coordenadas dos endereços');
      }
      
      // Calcular distância
      const distanceResult = await this.calculateDistance(pickupCoords, deliveryCoords);
      
      if (!distanceResult.success) {
        throw new Error('Erro ao calcular distância');
      }
      
      // Calcular frete
      const freightCalculation = this.calculateFreight(distanceResult.distance, vehicleType, time);
      
      return {
        ...freightCalculation,
        estimatedDuration: distanceResult.duration,
        coordinates: {
          pickup: pickupCoords,
          delivery: deliveryCoords
        }
      };
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      throw error;
    }
  }

  /**
   * Valida se a distância está dentro dos limites aceitáveis
   */
  isValidDistance(distance: number): boolean {
    return distance >= 0.5 && distance <= 100; // Entre 500m e 100km
  }

  /**
   * Formata o preço para exibição
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }
}

