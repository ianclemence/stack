## 🧠 Full Prompt for the Coding Agent

> ⚙️ **Project Context:**
> You’re building a React Native Expo app called **Stack**, which helps users manage and time their tasks (like Pomodoro or focus sessions). The component should visually and interactively match the attached reference: a single, smooth card that transitions between multiple states (task view, edit, timer, break, and delete confirmation).
> Use **NativeWind** for styling and **Reanimated** or **Framer Motion for React Native** for transitions.

---

## 🧩 **Prompt to the LLM**

You are building a **React Native Expo component** called `StackTimer` using **NativeWind** (Tailwind CSS for React Native) and **Framer Motion (or Reanimated)** for animated state transitions.

This component represents a **self-contained interactive card** that handles five UI states **without using any modals** — only in-place transitions and animations.

---

### 🪄 **Component Overview**

The component should render a **single card** that smoothly transitions between:

1. **View Mode** → shows task info with edit/play buttons.
2. **Edit Mode** → lets the user change the name, duration, and color.
3. **Timer Mode** → shows a running countdown with pause/cancel.
4. **Break Mode** → lets user take a break with adjustable time.
5. **Delete Mode** → asks for delete confirmation with long-press.

Each state must transition with **smooth opacity and layout animations** using `AnimatePresence` or `Reanimated` transitions.

---

### ⚙️ **Tech Requirements**

* Framework: **React Native + Expo**
* Styling: **NativeWind (Tailwind CSS for React Native)**
* Animation: **Framer Motion for React Native** *(preferred)* or `react-native-reanimated`
* Icons: **Lucide React Native** (e.g., `Play`, `Pause`, `Edit`, `Trash`, `X`)
* State: Managed locally with `useState`
* Timer: Use `useEffect` and `setInterval` to handle countdown logic
* Long press detection for delete confirmation using `Pressable`'s `onLongPress`

---

### 🎨 **Design & Style Guidelines**

**General Card Style**

```jsx
className="bg-white rounded-2xl p-5 shadow-sm w-full max-w-sm self-center"
```

* Background: `bg-neutral-50`
* Text: `text-neutral-900 font-medium`
* Buttons:

  * Default: `bg-neutral-100 rounded-full px-4 py-2`
  * Active: `bg-neutral-200`
* Icons: `text-neutral-600`
* Color options: `bg-red-500`, `bg-orange-500`, `bg-yellow-500`, `bg-green-500`, `bg-blue-500`, `bg-purple-500`, `bg-pink-500`

**Typography**

* Title: `text-lg font-medium`
* Timer: `text-4xl font-semibold text-center`
* Subtext: `text-neutral-500 text-sm`

---

### 🧩 **Functional Requirements per State**

#### 🐾 1. View State

* Shows:

  * Left icon in colored square (`bg-red-500 p-2 rounded-lg`)
  * Task title and duration text:
    *“Walk Luna for 30 minutes”*
  * Two pill buttons: ✏️ Edit, ▶️ Start
* Clicking **Edit** → transition to **Edit State**
* Clicking **Play** → transition to **Timer State**

#### ✏️ 2. Edit State

* Expands vertically
* Shows:

  * Text input for task name
  * Color selection row with circular buttons
  * Timer adjuster: “- 45:00 +”
  * Bottom buttons: ❌ Cancel, 👍 Save
* Save → returns to **View State**
* Cancel → reverts to **View State**

#### ⏳ 3. Timer State

* Shows large countdown (e.g., 29:59)
* Buttons below:

  * ❌ Cancel → back to **View State**
  * ⏸️ Pause → toggles pause/play
* “Finish” tooltip appears near completion (fade animation)

#### ☕ 4. Break State

* Header: “Take a Break?”
* Subtext: “Break for 5 minutes”
* Timer with +/- adjust buttons
* ❌ Cancel and 👍 Confirm buttons at bottom
* Transition back to **View State** after break ends or cancel

#### 🗑️ 5. Delete Confirmation State

* Text: “Delete task? This action cannot be undone, hold to confirm.”
* Two buttons:

  * ❌ Cancel → back to **View State**
  * 🗑️ Delete (requires long press)
* Card slightly shakes on hold to indicate confirmation

---

### 🧭 **Component Structure Example**

```jsx
import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native'
import { useState, useEffect } from 'react'
import { AnimatePresence, MotiView } from 'moti'
import { Play, Pause, Edit, Trash, X, Check } from 'lucide-react-native'

export default function StackTimer() {
  const [mode, setMode] = useState('view') // view | edit | timer | break | delete
  const [timeLeft, setTimeLeft] = useState(1800) // seconds
  const [paused, setPaused] = useState(false)
  const [taskName, setTaskName] = useState('Walk Luna')
  const [color, setColor] = useState('bg-red-500')

  useEffect(() => {
    if (mode === 'timer' && !paused) {
      const interval = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [mode, paused])

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {mode === 'view' && (
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-5 shadow-sm w-80">
          <View className="flex-row items-center space-x-3">
            <View className={`${color} p-2 rounded-lg`}>
              {/* Example icon placeholder */}
            </View>
            <Text className="text-neutral-900 font-medium">{taskName} for 30 minutes</Text>
          </View>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity className="bg-neutral-100 p-2 rounded-full" onPress={() => setMode('edit')}>
              <Edit size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-neutral-100 p-2 rounded-full" onPress={() => setMode('timer')}>
              <Play size={20} />
            </TouchableOpacity>
          </View>
        </MotiView>
      )}

      {mode === 'timer' && (
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-5 shadow-sm w-80 items-center">
          <Text className="text-4xl font-semibold mb-4">{formatTime(timeLeft)}</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="bg-neutral-100 p-3 rounded-full" onPress={() => setMode('view')}>
              <X size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-neutral-100 p-3 rounded-full" onPress={() => setPaused(!paused)}>
              {paused ? <Play size={20} /> : <Pause size={20} />}
            </TouchableOpacity>
          </View>
        </MotiView>
      )}

      {/* Repeat for edit, break, delete modes following same pattern */}
    </AnimatePresence>
  )
}
```

---

### 💡 **Additional Notes**

* Ensure **all transitions** between states use soft fade or slide animations.
* Avoid modal popups — every state is rendered inline in the same card.
* Use **Tailwind spacing** (`space-y-3`, `p-5`, `rounded-2xl`, `shadow-sm`) to maintain balance.
* Colors and icons should change dynamically based on the selected theme color.
* Keep animations under **300ms** for responsiveness.
