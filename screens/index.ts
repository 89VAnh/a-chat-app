import { ReactNode } from "react";
import AddToChatScreen from "./AddToChatScreen";
import ChatScreen from "./ChatScreen";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import ProfileScreen from "./ProfileScreen";
import SignUpScreen from "./SignUpScreen";
import SplashScreen from "./SplashScreen";
import {
  ADD_CHAT_SCREEN,
  CHAT_SCREEN,
  HOME_SCREEN,
  LOGIN_SCREEN,
  PROFILE_SCREEN,
  SIGNUP_SCREEN,
  SPLASH_SCREEN,
} from "./screens";

const screens: { name: string; component: React.FC<any> }[] = [
  { name: HOME_SCREEN, component: HomeScreen },
  { name: LOGIN_SCREEN, component: LoginScreen },
  { name: SIGNUP_SCREEN, component: SignUpScreen },
  { name: SPLASH_SCREEN, component: SplashScreen },
  { name: ADD_CHAT_SCREEN, component: AddToChatScreen },
  { name: CHAT_SCREEN, component: ChatScreen },
  { name: PROFILE_SCREEN, component: ProfileScreen },
];

export default screens;
