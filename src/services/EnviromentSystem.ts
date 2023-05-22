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

export default class EnviromentSystem {
  currentTemperature: number;
  currentTime: number;
  currentSeason: SeasonType;
  ticksPerMinute: number;
  totalDayMinutes: number;
  totalTicks: number;
  objectManager: any;
  threesFactor: any;
  animalsFactor: any;
  currentDayMoment: DayMoment;
  currentBiome: Biome;
  yearDuration: number;
  tickDuration: number;

  constructor(
    biome: Biome,
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
    this.currentBiome = biome;
    this.yearDuration = yearDuration;

    this.totalDayMinutes = totalDayMinutes;
    this.ticksPerMinute = ticksPerMinute;
    this.totalTicks = this.ticksPerMinute * this.totalDayMinutes;
    //* Calculate tick duration in milliseconds
    this.tickDuration = 1000 / this.ticksPerMinute;

    this.currentTemperature = this.calculateTemperatureBySeason(startingSeason);
    this.currentSeason = startingSeason;
  }

  public advanceTime(milliseconds: number) {
    this.currentTime += milliseconds;
    const currentTick = Math.floor(this.currentTime / this.tickDuration);
    this.tick(currentTick);
  }

  public tick(currentTick: number) {
    // * Environment internals
    this.currentDayMoment = this.getDayMoment(currentTick);
    this.updateCurrentSeason;
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

  private getDayMoment(currentTick: number): DayMoment {
    const normalizedTick: number = currentTick % this.totalTicks;
    const percentage = (normalizedTick / this.totalTicks) * DEFAULT_GAME_SPEED;

    if (percentage < 25) return DayMoment.Day;
    if (percentage < 50) return DayMoment.Noon;
    if (percentage < 75) return DayMoment.Evening;

    return DayMoment.Night;
  }

  private updateCurrentSeason() {
    const elapsedMinutes = Math.floor(this.currentTime / (1000 * 60));
    const currentYear = Math.floor(elapsedMinutes / this.yearDuration);
    const seasons = Object.values(SeasonType);
    const currentSeasonIndex = Math.floor(currentYear % seasons.length);
    this.currentSeason = seasons[currentSeasonIndex];
    this.currentTemperature = this.calculateTemperatureBySeason(
      this.currentSeason
    );
  }

  getCurrentTemperature(): number {
    const numberOfAnimals = this.objectManager.animals.length;
    const numberOfPlants = this.objectManager.plants.length;

    return (
      this.currentTemperature -
      numberOfPlants * this.threesFactor +
      numberOfAnimals * this.animalsFactor
    );
  }

  isRainingOrSnowing(): boolean {
    const randomValue = Math.random();
    const { chanceOfRain, chanceOfSnow } = this.getRainAndSnowChancesBySeason(
      this.currentSeason
    );

    if (chanceOfRain > 0 && randomValue <= chanceOfRain) {
      return true;
    }

    if (chanceOfSnow > 0 && randomValue <= chanceOfSnow) {
      return true;
    }

    return false;
  }

  getData() {
    return {
      time: {
        currentTime: this.currentTime,
        currentDayMoment: this.currentDayMoment,
        currentSeason: this.currentSeason,
      },
      temperature: {
        currentTemperature: this.currentTemperature,
      },
      weather: {
        isRaining: this.isRainingOrSnowing(),
      },
    };
  }

  private calculateTemperatureBySeason(season: SeasonType): number {
    if (season === SeasonType.Summer) {
      return this.currentBiome.temperature + 10;
    }

    if (season === SeasonType.Winter) {
      return this.currentBiome.temperature - 10;
    }

    if (season === SeasonType.Spring) {
      return this.currentBiome.temperature + 5;
    }

    if (season === SeasonType.Fall) {
      return this.currentBiome.temperature;
    }

    return this.currentBiome.temperature;
  }

  private getRainAndSnowChancesBySeason(season: SeasonType): {
    chanceOfRain: number;
    chanceOfSnow: number;
  } {
    if (season === SeasonType.Summer) {
      return {
        chanceOfRain: this.currentBiome.chanceOfRain * 0.2,
        chanceOfSnow: 0,
      };
    }

    if (season === SeasonType.Winter) {
      return {
        chanceOfRain: this.currentBiome.chanceOfRain * 0.4,
        chanceOfSnow: this.currentBiome.chanceOfSnow * 0.8,
      };
    }

    if (season === SeasonType.Spring) {
      return {
        chanceOfRain: this.currentBiome.chanceOfRain * 0.6,
        chanceOfSnow: this.currentBiome.chanceOfSnow * 0.1,
      };
    }

    if (season === SeasonType.Fall) {
      return {
        chanceOfRain: this.currentBiome.chanceOfRain * 0.3,
        chanceOfSnow: 0,
      };
    }

    return { chanceOfRain: 0, chanceOfSnow: 0 };
  }
}
