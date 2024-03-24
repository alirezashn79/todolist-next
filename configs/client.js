import axios from "axios";
import { baseUrl } from "./app";

export const client = axios.create({
  baseURL: baseUrl,
});
