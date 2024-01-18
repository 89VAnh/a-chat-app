import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { auth, db } from "../config/firebase.config";
import { firebaseErrors } from "../config/firebaseErrors.config";
import { emailRegex } from "../config/regex.config";
import { avatars } from "../utils/supports";
import { LOGIN_SCREEN } from "./screens";

export default function SignUpScreen() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]?.image?.asset?.url);
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);

  const navigation = useNavigation();

  const [aleart, setAleart] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  useEffect(() => {
    setEmailValid(emailRegex.test(email) || email.length === 0);
  }, [email]);

  const handleSignup = async () => {
    if (emailValid && email.length > 0) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
          const data = {
            _id: user?.uid,
            fullname: name,
            profilePic: avatar,
            provideData: user.providerData[0],
          };

          setDoc(doc(db, "users", user?.uid), data).then(() => {
            navigation.navigate(LOGIN_SCREEN);
          });
        })
        .catch((err) => {
          console.log(err.code);
          setAleart(firebaseErrors[err.code]);
        });
    }
  };

  const handleAvatar = (item: any) => {
    setAvatar(item?.image?.asset?.url);
    setIsAvatarMenu(false);
  };

  const resetErr = () => {
    setAleart("");
  };

  return (
    <View className='w-full h-full '>
      <Image
        source={BGImage}
        resizeMode='cover'
        className='flex-[0.4] w-full'
      />

      {isAvatarMenu && (
        <>
          <View className='absolute z-10'>
            <ScrollView>
              <BlurView
                className='flex-row flex-wrap items-center px-4 py-16 justify-evenly'
                tint='light'
                intensity={40}>
                {avatars?.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleAvatar(item)}
                    key={item._id}
                    className='w-20 h-20 p-1 m-3 border-2 rounded-full'>
                    <Image
                      source={{ uri: item?.image?.asset?.url }}
                      className='w-full h-full'
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </ScrollView>
          </View>
        </>
      )}

      <View className='w-full flex-1 bg-white rounded-tl-[90px] -mt-44 py-6 px-6 '>
        <KeyboardAvoidingView
          className='items-center justify-center flex-1 w-full space-y-6'
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={60}>
          <Image source={Logo} className='w-16 h-16' resizeMode='contain' />

          <Text className='py-2 text-xl font-semibold text-primaryText'>
            {t("join")}
          </Text>

          <View className='flex items-center justify-center w-full -my-4'>
            <TouchableOpacity
              onPress={() => setIsAvatarMenu(true)}
              className='relative w-20 h-20 p-1 border-2 rounded-full border-primary'>
              <Image
                source={{ uri: avatar }}
                className='w-full h-full'
                resizeMode='contain'
              />
              <View className='absolute top-0 right-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary'>
                <MaterialIcons name='edit' size={18} color='#fff' />
              </View>
            </TouchableOpacity>
          </View>

          <View className='flex items-center justify-center w-full'>
            <UserTextInput
              placeholder={t("form.fullname")}
              isPass={false}
              setState={setName}
              icon='person'
              resetErr={resetErr}
            />

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
              onPress={handleSignup}
              className='flex items-center justify-center w-full px-4 py-2 my-3 rounded-xl bg-primary'>
              <Text className='py-2 text-xl font-semibold text-white'>
                {t("signup")}
              </Text>
            </TouchableOpacity>
          </View>
          <View className='flex-row items-center justify-center w-full space-x-2'>
            <Text className='text-base text-primaryText'>
              {t("signup_question")}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate<string>("LoginScreen")}>
              <Text className='text-base font-semibold text-primaryBold'>
                {t("login_here")}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
