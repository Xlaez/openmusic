import { useState } from 'react'
import { TypeSelection } from '@/components/upload/TypeSelection'
import { ProjectDetailsForm } from '@/components/upload/ProjectDetailsForm'
import { TrackUploader } from '@/components/upload/TrackUploader'
import { PricingForm } from '@/components/upload/PricingForm'
import { UploadReview } from '@/components/upload/UploadReview'
import { Button } from '@/components/ui/Button'
import type { ProjectType } from '@/types'
import { ChevronRight, ChevronLeft, Loader2, Rocket, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useCreateProject } from '@/lib/api/upload'
import { useNavigate } from '@tanstack/react-router'

type Step = 'type' | 'details' | 'tracks' | 'pricing' | 'review'

export function UploadFlow() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>('type')
  const { mutate: create, isPending, isSuccess } = useCreateProject()

  // Form State
  const [formData, setFormData] = useState({
    type: null as ProjectType | null,
    title: '',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0],
    coverImage: '',
    tracks: [] as any[],
    pricePerUnit: 20,
    totalUnits: 100,
    genres: [] as string[],
  })

  const steps: Step[] = ['type', 'details', 'tracks', 'pricing', 'review']
  const currentIndex = steps.indexOf(currentStep)

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 'type':
        return !!formData.type
      case 'details':
        return !!formData.title && !!formData.coverImage && formData.genres.length > 0
      case 'tracks': {
        if (!formData.type) return false
        const count = formData.tracks.length
        if (formData.type === 'single') return count >= 1 && count <= 3
        if (formData.type === 'ep') return count >= 4 && count <= 9
        if (formData.type === 'album') return count >= 10
        return count > 0
      }
      case 'pricing':
        return formData.pricePerUnit >= 1 && formData.totalUnits >= 1
      default:
        return true
    }
  }

  const handleCreate = () => {
    create(
      {
        ...formData,
        price: formData.pricePerUnit, // Map pricePerUnit to price
        type: formData.type!,
        tracks: formData.tracks.map((t) => ({
          title: t.title,
          duration: t.duration,
          file: t.file,
        })),
      },
      {
        onSuccess: () => {
          setTimeout(() => navigate({ to: '/explore', search: { filter: 'all', q: '' } }), 3000)
        },
      },
    )
  }

  // Success Screen
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500 text-center space-y-6">
        <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Project Created Successfully!</h2>
          <p className="text-text-secondary">
            Your music is now live and on-chain. Redirecting to your profile...
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate({ to: '/explore', search: { filter: 'all', q: '' } })}
        >
          View My Profile
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      {/* Header & Steps Indicator */}
      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center gap-4">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  'h-2 w-12 rounded-full transition-all duration-300',
                  i <= currentIndex ? 'bg-primary' : 'bg-white/5',
                )}
              />
              {i < steps.length - 1 && <div className="mx-1" />}
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted font-mono uppercase tracking-[0.2em]">
          Step {currentIndex + 1} of 5 • {currentStep}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {currentStep === 'type' && (
          <TypeSelection
            selected={formData.type}
            onSelect={(type) => setFormData((prev) => ({ ...prev, type }))}
          />
        )}
        {currentStep === 'details' && (
          <ProjectDetailsForm
            data={formData}
            projectType={formData.type}
            onChange={(details) => setFormData((prev) => ({ ...prev, ...details }))}
          />
        )}
        {currentStep === 'tracks' && (
          <TrackUploader
            tracks={formData.tracks}
            onChange={(tracks) => setFormData((prev) => ({ ...prev, tracks }))}
          />
        )}
        {currentStep === 'pricing' && (
          <PricingForm
            data={formData}
            onChange={(pricing) => setFormData((prev) => ({ ...prev, ...pricing }))}
          />
        )}
        {currentStep === 'review' && <UploadReview data={formData} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentIndex === 0 || isPending}
          className="gap-2 text-text-secondary hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep === 'review' ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreate}
            disabled={!isStepValid() || isPending}
            className="px-12 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating project...
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5" />
                Create Release
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!isStepValid()}
            className="px-12 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all gap-2"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
