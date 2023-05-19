// * Abstract, level 1
export const ENTITY_NODE_TYPE_LABEL = 'entity';

// * Abstract, level 2
export const UNIT_NODE_TYPE_LABEL = 'unit';
export const BUILDING_NODE_TYPE_LABEL = 'building';

// * Abstract, level 3
export const FACTORY_NODE_TYPE_LABEL = 'factory';

// * Derived Unit
export const ANIMAL_NODE_TYPE_LABEL = 'animal';
export const PLANT_NODE_TYPE_LABEL = 'plant';
export const ITEM_NODE_TYPE_LABEL = 'item';

// * Derived Building
export const ANIMAL_FACTORY_NODE_TYPE_LABEL = `${ANIMAL_NODE_TYPE_LABEL}${FACTORY_NODE_TYPE_LABEL}`;
export const PLANT_FACTORY_NODE_TYPE_LABEL = `${PLANT_NODE_TYPE_LABEL}${FACTORY_NODE_TYPE_LABEL}`;
