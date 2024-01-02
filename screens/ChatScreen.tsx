import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../config/firebase.config";

import EmojiPicker, { EmojiType } from "rn-emoji-keyboard";
import PopupMenu from "../components/PopupMenu";
import { convertTimeStamp } from "../utils/convertTimeStamp";

export default function ChatScreen({ route }: { route: any }) {
  const navigation = useNavigation();
  const user = useSelector<any, any>((state) => state.user.user);

  const { room } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<DocumentData[]>([]);

  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>();

  const sendMessage = async () => {
    if (message) {
      const timeStamp = serverTimestamp();
      const id = `${Date.now()}`;

      const _doc = {
        _id: id,
        roomId: room._id,
        timeStamp,
        message,
        user,
      };

      updateLastMessage({ message, timeStamp });
      setMessage("");

      await addDoc(
        collection(doc(db, "chats", room._id), "messages"),
        _doc
      ).catch((err) => alert(err));
    }
  };

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handlePick = (emojiObject: EmojiType) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  });

  const updateLastMessage = async (message: any) => {
    // Get a new write batch
    const batch = writeBatch(db);

    const sfRef = doc(db, "chats", room._id);
    batch.update(sfRef, {
      lastMessage: message.message,
      lastMessageTimeStamp: message.timeStamp,
    });

    // Commit the batch
    await batch.commit();
  };

  useLayoutEffect(() => {
    const messageQuery = query(
      collection(db, "chats", room._id, "messages"),
      orderBy("timeStamp")
    );

    const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
      const upMessage = snapshot.docs.map((doc) => doc.data());
      setMessages(upMessage);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <View className='flex-1'>
      <View className='w-full bg-primary  py-6 flex-[0.2]'>
        <View className='flex-row items-center justify-between w-full overflow-visible py-11 '>
          <View className='flex-row items-center justify-between space-x-2'>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name='chevron-back' size={32} color='#fbfbfb' />
            </TouchableOpacity>

            <View className='flex-row items-center justify-center space-x-3'>
              <View className='flex items-center justify-center w-12 h-12 border border-white rounded-full'>
                <FontAwesome5 name='users' size={24} color='#fbfbfb' />
              </View>
              <View>
                <Text className='text-base font-semibold capitalize text-gray-50'>
                  {room.chatName.length > 15
                    ? room.chatName.slice(0, 15) + "..."
                    : room.chatName}
                </Text>
                <Text className='text-sm font-semibold text-gray-100 capitalize'>
                  online
                </Text>
              </View>
            </View>
          </View>

          <View className='flex-row items-center justify-center space-x-3 '>
            <TouchableOpacity>
              <FontAwesome5 name='video' size={24} color='#fbfbfb' />
            </TouchableOpacity>

            <TouchableOpacity>
              <FontAwesome5 name='phone' size={24} color='#fbfbfb' />
            </TouchableOpacity>

            <PopupMenu
              options={[1, 2, 3]}
              onSelect={(value: any) => console.log(value)}>
              <Entypo name='dots-three-vertical' size={24} color='#fbfbfb' />
            </PopupMenu>
          </View>
        </View>
      </View>
      <View className='w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10'>
        <KeyboardAvoidingView
          className='flex-1'
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}>
          <ScrollView ref={scrollViewRef}>
            {isLoading ? (
              <View className='flex items-center justify-center w-full'>
                <ActivityIndicator size='large' color='#43C651' />
              </View>
            ) : (
              <>
                {messages?.map((message: any, i: number) => {
                  const isMyMessage =
                    message.user.provideData.email === user.provideData.email;

                  if (isMyMessage)
                    return (
                      <View key={i} className='flex items-end m-1'>
                        <View className='relative self-end w-auto px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-primary'>
                          <Text className='text-base font-semibold text-white'>
                            {message.message}
                          </Text>
                        </View>
                        {/* <Image
                          source={{ uri: message?.user?.profilePic }}
                          className='w-8 h-8 rounded-full'
                        /> */}
                        <View className='self-end'>
                          {message?.timeStamp?.seconds && (
                            <Text className='text-gray-400'>
                              {convertTimeStamp(message?.timeStamp)}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  else
                    return (
                      <View
                        key={i}
                        className='flex self-start justify-center my-3 space-x-2 item-center'>
                        <View className='flex-row self-start justify-center space-x-2 item-center'>
                          <Image
                            className='w-12 h-12 rounded-full'
                            resizeMode='cover'
                            source={{ uri: message?.user?.profilePic }}
                          />
                          <View className='m-1'>
                            <View className='relative self-start w-auto px-4 py-2 bg-gray-100 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'>
                              <Text className='text-base font-semibold text-primaryText'>
                                {message.message}
                              </Text>
                            </View>
                            <View className='self-start'>
                              {message?.timeStamp?.seconds && (
                                <Text className='text-black text-[12px] font-semibold'>
                                  {convertTimeStamp(message?.timeStamp)}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                })}
              </>
            )}
          </ScrollView>
          <View className='flex-row items-center justify-center px-8'>
            <View className='flex-row items-center justify-center px-4 py-2 space-x-4 bg-gray-200 rounded-2xl'>
              <TouchableOpacity onPress={() => setIsOpen(true)}>
                <Entypo name='emoji-happy' size={24} color='#555' />
              </TouchableOpacity>
              <EmojiPicker
                onEmojiSelected={handlePick}
                open={isOpen}
                onClose={() => setIsOpen(false)}
              />
              <TextInput
                className='flex-1 h-8 text-base font-semibold text-primaryText'
                placeholder='Type here ...'
                placeholderTextColor='#999'
                value={message}
                onChangeText={setMessage}
                ref={textInputRef}
              />

              <TouchableOpacity>
                <Entypo name='mic' size={24} color='#43C651' />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={sendMessage} className='pl-4'>
              <FontAwesome name='send' size={24} color='#555' />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
