export interface Coord {
  lat: number;
  lon: number;
}


export interface WeatherData {
  coord: Coord;
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
    
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  visibility: number;
  alerts?: {
    event: string;
    description: string;
    start: number;
    end: number;
  }[];
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: {
      main: string;
      
    }[];
    wind: {
      speed: number;
    };
    pop: number;
  }[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';