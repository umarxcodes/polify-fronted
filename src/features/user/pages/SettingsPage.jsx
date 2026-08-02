import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Save, User, Bell, Shield, Palette } from 'lucide-react'
import { resolveIcon } from '../../../components/ui/iconUtils'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { toast } from 'sonner'
import { apiClient } from '../../../lib/axios'
import { normalizeUserResponse } from '../../../utils/apiResponse'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

const preferenceFields = [
  { key: 'emailNotifications', label: 'Email notifications', description: 'Receive account and moderation updates by email' },
  { key: 'pushNotifications', label: 'Push notifications', description: 'Receive notifications in your browser' },
  { key: 'voteNotifications', label: 'Vote activity', description: 'Get notified when someone votes on your polls' },
  { key: 'commentNotifications', label: 'Comments and replies', description: 'Get notified about comments and replies' },
  { key: 'pollNotifications', label: 'Poll updates', description: 'Get notified when polls you follow change or close' },
  { key: 'systemNotifications', label: 'System announcements', description: 'Receive important service notifications' },
  { key: 'marketingNotifications', label: 'Product updates', description: 'Receive occasional Pollify news and tips' },
]

const defaultPreferences = Object.fromEntries(
  preferenceFields.map(({ key }) => [key, key !== 'marketingNotifications'])
)

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [savingPreference, setSavingPreference] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      bio: '',
      location: '',
      website: '',
    },
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [response, preferencesResponse] = await Promise.all([
          apiClient.get('/users/me'),
          apiClient.get('/notifications/preferences'),
        ])
        const user = normalizeUserResponse(response.data)
        if (user) {
          reset({
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
            bio: user.bio || '',
            location: user.location || '',
            website: user.website || '',
          })
        }
        const storedPreferences = preferencesResponse.data?.data?.preferences
        if (storedPreferences) {
          setPreferences((current) => ({ ...current, ...storedPreferences }))
        }
      } catch {
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [reset])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const profile = { ...data }
      delete profile.email
      const { name, ...profileFields } = profile
      const response = await apiClient.patch('/users/profile', {
        ...profileFields,
        fullName: name,
      })
      const user = normalizeUserResponse(response.data)
      if (user) {
        reset({
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || '',
        })
      }
      toast.success('Settings saved!', {
        description: 'Your changes have been updated.',
      })
    } catch (error) {
      toast.error('Failed to save settings', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  const updatePreference = async (key, enabled) => {
    const previous = preferences
    const next = { ...preferences, [key]: enabled }
    setPreferences(next)
    setSavingPreference(key)
    try {
      const response = await apiClient.patch('/notifications/preferences', { [key]: enabled })
      const saved = response.data?.data?.preferences
      if (saved) setPreferences((current) => ({ ...current, ...saved }))
    } catch (error) {
      setPreferences(previous)
      toast.error('Failed to update notification preference', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSavingPreference(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="mb-8">
          <div className="h-8 w-48 bg-surface-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-surface-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <Card className="p-2">
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-surface-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </Card>
          </div>
          <div className="flex-1">
            <Card className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-surface-200 rounded animate-pulse" />
                    <div className="h-10 w-full bg-surface-100 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-surface-900">Settings</h2>
        <p className="text-surface-500 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                    }
                  `}
                >
                  {resolveIcon(tab.icon, 18)}
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-1">
                  Profile Information
                </h3>
                <p className="text-sm text-surface-500 mb-6">
                  Update your public profile details.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      {...register('name')}
                      error={errors.name?.message}
                    />
                    <Input
                      label="Username"
                      {...register('username')}
                      error={errors.username?.message}
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    {...register('email')}
                    readOnly
                    error={errors.email?.message}
                  />
                  <p className="-mt-3 text-xs text-surface-500">
                    Email changes are managed through account verification.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      className="input w-full resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Location"
                      {...register('location')}
                      placeholder="City, Country"
                    />
                    <Input
                      label="Website"
                      {...register('website')}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={saving}
                      disabled={!isDirty}
                      icon={<Save size={16} />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-1">
                  Notification Preferences
                </h3>
                <p className="text-sm text-surface-500 mb-6">
                  Choose how and when Pollify reaches you.
                </p>

                <div className="space-y-6">
                  {preferenceFields.map((setting) => (
                    <div
                      key={setting.label}
                      className="flex items-center justify-between py-3 border-b border-surface-100 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-surface-900">
                          {setting.label}
                        </p>
                        <p className="text-xs text-surface-500 mt-0.5">
                          {setting.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          aria-label={setting.label}
                          checked={preferences[setting.key]}
                          disabled={savingPreference === setting.key}
                          onChange={(event) => updatePreference(setting.key, event.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-1">
                  Privacy & Security
                </h3>
                <p className="text-sm text-surface-500 mb-6">
                  Control your privacy settings.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      label: 'Private profile',
                      description:
                        'Only approved followers can see your profile',
                      enabled: false,
                    },
                    {
                      label: 'Show online status',
                      description: "Let others see when you're online",
                      enabled: true,
                    },
                    {
                      label: 'Allow mentions',
                      description: 'Allow other users to mention you',
                      enabled: true,
                    },
                  ].map((setting) => (
                    <div
                      key={setting.label}
                      className="flex items-center justify-between py-3 border-b border-surface-100 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-surface-900">
                          {setting.label}
                        </p>
                        <p className="text-xs text-surface-500 mt-0.5">
                          {setting.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={setting.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-1">
                  Appearance
                </h3>
                <p className="text-sm text-surface-500 mb-6">
                  Customize how Pollify looks for you.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Light', 'Dark', 'System'].map((theme) => (
                        <button
                          key={theme}
                          className={`
                            p-4 rounded-xl border-2 text-sm font-medium transition-all
                            ${
                              theme === 'Light'
                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                : 'border-surface-200 hover:border-surface-300'
                            }
                          `}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Accent Color
                    </label>
                    <div className="flex gap-3">
                      {[
                        'bg-brand-500',
                        'bg-violet-500',
                        'bg-cyan-500',
                        'bg-orange-500',
                      ].map((color, index) => (
                        <button
                          key={color}
                          className={`
                            w-10 h-10 rounded-xl ${color} transition-all
                            ${index === 0 ? 'ring-2 ring-brand-500 ring-offset-2' : 'hover:scale-110'}
                          `}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
