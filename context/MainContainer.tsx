"use client";

import { registerLicense, setCulture } from "@syncfusion/ej2-base";
//import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { setComponentsCulture } from "../traslation/syncfusion.translate";
///import { SessionProvider } from "next-auth/react";
//import { MainContextProvider } from "./MainProvider";

registerLicense(
  "ORg4AjUWIQA/Gnt2XVhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5SdERjXnpacHRcQ2lZ"
);

//setCulture("es");
setComponentsCulture("es");
export function MainContainer({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
