import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  DocumentData,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { Logo } from "../assets";
import { db } from "../config/firebase.config";
import { convertTimeStamp } from "../utils/convertTimeStamp";
import { ADD_CHAT_SCREEN, CHAT_SCREEN, PROFILE_SCREEN } from "./screens";

const MessageCard = ({ room }: { room: any }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(CHAT_SCREEN, { room: room })}
      className='flex-row items-center justify-start w-full py-2'>
      <View className='flex items-center justify-center w-16 h-16 p-1 border-2 rounded-full border-primary'>
        <FontAwesome5 name='users' size={24} color='#555' />
      </View>
      <View className='flex justify-center flex-1 ml-4'>
        <Text className='text-[#333] text-base font-semibold capitalize'>
          {room.chatName.length > 15
            ? room.chatName.slice(0, 15) + "..."
            : room.chatName}
        </Text>

        <Text className='text-sm text-primaryText'>{room.lastMessage}</Text>
      </View>

      <Text className='px-4 text-base font-semibold text-primary'>
        {convertTimeStamp(room.lastMessageTimeStamp)}
      </Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const user = useSelector<any, any>((state) => state?.user?.user);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [rooms, setRooms] = useState<DocumentData[]>([]);

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(db, "chats"),
      orderBy("lastMessageTimeStamp", "desc")
    );

    // function to stop listening to the updates
    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const chatRooms = snapshot.docs.map((doc) => doc.data());
      setRooms(chatRooms);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <View className='flex-1'>
      <SafeAreaView className='bg-primary'>
        <View className='flex-row items-center justify-between w-full px-4 py-2'>
          <Image source={Logo} className='w-12 h-12' resizeMode='contain' />
          <View className='flex-row items-center gap-3'>
            <Text className='text-2xl font-semibold text-white capitalize'>
              {user?.fullname}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(PROFILE_SCREEN)}
              className='flex items-center justify-center w-12 h-12 border rounded-full border-primary'>
              <Image
                source={{ uri: user?.profilePic }}
                className='w-full h-full'
                resizeMode='cover'
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className='flex-row items-center justify-between w-full px-2 pt-6 bg-white'>
          <Text className='px-4 pb-2 text-base font-extrabold text-primaryText'>
            Messages
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(ADD_CHAT_SCREEN);
            }}>
            <Ionicons name='chatbox' size={28} color='#555' />
          </TouchableOpacity>
        </View>

        <ScrollView className='w-full h-full px-4 pt-4 bg-white'>
          {isLoading ? (
            <>
              <View className='flex items-center justify-center w-full mt-10'>
                <ActivityIndicator size='large' color='#43C651' />
              </View>
            </>
          ) : (
            <>
              {rooms && rooms.length > 0 ? (
                rooms.map((room: any) => (
                  <MessageCard key={room._id} room={room} />
                ))
              ) : (
                <></>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
