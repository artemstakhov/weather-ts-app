export interface CityWeather {
    id: number;
    name: string;
    weather: any;
}

export interface CitiesState {
    cities: CityWeather[];
    isLoading: boolean;
}

// Пример определения интерфейса City
export interface City {
    id: number;
    name: string;
    weather: {
        main: {
            temp: number;
        };
        wind: {
            speed: number;
        };
        weather: {
            description: string;
        }[];
        sys: {
            country: string;
            sunrise: number;
            sunset: number;
        };
        coord: {
            lat: number;
            lon: number;
        };
        visibility: number;
    };
}
