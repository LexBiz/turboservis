import { 
  Wrench, 
  Gauge, 
  Settings, 
  Car, 
  Shield, 
  Clock,
  Cpu,
  Fan,
  Filter,
  Droplets
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  id:
    | "diagnostics"
    | "turbo"
    | "egrdpf"
    | "injectors"
    | "engine"
    | "suspension"
    | "maintenance"
    | "warranty"
    | "dyno"
    | "repair";
  icon: LucideIcon;
  priceFromCzk?: number;
  status?: "available" | "soon";
};

export const services: Service[] = [
  {
    id: "diagnostics",
    icon: Cpu,
    priceFromCzk: 1500
  },
  {
    id: "turbo",
    icon: Fan,
    priceFromCzk: 12000
  },
  {
    id: "egrdpf",
    icon: Filter,
    priceFromCzk: 2000
  },
  {
    id: "injectors",
    icon: Droplets,
    status: "soon"
  },
  {
    id: "engine",
    icon: Settings,
    priceFromCzk: 25000
  },
  {
    id: "suspension",
    icon: Car,
    priceFromCzk: 3000
  },
  {
    id: "maintenance",
    icon: Clock,
    priceFromCzk: 3500
  },
  {
    id: "warranty",
    icon: Shield,
    priceFromCzk: undefined
  },
  {
    id: "dyno",
    icon: Gauge,
    priceFromCzk: 2500
  },
  {
    id: "repair",
    icon: Wrench,
    priceFromCzk: 10000
  }
];
