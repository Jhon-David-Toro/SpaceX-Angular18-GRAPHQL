/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
};

export type HistoryFind = {
  end?: InputMaybe<Scalars['Date']['input']>;
  flight_number?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  start?: InputMaybe<Scalars['Date']['input']>;
};

export type LaunchFind = {
  apoapsis_km?: InputMaybe<Scalars['Float']['input']>;
  block?: InputMaybe<Scalars['Int']['input']>;
  cap_serial?: InputMaybe<Scalars['String']['input']>;
  capsule_reuse?: InputMaybe<Scalars['String']['input']>;
  core_flight?: InputMaybe<Scalars['Int']['input']>;
  core_reuse?: InputMaybe<Scalars['String']['input']>;
  core_serial?: InputMaybe<Scalars['String']['input']>;
  customer?: InputMaybe<Scalars['String']['input']>;
  eccentricity?: InputMaybe<Scalars['Float']['input']>;
  end?: InputMaybe<Scalars['Date']['input']>;
  epoch?: InputMaybe<Scalars['Date']['input']>;
  fairings_recovered?: InputMaybe<Scalars['String']['input']>;
  fairings_recovery_attempt?: InputMaybe<Scalars['String']['input']>;
  fairings_reuse?: InputMaybe<Scalars['String']['input']>;
  fairings_reused?: InputMaybe<Scalars['String']['input']>;
  fairings_ship?: InputMaybe<Scalars['String']['input']>;
  gridfins?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  inclination_deg?: InputMaybe<Scalars['Float']['input']>;
  land_success?: InputMaybe<Scalars['String']['input']>;
  landing_intent?: InputMaybe<Scalars['String']['input']>;
  landing_type?: InputMaybe<Scalars['String']['input']>;
  landing_vehicle?: InputMaybe<Scalars['String']['input']>;
  launch_date_local?: InputMaybe<Scalars['Date']['input']>;
  launch_date_utc?: InputMaybe<Scalars['Date']['input']>;
  launch_success?: InputMaybe<Scalars['String']['input']>;
  launch_year?: InputMaybe<Scalars['String']['input']>;
  legs?: InputMaybe<Scalars['String']['input']>;
  lifespan_years?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  mean_motion?: InputMaybe<Scalars['Float']['input']>;
  mission_id?: InputMaybe<Scalars['String']['input']>;
  mission_name?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  norad_id?: InputMaybe<Scalars['Int']['input']>;
  orbit?: InputMaybe<Scalars['String']['input']>;
  payload_id?: InputMaybe<Scalars['String']['input']>;
  payload_type?: InputMaybe<Scalars['String']['input']>;
  periapsis_km?: InputMaybe<Scalars['Float']['input']>;
  period_min?: InputMaybe<Scalars['Float']['input']>;
  raan?: InputMaybe<Scalars['Float']['input']>;
  reference_system?: InputMaybe<Scalars['String']['input']>;
  regime?: InputMaybe<Scalars['String']['input']>;
  reused?: InputMaybe<Scalars['String']['input']>;
  rocket_id?: InputMaybe<Scalars['String']['input']>;
  rocket_name?: InputMaybe<Scalars['String']['input']>;
  rocket_type?: InputMaybe<Scalars['String']['input']>;
  second_stage_block?: InputMaybe<Scalars['String']['input']>;
  semi_major_axis_km?: InputMaybe<Scalars['Float']['input']>;
  ship?: InputMaybe<Scalars['String']['input']>;
  side_core1_reuse?: InputMaybe<Scalars['String']['input']>;
  side_core2_reuse?: InputMaybe<Scalars['String']['input']>;
  site_id?: InputMaybe<Scalars['String']['input']>;
  site_name?: InputMaybe<Scalars['String']['input']>;
  site_name_long?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Date']['input']>;
  tbd?: InputMaybe<Scalars['String']['input']>;
  tentative?: InputMaybe<Scalars['String']['input']>;
  tentative_max_precision?: InputMaybe<Scalars['String']['input']>;
};

export type ShipsFind = {
  abs?: InputMaybe<Scalars['Int']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  attempted_landings?: InputMaybe<Scalars['Int']['input']>;
  class?: InputMaybe<Scalars['Int']['input']>;
  course_deg?: InputMaybe<Scalars['Int']['input']>;
  home_port?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  imo?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  mission?: InputMaybe<Scalars['String']['input']>;
  mmsi?: InputMaybe<Scalars['Int']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  speed_kn?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  successful_landings?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  weight_kg?: InputMaybe<Scalars['Int']['input']>;
  weight_lbs?: InputMaybe<Scalars['Int']['input']>;
  year_built?: InputMaybe<Scalars['Int']['input']>;
};

