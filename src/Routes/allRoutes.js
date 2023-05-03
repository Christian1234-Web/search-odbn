import React from "react";
import { Redirect } from "react-router-dom";

//login
// import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";

import IndexSearch from "../pages/Pages/Government/Search/Index"
import ViewOpticianOptometrist from "../pages/Pages/Government/Search/ViewOpticianOptometrist";

import ViewPractice from "../pages/Pages/Government/Search/ViewPractice";

const authProtectedRoutes = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/" />,
  },
  {
    path: "*",
    exact: true,
    component: () => <Redirect to="/auth-404-cover" />,
  }
];

const publicRoutes = [
  { path: "/", component: IndexSearch },
  { path: "/search-dashboard/view/facility/:id", component: ViewPractice },
  { path: "/search-dashboard/view/:type/:id", component: ViewOpticianOptometrist }

];

export { authProtectedRoutes, publicRoutes };