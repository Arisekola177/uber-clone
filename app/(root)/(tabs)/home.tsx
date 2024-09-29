import * as Location from 'expo-location'
import GoogleTextInput from "@/app/components/GoogleTextInput";
import Map from "@/app/components/Map";
import RideCard from "@/app/components/RideCard";
import { icons, images } from "@/app/constants";
import { useLocationStore } from "@/store";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator,ScrollView, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import FindRide from '@/app/components/FindRide';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";


 export default function Page() {
   const { user } = useUser();
  const { signOut } = useAuth();

   const { setUserLocation, setDestinationLocation } = useLocationStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/signIn");
  };

   const [hasPermission, setHasPermission] = useState<boolean>(false);

   useEffect(() => {
     (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

     let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
         address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, []);


  return (
      <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-general-500 p-3 flex-1">
        <View className="flex-1">
          <View className="flex flex-row items-center justify-between my-5">
            <Text className="text-2xl capitalize font-JakartaExtraBold">
              Welcome{", "}
              {user?.firstName ||
                user?.emailAddresses[0].emailAddress.split("@")[0]}
              👋
            </Text>
            <TouchableOpacity
              className="justify-center items-center w-10 h-10 rounded-full bg-white"
              onPress={handleSignOut}
            >
              <Image source={icons.out} className="w-4 h-4" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-JakartaBold mt-5 mb-3">
            Your Current Location
          </Text>
          <View className="flex flex-row items-center bg-transparent h-[300px]">
            <Map />
          </View>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["30%", "80%"]}
            index={0}
          >
            <BottomSheetScrollView style={{ padding: 14 }}>
              <Text className="text-xl font-JakartaSemiBold mb-3">
                Where do you want to go?
              </Text>
              <FindRide />
            </BottomSheetScrollView>
          </BottomSheet>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
   );
}
