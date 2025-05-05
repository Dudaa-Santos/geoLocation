import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./pages/main";
import Cadastro from "./pages/cadastro";    
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="Cadastro" component={Cadastro} />
      
      <Stack.Screen
        name="Main"
        component={Main}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerLeft: null,
          headerRight: () => (
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#fff"
              style={{ marginRight: 15 }}
              onPress={async () => {
                try {
                  await AsyncStorage.removeItem("userToken");
                  navigation.replace("Cadastro");
                } catch (error) {
                  console.error("Erro ao realizar o logout:", error);
                }
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
