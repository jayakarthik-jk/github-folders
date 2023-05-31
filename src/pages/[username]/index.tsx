"use client";

import Container from "@/components/common/Container";
import Folder from "@/components/common/Folder";
import Navbar from "@/components/common/Navbar";
import { FC, useState } from "react";

export interface UserPageProps {
  params: {
    username: string;
  };
}

const data = [
  "folder name 1 1",
  "folder name 1 2",
  "folder name 1 3",
  "folder name 1 4",
  "folder name 1 5",
  "folder name 1 6",
  "folder name 1 7",
  "folder name 1 8",
  "folder name 1 9",
  "folder name 1 10",
  "folder name 1 11",
  "folder name 1 12",
  "folder name 1 13",
  "folder name 1 14",
  "folder name 1 15",
  "folder name 1 16",
  "folder name 1 17",
  "folder name 1 18",
  "folder name 1 19",
  "folder name 1 20",
  "folder name 1 21",
  "folder name 1 22",
  "folder name 1 23",
  "folder name 1 24",
  "folder name 1 25",
  "folder name 1 26",
  "folder name 1 27",
  "folder name 1 28",
  "folder name 1 29",
  "folder name 1 30",
  "folder name 2 1",
  "folder name 2 2",
  "folder name 2 3",
  "folder name 2 4",
  "folder name 2 5",
  "folder name 2 6",
  "folder name 2 7",
  "folder name 2 8",
  "folder name 2 9",
  "folder name 2 10",
  "folder name 2 11",
  "folder name 2 12",
  "folder name 2 13",
  "folder name 2 14",
  "folder name 2 15",
  "folder name 2 16",
  "folder name 2 17",
  "folder name 2 18",
  "folder name 2 19",
  "folder name 2 20",
  "folder name 2 21",
  "folder name 2 22",
  "folder name 2 23",
  "folder name 2 24",
  "folder name 2 25",
  "folder name 2 26",
  "folder name 2 27",
  "folder name 2 28",
  "folder name 2 29",
  "folder name 2 30",
  "folder name 3 1",
  "folder name 3 2",
  "folder name 3 3",
  "folder name 3 4",
  "folder name 3 5",
  "folder name 3 6",
  "folder name 3 7",
  "folder name 3 8",
  "folder name 3 9",
  "folder name 3 10",
  "folder name 3 11",
  "folder name 3 12",
  "folder name 3 13",
  "folder name 3 14",
  "folder name 3 15",
  "folder name 3 16",
  "folder name 3 17",
  "folder name 3 18",
  "folder name 3 19",
  "folder name 3 20",
  "folder name 3 21",
  "folder name 3 22",
  "folder name 3 23",
  "folder name 3 24",
  "folder name 3 25",
  "folder name 3 26",
  "folder name 3 27",
  "folder name 3 28",
  "folder name 3 29",
  "folder name 3 30",
];

const UserPage: FC<UserPageProps> = ({ params }) => {
  // TODO:
  // fetch the data from the database using the username
  // if user found fetch the repos from the github and categorize it with the folder
  // if the username is not found, fetch the data from the github and add all repos in a single folder called "All Repos"
  // if the username is not found, display a 404 page

  //   TODO: addon features
  //   2. add a button to create a new folder
  const [folders, setFolders] = useState(data);
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Container title="FOLDERS">
        {folders.map((folder, index) => (
          <Folder key={index} title={folder} />
        ))}
      </Container>
    </div>
  );
};

export default UserPage;
