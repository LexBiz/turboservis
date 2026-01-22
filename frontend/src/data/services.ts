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
    icon: Ruler
  },
  {
    id: "bodywork",
    icon: Paintbrush
  },
  {
    id: "dpf",
    icon: Filter
  },
  {
    id: "injectors",
    icon: Droplets
  },
  {
    id: "ac",
    icon: Snowflake
  },
  {
    id: "tires",
    icon: CircleDot
  },
  {
    id: "engine",
    icon: Settings,
    priceFromCzk: undefined
  },
  {
    id: "crash",
    icon: Car
  }
];
