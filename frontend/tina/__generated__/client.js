import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: "http://localhost:4001/graphql", token: "74d66dd15862ccf26d891877e43a6d9119fd8bfb", queries });
export default client;
