import { FormBuilderHero } from '@/components/home/FormBuilderHero'
import { DashboardContent } from '@/components/dashboard/DashboardContent'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <FormBuilderHero />
    </main>
  )
}
