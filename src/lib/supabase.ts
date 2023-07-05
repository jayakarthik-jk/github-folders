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

  static getFolderId = async (
    userName: string,
    path: string
  ): Promise<number | Error> => {
    const { data: folder, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .select("id")
      .eq("user_name", userName)
      .eq("path", path)
      .single();

    if (folderError !== null || folder === null) {
      return new Error("cannot find folder, try again later");
    }
    return folder.id;
  };

  static getRootFolders = async (
    userName: string
  ): Promise<FolderType[] | null> => {
    const { data: folders, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .select("*")
      .eq("user_name", userName)
      .is("parent_id", null);

    if (folderError !== null) {
      return null;
    }
    return folders;
  };

  static getSubFolders = async ({
    userName,
    parentId,
    path,
  }: {
    userName: string;
    parentId: number;
    path: string;
  }): Promise<FolderType[] | null> => {
    const { data: folders, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .select("*")
      .eq("user_name", userName)
      .eq("parent_id", parentId);

    if (folderError !== null) {
      return null;
    }
    const result = folders.filter(
      (f) => f.path.split("/").slice(0, -1).join("/") === path
    );

    return result;
  };

  static getRepos = async ({
    userName,
    folderId,
    path,
  }: {
    userName: string;
    folderId: number;
    path: string;
  }): Promise<RepoType[] | null> => {
    const { data: repos, error: repoError } = await Supabase.getInstance()
      .from(Supabase.tables.REPO)
      .select("*")
      .eq("user_name", userName)
      .eq("folder_id", folderId);

    if (repoError !== null) {
      return null;
    }

    const result = repos.filter(
      (r) => r.path.split("/").slice(0, -1).join("/") === path
    );
    return result;
  };

  static createFolder = async ({
    userId,
    userName,
    folderName,
    parentId,
    path,
  }: {
    userId: string;
    userName: string;
    folderName: string;
    parentId: number | null;
    path: string;
  }): Promise<FolderType | Error> => {
    const { data: existingFolder, error: existingFolderError } =
      await Supabase.getInstance()
        .from(Supabase.tables.FOLDER)
        .select("*")
        .eq("username", userName)
        .eq("path", path);

    console.log({ existingFolder, existingFolderError });

    if (existingFolderError !== null) {
      return new Error("Something went wrong, try again later");
    }

    if (existingFolder !== null && existingFolder.length > 0) {
      return new Error("Folder already exists");
    }
    const { data: folder, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .insert({
        user_id: userId,
        user_name: userName,
        folder_name: folderName,
        parent_id: parentId !== null ? +parentId : null,
        path,
      })
      .select("*")
      .single();

    console.log({
      folder,
      folderError,
    });

    if (folderError !== null) {
      return new Error("cannot create folder, try again later");
    }

    return folder;
  };

  static createRepo = async ({
    repoName,
    userId,
    userName,
    folderId,
    path,
  }: {
    repoName: string;
    userId: string;
    userName: string;
    folderId: number | null;
    path: string;
  }): Promise<RepoType | Error> => {
    const { data: existingRepo, error: existingRepoError } =
      await Supabase.getInstance()
        .from(Supabase.tables.REPO)
        .select("*")
        .eq("username", userName)
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
        repo_name: repoName,
        user_id: userId,
        user_name: userName,
        folder_id: folderId !== null ? +folderId : null,
        path,
      })
      .select("*")
      .single();

    if (repoError !== null) {
      return new Error("cannot create repo, try again later");
    }

    return repo;
  };
}
