import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import CityDetails from './CityDetails';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

describe('CityDetails Component', () => {
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
    });

    test('renders CityDetails component with correct city data', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CityDetails />
                </BrowserRouter>
            </Provider>,
        );

        // Используйте screen.debug() для отладки
        screen.debug();

        // Проверьте, что ожидаемые элементы присутствуют
        expect(screen.getByText('Kyiv')).toBeInTheDocument();
        expect(screen.getByText('Temperature: 20°C')).toBeInTheDocument();
        expect(screen.getByText('Humidity: 50%')).toBeInTheDocument();
        expect(screen.getByText('Wind Speed: 5 m/s')).toBeInTheDocument();
        expect(screen.getByText('Description: clear sky')).toBeInTheDocument();
    });

    test('shows "City not found" if city does not exist', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <CityDetails />
                </BrowserRouter>
            </Provider>,
        );

        // Используйте screen.debug() для отладки
        screen.debug();

        // Проверьте, что сообщение "City not found" присутствует
        expect(screen.getByText('City not found.')).toBeInTheDocument();
    });
});
