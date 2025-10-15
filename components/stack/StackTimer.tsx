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
  withTiming,
  Easing
} from 'react-native-reanimated';
import { AnimatedRollingNumber } from 'react-native-animated-rolling-numbers';
import { 
  Play, 
  Pause, 
  Edit, 
  Trash, 
  X, 
  Check, 
  Plus, 
  Minus,
  ThumbsUp
} from 'lucide-react-native';
import EmojiSelector from './EmojiSelector';

type Mode = 'view' | 'edit' | 'timer' | 'break' | 'delete';
type BreakStage = 'prompt' | 'edit' | 'countdown';
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
  const [breakStage, setBreakStage] = useState<BreakStage>('prompt');
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
            setBreakStage('prompt');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, paused, timeLeft]);

  useEffect(() => {
    if (mode === 'break' && breakStage === 'countdown' && !paused && breakTimeLeft > 0) {
      const interval = setInterval(() => {
        setBreakTimeLeft(prev => {
          if (prev <= 1) {
            setMode('view');
            setTimeLeft(taskDuration * 60);
            setBreakStage('prompt');
            return breakDuration * 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode, breakStage, paused, breakTimeLeft, taskDuration, breakDuration]);

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
    const normalizedDuration = Math.max(1, Math.min(60, editDuration));
    setTaskDuration(normalizedDuration);
    setColor(editColor);
    setTaskEmoji(editTaskEmoji);
    setTimeLeft(normalizedDuration * 60);
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
    // When cancelling during countdown, transition into break prompt
    setMode('break');
    setBreakStage('prompt');
    setPaused(false);
    // Reset timers to their configured durations
    setTimeLeft(taskDuration * 60);
    setBreakTimeLeft(breakDuration * 60);
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
    setBreakStage('prompt');
  };

  const handleBreakConfirm = () => {
    // Confirm selected duration and start break countdown
    setBreakTimeLeft(breakDuration * 60);
    setPaused(false);
    setBreakStage('countdown');
  };

  const handleBreakAgree = () => {
    // Move from prompt to duration selection
    setBreakStage('edit');
  };

  const adjustDuration = (increment: boolean) => {
    setEditDuration(prev => {
      const next = increment ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(60, next));
    });
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
        className="bg-white rounded-2xl p-6 md:p-7 shadow-sm w-full sm:max-w-sm md:max-w-md lg:max-w-lg self-center"
      >
        <View className="mb-3">
          <View className={`${colorClasses[color]} rounded-xl w-12 h-12 md:w-14 md:h-14 items-center justify-center`}>
            <Text className="text-neutral-900 text-2xl md:text-3xl">{taskEmoji}</Text>
          </View>
          <Text className="text-neutral-900 text-lg md:text-xl mt-2">
            <Text className="font-semibold">{taskName}</Text>
            <Text> for </Text>
            <Text className="font-semibold">{taskDuration} minutes</Text>
          </Text>
        </View>

        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
            onPress={handleEdit}
          >
            <Edit size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
            onPress={handleStart}
          >
            <Play size={22} color="#333" />
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
        className="bg-white rounded-2xl p-6 md:p-7 shadow-sm w-full sm:max-w-sm md:max-w-md lg:max-w-lg self-center"
      >
        {/* Header: emoji tile and delete icon */}
        <View className="flex-row items-center justify-between mb-3">
          <EmojiSelector
            emoji={editTaskEmoji}
            onEmojiChange={setEditTaskEmoji}
            styleVariant="compact"
            backgroundClass={colorClasses[editColor]}
          />
          <TouchableOpacity
            className="p-3"
            onPress={() => setMode('delete')}
          >
            <Trash size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Task name input */}
        <TextInput
          value={editTaskName}
          onChangeText={setEditTaskName}
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-neutral-900 text-xl md:text-2xl mb-4"
          placeholder="Walk Luna"
          placeholderTextColor={Platform.OS === 'web' ? undefined : '#9CA3AF'}
        />

        {/* Color palette */}
        <View className="flex-row items-center justify-between mb-4">
          {colorOptions.map((colorOption) => (
            <TouchableOpacity
              key={colorOption}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${colorClasses[colorOption]} border-2 border-white ${
                editColor === colorOption ? 'ring-2 ring-neutral-400' : ''
              }`}
              onPress={() => setEditColor(colorOption)}
            />
          ))}
        </View>

        {/* Duration controls */}
        <View className="flex-row items-center justify-between w-full mb-6">
          <TouchableOpacity
            className="w-12 h-12 md:w-14 md:h-14 items-center justify-center"
            onPress={() => adjustDuration(false)}
          >
            <Minus size={24} color="#666" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <View className="flex-row items-baseline justify-center">
              {/* Minutes only (MM:SS) */}
              <AnimatedRollingNumber
                value={editDuration}
                formattedText={String(editDuration).padStart(2, '0')}
                useGrouping={false}
                enableCompactNotation={false}
                spinningAnimationConfig={{ duration: 250, easing: Easing.bounce }}
                numberTextProps={{ className: 'text-4xl md:text-5xl font-semibold text-neutral-900' }}
              />
              <Text className="text-4xl md:text-5xl font-semibold text-neutral-900 mx-1">:</Text>
              <Text className="text-4xl md:text-5xl font-semibold text-neutral-900">00</Text>
            </View>
          </View>
          <TouchableOpacity
            className="w-12 h-12 md:w-14 md:h-14 items-center justify-center"
            onPress={() => adjustDuration(true)}
          >
            <Plus size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Footer actions */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
            onPress={handleCancel}
          >
            <X size={22} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
            onPress={handleSave}
          >
            <ThumbsUp size={22} color="#333" />
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
        className="bg-white rounded-2xl p-6 md:p-7 shadow-sm w-full sm:max-w-sm md:max-w-md lg:max-w-lg self-center items-center relative"
      >
        {/* Near-completion tooltip */}
        {timeLeft <= 60 && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            className="absolute -top-6 left-1/2 -translate-x-1/2 items-center"
          >
            <View className="bg-neutral-900 rounded-full px-3 py-1 shadow-sm">
              <Text className="text-white text-sm">finish</Text>
            </View>
            <View className="w-2 h-2 bg-neutral-900 rotate-45 mt-[-2]" />
          </Animated.View>
        )}

        <Text className="text-4xl md:text-5xl font-semibold text-neutral-900 mt-6 md:mt-6 mb-10 md:mb-10">
          {formatTime(timeLeft)}
        </Text>
        
        <View className="flex-row space-x-3 w-full">
          <TouchableOpacity 
            className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
            onPress={handleTimerCancel}
          >
            <X size={22} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
            onPress={handlePause}
          >
            {paused ? <Play size={22} color="#333" /> : <Pause size={22} color="#333" />}
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (mode === 'break') {
    return (
      <Animated.View 
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        layout={Layout.springify()}
        className="bg-white rounded-2xl p-6 md:p-7 shadow-sm w-full sm:max-w-sm md:max-w-md lg:max-w-lg self-center items-center"
      >
        {breakStage === 'prompt' && (
          <>
            {/* Header and description without any time display */}
            <Text className="text-xl md:text-2xl font-medium text-neutral-900 mt-6 md:mt-6 mb-2">Take a Break?</Text>
            <Text className="text-neutral-500 text-base md:text-lg mb-6">
              Break for <Text className="font-semibold">{breakDuration} minutes</Text>
            </Text>

            {/* Buttons matching countdown styling */}
            <View className="flex-row space-x-3 w-full">
              <TouchableOpacity 
                className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
                onPress={handleBreakCancel}
              >
                <X size={22} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
                onPress={handleBreakAgree}
              >
                <ThumbsUp size={22} color="#333" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {breakStage === 'edit' && (
          <>
            <Text className="text-xl md:text-2xl font-medium text-neutral-900 mt-6 md:mt-6 mb-6">Set Break Duration</Text>
            {/* Duration controls with same motion effect as edit state */}
            <View className="flex-row items-center justify-between w-full mb-6">
              <TouchableOpacity
                className="w-12 h-12 md:w-14 md:h-14 items-center justify-center"
                onPress={() => adjustBreakDuration(false)}
              >
                <Minus size={24} color="#666" />
              </TouchableOpacity>
              <View className="flex-1 items-center">
                <View className="flex-row items-baseline justify-center">
                  <AnimatedRollingNumber
                    value={breakDuration}
                    formattedText={String(breakDuration).padStart(2, '0')}
                    useGrouping={false}
                    enableCompactNotation={false}
                    spinningAnimationConfig={{ duration: 250, easing: Easing.bounce }}
                    numberTextProps={{ className: 'text-4xl md:text-5xl font-semibold text-neutral-900' }}
                  />
                  <Text className="text-4xl md:text-5xl font-semibold text-neutral-900 mx-1">:</Text>
                  <Text className="text-4xl md:text-5xl font-semibold text-neutral-900">00</Text>
                </View>
              </View>
              <TouchableOpacity
                className="w-12 h-12 md:w-14 md:h-14 items-center justify-center"
                onPress={() => adjustBreakDuration(true)}
              >
                <Plus size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Confirmation buttons identical to edit state */}
            <View className="flex-row space-x-3 w-full">
              <TouchableOpacity
                className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
                onPress={() => setBreakStage('prompt')}
              >
                <X size={22} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
                onPress={handleBreakConfirm}
              >
                <ThumbsUp size={22} color="#333" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {breakStage === 'countdown' && (
          <>
            <Text className="text-4xl md:text-5xl font-semibold text-neutral-900 mt-6 md:mt-6 mb-10 md:mb-10">
              {formatTime(breakTimeLeft)}
            </Text>

            <View className="flex-row space-x-3 w-full">
              <TouchableOpacity 
                className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
                onPress={handleBreakCancel}
              >
                <X size={22} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-6 py-4 items-center justify-center flex-1"
                onPress={handlePause}
              >
                {paused ? <Play size={22} color="#333" /> : <Pause size={22} color="#333" />}
              </TouchableOpacity>
            </View>
          </>
        )}
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
        className="bg-white rounded-2xl p-6 md:p-7 shadow-sm w-full sm:max-w-sm md:max-w-md lg:max-w-lg self-center"
      >
        <Text className="text-xl md:text-2xl font-medium text-neutral-900 mb-2 text-center">
          Delete task?
        </Text>
        <Text className="text-neutral-500 text-base md:text-lg mb-6 text-center">
          This action cannot be undone, hold to confirm.
        </Text>
        
        <View className="flex-row justify-between">
          <TouchableOpacity 
            className="bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors rounded-full px-5 py-3 flex-row items-center space-x-2"
            onPress={() => setMode('view')}
          >
            <X size={20} color="#666" />
            <Text className="text-neutral-700 font-medium text-base md:text-lg">Cancel</Text>
          </TouchableOpacity>
          
          <Pressable 
            className="bg-red-500 hover:bg-red-600 active:bg-red-600 transition-colors rounded-full px-5 py-3 flex-row items-center space-x-2"
            onLongPress={handleDeleteLongPress}
          >
            <Trash size={20} color="#fff" />
            <Text className="text-white font-medium text-base md:text-lg">Delete</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  return null;
}