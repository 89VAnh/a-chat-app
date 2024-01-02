import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function UserTextInput({
  placeholder,
  isPass,
  setState,
  icon,
  valid = true,
  resetErr,
}: {
  placeholder: string;
  isPass: boolean;
  setState: React.Dispatch<React.SetStateAction<string>>;
  icon: string;
  valid?: boolean;
  resetErr: CallableFunction;
}) {
  const [value, setValue] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(true);

  const handleChange = (text: string) => {
    setValue(text);
    setState(text);
    resetErr();
  };

  return (
    <View
      className={`border rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2  ${
        !valid ? "border-red-500" : "border-gray-200"
      }`}>
      <MaterialIcons name={icon} size={24} color='#6c6d83' />
      <TextInput
        className='flex-1 -mt-1 text-base font-semibold text-primaryText'
        placeholder={placeholder}
        value={value}
        onChangeText={handleChange}
        secureTextEntry={isPass && showPass}
        autoCapitalize='none'
      />

      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Entypo
            name={showPass ? "eye" : "eye-with-line"}
            size={24}
            color='#6c6d83'
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
