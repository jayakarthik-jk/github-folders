import { createClient } from "@supabase/supabase-js";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { supabaseUrl, supabaseKey } = publicRuntimeConfig;

if (supabaseUrl == null || supabaseKey == null) {
  console.log("Supabase credentials not found");
  throw new Error("Supabase credentials not found");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export const Tables = {
  Folder: "Folder",
  Repo: "Repo",
};

export default supabase;
