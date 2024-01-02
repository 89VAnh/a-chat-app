import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import React, { useLayoutEffect } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { useDispatch } from "react-redux";
import { Logo } from "../assets";
import { auth, db } from "../config/firebase.config";
import { SET_USER } from "../context/actions/userAction";
import { HOME_SCREEN, LOGIN_SCREEN } from "./screens";

export default function SplashScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    checkLoggedUser();
  });

  const checkLoggedUser = async () => {
    auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        if (user) {
          getDoc(doc(db, "users", user.uid))
            .then((docSnap) => {
              if (docSnap.exists()) {
                dispatch(SET_USER(docSnap.data()));
              } else {
                console.log("No such User!");
              }
            })
            .then(() => {
              setTimeout(() => {
                navigation.navigate(HOME_SCREEN);
              }, 2000);
            });
        }
      } else {
        navigation.navigate(LOGIN_SCREEN);
      }
    });
  };

  return (
    <View className='items-center justify-center flex-1 space-y-24'>
      <Image source={Logo} className='w-24 h-24' resizeMode='contain' />
      <ActivityIndicator size='large' color='#43C651' />
    </View>
  );
}
