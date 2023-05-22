import styled from "styled-components";
import { useAppUIState } from "../../../containers/AppUIContext";

enum DayMomentIcons {
  Day = "☀️",
  Noon = "🌞",
  Evening = "🌇",
  Night = "🌙",
}

enum SeasonIcons {
  Summer = "🌴",
  Fall = "🍂",
  Winter = "❄️",
  Spring = "🌸",
}

const WeatherContainer = styled.div`
  display: flex;
  width: 500px;
  justify-content: space-around;
`;

const WeatherText = styled.div`
  font-size: 11px;
`;

const WeatherComponent = () => {
  const {
    UIState: { enviromentData },
  } = useAppUIState();

  // * Public enviroment data
  const {
    time: { currentTime, currentDayMoment, currentSeason },
    temperature: { currentTemperature },
    weather: { isRaining, isSnowing },
  } = enviromentData;

  return (
    <WeatherContainer>
      <WeatherText>
        Time: {currentDayMoment && DayMomentIcons[currentDayMoment]}
      </WeatherText>
      <WeatherText>
        Season: {currentSeason && SeasonIcons[currentSeason]}
      </WeatherText>
      <WeatherText>Temperature: {currentTemperature}°C 🌡️</WeatherText>
      <WeatherText>
        Weather: {isRaining ? "🌧" : isSnowing ? "❄️" : "☁️"}
      </WeatherText>
    </WeatherContainer>
  );
};

export default WeatherComponent;
