import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import FlowerScreen from "./screens/FlowerScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import { Ionicons } from "@expo/vector-icons";
import FlowerDetailScreen from "./screens/FlowerDetailScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const flowers = [
    {
      id: 1,
      name: " White Cattleya ",
      description: "White Cattleya là một loại hoa phong lan Cattleya có màu trắng tinh khiết trên cánh hoa. Đây là một trong những loài phong lan Cattleya phổ biến và được yêu thích vì vẻ đẹp thanh lịch và sự tinh tế của nó. Loại hoa này có mùi hương thơm đặc trưng, là một trong những điểm đặc biệt thu hút của nó. Mỗi bông hoa White Cattleya thường chỉ có một hoặc hai cánh hoa, tạo nên một vẻ đẹp tinh khiết và đơn giản. White Cattleya thích ánh sáng mạnh và trực tiếp để phát triển tốt nhất. Chúng thường được trồng gần cửa sổ hoặc trong vùng có ánh sáng đủ. Ngoài ra, Cattleya cần môi trường ấm áp và độ ẩm cao, tương tự như môi trường nhiệt đới.",
      category: "Cattleya",
      image: require("./src/images/1.jpg"),
      price: 9.99,
    },
    {
      id: 2,
      name: "Phalaenopsis",
      description:
        "Phalaenopsis orchid, còn được gọi là hoa phong lan đơn (Phalaenopsis), là một loại hoa phong lan phổ biến và được ưa chuộng trong việc trồng trong nhà. Đây là một loại hoa phổ biến với cánh hoa lớn và hình dáng tinh tế. Phalaenopsis orchid có cánh hoa mềm mại và mỏng, thường có hình dạng hơi cong và thon dài. Màu sắc của cánh hoa Phalaenopsis rất đa dạng, bao gồm trắng, hồng, vàng, tím, cam và nhiều biến thể màu sắc khác. Cánh hoa thường có một vẻ đẹp tinh tế với các mẫu hoa, đốm hoặc vệt màu khác nhau trên bề mặt.",
      category: "Carnation",
      image: require("./src/images/2.jpg"),
      price: 7.99,
    },
    {
      id: 3,
      name: "Vanda Blue",
      description:
        "Vanda orchid, hay còn được gọi là hoa phong lan Vanda, là một trong những loại hoa phong lan đẹp và đa dạng nhất. Đây là nhóm phong lan rất lớn và đa dạng, bao gồm nhiều loài và chủng loại khác nhau. Vanda orchid có cánh hoa lớn, rộng và đẹp, với hình dạng đặc trưng và đa dạng. Cánh hoa thường có màu sắc tươi sáng và rực rỡ như xanh, xanh tím, xanh lam, vàng, cam, đỏ và tím. Một số loại Vanda có cánh hoa có màu sắc kết hợp và hoa có hoa văn phức tạp. Vanda orchid có cách trồng đặc biệt. Thay vì được trồng trong chậu hoặc hạt giống, chúng thường được treo lên trên một kệ hoặc treo trên cây. Vanda cần ánh sáng mạnh và trực tiếp, vì vậy nếu được trồng trong nhà, nên đặt gần cửa sổ hoặc nơi có ánh sáng đủ. Chúng thích hợp với môi trường nhiệt đới, với nhiệt độ ấm và độ ẩm cao.",
      category: "Vanda",
      image: require("./src/images/3.jpg"),
      price: 5.99,
    },
    {
      id: 4,
      name: "Purple Vanda Orchid",
      description:
        "Vanda Purple Orchid, hay còn gọi là hoa phong lan Vanda màu tím, là một loại hoa phong lan thuộc chi Vanda với cánh hoa màu tím đậm và hấp dẫn. Đây là một trong những biến thể màu sắc phổ biến của Vanda orchid. Cánh hoa của Vanda Purple Orchid có kích thước lớn và hình dạng đa dạng. Chúng có màu tím đậm và có thể có các tông màu khác như tím đỏ hoặc tím xanh. Một số loại Vanda Purple Orchid có cánh hoa có màu sắc kết hợp hoặc các mảng màu khác nhau trên bề mặt. Vanda Purple Orchid cần ánh sáng mạnh và trực tiếp để phát triển và nở hoa tốt nhất. Điều này có nghĩa là chúng nên được trồng ở vị trí gần cửa sổ hoặc nơi có ánh sáng đủ. Ngoài ra, Vanda cần môi trường ấm áp và độ ẩm cao, giống như môi trường nhiệt đới.",
      category: "Vanda",
      image: require("./src/images/4.jpg"),
      price: 13.99,
    },
    {
      id: 5,
      name: "Oncidium yellow",
      description:
        "Oncidium Yellow Orchid, hay còn gọi là hoa phong lan Oncidium màu vàng, là một loại hoa phong lan thuộc chi Oncidium với cánh hoa màu vàng tươi sáng và hấp dẫn. Đây là một trong những biến thể màu sắc phổ biến của Oncidium orchid. Cánh hoa của Oncidium Yellow Orchid có hình dạng đa dạng, thường có nhiều cánh hoa nhỏ tạo thành một chùm hoa. Chúng có màu vàng tươi sáng và có thể có các tông màu khác như vàng cam hoặc vàng xanh. Một số loại Oncidium Yellow Orchid có cánh hoa có các đốm màu tối hoặc các mảng màu khác nhau trên bề mặt. Oncidium Yellow Orchid thường thích ánh sáng mạnh và trực tiếp để phát triển tốt nhất. Điều này có nghĩa là chúng nên được trồng ở vị trí gần cửa sổ hoặc nơi có ánh sáng đủ. Ngoài ra, Oncidium cần môi trường ấm áp và độ ẩm cao, tương tự như môi trường nhiệt đới.",
      category: "Oncidium",
      image: require("./src/images/5.jpg"),
      price: 19.99,
    },
    {
      id: 6,
      name: "Dendrobium Pink",
      description:
        "Dendrobium Pink Orchid, hay còn gọi là hoa phong lan Dendrobium màu hồng, là một loại hoa phong lan thuộc chi Dendrobium với cánh hoa màu hồng tươi sáng và đẹp mắt. Đây là một trong những biến thể màu sắc phổ biến của Dendrobium orchid. Cánh hoa của Dendrobium Pink Orchid có hình dạng đa dạng, từ cánh hoa nhỏ đến cánh hoa lớn. Chúng có màu hồng tươi sáng và có thể có các tông màu khác như hồng nhạt, hồng đậm hoặc hồng cam. Một số loại Dendrobium Pink Orchid có cánh hoa có các đốm màu tối hoặc các mảng màu khác nhau trên bề mặt. Dendrobium Pink Orchid thích ánh sáng mạnh và trực tiếp để phát triển tốt nhất. Chúng thường được trồng gần cửa sổ hoặc trong vùng có ánh sáng đủ. Ngoài ra, Dendrobium cần môi trường ấm áp và độ ẩm cao, tương tự như môi trường nhiệt đới.",
      category: "Dendrobium",
      image: require("./src/images/6.jpg"),
      price: 11.99,
    },
    {
      id: 7,
      name: "Dendrobium Purple",
      description:
        "Dendrobium Purple Orchid, hay còn gọi là hoa phong lan Dendrobium màu tím, là một loại hoa phong lan thuộc chi Dendrobium với cánh hoa màu tím đậm và đẹp mắt. Đây là một trong những biến thể màu sắc phổ biến của Dendrobium orchid. Cánh hoa của Dendrobium Purple Orchid có hình dạng đa dạng, từ cánh hoa nhỏ đến cánh hoa lớn. Chúng có màu tím đậm và có thể có các tông màu khác như tím xanh, tím đỏ hoặc tím hồng. Một số loại Dendrobium Purple Orchid có cánh hoa có các đốm màu tối hoặc các mảng màu khác nhau trên bề mặt. Dendrobium Purple Orchid thích ánh sáng mạnh và trực tiếp để phát triển tốt nhất. Chúng thường được trồng gần cửa sổ hoặc trong vùng có ánh sáng đủ. Ngoài ra, Dendrobium cần môi trường ấm áp và độ ẩm cao, tương tự như môi trường nhiệt đới.",
      category: "Dendrobium Pink",
      image: require("./src/images/7.jpeg"),
      price: 8.99,
    },
    {
      id: 8,
      name: "Cattleya Pink",
      description:
        "Cattleya Pink Orchid, hay còn gọi là hoa phong lan Cattleya màu hồng, là một loại hoa phong lan thuộc chi Cattleya với cánh hoa màu hồng tươi sáng và quyến rũ. Đây là một trong những biến thể màu sắc phổ biến của Cattleya orchid. Cánh hoa của Cattleya Pink Orchid có kích thước lớn và hình dạng đa dạng, thường có cấu trúc hoa rất đặc trưng. Chúng có màu hồng tươi sáng và có thể có các tông màu khác như hồng nhạt, hồng đậm hoặc hồng cam. Cánh hoa thường có hình dạng rộng, mở rộng và tạo ra một cấu trúc hoa thật sự hấp dẫn. ",
      category: "RoseCattleya",
      image: require("./src/images/9.jpg"),
      price: 17.99,
    },
    {
      id: 9,
      name: "Phalaenopsis White Pink",
      description:
        "Phalaenopsis White Pink Orchid, hay còn gọi là hoa phong lan Phalaenopsis màu trắng hồng, là một loại hoa phong lan thuộc chi Phalaenopsis với cánh hoa màu trắng kết hợp với một chút màu hồng. Đây là một trong những biến thể màu sắc độc đáo của Phalaenopsis orchid. Cánh hoa của Phalaenopsis White Pink Orchid có kích thước trung bình đến lớn, có hình dạng đẹp và thanh lịch. Chúng có màu trắng trong suốt, nhưng trên một số phần của cánh hoa có một chút màu hồng nhạt hoặc màu hồng đậm. Màu sắc này tạo nên sự pha trộn tinh tế và tạo điểm nhấn hấp dẫn trên cánh hoa. Phalaenopsis White Pink Orchid thích ánh sáng vừa phải và tránh ánh sáng mặt trực tiếp quá mạnh để tránh làm cháy cánh hoa. Chúng thường được trồng trong nhà, gần cửa sổ để có đủ ánh sáng tự nhiên. Phalaenopsis cũng cần môi trường ấm áp và độ ẩm cao để phát triển tốt nhất.",
      category: "Phalaenopsis",
      image: require("./src/images/9.jpg"),
      price: 17.99,
    },
  ];
  const FlowerListScreen = () => <FlowerScreen flowers={flowers} />;
  const FavoriteListScreen = () => <FavoritesScreen />;
  const MainDrawer = () => {
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Drawer.Screen name="FavoritesScreen" component={FavoriteListScreen} />
      </Drawer.Navigator>
    );
  };

  const MainTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Flower") {
              iconName = focused ? "flower" : "flower-outline";
            } else if (route.name === "Favorites") {
              iconName = focused ? "heart" : "heart-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Flower" component={FlowerListScreen} />
        <Tab.Screen name="Favorites" component={FavoriteListScreen} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Drawer"
          component={MainDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Tabs" component={MainTabs} />
        <Stack.Screen name="FlowerScreen" component={FlowerListScreen} />
        <Stack.Screen name="FlowerDetail" component={FlowerDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pressed: {
    opacity: 0.25,
  },
});
