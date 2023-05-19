export interface ITrigger {
  afterInsert: () => void;
  afterUpdate: () => void;
  afterDelete: () => void;
  beforeInsert: () => void;
  beforeUpdate: () => void;
  beforeDelete: () => void;
}
