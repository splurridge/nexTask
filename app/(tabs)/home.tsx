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
  Modal,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface Task {
  id: number;
  text: string;
  checked: boolean;
}

interface Todo {
  id: number;
  title: string;
  tasks: Task[];
}

const screenWidth = Dimensions.get("window").width;
const scaleFactor = screenWidth / 320;

const responsiveFontSize = (size: number): number => {
  const newSize = size * scaleFactor;
  return Math.round(newSize);
};

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTodoTitle, setCurrentTodoTitle] = useState("");
  const [taskInputs, setTaskInputs] = useState<string[]>([""]);
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

  // func to toggle show/hide checked items
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
  todoTitle: {
    fontSize: responsiveFontSize(16),
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
    maxHeight: Dimensions.get("window").height * 0.5,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 8,
  },
  taskText: {
    color: "white",
    fontSize: responsiveFontSize(12),
  },
  taskInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  taskInput: {
    flex: 1,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 32,
    padding: 8,
    color: "white",
    backgroundColor: "#111",
  },
  addTaskIcon: {
    marginLeft: 8,
  },
  toggleButton: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#333",
    marginBottom: 8,
    borderRadius: 4,
  },
  toggleButtonText: {
    color: "white",
    textAlign: "center",
  },
  checkedListContainer: {
    marginTop: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
});

export default Home;
