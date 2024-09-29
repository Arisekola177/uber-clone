import { router } from "expo-router";
import { FlatList, View } from "react-native";
import { useDriverStore } from "@/store";
import RideLayout from "../components/RideLayout";
import DriverCard from "../components/DriverCard";
import CustomButton from "../components/CustomButton";
import { useEffect } from "react";


const ConfirmRide = () => {
  
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["35%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(item.id!)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Ride"
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};


export default ConfirmRide;



