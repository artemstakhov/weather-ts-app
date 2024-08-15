import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import HTTPWeather from '../../services/HTTPWeather';
import { LocalStorageService } from '../../services/LocalStorageService';
import { CitiesState, CityWeather, City } from '../../types/cityTypes';
import { RootState } from '../store';

const initialState: CitiesState = {
    cities: [],
    isLoading: false,
};

const httpWeather = new HTTPWeather();

export const fetchWeatherByCityName = createAsyncThunk<
    CityWeather,
    string,
    { rejectValue: string }
>('cities/fetchWeatherByCityName', async (cityName, { rejectWithValue }) => {
    const localStorageKey = `weather_${cityName.toLowerCase()}`;
    const maxAge = 4 * 60 * 60 * 1000;

    const cachedData = LocalStorageService.load<CityWeather>(
        localStorageKey,
        maxAge,
    );

    if (cachedData) {
        return { id: cachedData.id, name: cityName, weather: cachedData };
    }

    try {
        const response = await httpWeather.getWeatherByCityName(cityName);
        const weatherData = response.data as CityWeather;

        LocalStorageService.save(localStorageKey, weatherData);

        return { id: weatherData.id, name: cityName, weather: weatherData };
    } catch {
        return rejectWithValue('Failed to fetch weather data');
    }
});

export const loadCitiesFromLocalStorage = createAsyncThunk<CityWeather[], void>(
    'cities/loadCitiesFromLocalStorage',
    async () => {
        const cities: CityWeather[] = [];

        for (const key in localStorage) {
            if (key.startsWith('weather_')) {
                const cityName = key.replace('weather_', '');
                const maxAge = 4 * 60 * 60 * 1000;
                const cityData = LocalStorageService.load<CityWeather>(
                    key,
                    maxAge,
                );
                if (cityData) {
                    cities.push({
                        id: cityData.id,
                        name: cityName,
                        weather: cityData,
                    });
                }
            }
        }

        return cities;
    },
);

export const citiesSlice = createSlice({
    name: 'cities',
    initialState,
    reducers: {
        addCity(state, action: PayloadAction<CityWeather>) {
            state.cities.push(action.payload);
            LocalStorageService.save(
                `weather_${action.payload.name.toLowerCase()}`,
                action.payload.weather,
            );
        },
        removeCity(state, action: PayloadAction<number>) {
            const city = state.cities.find(
                (city) => city.id === action.payload,
            );
            if (city) {
                localStorage.removeItem(`weather_${city.name.toLowerCase()}`);
            }
            state.cities = state.cities.filter(
                (city) => city.id !== action.payload,
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeatherByCityName.pending, (state) => {
                toast.dismiss();
                toast.loading('Loading forecast...');
                state.isLoading = true;
            })
            .addCase(fetchWeatherByCityName.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.cities.findIndex(
                    (city) => city.id === action.payload.id,
                );
                if (index !== -1) {
                    state.cities[index] = action.payload;
                } else {
                    state.cities.push(action.payload);
                }
                toast.dismiss();
                toast.success('The forecast is successfully loaded.', {
                    isLoading: false,
                    autoClose: 2000,
                });
            })
            .addCase(fetchWeatherByCityName.rejected, (state) => {
                state.isLoading = false;
                toast.dismiss();
                toast.error('Failed to load the forecast. Please try again.', {
                    isLoading: false,
                    autoClose: 2000,
                });
            })
            .addCase(loadCitiesFromLocalStorage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadCitiesFromLocalStorage.fulfilled, (state, action) => {
                state.cities = action.payload;
                state.isLoading = false;
            })
            .addCase(loadCitiesFromLocalStorage.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { addCity, removeCity } = citiesSlice.actions;

export const selectCities = (state: RootState): City[] => state.cities.cities;

export default citiesSlice.reducer;
