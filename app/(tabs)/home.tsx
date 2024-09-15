import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

interface Task {
  id: number;
  text: string;
  checked: boolean;
}

const screenWidth = Dimensions.get("window").width;
const scaleFactor = screenWidth / 320;

const responsiveFontSize = (size: number): number => {
  const newSize = size * scaleFactor;
  return Math.round(newSize);
};

const Home: React.FC = () => {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCheckedItems, setShowCheckedItems] = useState(false);
  const router = useRouter();

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, { id: Date.now(), text: taskInput, checked: false }]);
      setTaskInput(""); // Clear input after adding
    }
  };

  const handleToggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };

  const toggleCheckedItems = () => {
    setShowCheckedItems(!showCheckedItems);
  };

  const uncheckedTasks = tasks.filter((task) => !task.checked);
  const checkedTasks = tasks.filter((task) => task.checked);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Tasks</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={taskInput}
            onChangeText={setTaskInput}
            placeholder="Add a task"
            placeholderTextColor="#ccc"
            onSubmitEditing={handleAddTask}
          />
          <TouchableOpacity onPress={handleAddTask}>
            <FontAwesome
              name="plus"
              size={24}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.listContainer}>
          {uncheckedTasks.map((task) => (
            <View key={task.id} style={styles.taskContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleToggleTask(task.id)}
              >
                <FontAwesome
                  name={task.checked ? "check-square-o" : "square-o"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <Text style={styles.taskText}>{task.text}</Text>
            </View>
          ))}
          {checkedTasks.length > 0 && (
            <>
              <TouchableOpacity
                onPress={toggleCheckedItems}
                style={styles.toggleButton}
              >
                <Text style={styles.toggleButtonText}>
                  {showCheckedItems
                    ? `Hide ${checkedTasks.length} Checked Items`
                    : `Show ${checkedTasks.length} Checked Items`}
                </Text>
              </TouchableOpacity>
              {showCheckedItems && (
                <View style={styles.checkedListContainer}>
                  {checkedTasks.map((task) => (
                    <View key={task.id} style={styles.taskContainer}>
                      <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => handleToggleTask(task.id)}
                      >
                        <FontAwesome
                          name={task.checked ? "check-square-o" : "square-o"}
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.taskText,
                          task.checked && {
                            textDecorationLine: "line-through",
                            color: "#a1a1a1",
                          },
                        ]}
                      >
                        {task.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderColor: "#fff",
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    color: "#fff",
    paddingVertical: responsiveFontSize(10),
    borderRadius: 10,
    fontSize: responsiveFontSize(12),
  },
  listContainer: {
    marginBottom: 16,
    paddingHorizontal: responsiveFontSize(8),
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: responsiveFontSize(8),
  },
  checkbox: {
    marginRight: 8,
  },
  taskText: {
    fontSize: responsiveFontSize(13),
    color: "#fff",
  },
  toggleButton: {
    padding: 8,
    backgroundColor: "#333",
    marginBottom: 8,
    borderRadius: 4,
  },
  toggleButtonText: {
    color: "#fff",
  },
  checkedListContainer: {
    marginTop: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
});

export default Home;
