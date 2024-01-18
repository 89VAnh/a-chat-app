import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { use } from "i18next";
import React, { useState } from "react";
import {
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../config/firebase.config";
import { HOME_SCREEN } from "./screens";

export default function AddToChatScreen() {
  const navigation = useNavigation();
  const user = useSelector<any, any>((state) => state.user.user);
  const [addChat, setAddChat] = useState("");

  const createNewChat = async () => {
    let id = `${Date.now()}`;

    const _doc = {
      _id: id,
      user: user,
      chatName: addChat,
      lastMessage: "🎉",
      lastMessageTimeStamp: serverTimestamp(),
    };

    if (addChat) {
      setDoc(doc(db, "chats", id), _doc)
        .then(() => {
          setAddChat("");
          navigation.navigate(HOME_SCREEN);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <View className='flex-1'>
      <View className='w-full bg-primary px-4 py-6 flex-[0.2]'>
        <View className='flex-row items-center justify-between w-full px-4 py-12'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='chevron-back' size={32} color='#fbfbfb' />
          </TouchableOpacity>

          <View className='flex-row items-center justify-center space-x-3'>
            <Image
              source={{ uri: user?.profilePic }}
              className='w-12 h-12'
              resizeMode='contain'
            />
          </View>
        </View>
      </View>

      <View className='w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10'>
        <View className='w-full px-4 py-4'>
          <View className='flex-row items-center justify-between w-full px-4 py-3 space-x-3 border border-gray-200 rounded-xl'>
            {/* icons */}
            <Ionicons name='chatbubbles' size={24} color='#777' />
            {/* textInput */}
            <TextInput
              className='flex-1 w-full h-12 -mt-2 text-lg text-primaryText'
              placeholder='Create a chat'
              placeholderTextColor='#999'
              value={addChat}
              onChangeText={(text: string) => setAddChat(text)}
            />
            {/* icon */}
            <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name='send' size={24} color='#777' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
