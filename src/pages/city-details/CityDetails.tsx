import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    CircularProgress,
    Divider,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import {
    fetchWeatherByCityName,
    loadCitiesFromLocalStorage,
    removeCity,
} from '../../store/slices/citiesSlice';
import { AppDispatch, RootState } from '../../store/store';
import './CityDetails.scss';

const CityDetails: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { cityId } = useParams<{ cityId: string }>();
    const cities = useSelector((state: RootState) => state.cities.cities);
    const isLoading = useSelector((state: RootState) => state.cities.isLoading);
    const city = cities.find((c) => c.id === Number(cityId));
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(loadCitiesFromLocalStorage());
    }, [dispatch]);

    const handleUpdate = () => {
        if (city) {
            dispatch(fetchWeatherByCityName(city.name));
        }
    };

    const handleDelete = () => {
        if (city) {
            dispatch(removeCity(city.id));
            navigate('/');
        }
    };

    if (!city) {
        return <div className="city-details__not-found">City not found.</div>;
    }

    return (
        <Container className="city-details">
            {isLoading ? (
                <Box className="city-details__loading">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Button
                        className="city-details__back-button"
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                    <Card className="city-details__card">
                        <CardContent>
                            <Typography
                                variant="h4"
                                className="city-details__city-name"
                                gutterBottom={true}
                            >
                                {city.name}
                            </Typography>
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Temperature:{' '}
                                {Math.round(city.weather.main.temp)}°C
                            </Typography>
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Humidity: {city.weather.main.humidity}%
                            </Typography>
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Wind Speed: {city.weather.wind.speed} m/s
                            </Typography>
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Description:{' '}
                                {city.weather.weather[0].description}
                            </Typography>
                            <Divider />
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Country: {city.weather.sys.country}
                            </Typography>
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Coordinates: {city.weather.coord.lat}° N,{' '}
                                {city.weather.coord.lon}° E
                            </Typography>
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Visibility: {city.weather.visibility / 1000} km
                            </Typography>
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Sunrise:{' '}
                                {new Date(
                                    city.weather.sys.sunrise * 1000,
                                ).toLocaleTimeString()}
                            </Typography>
                            <Typography
                                variant="body1"
                                className="city-details__detail"
                            >
                                Sunset:{' '}
                                {new Date(
                                    city.weather.sys.sunset * 1000,
                                ).toLocaleTimeString()}
                            </Typography>
                            <Box className="city-details__actions">
                                <Button
                                    className="city-details__action-button city-details__action-button--update"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdate}
                                >
                                    Update
                                </Button>
                                <Button
                                    className="city-details__action-button city-details__action-button--delete"
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default CityDetails;
