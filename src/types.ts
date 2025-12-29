import { type Database } from "@/database.types";

export type TodoEntity = Database["public"]["Tables"]["todos"]["Row"];
