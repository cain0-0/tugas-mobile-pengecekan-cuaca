// src/api/weatherService.ts
import axios from 'axios';

const API_KEY = '29a39df4c800d4d9fb594c7625186134'; // Ganti dengan API Key Anda yang sebenarnya dari OpenWeather
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Convert temperature for other units
const convertTemperature = (temp: number, unit: 'metric' | 'imperial' | 'reamur' | 'kelvin') => {
  switch (unit) {
    case 'reamur':
      return temp * (4 / 5); // Convert from Celsius to Réaumur
    case 'kelvin':
      return temp + 273.15; // Convert from Celsius to Kelvin
    case 'imperial':
      return temp * (9 / 5) + 32; // Convert from Celsius to Fahrenheit
    case 'metric':
    default:
      return temp; // Return Celsius as is
  }
};

export const getWeatherByCity = async (city: string) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', // Selalu minta dalam metric (Celsius)
      },
    });

    // Dapatkan suhu dalam Celsius dari response
    const tempInCelsius = response.data.main.temp; // Dapatkan suhu dalam Celsius

    // Tambahkan suhu yang telah dikonversi ke data respons
    return {
      ...response.data,
      main: {
        ...response.data.main,
        tempInCelsius, // Simpan suhu dalam Celsius
        tempFahrenheit: convertTemperature(tempInCelsius, 'imperial'),
        tempReaumur: convertTemperature(tempInCelsius, 'reamur'),
        tempKelvin: convertTemperature(tempInCelsius, 'kelvin'),
      },
    };
  } catch (error: any) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};
