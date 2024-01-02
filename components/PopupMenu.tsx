import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const PopupMenu = ({
  options,
  onSelect,
  children,
}: {
  options: any[];
  onSelect: CallableFunction;
  children: React.JSX.Element;
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOptionPress = (option: any) => {
    setModalVisible(false);
    onSelect(option);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {children}
      </TouchableOpacity>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className='items-center justify-center flex-1'>
          <View className='p-16 bg-white rounded-lg'>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                className='items-center p-8 mx-4'
                onPress={() => handleOptionPress(option)}>
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PopupMenu;
