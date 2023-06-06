import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import SignUpForm from "./Components/LogInForm/LogInForm";
import LoginForm from "./Components/SignUpForm/SignUpForm";
import HomePage from "./Components/HomePage/HomePage";
import { BrowserRouter, Navigate, Route, Routes, redirect } from "react-router-dom";
import SuggestionProfile from "./Components/HomePage/suggestionProfile/SuggestionProfile";
import Profile from "./Components/HomePage/Profile/Profile";
import { fetchUserLoggedInUserDetails } from "./Actions/UserDetailsAction/UserDetailsAction";
import { TStore } from "./Store/store";

const App: React.FC = () => {
  const dispatch = useDispatch<any>();
  const loggedInUser: any = useSelector<TStore>(
    (state) => state.loggedInUserDetails
  );

  useEffect(() => {
    dispatch(fetchUserLoggedInUserDetails());
  }, []);
  if (loggedInUser.isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/MyProfile" element={<Profile />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="*" element={<div>404 not found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
