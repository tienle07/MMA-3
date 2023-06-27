import React from "react";
import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";

const FlowerDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { flower } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem("favorites");
      const favorites = JSON.parse(favoritesString) || [];

      const isFavorite = favorites.some((f) => f.id === flower.id);
      setIsFavorite(isFavorite);
    } catch (error) {
      console.log("Error checking favorite status:", error);
    }
  };

  const confirmRemoveFromFavorites = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to remove this flower from favorites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: removeFromFavorites,
        },
      ]
    );
  };

  const removeFromFavorites = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem("favorites");
      const favorites = JSON.parse(favoritesString) || [];

      const updatedFavorites = favorites.filter((f) => f.id !== flower.id);
      setIsFavorite(false);

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.log("Error removing flower from favorites:", error);
    }
  };

  const addToFavorites = async () => {
    if (isFavorite) {
      confirmRemoveFromFavorites();
    } else {
      try {
        const favoritesString = await AsyncStorage.getItem("favorites");
        const favorites = JSON.parse(favoritesString) || [];

        const existingFlowerIndex = favorites.findIndex(
          (f) => f.id === flower.id
        );
        if (existingFlowerIndex > -1) {
          // Flower already exists in favorites, remove it
          favorites.splice(existingFlowerIndex, 1);
          setIsFavorite(false);
        } else {
          // Flower does not exist in favorites, add it
          favorites.push(flower);
          setIsFavorite(true);
        }

        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (error) {
        console.log("Error adding/removing flower from favorites:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          onPress={addToFavorites}
        >
          {isFavorite ? (
            <Ionicons name="heart" color="red" size={36} />
          ) : (
            <Ionicons name="heart-outline" color="black" size={36} />
          )}
        </Pressable>
      </View>
      <Image style={styles.flowerImage} source={flower.image} />
      <View style={styles.flowerInfo}>
        <Text style={styles.flowerName}>{flower.name}</Text>
        <Text style={styles.flowerPrice}>Price: ${flower.price}</Text>
        <Text style={styles.flowerDescription}>{flower.description}</Text>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  flowerImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  flowerInfo: {
    marginTop: 16,
    alignItems: "center",
  },
  flowerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34c0eb"
  },
  flowerDescription: {
    fontSize: 18,
    marginTop: 8,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flowerPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: "orange"
  },
  pressed: {
    opacity: 0.25,
  },
  icon: {
    position: "absolute",
    top: 24,
    right: 24,
  },
});

export default FlowerDetailScreen;
