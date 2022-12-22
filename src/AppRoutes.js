import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Overview from "./components/Overview";
import Diagnosis from "./components/Diagnosis";
import Chat from "./components/Chat";
import Signin from "./components/Signin";
import ProfileAccount from "./components/ProfileAccount";
import ConnectMap from "./components/ConnectMap";

import Illnesses from "./manages/Illnesses";
import Symptoms from "./manages/Symptoms";
import Rules from "./manages/Rules";

import { isAuth } from "./settings/utils";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/overview" element={<Overview></Overview>} />
      <Route path="/diagnosis" element={<Diagnosis></Diagnosis>} />
      <Route path="/chat" element={<Chat></Chat>} />
      <Route
        path="/illnesses"
        element={isAuth() ? <Illnesses></Illnesses> : <Navigate to="/signin" />}
      />
      <Route
        path="/symptoms"
        element={isAuth() ? <Symptoms></Symptoms> : <Navigate to="/signin" />}
      />
      <Route
        path="/rules"
        element={isAuth() ? <Rules></Rules> : <Navigate to="/signin" />}
      />
      <Route path="/signin" element={<Signin></Signin>} />
      <Route
        path="/profile"
        element={
          isAuth() ? (
            <ProfileAccount></ProfileAccount>
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
      <Route path="/map" element={<ConnectMap></ConnectMap>} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
};

export default AppRoutes;
