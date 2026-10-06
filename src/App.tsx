import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { BottomNav } from './components/BottomNav'
import { GlossaryPressLayer } from './components/GlossarySheet'
import { TopBar } from './components/TopBar'
import { ExamResultScreen } from './exam/ExamResultScreen'
import { ExamReviewScreen } from './exam/ExamReviewScreen'
import { ExamRunScreen } from './exam/ExamRunScreen'
import { ExamScreen } from './exam/ExamScreen'
import { PlacementRun } from './lesson/PlacementRun'
import { CheckpointScreen } from './lesson/CheckpointScreen'
import { LessonScreen } from './lesson/LessonScreen'
import { PracticeRun } from './lesson/PracticeRun'
import { useRoute, type Route, type Tab } from './lib/router'
import { GlossaryScreen } from './screens/GlossaryScreen'
import { GuideScreen } from './screens/GuideScreen'
import { HomeScreen } from './screens/HomeScreen'
import { OutlineScreen } from './screens/OutlineScreen'
import { PracticeScreen } from './screens/PracticeScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { StatsScreen } from './screens/StatsScreen'
import { useProgress } from './store/progress'
import { startSync } from './sync/sync'

function TabScreen({ tab }: { tab: Tab }) {
  switch (tab) {
    case 'home':
      return <HomeScreen />
    case 'latihan':
      return <PracticeScreen />
    case 'ujian':
      return <ExamScreen />
    case 'statistik':
      return <StatsScreen />
    case 'glosarium':
      return <GlossaryScreen />
    case 'pengaturan':
      return <SettingsScreen />
  }
}

function FullScreen({ route }: { route: Exclude<Route, { name: 'tab' }> }) {
  switch (route.name) {
    case 'lesson':
      return <LessonScreen key={route.lessonId} lessonId={route.lessonId} />
    case 'checkpoint':
      return <CheckpointScreen key={route.checkpointId} checkpointId={route.checkpointId} />
    case 'practice':
      return <PracticeRun />
    case 'exam':
      return <ExamRunScreen />
    case 'exam-result':
      return <ExamResultScreen attemptId={route.attemptId} />
    case 'exam-review':
      return <ExamReviewScreen attemptId={route.attemptId} />
    case 'guide':
      return <GuideScreen unitId={route.unitId} />
    case 'placement':
      return <PlacementRun />
    case 'outline':
      return <OutlineScreen />
  }
}

export function App() {
  const route = useRoute()
  const refreshDay = useProgress((s) => s.refreshDay)

  // Hearts refill on a new day: check on start and whenever the app comes back.
  useEffect(() => {
    refreshDay()
    const onVisible = () => document.visibilityState === 'visible' && refreshDay()
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [refreshDay])

  // Progress sync between devices; does nothing until a sync code is set in Settings.
  useEffect(() => startSync(), [])

  return (
    // reducedMotion="user" turns off transform animations when the OS asks for less motion.
    <MotionConfig reducedMotion="user">
      <div className="mx-auto min-h-dvh max-w-[480px]">
        {route.name === 'tab' ? (
          <>
            <TopBar />
            <TabScreen key={route.tab} tab={route.tab} />
            <BottomNav active={route.tab} />
          </>
        ) : (
          <FullScreen key={JSON.stringify(route)} route={route} />
        )}
        <GlossaryPressLayer />
      </div>
    </MotionConfig>
  )
}
