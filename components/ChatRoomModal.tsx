import { useNavigation } from "@react-navigation/native";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../config/firebase.config";
import { HOME_SCREEN } from "../screens/screens";

const ChatRoomModal = ({
  chatId,
  children,
}: {
  chatId: string;
  children: any;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const options = [
    {
      label: "Rename",
      color: "primary",
      func: () => {
        console.log("Rename");
      },
    },
    {
      label: "Delete",
      color: "red-700",
      func: async () => {
        await deleteDoc(doc(db, "chats", chatId)).then(() =>
          navigation.navigate(HOME_SCREEN)
        );
      },
    },
    {
      label: "Close",
      color: "red-200",
      func: () => {
        console.log("Close");
      },
    },
  ];

  return (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
      {children}
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View className='items-center justify-center flex-1 mt-5'>
          <View style={styles.modalView}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                className={`bg-primary bg-${option?.color}  p-2.5 rounded-3xl w-full block`}
                onPress={() => {
                  option?.func();
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>{option?.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: "flex",
    width: "80%",
    gap: 8,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "100%",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default ChatRoomModal;
