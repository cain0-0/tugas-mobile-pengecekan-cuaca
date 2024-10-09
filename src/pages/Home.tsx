import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { cloud } from 'ionicons/icons';
import './Home.css';
import { getWeatherByCity } from '../api/weatherService';

const Home: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial' | 'reamur' | 'kelvin'>('metric'); // Default unit

  // Fixed city
  const city = 'Manado';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherByCity(city);
        setWeather(data);
      } catch (error) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  // Fungsi untuk mengonversi suhu ke unit yang dipilih
  const convertTemperature = (temp: number) => {
    switch (unit) {
      case 'reamur':
        return temp * (4 / 5); // Celsius to Réaumur
      case 'kelvin':
        return temp + 273.15; // Celsius to Kelvin
      case 'imperial':
        return temp * (9 / 5) + 32; // Celsius to Fahrenheit
      case 'metric':
      default:
        return temp; // Celsius
    }
  };

  const handleUnitChange = (newUnit: 'metric' | 'imperial' | 'reamur' | 'kelvin') => {
    setUnit(newUnit);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="header-title">Cuaca Manado Terkini</IonTitle>
          <IonText className="header-name">Matthew Darren Sumampouw/220211060097</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading weather...'} />
        ) : error ? (
          <IonText color="danger">{error}</IonText>
        ) : (
          weather && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{weather.name}, {weather.sys.country}</IonCardTitle>
                <IonCardSubtitle>{weather.weather[0].description}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  Temperature: {convertTemperature(weather.main.temp).toFixed(2)}°
                  {unit === 'metric' ? 'C' : unit === 'imperial' ? 'F' : unit === 'reamur' ? 'Re' : 'K'}
                </p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                />
                {/* Tombol untuk mengubah unit */}
                <div className="unit-buttons">
                  <IonButton onClick={() => handleUnitChange('metric')}>Celsius</IonButton>
                  <IonButton onClick={() => handleUnitChange('imperial')}>Fahrenheit</IonButton>
                  <IonButton onClick={() => handleUnitChange('reamur')}>Reamur</IonButton>
                  <IonButton onClick={() => handleUnitChange('kelvin')}>Kelvin</IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          )
        )}
      </IonContent>

      {/* Bottom Navigation Bar */}
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home" className="tab-button">
          <IonIcon icon={cloud} className="tab-icon" />
          <IonText className="tab-text">Beranda</IonText>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default Home;
