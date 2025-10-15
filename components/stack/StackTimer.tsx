import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Pressable, Platform } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { 
  Play, 
  Pause, 
  Edit, 
  Trash, 
  X, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react-native';
import EmojiSelector from './EmojiSelector';

type Mode = 'view' | 'edit' | 'timer' | 'break' | 'delete';
type ColorOption = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

const colorOptions: ColorOption[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
const colorClasses = {
  red: 'bg-red-500',
  orange: 'bg-orange-500', 
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500'
};

export default function StackTimer() {
  const [mode, setMode] = useState<Mode>('view');
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [breakTimeLeft, setBreakTimeLeft] = useState(300); // 5 minutes in seconds
  const [paused, setPaused] = useState(false);
  const [taskName, setTaskName] = useState('Walk Luna');
  const [taskDuration, setTaskDuration] = useState(30);
  const [color, setColor] = useState<ColorOption>('red');
  const [editTaskName, setEditTaskName] = useState(taskName);
  const [editDuration, setEditDuration] = useState(taskDuration);
  const [editColor, setEditColor] = useState<ColorOption>(color);
  const [breakDuration, setBreakDuration] = useState(5);
  const [taskEmoji, setTaskEmoji] = useState('🐕');
  const [editTaskEmoji, setEditTaskEmoji] = useState(taskEmoji);

  const shakeAnimation = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value }]
    };
  });

  useEffect(() => {
    if (mode === 'timer' && !paused && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setMode('break');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, paused, timeLeft]);

  useEffect(() => {
    if (mode === 'break' && breakTimeLeft > 0) {
      const interval = setInterval(() => {
        setBreakTimeLeft(prev => {
          if (prev <= 1) {
            setMode('view');
            setTimeLeft(taskDuration * 60);
            return breakDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, breakTimeLeft, taskDuration, breakDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleEdit = () => {
    setEditTaskName(taskName);
    setEditDuration(taskDuration);
    setEditColor(color);
    setEditTaskEmoji(taskEmoji);
    setMode('edit');
  };

  const handleSave = () => {
    setTaskName(editTaskName);
    setTaskDuration(editDuration);
    setColor(editColor);
    setTaskEmoji(editTaskEmoji);
    setTimeLeft(editDuration * 60);
    setMode('view');
  };

  const handleCancel = () => {
    setEditTaskName(taskName);
    setEditDuration(taskDuration);
    setEditColor(color);
    setEditTaskEmoji(taskEmoji);
    setMode('view');
  };

  const handleStart = () => {
    setMode('timer');
    setPaused(false);
  };

  const handlePause = () => {
    setPaused(!paused);
  };

  const handleTimerCancel = () => {
    setMode('view');
    setPaused(false);
    setTimeLeft(taskDuration * 60);
  };

  const handleDeleteLongPress = () => {
    shakeAnimation.value = withSequence(
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(-5, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    // Actually delete the task here if needed
    setMode('view');
  };

  const handleBreakCancel = () => {
    setMode('view');
    setBreakTimeLeft(breakDuration * 60);
  };

  const handleBreakConfirm = () => {
    // Continue with break
  };

  const adjustDuration = (increment: boolean) => {
    setEditDuration(prev => Math.max(1, increment ? prev + 5 : prev - 5));
  };

  const adjustBreakDuration = (increment: boolean) => {
    setBreakDuration(prev => Math.max(1, increment ? prev + 1 : prev - 1));
  };

  if (mode === 'view') {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        layout={Layout.springify()}
        className="bg-white rounded-2xl p-5 shadow-sm w-full max-w-sm self-center"
      >
        <View className="flex-row items-center space-x-3 mb-4">
          <View className={`${colorClasses[color]} p-2 rounded-lg`}>
            <Text className="text-white text-lg">{taskEmoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-neutral-900 font-medium text-lg">
              {taskName} for {taskDuration} minutes
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-between">
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full px-4 py-2 flex-row items-center space-x-2"
            onPress={handleEdit}
          >
            <Edit size={16} color="#666" />
            <Text className="text-neutral-700 font-medium">Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-neutral-900 rounded-full px-4 py-2 flex-row items-center space-x-2"
            onPress={handleStart}
          >
            <Play size={16} color="#fff" />
            <Text className="text-white font-medium">Start</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (mode === 'edit') {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        layout={Layout.springify()}
        className="bg-white rounded-2xl p-5 shadow-sm w-full max-w-sm self-center"
      >
        <Text className="text-lg font-medium text-neutral-900 mb-4">Edit Task</Text>
        
        <TextInput
          value={editTaskName}
          onChangeText={setEditTaskName}
          className="bg-neutral-50 rounded-lg p-3 text-neutral-900 mb-4"
          placeholder="Task name"
        />
        
        <Text className="text-neutral-700 mb-2">Emoji</Text>
        <View className="mb-4">
          <EmojiSelector 
            emoji={editTaskEmoji}
            onEmojiChange={setEditTaskEmoji}
          />
        </View>
        
        <Text className="text-neutral-700 mb-2">Color</Text>
        <View className="flex-row space-x-2 mb-4">
          {colorOptions.map((colorOption) => (
            <TouchableOpacity
              key={colorOption}
              className={`w-8 h-8 rounded-full ${colorClasses[colorOption]} ${
                editColor === colorOption ? 'ring-2 ring-neutral-400' : ''
              }`}
              onPress={() => setEditColor(colorOption)}
            />
          ))}
        </View>
        
        <Text className="text-neutral-700 mb-2">Duration</Text>
        <View className="flex-row items-center justify-center space-x-4 mb-6">
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full p-2"
            onPress={() => adjustDuration(false)}
          >
            <Minus size={20} color="#666" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-neutral-900 min-w-[80px] text-center">
            {editDuration}:00
          </Text>
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full p-2"
            onPress={() => adjustDuration(true)}
          >
            <Plus size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row justify-between">
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full px-4 py-2 flex-row items-center space-x-2"
            onPress={handleCancel}
          >
            <X size={16} color="#666" />
            <Text className="text-neutral-700 font-medium">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-neutral-900 rounded-full px-4 py-2 flex-row items-center space-x-2"
            onPress={handleSave}
          >
            <Check size={16} color="#fff" />
            <Text className="text-white font-medium">Save</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (mode === 'timer') {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        layout={Layout.springify()}
        className="bg-white rounded-2xl p-5 shadow-sm w-full max-w-sm self-center items-center"
      >
        <Text className="text-4xl font-semibold text-neutral-900 mb-6">
          {formatTime(timeLeft)}
        </Text>
        
        <View className="flex-row space-x-4">
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full p-3"
            onPress={handleTimerCancel}
          >
            <X size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-neutral-900 rounded-full p-3"
            onPress={handlePause}
          >
            {paused ? <Play size={24} color="#fff" /> : <Pause size={24} color="#fff" />}
          </TouchableOpacity>
        </View>
        
        {timeLeft <= 60 && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            className="mt-4"
          >
            <Text className="text-neutral-500 text-sm">Almost done!</Text>
          </Animated.View>
        )}
      </Animated.View>
    );
  }

  if (mode === 'break') {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        layout={Layout.springify()}
        className="bg-white rounded-2xl p-5 shadow-sm w-full max-w-sm self-center items-center"
      >
        <Text className="text-lg font-medium text-neutral-900 mb-2">Take a Break?</Text>
        <Text className="text-neutral-500 text-sm mb-4">Break for {breakDuration} minutes</Text>
        
        <Text className="text-3xl font-semibold text-neutral-900 mb-4">
          {formatTime(breakTimeLeft)}
        </Text>
        
        <View className="flex-row items-center space-x-4 mb-6">
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full p-2"
            onPress={() => adjustBreakDuration(false)}
          >
            <Minus size={16} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-medium text-neutral-900 min-w-[60px] text-center">
            {breakDuration}:00
          </Text>
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full p-2"
            onPress={() => adjustBreakDuration(true)}
          >
            <Plus size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row space-x-4">
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full px-4 py-2 flex-row items-center space-x-2"
            onPress={handleBreakCancel}
          >
            <X size={16} color="#666" />
            <Text className="text-neutral-700 font-medium">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-neutral-900 rounded-full px-4 py-2 flex-row items-center space-x-2"
            onPress={handleBreakConfirm}
          >
            <Check size={16} color="#fff" />
            <Text className="text-white font-medium">Confirm</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (mode === 'delete') {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        layout={Layout.springify()}
        style={shakeStyle}
        className="bg-white rounded-2xl p-5 shadow-sm w-full max-w-sm self-center"
      >
        <Text className="text-lg font-medium text-neutral-900 mb-2 text-center">
          Delete task?
        </Text>
        <Text className="text-neutral-500 text-sm mb-6 text-center">
          This action cannot be undone, hold to confirm.
        </Text>
        
        <View className="flex-row justify-between">
          <TouchableOpacity 
            className="bg-neutral-100 rounded-full px-4 py-2 flex-row items-center space-x-2"
            onPress={() => setMode('view')}
          >
            <X size={16} color="#666" />
            <Text className="text-neutral-700 font-medium">Cancel</Text>
          </TouchableOpacity>
          
          <Pressable 
            className="bg-red-500 rounded-full px-4 py-2 flex-row items-center space-x-2"
            onLongPress={handleDeleteLongPress}
          >
            <Trash size={16} color="#fff" />
            <Text className="text-white font-medium">Delete</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  return null;
}