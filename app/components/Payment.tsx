import { PaymentProps } from "@/types/type";
import { useLocationStore } from "@/store";
import { useAuth } from "@clerk/clerk-expo";
import { fetchAPI } from "@/libs/fetch";
import React, { useRef, useState } from "react";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import { View, Text } from "react-native";
import CustomButton from "./CustomButton";
import ReactNativeModal from "react-native-modal";
import { Image } from "react-native";
import { images } from "../constants";
import { router } from "expo-router";


const paystackPublishkey = process.env.EXPO_PUBLIC_PAYSTACK_API_KEY!;
const paystackSecretkey = process.env.PAYSTACK_SECRET_KEY!;

export default function Payment({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) {
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null); // Fix the type and initial value of ref
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const { userId } = useAuth();
  const [success, setSuccess] = useState<boolean>(false);

  const createRide = async () => {
    try {
      const response =  await fetchAPI("/(api)/ride/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin_address: userAddress,
          destination_address: destinationAddress,
          origin_latitude: userLatitude,
          origin_longitude: userLongitude,
          destination_latitude: destinationLatitude,
          destination_longitude: destinationLongitude,
          ride_time: rideTime.toFixed(0),
          fare_price: amount, 
          payment_status: "paid",
          driver_id: driverId,
          user_id: userId,
        }),
      });
      setSuccess(true); 
      console.log('sent', response)
    } catch (error) {
      console.log("Error creating ride:", error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Paystack
        paystackKey={paystackPublishkey}
        paystackSecretKey={paystackSecretkey}
        amount={amount}
        currency="NGN"
        billingEmail={email}
        billingName={fullName}
        activityIndicatorColor="green"
        onCancel={(e) => {
          console.log("Payment cancelled:", e);
        }}
        onSuccess={createRide}
        ref={paystackWebViewRef}
      />
      <CustomButton
        title="Book Ride"
        onPress={() => {
          if (paystackWebViewRef.current) {
            paystackWebViewRef.current.startTransaction();
          }
        }}
        className="my-6"
      />
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />

          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Booking placed successfully
          </Text>

          <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
            Thank you for your booking. Your reservation has been successfully
            placed. Please proceed with your trip.
          </Text>

          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push("/(root)/(tabs)/home");
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </View>
  );
}
