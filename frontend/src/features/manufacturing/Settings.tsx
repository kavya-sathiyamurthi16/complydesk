import { ManufacturingLayout } from '../../components/manufacturing/ManufacturingLayout'
import { getBusinessOperationalRules, getGovernmentRegulatoryRules } from '../../services/complianceService'
import { User, Database, ChevronRight, ToggleLeft, ToggleRight, AlertTriangle, ExternalLink } from 'lucide-react'
import { useState } from 'react'

type SettingsTab = 'account' | 'notifications' | 'compliance' | 'system' | 'users'
type Profile = {
  fullName: string
  email: string
  phone: string
  department: string
  company: string
}

const emptyProfile: Profile = {
  fullName: '',
  email: '',
  phone: '',
  department: '',
  company: '',
}

export function ManufacturingSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const savedProfile = localStorage.getItem('complydesk-profile')
      return savedProfile ? { ...emptyProfile, ...JSON.parse(savedProfile) } : emptyProfile
    } catch {
      return emptyProfile
    }
  })
  const [saveMessage, setSaveMessage] = useState('')
  const businessRules = getBusinessOperationalRules()
  const governmentRules = getGovernmentRegulatoryRules()

  const settingsSections = [
    { id: 'account' as SettingsTab, label: 'Account', icon: User },
  ]

  // Static data that could be moved to Supabase in production
  const dbConnections = [
    { name: 'Vendor Master', status: 'Connected' },
    { name: 'Shipment/TMS', status: 'Connected' },
    { name: 'Contract/PO', status: 'Connected' },
    { name: 'Payment History', status: 'Connected' },
  ]

  const externalServices = [
    { name: 'Fuel Price API', status: 'Not configured' },
    { name: 'E-way Bill', status: 'Not configured' },
    { name: 'Document Verification', status: 'Not configured' },
  ]

  const users = [
    { name: 'Finance Team', role: 'Finance Team', email: 'finance@company.com' },
    { name: 'Compliance Team', role: 'Compliance Team', email: 'compliance@company.com' },
    { name: 'Admin User', role: 'Admin', email: 'admin@company.com' },
  ]

  const updateProfile = (field: keyof Profile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }))
    setSaveMessage('')
  }

  const saveProfile = () => {
    localStorage.setItem('complydesk-profile', JSON.stringify(profile))
    setSaveMessage('Profile saved successfully.')
  }

  return (
    <ManufacturingLayout 
      title="Settings" 
      subtitle="Manage your account and application preferences"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {settingsSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === section.id
                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{section.label}</span>
                    {activeTab === section.id && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'account' && (
              <div className="space-y-4">
                {/* Profile Card */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Profile Information</h3>
                    <p className="text-sm text-gray-500">Update your personal details</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                        <User size={32} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">Your Profile</h4>
                        <p className="text-sm text-gray-500">Manage your profile information</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(event) => updateProfile('fullName', event.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(event) => updateProfile('email', event.target.value)}
                          placeholder="Enter your email address"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(event) => updateProfile('phone', event.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <input
                          type="text"
                          value={profile.department}
                          onChange={(event) => updateProfile('department', event.target.value)}
                          placeholder="Enter your department"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                        <input
                          type="text"
                          value={profile.company}
                          onChange={(event) => updateProfile('company', event.target.value)}
                          placeholder="Enter your company name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button onClick={saveProfile} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                        Save Changes
                      </button>
                      {saveMessage && <p className="self-center text-sm text-green-600">{saveMessage}</p>}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h3>
                    <p className="text-sm text-gray-500">Choose how you want to be notified</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive email alerts for compliance issues</p>
                      </div>
                      <ToggleRight size={24} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                        <p className="text-xs text-gray-500">Receive browser push notifications</p>
                      </div>
                      <ToggleLeft size={24} className="text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Invoice Status Updates</p>
                        <p className="text-xs text-gray-500">Get notified when invoice status changes</p>
                      </div>
                      <ToggleRight size={24} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Review Queue Alerts</p>
                        <p className="text-xs text-gray-500">Alert when new items need review</p>
                      </div>
                      <ToggleRight size={24} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Weekly Summary</p>
                        <p className="text-xs text-gray-500">Receive weekly compliance reports</p>
                      </div>
                      <ToggleLeft size={24} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-4">
                {/* Business / Operational Rules */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200 bg-indigo-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Business / Operational Rules</h3>
                    <p className="text-sm text-gray-600">R-01 to R-09</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {businessRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-mono font-medium text-gray-900">{rule.id}</span>
                            <span className="text-sm text-gray-700">{rule.name}</span>
                          </div>
                          <p className="text-xs text-gray-500">{rule.description}</p>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Decision</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              rule.severity === 'BLOCK' ? 'bg-red-100 text-red-700' :
                              rule.severity === 'REVIEW' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {rule.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Government / Regulatory Rules */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200 bg-red-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Government / Regulatory Rules</h3>
                    <p className="text-sm text-gray-600">R-10 to R-12</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {governmentRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-mono font-medium text-gray-900">{rule.id}</span>
                            <span className="text-sm text-gray-700">{rule.name}</span>
                            <AlertTriangle size={14} className="text-red-600" />
                          </div>
                          <p className="text-xs text-gray-500">{rule.description}</p>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Decision</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              rule.severity === 'BLOCK' ? 'bg-red-100 text-red-700' :
                              rule.severity === 'REVIEW' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {rule.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <span className="font-medium">Note:</span> Rule configuration is read-only in this prototype. Contact system administrator for changes.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Data Sources</h3>
                    <p className="text-sm text-gray-500">Connected databases and services</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {dbConnections.map((connection) => (
                      <div key={connection.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Database size={20} className="text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{connection.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-green-600 font-medium">{connection.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">External Services</h3>
                    <p className="text-sm text-gray-500">Third-party integrations</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {externalServices.map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-60">
                        <div className="flex items-center gap-3">
                          <ExternalLink size={20} className="text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 italic">Coming soon</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">User Management</h3>
                        <p className="text-sm text-gray-500">Manage team members and permissions</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        Add User
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">User</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Role</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Email</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.email} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-white" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-sm text-gray-700">{user.role}</span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-sm text-gray-600">{user.email}</span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                                  Active
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ManufacturingLayout>
  )
}