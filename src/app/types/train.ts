export type Train = {
  line?: string;
  destination: string;
  time: string;
  remarks?: string;
  color?: string;
}

export interface StopData {
  [key: string]: string; // Maps stop IDs to stop names
}

export interface Route {
  short_name: string;
  long_name: string;
  color: string;
}

export interface RouteData {
  [key: string]: Route; // Maps route IDs to route objects
}

export interface TransitData {
  stops: StopData;
  routes: RouteData;
  grand_central_stop_ids: string[];
}