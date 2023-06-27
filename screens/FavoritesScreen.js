import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    loadFavorites();
  }, [isFocused]);

  const loadFavorites = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem("favorites");
      const favoritesData = JSON.parse(favoritesString) || [];
      setFavorites(favoritesData);
    } catch (error) {
      console.log("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (flower) => {
    try {
      const favoritesString = await AsyncStorage.getItem("favorites");
      let favorites = JSON.parse(favoritesString) || [];
      const existingFlowerIndex = favorites.findIndex(
        (f) => f.id === flower.id
      );

      if (existingFlowerIndex > -1) {
        Alert.alert(
          "Remove Flower",
          "Are you sure you want to remove this flower from favorites?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Remove",
              style: "destructive",
              onPress: () => {
                favorites.splice(existingFlowerIndex, 1);
                updateFavorites(favorites);
              },
            },
          ]
        );
      } else {
        // Flower does not exist in favorites, add it
        favorites.push(flower);
        updateFavorites(favorites);
      }
    } catch (error) {
      console.log("Error adding/removing flower from favorites:", error);
    }
  };

  const updateFavorites = async (favorites) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      setFavorites(favorites);
    } catch (error) {
      console.log("Error updating favorites:", error);
    }
  };

  const clearFavorites = () => {
    Alert.alert(
      "Clear Favorites",
      "Are you sure you want to clear all favorites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("favorites");
              setFavorites([]);
            } catch (error) {
              console.log("Error clearing favorites:", error);
            }
          },
        },
      ]
    );
  };

  const renderFlowerItem = ({ item }) => {
    const key = item.id ? item.id.toString() : item.name;

    const navigateToFlowerDetail = () => {
      navigation.navigate("FlowerDetail", { flower: item });
    };

    return (
      <View style={styles.containerItem}>
        <TouchableOpacity onPress={navigateToFlowerDetail}>
          <View style={styles.flowerContainer} key={key}>
            <Image style={styles.flowerImage} source={item.image} />
            <View style={styles.flowerInfo}>
              <Text style={styles.flowerName}>{item.name}</Text>
              <Text style={styles.flowerCategory}>{item.category}</Text>
              <Text style={styles.flowerPrice}>Price: ${item.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.iconStyle}>
          <Pressable onPress={() => toggleFavorite(item)}>
            {favorites.some((f) => f.id === item.id) ? (
              <Ionicons name="heart" color="red" size={24} />
            ) : (
              <Ionicons name="heart-outline" color="black" size={24} />
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {favorites.length > 0 && (
          <Pressable onPress={clearFavorites}>
            <Ionicons name="trash" size={24} color="red" />
          </Pressable>
        )}
      </View>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFlowerItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyText}>No flowers in favorites</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  flowerContainer: {
    flexDirection: "row",
    // alignItems: "center",
    marginBottom: 16,
  },
  flowerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  flowerInfo: {
    marginLeft: 16,
  },
  flowerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  flowerCategory: {
    fontSize: 14,
    fontWeight: "bold",
  },
  flowerPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  containerItem: {
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 6,
    marginBottom: 10,
    paddingVertical: 8,
  },
  iconStyle: {
    position: "absolute",
    right: 4,
  },
  clearButton: {
    fontSize: 16,
    color: "red",
  },
  header: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default FavoritesScreen;