export type FleetQueryVariables = Exact<{ [key: string]: never; }>;


export type FleetQuery = { ships: Array<{ id: string | null, name: string | null, type: string | null, roles: Array<string | null> | null, active: boolean | null, home_port: string | null, year_built: number | null, image: string | null, url: string | null, successful_landings: number | null, attempted_landings: number | null, weight_kg: number | null, weight_lbs: number | null, missions: Array<{ name: string | null, flight: string | null } | null> | null } | null> | null };

export type HistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type HistoryQuery = { histories: Array<{ id: string | null, title: string | null, event_date_utc: string | null, details: string | null, links: { article: string | null, wikipedia: string | null } | null, flight: { id: string | null, mission_name: string | null } | null } | null> | null };

export type CompanyQueryVariables = Exact<{ [key: string]: never; }>;


export type CompanyQuery = { company: { name: string | null, founder: string | null, founded: number | null, employees: number | null, vehicles: number | null, launch_sites: number | null, test_sites: number | null, ceo: string | null, cto: string | null, coo: string | null, valuation: number | null, summary: string | null, headquarters: { city: string | null, state: string | null } | null, links: { website: string | null, flickr: string | null, twitter: string | null } | null } | null };

export type LaunchArchiveQueryVariables = Exact<{ [key: string]: never; }>;


export type LaunchArchiveQuery = { launchesPast: Array<{ id: string | null, mission_name: string | null, launch_date_utc: string | null, launch_success: boolean | null, details: string | null, launch_site: { site_id: string | null, site_name: string | null } | null, rocket: { rocket_name: string | null, second_stage: { payloads: Array<{ id: string | null, payload_mass_kg: number | null, orbit: string | null } | null> | null } | null } | null, links: { mission_patch_small: string | null, flickr_images: Array<string | null> | null } | null } | null> | null };

export type LaunchDetailQueryVariables = Exact<{
  id: string | number;
}>;


export type LaunchDetailQuery = { launch: { id: string | null, mission_name: string | null, launch_date_utc: string | null, launch_success: boolean | null, details: string | null, launch_site: { site_id: string | null, site_name: string | null, site_name_long: string | null } | null, links: { article_link: string | null, video_link: string | null, wikipedia: string | null, presskit: string | null, mission_patch: string | null, flickr_images: Array<string | null> | null } | null, rocket: { rocket_name: string | null, rocket_type: string | null, rocket: { id: string | null } | null, first_stage: { cores: Array<{ flight: number | null, block: number | null, reused: boolean | null, land_success: boolean | null, landing_intent: boolean | null, landing_type: string | null, landing_vehicle: string | null, core: { id: string | null, status: string | null, reuse_count: number | null } | null } | null> | null } | null, second_stage: { block: number | null, payloads: Array<{ id: string | null, payload_type: string | null, payload_mass_kg: number | null, payload_mass_lbs: number | null, orbit: string | null, nationality: string | null, manufacturer: string | null, customers: Array<string | null> | null, reused: boolean | null, orbit_params: { regime: string | null, periapsis_km: number | null, apoapsis_km: number | null, inclination_deg: number | null, period_min: number | null } | null } | null> | null } | null, fairings: { reused: boolean | null, recovery_attempt: boolean | null, recovered: boolean | null } | null } | null, ships: Array<{ id: string | null, name: string | null, image: string | null } | null> | null } | null };

export type RoadsterQueryVariables = Exact<{ [key: string]: never; }>;


export type RoadsterQuery = { roadster: { name: string | null, details: string | null, launch_date_utc: string | null, launch_mass_kg: number | null, launch_mass_lbs: number | null, norad_id: number | null, apoapsis_au: number | null, periapsis_au: number | null, semi_major_axis_au: number | null, eccentricity: number | null, inclination: number | null, longitude: number | null, periapsis_arg: number | null, period_days: number | null, speed_kph: number | null, speed_mph: number | null, earth_distance_km: number | null, earth_distance_mi: number | null, mars_distance_km: number | null, mars_distance_mi: number | null, wikipedia: string | null } | null };

export type RocketsQueryVariables = Exact<{ [key: string]: never; }>;


