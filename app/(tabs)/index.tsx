import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View>
        <Text className="text-4xl font-bold">PROPSER</Text>
      </View>
    </SafeAreaView>
  );
}