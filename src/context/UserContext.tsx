import { type FC, createContext, useState, useEffect, useContext } from "react";
import supabase from "@/lib/supabase";
import { type User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  setUser: (user: any) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  login: async (): Promise<void> => {},
  logout: async (): Promise<void> => {},
  checkUser: () => {},
});

export const useUser = (): UserContextType => useContext(UserContext);

interface UserProviderProps {
  children: JSX.Element | JSX.Element[];
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const login = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "public_repo",
      },
    });
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const checkUser = (): void => {
    supabase.auth
      .getUser()
      .then((user) => {
        if (user.error != null) {
          console.log(user.error.message);
          return;
        }
        setUser(user.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("hashchange", () => {
      checkUser();
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, setUser, checkUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;