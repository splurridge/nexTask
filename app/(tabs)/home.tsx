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
  const [currentTask, setCurrentTask] = useState(""); 
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null); 
  const [focusedField, setFocusedField] = useState<string | null>(null); 

  // function to add a new Todo
  // Todo includes title and tasks
  const handleAddTodo = () => {
    if (!currentTodoTitle.trim()) {
      console.error("Todo title is required.");
      return;
    }
    if (taskInputs.every((input) => !input.trim())) {
      console.error("At least one task is required.");
      return;
    }

    const newTodoId = Date.now();
    const newTasks = taskInputs
      .filter((text) => text.trim()) // tasks can't be empty
      .map((text) => ({
        id: Date.now() + Math.random(), 
        text,
        checked: false,
      }));

    setTodos([
      ...todos,
      {
        id: newTodoId,
        title: currentTodoTitle,
        tasks: newTasks,
      },
    ]);

    setCurrentTodoTitle("");
    setTaskInputs([""]);
    setModalVisible(false);
  };

  // function to handle change in task inputs
  const handleTaskInputChange = (index: number, text: string) => {
    const updatedTasks = [...taskInputs];
    updatedTasks[index] = text;
    setTaskInputs(updatedTasks);
  };

  // function to add a new task input field
  const addNewTaskInput = () => {
    if (taskInputs[taskInputs.length - 1].trim()) {
      setTaskInputs([...taskInputs, ""]);
    }
  };

  // func to handle adding a new task directly in Todo list
  const handleAddTask = (todoId: number) => {
    if (!currentTask.trim()) {
      console.error("Task text is required.");
      return;
    }

    const newTask: Task = {
      id: Date.now() + Math.random(),
      text: currentTask,
      checked: false,
    };

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, tasks: [...todo.tasks, newTask] } : todo
      )
    );

    setCurrentTask(""); 
  };

  // function to toggle a task's checked status
  const handleToggleTask = (todoId: number, taskId: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              tasks: todo.tasks.map((task) =>
                task.id === taskId ? { ...task, checked: !task.checked } : task
              ),
            }
          : todo
      )
    );
  };

  // func to toggle show/hide checked items
  const toggleCheckedItems = () => {
    setShowCheckedItems(!showCheckedItems);
  };

  // func to handle enter key 
  const handleInputSubmit = (todoId: number) => {
    if (currentTask.trim()) {
      handleAddTask(todoId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView}>
          {/* Display Todos */}
          {todos.map((todo) => {
            const uncheckedTasks = todo.tasks.filter((task) => !task.checked);
            const checkedTasks = todo.tasks.filter((task) => task.checked);

            return (
              <View key={todo.id} style={styles.todoContainer}>
                <Text style={styles.todoTitle}>{todo.title}</Text>

                {/* List of tasks */}
                <ScrollView style={styles.listContainer}>
                  {uncheckedTasks.map((task) => (
                    <View key={task.id} style={styles.taskContainer}>
                      <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => handleToggleTask(todo.id, task.id)}
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

                  {/* Task Input */}
                  <View style={styles.taskInputContainer}>
                    <TextInput
                      style={[
                        styles.taskInput,
                        focusedField === "task" && styles.focusedInput,
                      ]}
                      placeholder="Add a task"
                      placeholderTextColor="#ccc"
                      onSubmitEditing={() => handleAddTask(todo.id)}
                      value={currentTask}
                      onChangeText={setCurrentTask}
                      onFocus={() => setFocusedField("task")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TouchableOpacity
                      onPress={() => handleAddTask(todo.id)}
                      disabled={!currentTask.trim()}
                    >
                      <FontAwesome
                        name="plus"
                        size={24}
                        color={!currentTask.trim() ? "#777" : "#1da1f2"}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Toggle for checked items */}
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
                                onPress={() =>
                                  handleToggleTask(todo.id, task.id)
                                }
                              >
                                <FontAwesome
                                  name={
                                    task.checked ? "check-square-o" : "square-o"
                                  }
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
              </View>
            );
          })}
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Floating Add Todo Button */}
      <TouchableOpacity
        style={styles.addTodoButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for adding Todo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <FontAwesome name="times" size={24} color="#1da1f2" />
            </Pressable>

            <TextInput
              style={[
                styles.modalTitleInput,
                focusedField === "title" && styles.focusedInput,
              ]}
              value={currentTodoTitle}
              onChangeText={setCurrentTodoTitle}
              placeholder="Title"
              placeholderTextColor="#ccc"
              onFocus={() => setFocusedField("title")}
              onBlur={() => setFocusedField(null)}
            />

            {taskInputs.map((taskInput, index) => (
              <View key={index} style={styles.taskInputWrapper}>
                <TextInput
                  style={[
                    styles.modalTaskInput,
                    focusedField === `task-${index}` && styles.focusedInput,
                  ]}
                  value={taskInput}
                  onChangeText={(text) => handleTaskInputChange(index, text)}
                  placeholder={`List item ${index + 1}`}
                  placeholderTextColor="#ccc"
                  onFocus={() => setFocusedField(`task-${index}`)}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={() => {
                    if (index === taskInputs.length - 1 && taskInput.trim()) {
                      addNewTaskInput();
                    }
                  }}
                />
                {index === taskInputs.length - 1 && (
                  <TouchableOpacity
                    onPress={addNewTaskInput}
                    disabled={!taskInput.trim()}
                    style={styles.addTaskIcon}
                  >
                    <FontAwesome
                      name="plus"
                      size={24}
                      color={!taskInput.trim() ? "#777" : "#1da1f2"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddTodo}
                disabled={
                  !currentTodoTitle.trim() ||
                  taskInputs.every((input) => !input.trim())
                }
              >
                <Text style={styles.modalButtonText}>Add Todo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    padding: 16,
  },
  focusedInput: {
    borderColor: "#1da1f2",
    borderWidth: 2,
  },
  todoContainer: {
    borderLeftWidth: 8,
    borderLeftColor: "#1da1f2", 
    borderRadius: 8, 
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#111", 
  },
  todoTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
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
    backgroundColor: "#555",
    borderRadius: 4,
  },
  toggleButtonText: {
    color: "white",
    textAlign: "center",
  },
  checkedListContainer: {
    marginTop: 16,
  },
  addTodoButton: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: "#1da1f2",
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    maxHeight: "80%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: -20,
    right: -16,
    width: 40,
    height: 40,
    borderRadius: 60,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalTitleInput: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 8,
    width: "100%",
    padding: 8,
    marginBottom: 16,
    color: "white",
    backgroundColor: "transparent",
  },
  modalTitleInputFocused: {
    borderColor: "#1da1f2",
  },
  taskInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTaskInput: {
    flex: 1,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    color: "white",
    backgroundColor: "#111",
  },
  modalTaskInputFocused: {
    borderColor: "#007bff",
  },
  modalButtons: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    padding: 32,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: "#1da1f2",
    borderRadius: 32,
    padding: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
  },
  icon: {
    marginLeft: 8,
  },
});

export default Home;
