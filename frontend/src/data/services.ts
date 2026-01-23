import {
  PackageSearch,
  Ruler,
  Paintbrush,
  Filter,
  Droplets,
  Snowflake,
  CircleDot,
  Settings,
  Car
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  id:
    | "parts"
    | "alignment"
    | "bodywork"
    | "dpf"
    | "injectors"
    | "ac"
    | "tires"
    | "engine"
    | "crash";
  icon: LucideIcon;
  priceFromCzk?: number;
  status?: "available" | "soon";
};

export const services: Service[] = [
  {
    id: "parts",
    icon: PackageSearch
  },
  {
    id: "alignment",
    icon: Ruler,
    // geometry (passenger cars) from the price list
    priceFromCzk: 1500
  },
  {
    id: "bodywork",
    icon: Paintbrush
  },
  {
    id: "dpf",
    icon: Filter,
    // DPF cleaning from the price list
    priceFromCzk: 3630
  },
  {
    id: "injectors",
    icon: Droplets
  },
  {
    id: "ac",
    icon: Snowflake,
    // AC service: cheapest item is disinfection (30 min)
    priceFromCzk: 695
  },
  {
    id: "tires",
    icon: CircleDot,
    // passenger cars 13–15" full swap + balancing
    priceFromCzk: 1089
  },
  {
    id: "engine",
    icon: Settings,
    // hour rate "from" (mechanic work)
    priceFromCzk: 895
  },
  {
    id: "crash",
    icon: Car
  }
];
