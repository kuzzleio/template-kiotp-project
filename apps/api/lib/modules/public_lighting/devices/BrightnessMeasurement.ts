import { MeasureDefinition } from "kuzzle-device-manager";

export type BrightnessMeasurement = {
  lumens: number;
};

export const brightnessMeasureDefinition: MeasureDefinition = {
  valuesMappings: { lumens: { type: "float" } },
};
