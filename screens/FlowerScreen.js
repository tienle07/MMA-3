import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const FlowerScreen = ({ flowers }) => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
  };

  const searchFlowers = (query) => {
    setSearchQuery(query);
  };

  const filteredFlowers = flowers.filter((flower) => {
    selectedCategory === "All"
      ? flowers
      : flowers.filter((flower) => flower.category === selectedCategory);

    if (selectedCategory !== "All" && flower.category !== selectedCategory) {
      return false;
    }
    if (
      searchQuery.trim() !== "" &&
      !flower.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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

  const renderCategoryItem = ({ item }) => (
    <Pressable
      onPress={() => handleCategorySelection(item.name)}
      style={[
        styles.itemCategory,
        selectedCategory === item.name && styles.activeItemCategory,
      ]}
    >
      <Text
        style={[
          styles.categoryItemText,
          selectedCategory === item.name && styles.activeCategoryItemText,
        ]}
      >
        {item.name}
      </Text>
    </Pressable>
  );

  const renderFlowerItem = ({ item }) => (
    <View style={styles.containerItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate("FlowerDetail", { flower: item })}
      >
        <View style={styles.flowerContainer}>
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

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search flower..."
          value={searchQuery}
          onChangeText={searchFlowers}
        />
      </View>
      <View>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          style={styles.FilterCategory}
        />
      </View>

      <FlatList
        data={filteredFlowers}
        renderItem={renderFlowerItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Cattleya" },
  { id: 3, name: "Phalaenopsis" },
  { id: 4, name: "Vanda" },
  { id: 5, name: "Oncidium" },
  { id: 6, name: "Dendrobium" },
  // Add more categories as needed
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  flowerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,

  },
  flowerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    paddingLeft: 2,
  },
  flowerInfo: {
    marginLeft: 16,
  },
  flowerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34c0eb"
  },
  flowerCategory: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#34ebc6"
  },
  flowerDescription: {
    fontSize: 14,
    color: "#888",
  },
  flowerPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "orange"
  },
  containerItem: {
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 6,
    marginBottom: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  iconStyle: {
    position: "absolute",
    right: 4,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  categoryItemText: {
    marginHorizontal: 14,
  },
  itemCategory: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activeItemCategory: {
    backgroundColor: "blue",
    borderColor: "blue",
  },
  categoryItemText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  activeCategoryItemText: {
    color: "#fff",
  },
  FilterCategory: {
    marginBottom: 12,
  },
});

export default FlowerScreen;
