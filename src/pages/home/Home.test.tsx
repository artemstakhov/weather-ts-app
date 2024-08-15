import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import Home from './Home';
import {
    fetchWeatherByCityName,
    loadCitiesFromLocalStorage,
} from '../../store/slices/citiesSlice';
import '@testing-library/jest-dom';

jest.mock('../../store/slices/citiesSlice');

const mockStore = configureStore([]);

describe('Home Component', () => {
    let store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        store = mockStore({
            cities: {
                cities: [
                    {
                        id: 1,
                        name: 'Kyiv',
                        weather: {
                            main: { temp: 20, humidity: 50 },
                            wind: { speed: 5 },
                            weather: [{ description: 'clear sky' }],
                        },
                    },
                ],
            },
        });
        store.dispatch = jest.fn();
    });

    test('renders Home component', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>,
        );
        expect(screen.getByText('Weather in Your Cities')).toBeInTheDocument();
    });

    test('dispatches loadCitiesFromLocalStorage on mount', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>,
        );
        expect(store.dispatch).toHaveBeenCalledWith(
            loadCitiesFromLocalStorage(),
        );
    });

    test('dispatches fetchWeatherByCityName when Add City button is clicked', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>,
        );

        fireEvent.change(screen.getByLabelText(/enter city name/i), {
            target: { value: 'Kyiv' },
        });
        fireEvent.click(screen.getByText(/Add City/i));

        expect(store.dispatch).toHaveBeenCalledWith(
            fetchWeatherByCityName('Kyiv'),
        );
    });
});
