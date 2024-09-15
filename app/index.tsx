import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: any;
}

const screenWidth = Dimensions.get("window").width;
const scaleFactor = screenWidth / 320;

const responsiveFontSize = (size: number): number => {
  const newSize = size * scaleFactor;
  return Math.round(newSize);
};

export default function App(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const router = useRouter();

  const slides: Slide[] = [
    {
      id: 1,
      title: "Welcome to NexTask",
      description:
        "NexTask is your go-to app for managing tasks efficiently. Organize your daily tasks and set reminders to stay on top of your schedule.",
      image: require("../assets/images/developer_outline II_black.png"),
    },
    {
      id: 2,
      title: "Manage Your Tasks",
      description:
        "Create and manage tasks with ease. Track your progress and prioritize your tasks to boost productivity.",
      image: require("../assets/images/eCommerce_outline I_black.png"),
    },
    {
      id: 3,
      title: "Stay Organized",
      description:
        "With NexTask, you can keep everything organized in one place. Never miss a deadline and stay on top of your goals.",
      image: require("../assets/images/workspace_outline III_black.png"),
    },
  ];

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
        if (hasOnboarded === "true") {
          router.push("/home");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to check onboarding status", error);
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  const handleContinue = async (): Promise<void> => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem("hasOnboarded", "true");
        router.push("/home");
      } catch (error) {
        console.error("Failed to set onboarding status", error);
      }
    }
  };

  const getContinueButtonText = (): string => {
    return currentIndex === slides.length - 1 ? "Get Started" : "Continue";
  };

  const showSkipButton = currentIndex < slides.length - 1;

  const renderIndicator = ({ index }: { index: number }): JSX.Element => {
    const activeColor = "#fff";
    const inactiveColor = "darkgray";

    return (
      <View
        style={[
          styles.indicator,
          {
            backgroundColor:
              index === currentIndex ? activeColor : inactiveColor,
          },
        ]}
        key={index}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.top}>
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const slideIndex = Math.round(
              event.nativeEvent.contentOffset.x / Dimensions.get("window").width
            );
            setCurrentIndex(slideIndex);
          }}
          renderItem={({ item }) => {
            return (
              <View style={styles.item}>
                <Image style={styles.image} source={item.image} />
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>
            );
          }}
        />
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => renderIndicator({ index }))}
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>{getContinueButtonText()}</Text>
        </TouchableOpacity>
        {showSkipButton && (
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={async () => {
              try {
                await AsyncStorage.setItem("hasOnboarded", "true");
                router.push("/home");
              } catch (error) {
                console.error("Failed to set onboarding status", error);
              }
            }}
          >
            <Text
              style={[styles.buttonText, { color: "#fff", fontWeight: "500" }]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  top: {
    flex: 0.8,
    backgroundColor: "#000",
  },
  bottom: {
    flex: 0.2,
    marginBottom: responsiveFontSize(13),
    alignItems: "center",
    backgroundColor: "#000",
  },
  button: {
    backgroundColor: "#fff",
    padding: 18,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: "70%",
  },
  buttonOutline: {
    borderColor: "#fff",
    padding: 10,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 15,
  },
  item: {
    paddingTop: responsiveFontSize(80),
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: responsiveFontSize(200),
    height: responsiveFontSize(200),
    tintColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: responsiveFontSize(20),
    paddingVertical: responsiveFontSize(10),
    paddingBottom: responsiveFontSize(20),
  },
  title: {
    fontSize: responsiveFontSize(23),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontSize: responsiveFontSize(11),
    textAlign: "center",
    color: "#ccc",
    paddingHorizontal: responsiveFontSize(35),
    marginTop: responsiveFontSize(5),
  },
  indicatorContainer: {
    flexDirection: "row",
    right: 0,
    left: 0,
    bottom: 20,
    justifyContent: "center",
    marginTop: responsiveFontSize(20),
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 50,
    marginHorizontal: 5,
    borderColor: "#000",
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
