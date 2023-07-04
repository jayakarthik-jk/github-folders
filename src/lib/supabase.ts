import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";
import getConfig from "next/config";

type SupabaseInstance = SupabaseClient<Database>;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Supabase {
  static tables: {
    FOLDER: "Folder";
    REPO: "Repo";
  } = {
    FOLDER: "Folder",
    REPO: "Repo",
  };

  static client: SupabaseInstance | null = null;

  private static createClient(): SupabaseInstance {
    const { publicRuntimeConfig } = getConfig();
    const { supabaseUrl, supabaseKey } = publicRuntimeConfig;

    if (supabaseUrl == null || supabaseKey == null) {
      console.log("Supabase credentials not found");
      throw new Error("Supabase credentials not found");
    }
    return createClient<Database>(supabaseUrl, supabaseKey);
  }

  static getInstance(): SupabaseInstance {
    if (Supabase.client == null) {
      Supabase.client = Supabase.createClient();
    }
    return Supabase.client;
  }

  static setInstance(instance: SupabaseInstance): void {
    Supabase.client = instance;
  }

  static getRootFolders = async (
    username: string
  ): Promise<FolderType[] | null> => {
    const { data: folders, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .select("*")
      .eq("username", username)
      .is("parent_name", null);

    if (folderError !== null) {
      return null;
    }
    return folders;
  };

  static getSubFolders = async (
    username: string,
    parentFolderName: string,
    path: string
  ): Promise<FolderType[] | null> => {
    const { data: folders, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .select("*")
      .eq("username", username)
      .eq("parent_name", parentFolderName);

    if (folderError !== null) {
      return null;
    }
    const result = folders.filter(
      (f) => f.path.split("/").slice(0, -1).join("/") === path
    );

    return result;
  };

  static getRepos = async (
    username: string,
    folderName: string,
    path: string
  ): Promise<RepoType[] | null> => {
    const { data: repos, error: repoError } = await Supabase.getInstance()
      .from(Supabase.tables.REPO)
      .select("*")
      .eq("username", username)
      .eq("folder_name", folderName);

    if (repoError !== null) {
      return null;
    }

    const result = repos.filter(
      (r) => r.path.split("/").slice(0, -1).join("/") === path
    );
    return result;
  };

  static createFolder = async ({
    username,
    folderName,
    path,
    parentName,
  }: {
    username: string;
    folderName: string;
    path: string;
    parentName: string | null;
  }): Promise<FolderType | Error> => {
    const { data: existingFolder, error: existingFolderError } =
      await Supabase.getInstance()
        .from(Supabase.tables.FOLDER)
        .select("*")
        .eq("username", username)
        .eq("path", path);

    if (existingFolderError !== null) {
      return new Error("Something went wrong, try again later");
    }

    if (existingFolder !== null && existingFolder.length > 0) {
      return new Error("Folder already exists");
    }
    const { data: folder, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .insert({
        username,
        title: folderName,
        path,
        parent_name: parentName,
      })
      .select("*")
      .single();

    if (folderError !== null) {
      return new Error("cannot create folder, try again later");
    }
    return folder;
  };

  static createRepo = async ({
    username,
    repoName,
    repoId,
    path,
    folderName,
  }: {
    username: string;
    repoName: string;
    repoId: string;
    path: string;
    folderName: string | null;
  }): Promise<RepoType | Error> => {
    const { data: existingRepo, error: existingRepoError } =
      await Supabase.getInstance()
        .from(Supabase.tables.REPO)
        .select("*")
        .eq("username", username)
        .eq("path", path);

    if (existingRepoError !== null) {
      return new Error("Something went wrong, try again later");
    }

    if (existingRepo !== null && existingRepo.length > 0) {
      return new Error("Repo already exists");
    }

    const { data: repo, error: repoError } = await Supabase.getInstance()
      .from(Supabase.tables.REPO)
      .insert({
        username,
        title: repoName,
        path,
        repo_id: repoId,
        folder_name: folderName,
      })
      .select("*")
      .single();

    if (repoError !== null) {
      return new Error("cannot create repo, try again later");
    }

    return repo;
  };
}
