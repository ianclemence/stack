import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, View, Text, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import EditTaskModal from './EditTaskModal';
import BreakSuggestionModal from './BreakSuggestionModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EmptyState from './EmptyState';
import {
  ColorOption,
  TaskData,
  minutesToSeconds,
  formatTime,
  colorBgClass,
} from './utils';

type TimerState = 'idle' | 'running' | 'paused' | 'break';

const initialTask: TaskData = {
  title: 'Read a book',
  minutes: 45,
  emoji: '📚',
  color: 'blue',
};

export default function StackTimer() {
  const [task, setTask] = useState<TaskData | null>(initialTask);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [remaining, setRemaining] = useState<number>(minutesToSeconds(initialTask.minutes));
  const [breakRemaining, setBreakRemaining] = useState<number>(0);

  const [showEdit, setShowEdit] = useState(false);
  const [showBreakSuggest, setShowBreakSuggest] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef<AppStateStatus>('active');

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      appState.current = next;
      if (next !== 'active') {
        // pause timers when background
        stopTick();
        if (timerState === 'running') setTimerState('paused');
      }
    });
    return () => sub.remove();
  }, [timerState]);

  useEffect(() => {
    if (timerState === 'running') startTick();
    else stopTick();
    // Cleanup on unmount
    return () => stopTick();
  }, [timerState]);

  useEffect(() => {
    if (timerState !== 'break') return;
    // Break tick
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setBreakRemaining((s) => {
        const next = s - 1;
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // After break ends, return to main view. If task is deleted or finished, show empty.
          setTimerState('idle');
        }
        return Math.max(0, next);
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [timerState]);

  const startTick = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining((s) => {
        const next = s - 1;
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimerState('idle');
          // complete task
          setTask(null);
        }
        return Math.max(0, next);
      });
    }, 1000);
  };

  const stopTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onStart = () => {
    if (!task) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimerState('running');
  };

  const onPause = () => {
    Haptics.selectionAsync();
    setTimerState('paused');
  };

  const onResume = () => {
    Haptics.selectionAsync();
    setTimerState('running');
  };

  const onFinishEarly = () => {
    if (!task) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowBreakSuggest(true);
  };

  const confirmBreak = (minutes: number) => {
    setShowBreakSuggest(false);
    // Consider task finished early
    setTask(null);
    setBreakRemaining(minutesToSeconds(minutes));
    setTimerState('break');
  };

  const cancelBreak = () => {
    setShowBreakSuggest(false);
  };

  const onDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    stopTick();
    setTask(null);
    setTimerState('idle');
  };

  const cancelDelete = () => setShowDeleteConfirm(false);

  const openEdit = () => setShowEdit(true);
  const cancelEdit = () => setShowEdit(false);
  const confirmEdit = ({ emoji, color, minutes }: { emoji: string; color: ColorOption; minutes: number }) => {
    setShowEdit(false);
    if (!task) return;
    const updated: TaskData = { ...task, emoji, color, minutes };
    setTask(updated);
    setRemaining(minutesToSeconds(minutes));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const createDemoTask = () => {
    setTask(initialTask);
    setRemaining(minutesToSeconds(initialTask.minutes));
    setTimerState('idle');
  };

  const accent = task ? colorBgClass[task.color] : 'bg-blue-500';

  const card = useMemo(() => {
    if (!task) return null;
    const running = timerState === 'running';
    const paused = timerState === 'paused';
    return (
      <View className="bg-white rounded-2xl p-4 shadow-sm">
        {/* Top row */}
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center gap-3">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${accent}`}>
              <Text className="text-2xl">{task.emoji}</Text>
            </View>
            <View>
              <Text className="text-lg font-medium">
                {task.title} for {task.minutes} minutes
              </Text>
              <Text className="text-gray-600">{formatTime(remaining)}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete task"
          >
            <View className="p-2">
              <Feather name="trash-2" size={18} color="#444" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom actions */}
        <View className="flex-row items-center justify-between mt-4">
          <TouchableOpacity onPress={openEdit} accessibilityRole="button" accessibilityLabel="Edit task">
            <View className="px-4 py-2 rounded-full bg-gray-100 flex-row items-center gap-2">
              <Feather name="edit-2" size={16} color="#111" />
              <Text className="text-gray-900">Edit</Text>
            </View>
          </TouchableOpacity>

          {running ? (
            <TouchableOpacity onPress={onPause} accessibilityRole="button" accessibilityLabel="Pause">
              <View className="px-4 py-2 rounded-full bg-gray-900 flex-row items-center gap-2">
                <Ionicons name="pause" size={16} color="#fff" />
                <Text className="text-white">Pause</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={paused ? onResume : onStart} accessibilityRole="button" accessibilityLabel={paused ? 'Resume' : 'Start'}>
              <View className="px-4 py-2 rounded-full bg-gray-900 flex-row items-center gap-2">
                <Ionicons name={paused ? 'play' : 'play'} size={16} color="#fff" />
                <Text className="text-white">{paused ? 'Resume' : 'Start'}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Floating Finish button */}
        {(running || paused) && (
          <View className="absolute -top-5 right-4">
            <TouchableOpacity onPress={onFinishEarly} accessibilityRole="button" accessibilityLabel="Finish early">
              <View className="rounded-full bg-gray-800 px-4 py-2">
                <Text className="text-white">Finish</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }, [task, timerState, remaining]);

  if (!task) {
    return (
      <View className="p-4">
        <EmptyState onAddTask={createDemoTask} />
        {/* Modals still mounted to stay consistent */}
        <BreakSuggestionModal visible={showBreakSuggest} defaultMinutes={5} onCancel={cancelBreak} onConfirm={confirmBreak} />
        <DeleteConfirmationModal visible={showDeleteConfirm} onCancel={cancelDelete} onDeleteConfirm={confirmDelete} />
      </View>
    );
  }

  return (
    <View className="p-4">
      {card}
      <EditTaskModal
        visible={showEdit}
        initialEmoji={task.emoji}
        initialColor={task.color}
        initialMinutes={task.minutes}
        onCancel={cancelEdit}
        onConfirm={confirmEdit}
      />

      <BreakSuggestionModal visible={showBreakSuggest} defaultMinutes={5} onCancel={cancelBreak} onConfirm={confirmBreak} />
      <DeleteConfirmationModal visible={showDeleteConfirm} onCancel={cancelDelete} onDeleteConfirm={confirmDelete} />

      {timerState === 'break' && (
        <View className="mt-4 items-center">
          <Text className="text-gray-700">Break: {formatTime(breakRemaining)}</Text>
        </View>
      )}
    </View>
  );
}