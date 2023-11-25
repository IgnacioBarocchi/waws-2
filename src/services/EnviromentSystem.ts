import { DEFAULT_GAME_SPEED } from "../constants/config/game";
import ObjectManager, { Compositions, Entities } from "./ObjectManager";

export enum SeasonType {
  Summer = "Summer",
  Winter = "Winter",
  Spring = "Spring",
  Fall = "Fall",
}

export enum DayMoment {
  Day = "Day",
  Noon = "Noon",
  Evening = "Evening",
  Night = "Night",
}

export enum BiomeType {
  Forest = "Forest",
  Desert = "Desert",
  Arctic = "Arctic",
  Grassland = "Grassland",
}

export interface Biome {
  temperature: number;
  chanceOfRain: number;
  chanceOfSnow: number;
}

const biomeSettingsByType = {
  [BiomeType.Forest]: {
    temperature: 10,
    chanceOfRain: 0.4,
    chanceOfSnow: 0.3,
  },
  [BiomeType.Desert]: {
    temperature: 30,
    chanceOfRain: 0.2,
    chanceOfSnow: 0,
  },
  [BiomeType.Arctic]: {
    temperature: 5,
    chanceOfRain: 0.3,
    chanceOfSnow: 0.1,
  },
  [BiomeType.Grassland]: {
    temperature: 20,
    chanceOfRain: 0.3,
    chanceOfSnow: 0.1,
  },
};

export default class EnviromentSystem {
  currentTemperature: number;
  currentTime: number;
  currentSeason: SeasonType;
  ticksPerMinute: number;
  totalDayMinutes: number;
  totalTicks: number;

  objectManager: ObjectManager;

  threesFactor: number;
  animalsFactor: number;

  currentDayMoment: DayMoment;
  biomeType: BiomeType;
  yearDuration: number;
  tickDuration: number;
  biome:
    | { temperature: number; chanceOfRain: number; chanceOfSnow: number }
    | { temperature: number; chanceOfRain: number; chanceOfSnow: number }
    | { temperature: number; chanceOfRain: number; chanceOfSnow: number }
    | { temperature: number; chanceOfRain: number; chanceOfSnow: number };

  constructor(
    biomeType: BiomeType,
    timeSettings: {
      startingTime: number;
      startingDayMoment: DayMoment;
      startingSeason: SeasonType;
      ticksPerMinute: number;
      startingTick: number;
      totalDayMinutes: number;
    },
    objectManager: ObjectManager,
    yearDuration: number
  ) {
    const {
      startingSeason,
      ticksPerMinute,
      startingTime,
      startingDayMoment,
      totalDayMinutes,
    } = timeSettings;

    this.objectManager = objectManager;
    this.currentTime = startingTime;
    this.currentDayMoment = startingDayMoment;
    this.biomeType = biomeType;

    this.biome = biomeSettingsByType[biomeType];

    this.yearDuration = yearDuration;

    this.totalDayMinutes = totalDayMinutes;
    this.ticksPerMinute = ticksPerMinute;
    this.totalTicks = this.ticksPerMinute * this.totalDayMinutes;
    //* Calculate tick duration in milliseconds
    this.tickDuration = 1000 / this.ticksPerMinute;

    this.currentSeason = startingSeason;
    this.currentTemperature = this.calculateTemperatureBySeason();

    this.threesFactor = 0.8;
    this.animalsFactor = 0.1;
  }

  public advanceTime(milliseconds: number) {
    this.currentTime += milliseconds;
    const currentTick = Math.floor(this.currentTime / this.tickDuration);
    this.tick(currentTick);
  }

  public tick(currentTick: number) {
    console.log("tick");
    // * Environment internals
    this.updateDayMoment(currentTick);
    this.updateSeason();
    this.updateTemperature();

    // * Manage units and compositions
    const compositions: Compositions = this.objectManager.compositions;
    // * Groups tick first
    if (compositions.animalGroups?.length) {
      compositions.animalGroups.forEach((composition) => composition.tick(0.1));
    }

    if (compositions.microbeColonies?.length) {
      compositions.microbeColonies.forEach((composition) =>
        composition.tick(0.1)
      );
    }
    // *Then entities
    const entities: Entities = this.objectManager.getAllEntities();
    entities.forEach((entity) => entity.tick(0.1));
  }