export type RocketsQuery = { rockets: Array<{ id: string | null, name: string | null, type: string | null, active: boolean | null, stages: number | null, boosters: number | null, cost_per_launch: number | null, success_rate_pct: number | null, first_flight: string | null, country: string | null, company: string | null, description: string | null, wikipedia: string | null, height: { meters: number | null, feet: number | null } | null, diameter: { meters: number | null, feet: number | null } | null, mass: { kg: number | null, lb: number | null } | null, engines: { number: number | null, type: string | null, version: string | null, propellant_1: string | null, propellant_2: string | null, thrust_sea_level: { kN: number | null, lbf: number | null } | null } | null, payload_weights: Array<{ id: string | null, name: string | null, kg: number | null, lb: number | null } | null> | null, first_stage: { reusable: boolean | null, engines: number | null, fuel_amount_tons: number | null, burn_time_sec: number | null } | null, landing_legs: { number: number | null, material: string | null } | null } | null> | null };


export const FleetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Fleet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"home_port"}},{"kind":"Field","name":{"kind":"Name","value":"year_built"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"successful_landings"}},{"kind":"Field","name":{"kind":"Name","value":"attempted_landings"}},{"kind":"Field","name":{"kind":"Name","value":"weight_kg"}},{"kind":"Field","name":{"kind":"Name","value":"weight_lbs"}},{"kind":"Field","name":{"kind":"Name","value":"missions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"flight"}}]}}]}}]}}]} as unknown as DocumentNode<FleetQuery, FleetQueryVariables>;
export const HistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"History"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"histories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"event_date_utc"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article"}},{"kind":"Field","name":{"kind":"Name","value":"wikipedia"}}]}},{"kind":"Field","name":{"kind":"Name","value":"flight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mission_name"}}]}}]}}]}}]} as unknown as DocumentNode<HistoryQuery, HistoryQueryVariables>;
export const CompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"founder"}},{"kind":"Field","name":{"kind":"Name","value":"founded"}},{"kind":"Field","name":{"kind":"Name","value":"employees"}},{"kind":"Field","name":{"kind":"Name","value":"vehicles"}},{"kind":"Field","name":{"kind":"Name","value":"launch_sites"}},{"kind":"Field","name":{"kind":"Name","value":"test_sites"}},{"kind":"Field","name":{"kind":"Name","value":"ceo"}},{"kind":"Field","name":{"kind":"Name","value":"cto"}},{"kind":"Field","name":{"kind":"Name","value":"coo"}},{"kind":"Field","name":{"kind":"Name","value":"valuation"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"headquarters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"flickr"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}}]}}]}}]}}]} as unknown as DocumentNode<CompanyQuery, CompanyQueryVariables>;
export const LaunchArchiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LaunchArchive"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"launchesPast"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"500"}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"StringValue","value":"launch_date_utc","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"StringValue","value":"desc","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mission_name"}},{"kind":"Field","name":{"kind":"Name","value":"launch_date_utc"}},{"kind":"Field","name":{"kind":"Name","value":"launch_success"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"launch_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site_id"}},{"kind":"Field","name":{"kind":"Name","value":"site_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rocket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rocket_name"}},{"kind":"Field","name":{"kind":"Name","value":"second_stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payload_mass_kg"}},{"kind":"Field","name":{"kind":"Name","value":"orbit"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mission_patch_small"}},{"kind":"Field","name":{"kind":"Name","value":"flickr_images"}}]}}]}}]}}]} as unknown as DocumentNode<LaunchArchiveQuery, LaunchArchiveQueryVariables>;
export const LaunchDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LaunchDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"launch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mission_name"}},{"kind":"Field","name":{"kind":"Name","value":"launch_date_utc"}},{"kind":"Field","name":{"kind":"Name","value":"launch_success"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"launch_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site_id"}},{"kind":"Field","name":{"kind":"Name","value":"site_name"}},{"kind":"Field","name":{"kind":"Name","value":"site_name_long"}}]}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article_link"}},{"kind":"Field","name":{"kind":"Name","value":"video_link"}},{"kind":"Field","name":{"kind":"Name","value":"wikipedia"}},{"kind":"Field","name":{"kind":"Name","value":"presskit"}},{"kind":"Field","name":{"kind":"Name","value":"mission_patch"}},{"kind":"Field","name":{"kind":"Name","value":"flickr_images"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rocket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rocket_name"}},{"kind":"Field","name":{"kind":"Name","value":"rocket_type"}},{"kind":"Field","name":{"kind":"Name","value":"rocket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"first_stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cores"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flight"}},{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"reused"}},{"kind":"Field","name":{"kind":"Name","value":"land_success"}},{"kind":"Field","name":{"kind":"Name","value":"landing_intent"}},{"kind":"Field","name":{"kind":"Name","value":"landing_type"}},{"kind":"Field","name":{"kind":"Name","value":"landing_vehicle"}},{"kind":"Field","name":{"kind":"Name","value":"core"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reuse_count"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"second_stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"payloads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payload_type"}},{"kind":"Field","name":{"kind":"Name","value":"payload_mass_kg"}},{"kind":"Field","name":{"kind":"Name","value":"payload_mass_lbs"}},{"kind":"Field","name":{"kind":"Name","value":"orbit"}},{"kind":"Field","name":{"kind":"Name","value":"nationality"}},{"kind":"Field","name":{"kind":"Name","value":"manufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"customers"}},{"kind":"Field","name":{"kind":"Name","value":"reused"}},{"kind":"Field","name":{"kind":"Name","value":"orbit_params"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"regime"}},{"kind":"Field","name":{"kind":"Name","value":"periapsis_km"}},{"kind":"Field","name":{"kind":"Name","value":"apoapsis_km"}},{"kind":"Field","name":{"kind":"Name","value":"inclination_deg"}},{"kind":"Field","name":{"kind":"Name","value":"period_min"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fairings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reused"}},{"kind":"Field","name":{"kind":"Name","value":"recovery_attempt"}},{"kind":"Field","name":{"kind":"Name","value":"recovered"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]} as unknown as DocumentNode<LaunchDetailQuery, LaunchDetailQueryVariables>;
export const RoadsterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Roadster"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roadster"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"launch_date_utc"}},{"kind":"Field","name":{"kind":"Name","value":"launch_mass_kg"}},{"kind":"Field","name":{"kind":"Name","value":"launch_mass_lbs"}},{"kind":"Field","name":{"kind":"Name","value":"norad_id"}},{"kind":"Field","name":{"kind":"Name","value":"apoapsis_au"}},{"kind":"Field","name":{"kind":"Name","value":"periapsis_au"}},{"kind":"Field","name":{"kind":"Name","value":"semi_major_axis_au"}},{"kind":"Field","name":{"kind":"Name","value":"eccentricity"}},{"kind":"Field","name":{"kind":"Name","value":"inclination"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"periapsis_arg"}},{"kind":"Field","name":{"kind":"Name","value":"period_days"}},{"kind":"Field","name":{"kind":"Name","value":"speed_kph"}},{"kind":"Field","name":{"kind":"Name","value":"speed_mph"}},{"kind":"Field","name":{"kind":"Name","value":"earth_distance_km"}},{"kind":"Field","name":{"kind":"Name","value":"earth_distance_mi"}},{"kind":"Field","name":{"kind":"Name","value":"mars_distance_km"}},{"kind":"Field","name":{"kind":"Name","value":"mars_distance_mi"}},{"kind":"Field","name":{"kind":"Name","value":"wikipedia"}}]}}]}}]} as unknown as DocumentNode<RoadsterQuery, RoadsterQueryVariables>;
export const RocketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Rockets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rockets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"stages"}},{"kind":"Field","name":{"kind":"Name","value":"boosters"}},{"kind":"Field","name":{"kind":"Name","value":"cost_per_launch"}},{"kind":"Field","name":{"kind":"Name","value":"success_rate_pct"}},{"kind":"Field","name":{"kind":"Name","value":"first_flight"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"wikipedia"}},{"kind":"Field","name":{"kind":"Name","value":"height"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meters"}},{"kind":"Field","name":{"kind":"Name","value":"feet"}}]}},{"kind":"Field","name":{"kind":"Name","value":"diameter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meters"}},{"kind":"Field","name":{"kind":"Name","value":"feet"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mass"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kg"}},{"kind":"Field","name":{"kind":"Name","value":"lb"}}]}},{"kind":"Field","name":{"kind":"Name","value":"engines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"propellant_1"}},{"kind":"Field","name":{"kind":"Name","value":"propellant_2"}},{"kind":"Field","name":{"kind":"Name","value":"thrust_sea_level"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kN"}},{"kind":"Field","name":{"kind":"Name","value":"lbf"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payload_weights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kg"}},{"kind":"Field","name":{"kind":"Name","value":"lb"}}]}},{"kind":"Field","name":{"kind":"Name","value":"first_stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reusable"}},{"kind":"Field","name":{"kind":"Name","value":"engines"}},{"kind":"Field","name":{"kind":"Name","value":"fuel_amount_tons"}},{"kind":"Field","name":{"kind":"Name","value":"burn_time_sec"}}]}},{"kind":"Field","name":{"kind":"Name","value":"landing_legs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"material"}}]}}]}}]}}]} as unknown as DocumentNode<RocketsQuery, RocketsQueryVariables>;