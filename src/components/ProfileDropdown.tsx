import React, { useState } from 'react'
import { User, Settings, LogOut, HelpCircle, Shield, ChevronDown } from 'lucide-react'

interface ProfileDropdownProps {
  onViewProfile: () => void;
  onSystemSettings: () => void;
  onSecurity: () => void;
  onHelp: () => void;
  onSignOut: () => void;
  currentUser: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onViewProfile,
  onSystemSettings,
  onSecurity,
  onHelp,
  onSignOut,
  currentUser
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      icon: User,
      label: 'Profile Settings',
      action: onViewProfile
    },
    {
      icon: Settings,
      label: 'System Settings',
      action: onSystemSettings
    },
    {
      icon: Shield,
      label: 'Security',
      action: onSecurity
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: onHelp
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      action: onSignOut,
      className: 'text-red-600 hover:text-red-700 hover:bg-red-50'
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{currentUser}</p>
          <p className="text-xs text-gray-500">Workshop Admin</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentUser}</p>
                  <p className="text-sm text-gray-500">Workshop Admin</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.action()
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      item.className || 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileDropdown