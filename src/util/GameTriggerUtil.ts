import Animal from "../entities/unit/Animal";
import Plant from "../entities/unit/Plant";
import Rock from "../entities/unit/Rock";
import ObjectManager from "../services/ObjectManager";

export const getRandomRecordTypesArray = (
  size = 1,
  records: any,
  recordFilter: ((records: any) => string[]) | undefined
) => {
  const source = Object.keys(recordFilter ? recordFilter(records) : records);
  // Shuffle the source array
  const shuffledSource = source.sort(() => Math.random() - 0.5);
  // Create a new array of the desired length by repeating values from the shuffled source array
  const randomRecordTypes = [];
  for (let i = 0; i < size; i++) {
    randomRecordTypes.push(shuffledSource[i % source.length]);
  }
  return randomRecordTypes;
};

export const getUnitIntances = (
  records: string[],
  entityType: string,
  objectManager: ObjectManager
) => {
  const intances = records.map((record, i) => {
    const position = {
      x: Math.random() * 800 - 400 + i * 1.618,
      y: Math.random() * 800 - 400 + i * 1.618,
    };

    if (entityType === "Animal") {
      return new Animal(
        String(Math.floor(Math.random() * 100) + i),
        record,
        position,
        objectManager
      );
    }

    if (entityType === "Plant") {
      return new Plant(
        String(Math.floor(Math.random() * 100) + i),
        record,
        position,
        objectManager
      );
    }

    if (entityType === "Rock") {
      return new Rock(
        String(Math.floor(Math.random() * 100) + i),
        position,
        objectManager
      );
    }
  });

  return intances;
};
