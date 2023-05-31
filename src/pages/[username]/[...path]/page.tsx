import React, { FC } from "react";

export interface FolderPageProps {
  params: {
    username: string;
    path: string[];
  };
}

const FolderPage = async ({ params: { path, username } }: FolderPageProps) => {
  // TODO:
  // get the repos that are in the folder
  // if folder not exist redirect to 404 page
  // if folder exist, display the repos
  // TODO: addon features
  // if the user clicks on the repo, redirect to the repo page
  const repos = await fetch(
    `https://api.github.com/users/${username}/repos`
  ).then((res) => res.json());

  console.log(repos.length);
  const getProps = async (form: FormData) => {
    "use server";
    console.log(form);
  };
  return (
    <div>
      <form action={getProps}>
        <button type="submit">Submit</button>
      </form>
      {username} - {path}
    </div>
  );
};

export default FolderPage;
