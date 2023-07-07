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
    return createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
      },
    });
  }

  static getInstance = (): SupabaseInstance => {
    if (Supabase.client == null) {
      Supabase.client = Supabase.createClient();
    }
    return Supabase.client;
  };

  static isFolderType = (obj: FolderRepo): obj is FolderType => {
    return "parent_id" in obj;
  };

  static getFolderId = async (
    userName: string,
    path: string
  ): Promise<number | Error> => {
    const { data: folder, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .select("id")
      .eq("user_name", userName)
      .eq("path", path)
      .maybeSingle();

    if (folderError !== null || folder === null) {
      return new Error("cannot find folder, try again later");
    }
    return folder.id;
  };

  static getRootFolderRepos = async (
    userName: string
  ): Promise<FolderRepo[] | null> => {
    const { data: folders, error: folderError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .select("*")
      .eq("user_name", userName)
      .is("parent_id", null);

    if (folderError !== null) {
      return null;
    }
    const { data: repos, error: reposError } = await Supabase.getInstance()
      .from(Supabase.tables.REPO)
      .select("*")
      .eq("user_name", userName)
      .is("folder_id", null);

    if (reposError !== null) {
      return null;
    }
    return [...folders, ...repos];
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
        .eq("user_name", userName)
        .eq("user_id", userId)
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
        user_id: userId,
        user_name: userName,
        folder_name: folderName,
        parent_id: parentId !== null ? +parentId : null,
        path,
      })
      .select("*")
      .maybeSingle();

    if (folderError !== null || folder === null) {
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
        .eq("user_name", userName)
        .eq("user_id", userId)
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
      .maybeSingle();

    if (repoError !== null || repo === null) {
      return new Error("cannot create repo, try again later");
    }

    return repo;
  };

  static deleteFolders = async ({
    userName,
    userId,
    ids,
  }: {
    userName: string;
    userId: string;
    ids: number[];
  }): Promise<Error | null> => {
    const { error: deletionError } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .delete()
      .eq("user_name", userName)
      .eq("user_id", userId)
      .in("id", ids);
    if (deletionError !== null) {
      return new Error("cannot delete, try again");
    }
    return null;
  };

  static deleteRepos = async ({
    userName,
    userId,
    ids,
  }: {
    userName: string;
    userId: string;
    ids: number[];
  }): Promise<Error | null> => {
    const { error: deletionError } = await Supabase.getInstance()
      .from(Supabase.tables.REPO)
      .delete()
      .eq("user_name", userName)
      .eq("user_id", userId)
      .in("id", ids);
    if (deletionError !== null) {
      return new Error("cannot delete, try again");
    }
    return null;
  };

  static renameFolder = async ({
    userName,
    userId,
    folder,
    newName,
    newPath,
  }: {
    userName: string;
    userId: string;
    folder: FolderType;
    newName: string;
    newPath: string;
  }): Promise<FolderType | Error> => {
    const { data: updatedFolder, error } = await Supabase.getInstance()
      .from(Supabase.tables.FOLDER)
      .update({
        folder_name: newName,
        path: newPath,
      })
      .eq("user_name", userName)
      .eq("user_id", userId)
      .eq("id", folder.id)
      .select("*")
      .maybeSingle();

    if (error !== null || updatedFolder === null) {
      return new Error("cannot rename folder, try again later.");
    }

    const childrenError = await Supabase.getRecursiveChildrens({
      userName,
      userId,
      folder,
      newPath,
    });

    if (childrenError !== null) {
      return childrenError;
    }

    return updatedFolder;
  };

  private static async getRecursiveChildrens({
    userName,
    userId,
    folder,
    newPath,
  }: {
    userName: string;
    userId: string;
    folder: FolderType;
    newPath: string;
  }): Promise<Error | null> {
    const updatePath = async (
      children: FolderRepo[]
    ): Promise<Error | null> => {
      for (const child of children) {
        const childNewPath = child.path.replace(folder.path, newPath);

        const { data: updatedChild, error: updatedChildError } =
          await Supabase.getInstance()
            .from(
              Supabase.isFolderType(child)
                ? Supabase.tables.FOLDER
                : Supabase.tables.REPO
            )
            .update({
              path: childNewPath,
            })
            .eq("user_name", userName)
            .eq("user_id", userId)
            .eq("id", child.id)
            .select("*")
            .maybeSingle();

        if (updatedChildError !== null || updatedChild === null) {
          return new Error("cannot rename, try again later.");
        }
        if (Supabase.isFolderType(child)) {
          const subChildError = await renameRecursively(child);
          if (subChildError !== null) {
            return new Error("cannot rename, try again later.");
          }
        }
      }
      return null;
    };

    const renameRecursively = async (f: FolderType): Promise<Error | null> => {
      const { data: subFolders, error: subFolderError } =
        await Supabase.getInstance()
          .from(Supabase.tables.FOLDER)
          .select("*")
          .eq("user_name", userName)
          .eq("user_id", userId)
          .eq("parent_id", f.id);

      if (subFolderError !== null) {
        return new Error("cannot rename, try again later.");
      }

      if (subFolders === null || subFolders.length === 0) {
        return null;
      }

      const { data: subRepos, error: subReposError } =
        await Supabase.getInstance()
          .from(Supabase.tables.REPO)
          .select("*")
          .eq("user_name", userName)
          .eq("user_id", userId)
          .eq("folder_id", f.id);

      if (subReposError !== null) {
        return new Error("cannot rename, try again later.");
      }

      if (subRepos === null || subRepos.length === 0) {
        return null;
      }

      const updationError = await updatePath([...subRepos, ...subFolders]);
      if (updationError !== null) {
        return updationError;
      }
      return null;
    };

    return await renameRecursively(folder);
  }
}
