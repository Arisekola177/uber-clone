
import { useState } from "react";
import { View, Image, TextInput, TouchableOpacity } from "react-native";
import { GoogleInputProps } from "@/types/type";
import { icons } from "../constants";

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
    
      <TouchableOpacity
        onPress={() => {
          handlePress({
            latitude: 0, 
            longitude: 0, 
            address: searchQuery,
          });
        }}
        className="justify-center items-center w-6 h-6 mr-2"
      >
        <Image
          source={icon ? icon : icons.search}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>

    
      <TextInput
        className="flex-1 h-10 px-4 rounded-lg bg-white"
        placeholder={initialLocation ?? "Where do you want to go?"}
        placeholderTextColor="gray"
        style={{
          backgroundColor: textInputBackgroundColor || "white",
          fontSize: 16,
          fontWeight: "600",
        }}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

export default GoogleTextInput;

 