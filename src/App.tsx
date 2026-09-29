import { MotionConfig } from 'framer-motion'
import { BottomNav } from './components/BottomNav'
import { TopBar } from './components/TopBar'
import { LessonScreen } from './lesson/LessonScreen'
import { useRoute, type Tab } from './lib/router'
import { ComingSoonScreen } from './screens/ComingSoonScreen'
import { HomeScreen } from './screens/HomeScreen'
import { SettingsScreen } from './screens/SettingsScreen'

function TabScreen({ tab }: { tab: Tab }) {
  switch (tab) {
    case 'home':
      return <HomeScreen />
    case 'latihan':
      return <ComingSoonScreen title="Latihan" note="Soal yang pernah salah akan muncul lagi di sini (tahap 6)." />
    case 'statistik':
      return <ComingSoonScreen title="Statistik" note="XP total, streak, dan penguasaan per konsep (tahap 6)." />
    case 'glosarium':
      return <ComingSoonScreen title="Glosarium" note="Semua singkatan dan kepanjangannya, bisa dicari (tahap 6)." />
    case 'pengaturan':
      return <SettingsScreen />
  }
}

export function App() {
  const route = useRoute()

  return (
    // reducedMotion="user" turns off transform animations when the OS asks for less motion.
    <MotionConfig reducedMotion="user">
      <div className="mx-auto min-h-dvh max-w-[480px]">
        {route.name === 'lesson' ? (
          <LessonScreen key={route.lessonId} lessonId={route.lessonId} />
        ) : (
          <>
            <TopBar />
            <TabScreen key={route.tab} tab={route.tab} />
            <BottomNav active={route.tab} />
          </>
        )}
      </div>
    </MotionConfig>
  )
}
