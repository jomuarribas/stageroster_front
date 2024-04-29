import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user: {
        username: string;
        email: string;
        name: string;
        img: string;
        groups: [];
        surnames: string;
        myDates: [];
        groupDates: [];
        _id: string;
      };
      token: string;
    };
  }
}