import { AxiosResponse } from 'axios';
import HTTPService from './HTTPService';

interface WeatherData {
    id: number;
    name: string;
    weather: {
        main: {
            temp: number;
        };
        description: string;
    };
    main: {
        temp: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
    sys: {
        country: string;
    };
}

interface ForecastData {
    list: Array<{
        dt: number;
        main: {
            temp: number;
            humidity: number;
        };
        weather: Array<{
            description: string;
        }>;
        wind: {
            speed: number;
        };
    }>;
}

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class HTTPWeather {
    private httpService: HTTPService;

    constructor() {
        this.httpService = new HTTPService(BASE_URL);
    }

    public getWeatherByCityName(
        cityName: string,
    ): Promise<AxiosResponse<WeatherData>> {
        return this.httpService.get<WeatherData>(
            `/weather?q=${cityName}&appid=${API_KEY}&units=metric`,
        );
    }

    public getWeatherByCityId(
        cityId: number,
    ): Promise<AxiosResponse<WeatherData>> {
        return this.httpService.get<WeatherData>(
            `/weather?id=${cityId}&appid=${API_KEY}&units=metric`,
        );
    }

    public getHourlyForecast(
        cityId: number,
    ): Promise<AxiosResponse<ForecastData>> {
        return this.httpService.get<ForecastData>(
            `/forecast?id=${cityId}&appid=${API_KEY}&units=metric`,
        );
    }
}

export default HTTPWeather;
