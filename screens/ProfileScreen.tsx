import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../config/firebase.config";
import { SET_USER_NULL } from "../context/actions/userAction";
import { LOGIN_SCREEN } from "./screens";

const ProfileItem = ({
  iconName,
  text,
}: {
  iconName: string;
  text: string;
}) => (
  <View className='items-center justify-center'>
    <TouchableOpacity className='items-center justify-center w-12 h-12 bg-gray-200 rounded-lg'>
      <Ionicons name={iconName} size={24} color='#555' />
    </TouchableOpacity>
    <Text className='py-1 text-sm text-primaryText'>{text}</Text>
  </View>
);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = useSelector<any, any>((state) => state?.user?.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await auth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.navigate(LOGIN_SCREEN);
    });
  };
  return (
    <ScrollView>
      <SafeAreaView className='items-center justify-start flex-1'>
        <View className='flex-row items-center justify-between w-full px-4'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='chevron-back' size={32} color='#555' />
          </TouchableOpacity>

          <TouchableOpacity>
            <Entypo name='dots-three-vertical' size={24} color='#555' />
          </TouchableOpacity>
        </View>
        <View className='items-center justify-center'>
          <View className='p-1 border-2 rounded-full realative border-primary'>
            <Image
              source={{ uri: user?.profilePic }}
              className='w-24 h-24'
              resizeMode='contain'
            />
          </View>

          <Text className='pt-3 text-2xl font-semibold text-primaryBold'>
            {user?.fullname}
          </Text>
          <Text className='text-base font-semibold text-primaryText'>
            {user?.provideData.email}
          </Text>
        </View>
        <View className='flex-row items-center w-full py-6 justify-evenly'>
          <ProfileItem iconName='chatbubbles-outline' text='Message' />
          <ProfileItem iconName='videocam-outline' text='Video Call' />
          <ProfileItem iconName='call-outline' text='Call' />
          <ProfileItem iconName='ellipsis-horizontal-outline' text='More' />
        </View>
        <View className='w-full px-6 space-y-3'>
          <View className='flex-row items-center justify-between w-full'>
            <Text className='text-base font-semibold text-primaryText'>
              Media Shared
            </Text>
            <TouchableOpacity>
              <Text className='text-base font-semibold uppercase text-primaryText'>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <View className='flex-row items-center justify-between w-full'>
            <TouchableOpacity className='w-24 h-24 m-1 overflow-hidden bg-gray-300 rounded-xl'>
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/photo/2023/06/29/10/33/lion-8096155_1280.png",
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </TouchableOpacity>

            <TouchableOpacity className='w-24 h-24 m-1 overflow-hidden bg-gray-300 rounded-xl'>
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/photo/2023/07/02/18/49/cup-8102791_640.jpg",
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </TouchableOpacity>

            <TouchableOpacity className='relative w-24 h-24 m-1 overflow-hidden bg-gray-300 rounded-xl'>
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/photo/2023/07/07/17/47/sushi-8113165_640.jpg",
                }}
                className='w-full h-full'
                resizeMode='cover'
              />
              <View className='absolute w-full h-full items-center justify-center bg-[#00000068]'>
                <Text className='text-base font-semibold text-white'>250+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className='flex-row items-center justify-between w-full px-6 py-4'>
          <View className='flex-row items-center'>
            <MaterialIcons name='security' size={24} color={"#555"} />
            <Text className='px-3 text-base font-semibold text-primaryText'>
              Privacy
            </Text>
          </View>
          <MaterialIcons name='chevron-right' size={32} color={"#555"} />
        </View>
        <View className='flex-row items-center justify-between w-full px-6 py-4'>
          <View className='flex-row items-center'>
            <MaterialIcons name='message' size={24} color={"#555"} />
            <Text className='px-3 text-base font-semibold text-primaryText'>
              Groups
            </Text>
          </View>
          <MaterialIcons name='chevron-right' size={32} color={"#555"} />
        </View>
        <View className='flex-row items-center justify-between w-full px-6 py-4'>
          <View className='flex-row items-center'>
            <MaterialIcons name='music-note' size={24} color={"#555"} />
            <Text className='px-3 text-base font-semibold text-primaryText'>
              Media's & Downloads
            </Text>
          </View>
          <MaterialIcons name='chevron-right' size={32} color={"#555"} />
        </View>
        <View className='flex-row items-center justify-between w-full px-6 py-4'>
          <View className='flex-row items-center'>
            <MaterialIcons name='person' size={24} color={"#555"} />
            <Text className='px-3 text-base font-semibold text-primaryText'>
              Account
            </Text>
          </View>
          <MaterialIcons name='chevron-right' size={32} color={"#555"} />
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className='flex-row items-center justify-center w-full px-6 py-4'>
          <Text className='px-3 text-lg font-semibold text-primaryBold'>
            Logout
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}
