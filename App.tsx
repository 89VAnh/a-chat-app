import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeWindStyleSheet } from "nativewind";
import { Provider } from "react-redux";
import Store from "./context/store";
import "./locale/i18n";
import screens from "./screens";
import { SPLASH_SCREEN } from "./screens/screens";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={SPLASH_SCREEN}>
          {screens?.map((screen) => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
            />
          ))}
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

export default App;
