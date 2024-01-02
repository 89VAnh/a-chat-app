import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { auth, db } from "../config/firebase.config";
import { firebaseErrors } from "../config/firebaseErrors.config";
import { emailRegex } from "../config/regex.config";
import { SET_USER } from "../context/actions/userAction";
import { SIGNUP_SCREEN, SPLASH_SCREEN } from "./screens";

export default function LoginScreen() {
  const screenWidth = Math.round(Dimensions.get("window").width);
  // const { t } = useTranslation("translation", { keyPrefix: "all" });
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const [emailValid, setEmailValid] = useState(false);
  useEffect(() => {
    setEmailValid(emailRegex.test(email) || email.length === 0);
  }, [email]);

  useLayoutEffect(() => {
    setEmailValid(true);
  }, []);
  const [aleart, setAleart] = useState("");

  const resetErr = () => {
    setAleart("");
  };

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (emailValid) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          if (user) {
            console.log("User Id : ", user.user.uid);
            getDoc(doc(db, "users", user.user.uid)).then((docSnap) => {
              if (docSnap.exists()) {
                console.log("User data:", docSnap.data());
                dispatch(SET_USER(docSnap.data()));
              } else {
                console.log("No such User!");
              }
            });
          }
        })
        .then(() => {
          setTimeout(() => {
            navigation.navigate(SPLASH_SCREEN);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          console.log(err.code);
          setAleart(firebaseErrors[err.code]);
        });
    }
  };

  return (
    <View className='items-center justify-start flex-1'>
      <Image
        source={BGImage}
        resizeMode='cover'
        className='flex-[0.6]'
        style={{ width: screenWidth }}
      />

      <View className=' w-full flex-1 -mt-44 bg-white rounded-tl-[90px]  py-6 px-6 space-y-6'>
        <KeyboardAvoidingView
          className='items-center justify-center flex-1 w-full'
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Image source={Logo} className='w-16 h-16' resizeMode='contain' />

          <Text className='py-2 text-xl font-semibold text-primaryText'>
            {t("wellcome")}
          </Text>

          <View className='flex items-center justify-center w-full'>
            <UserTextInput
              placeholder={t("form.email")}
              isPass={false}
              setState={setEmail}
              icon='email'
              valid={emailValid}
              resetErr={resetErr}
            />
            <UserTextInput
              placeholder={t("form.password")}
              isPass={true}
              setState={setPassword}
              icon='lock'
              resetErr={resetErr}
            />
            {/* aleart */}
            {aleart && <Text className='text-base text-red-600'>{aleart}</Text>}

            <TouchableOpacity
              onPress={handleLogin}
              className='flex items-center justify-center w-full px-4 py-2 my-3 rounded-xl bg-primary'>
              <Text className='py-2 text-xl font-semibold text-white'>
                {t("signin")}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <View className='flex-row items-center justify-center w-full py-12 space-x-2'>
          <Text className='text-base text-primaryText'>
            {t("signin_question")}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate(SIGNUP_SCREEN)}>
            <Text className='text-base font-semibold text-primaryBold'>
              {t("create_here")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
