export interface Sensor {
  reference: string;
  manufacturer: string;
  measures: [
    {
      labelFr: string;
      labelEn: string;
      type: string;
    },
  ];
  network: string;
  power: string;
  powerEn: string;
  sales: string;
  datasheet: string;
}
