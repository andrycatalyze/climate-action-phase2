import { default as percapita } from './percapita.carto.json';
import { default as ghg } from './ghg.carto.json';
import { default as trends } from './trends.carto.json';
import { default as countries } from './countryDictionary.json';
import {default as copyJson} from './copy.json';

export const copy = copyJson;

export interface TimeseriesDataPoint {
  year: number;
  value: number;
}


export default {
  countries,
  cartoworld: {
    percapita,
    ghg,
    trends
  },
  endYear: 2015
};
