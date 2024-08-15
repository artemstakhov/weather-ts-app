import {
    Container,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    fetchWeatherByCityName,
    loadCitiesFromLocalStorage,
    selectCities,
    removeCity,
} from '../../store/slices/citiesSlice';
import { AppDispatch, RootState } from '../../store/store';
import './Home.scss';

const Home: React.FC = () => {
    const cities = useSelector(selectCities);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector((state: RootState) => state.cities.isLoading);
    const [cityName, setCityName] = useState('');

    useEffect(() => {
        dispatch(loadCitiesFromLocalStorage());
    }, [dispatch]);

    const handleAddCity = () => {
        if (cityName.trim()) {
            dispatch(fetchWeatherByCityName(cityName));
            setCityName('');
        }
    };

    return (
        <Container className="home">
            {isLoading ? (
                <Box className="home__loading">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography
                        className="home__header"
                        variant="h4"
                        gutterBottom={true}
                    >
                        Weather in Your Cities
                    </Typography>
                    <Box className="home__add-city">
                        <TextField
                            label="Enter city name"
                            variant="outlined"
                            fullWidth={true}
                            size="small"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            className="home__add-city-field"
                        />
                        <Button
                            className="home__add-city-button"
                            variant="contained"
                            color="primary"
                            onClick={handleAddCity}
                        >
                            Add City
                        </Button>
                    </Box>
                    <div className="home__cards">
                        {cities?.map((city) => (
                            <Card key={city.id} className="home__card">
                                <CardContent className="home__card-content">
                                    <Typography
                                        variant="h6"
                                        className="home__card-title"
                                    >
                                        {city.name}
                                    </Typography>
                                    <Typography className="home__card-temp">
                                        Temperature:{' '}
                                        {Math.round(city.weather.main.temp)}°C
                                    </Typography>
                                    <Typography className="home__card-description">
                                        Description:{' '}
                                        {city.weather.weather[0].description}
                                    </Typography>
                                    <Box className="home__card-actions">
                                        <Button
                                            className="home__card-button home__card-button--remove"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() =>
                                                dispatch(removeCity(city.id))
                                            }
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            className="home__card-button home__card-button--update"
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                                dispatch(
                                                    fetchWeatherByCityName(
                                                        city.name,
                                                    ),
                                                )
                                            }
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            className="home__card-button home__card-button--details"
                                            variant="outlined"
                                            onClick={() =>
                                                navigate(
                                                    `/city-details/${city.id}`,
                                                )
                                            }
                                        >
                                            Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </Container>
    );
};

export default Home;