  private updateDayMoment(currentTick: number) {
    const normalizedTick: number = currentTick % this.totalTicks;
    const percentage = (normalizedTick / this.totalTicks) * DEFAULT_GAME_SPEED;

    if (percentage < 25) {
      this.currentDayMoment = DayMoment.Day;
      return null;
    }

    if (percentage < 50) {
      this.currentDayMoment = DayMoment.Noon;
      return null;
    }

    if (percentage < 75) {
      this.currentDayMoment = DayMoment.Evening;
      return null;
    }

    this.currentDayMoment = DayMoment.Night;
  }

  private updateSeason() {
    const elapsedMinutes = Math.floor(this.currentTime / (1000 * 60));
    const currentYear = Math.floor(elapsedMinutes / this.yearDuration);
    const seasons = Object.values(SeasonType);
    const currentSeasonIndex = Math.floor(currentYear % seasons.length);
    this.currentSeason = seasons[currentSeasonIndex];
  }

  private updateTemperature() {
    const baseTemperature = this.calculateTemperatureBySeason();

    const numberOfAnimals = this.objectManager.animals.length;
    const numberOfPlants = this.objectManager.plants.length;

    this.currentTemperature =
      baseTemperature -
      numberOfPlants * this.threesFactor +
      numberOfAnimals * this.animalsFactor;
  }

  isRaining(): boolean {
    const randomValue = Math.random();
    const { chanceOfRain } = this.getRainAndSnowChancesBySeason(
      this.currentSeason
    );

    if (chanceOfRain > 0 && randomValue <= chanceOfRain) {
      return true;
    }

    return false;
  }

  isSnowing(): boolean {
    const randomValue = Math.random();

    const { chanceOfSnow } = this.getRainAndSnowChancesBySeason(
      this.currentSeason
    );
    if (chanceOfSnow > 0 && randomValue <= chanceOfSnow) {
      return true;
    }

    return false;
  }

  isRainingOrSnowing() {
    return {
      isRaining: this.isRaining(),
      isSnowing: this.isSnowing(),
    };
  }

  getData(): PublicEnvironmentData {
    return {
      time: {
        currentTime: this.currentTime,
        currentDayMoment: this.currentDayMoment,
        currentSeason: this.currentSeason,
      },
      temperature: {
        currentTemperature: this.currentTemperature,
      },
      weather: this.isRainingOrSnowing(),
    };
  }

  private calculateTemperatureBySeason(): number {
    if (this.currentSeason === SeasonType.Summer) {
      return this.biome.temperature + 10;
    }

    if (this.currentSeason === SeasonType.Winter) {
      return this.biome.temperature - 10;
    }

    if (this.currentSeason === SeasonType.Spring) {
      return this.biome.temperature + 5;
    }

    if (this.currentSeason === SeasonType.Fall) {
      return this.biome.temperature;
    }

    return this.biome.temperature;
  }

  private getRainAndSnowChancesBySeason(season: SeasonType): {
    chanceOfRain: number;
    chanceOfSnow: number;
  } {
    if (season === SeasonType.Summer) {
      return {
        chanceOfRain: this.biome.chanceOfRain * 0.2,
        chanceOfSnow: 0,
      };
    }

    if (season === SeasonType.Winter) {
      return {
        chanceOfRain: this.biome.chanceOfRain * 0.4,
        chanceOfSnow: this.biome.chanceOfSnow * 0.8,
      };
    }

    if (season === SeasonType.Spring) {
      return {
        chanceOfRain: this.biome.chanceOfRain * 0.6,
        chanceOfSnow: this.biome.chanceOfSnow * 0.1,
      };
    }

    if (season === SeasonType.Fall) {
      return {
        chanceOfRain: this.biome.chanceOfRain * 0.3,
        chanceOfSnow: 0,
      };
    }

    return { chanceOfRain: 0, chanceOfSnow: 0 };
  }
}

export interface PublicEnvironmentData {
  time: {
    currentTime: number;
    currentDayMoment: DayMoment;
    currentSeason: SeasonType;
  };
  temperature: {
    currentTemperature: number;
  };
  weather: {
    isRaining: boolean;
    isSnowing: boolean;
  };
}
