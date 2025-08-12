'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Info,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'

// Types
interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'Closer' | 'Manager' | 'Viewer'
  availability: 'Parametré' | 'Pas encore défini' | 'Indisponible'
  avatar?: string
  initials: string
}

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Adrien Gavel',
    email: 'gavel.adrien@gmail.com',
    role: 'Closer',
    availability: 'Parametré',
    initials: 'AG'
  },
  {
    id: '2',
    name: 'Alassane Fall',
    email: 'alassane@be-tech.co',
    role: 'Super Admin',
    availability: 'Parametré',
    initials: 'AF'
  },
  {
    id: '3',
    name: 'Clement D',
    email: 'clement@dabreteau.co',
    role: 'Super Admin',
    availability: 'Pas encore défini',
    initials: 'CD'
  },
  {
    id: '4',
    name: 'Hugo Chatelain',
    email: 'hchatelain18@gmail.com',
    role: 'Super Admin',
    availability: 'Pas encore défini',
    initials: 'HC'
  },
  {
    id: '5',
    name: 'Moussa Toure',
    email: 'moussa@be-tech.co',
    role: 'Closer',
    availability: 'Parametré',
    initials: 'MT'
  }
]

// Utility functions
const getRoleColor = (role: TeamMember['role']) => {
  switch (role) {
    case 'Super Admin':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'Closer':
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    case 'Manager':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    case 'Viewer':
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }
}

const getAvailabilityColor = (availability: TeamMember['availability']) => {
  switch (availability) {
    case 'Parametré':
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    case 'Pas encore défini':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    case 'Indisponible':
      return 'bg-red-500/20 text-red-300 border-red-500/30'
  }
}

// Components
const Avatar = ({ initials, name }: { initials: string; name: string }) => (
  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
    {initials}
  </div>
)

const RoleBadge = ({ role }: { role: TeamMember['role'] }) => (
  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(role)}`}>
    {role}
  </div>
)

const AvailabilityBadge = ({ availability }: { availability: TeamMember['availability'] }) => (
  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(availability)}`}>
    {availability}
  </div>
)

// Main component
export default function TeamView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all')

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    const matchesAvailability = selectedAvailability === 'all' || member.availability === selectedAvailability
    
    return matchesSearch && matchesRole && matchesAvailability
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-green-main" />
          <div>
            <h1 className="text-3xl font-bold text-white">Team Management</h1>
            <p className="text-gray-400">Manage your organization members and their roles</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-green-main to-green-light text-white rounded-lg hover:from-green-dark hover:to-green-main transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-main"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-main appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Closer">Closer</option>
              <option value="Manager">Manager</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-main appearance-none"
            >
              <option value="all">All Availability</option>
              <option value="Parametré">Parametré</option>
              <option value="Pas encore défini">Pas encore défini</option>
              <option value="Indisponible">Indisponible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  NOM ET PRÉNOM
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  E-MAIL
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  <div className="flex items-center space-x-2">
                    <span>RÔLE</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  <div className="flex items-center space-x-2">
                    <span>DISPONIBILITÉ</span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-gray-300 font-medium">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMembers.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar initials={member.initials} name={member.name} />
                      <span className="text-white font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{member.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="px-6 py-4">
                    <AvailabilityBadge availability={member.availability} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No members found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Showing {filteredMembers.length} of {mockTeamMembers.length} members</span>
          <div className="flex items-center space-x-4">
            <span>Super Admins: {mockTeamMembers.filter(m => m.role === 'Super Admin').length}</span>
            <span>Closers: {mockTeamMembers.filter(m => m.role === 'Closer').length}</span>
            <span>Available: {mockTeamMembers.filter(m => m.availability === 'Parametré').length}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 