import LocalStorageService from "../services/LocalStorageService";
import animalRecordTypes from "../data/json/animals/vertebrates.json";
import AnimalRecordType from "../data/interface/AnimalRecordType";

export const loadAnimalRecordTypes = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    LocalStorageService.getInstance().setAnimalRecordTypes(
      // @ts-ignore
      animalRecordTypes as AnimalRecordType[]
    );
    resolve(animalRecordTypes);
  });
};

/*
// dont use fetch. the json is not in the public folder
export const loadAnimalRecordTypes = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const jsonFilePath = "../data/json/animals/vertebrates.json";

    fetch(jsonFilePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${jsonFilePath}: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((jsonData) => {
        
        LocalStorageService.getInstance().setAnimalRecordTypes(jsonData);
        resolve(jsonData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
*/
