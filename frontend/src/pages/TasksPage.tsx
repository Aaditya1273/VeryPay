import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { Search, Filter, Plus, Clock, MapPin, Star, Users } from 'lucide-react'

// Mock task data
const mockTasks = [
  {
    id: '1',
    title: 'Design a Logo for Coffee Shop',
    description: 'Looking for a creative logo design for my new coffee shop. Should be modern, warm, and inviting.',
    category: 'Design',
    budget: 150,
    duration: '3-5 days',
    location: 'Remote',
    poster: 'coffee_shop',
    posterRating: 4.8,
    skills: ['Graphic Design', 'Logo Design', 'Adobe Illustrator'],
    applications: 12,
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'open'
  },
  {
    id: '2',
    title: 'Write Product Descriptions',
    description: 'Need compelling product descriptions for 20 items in my online store. Experience with e-commerce copy preferred.',
    category: 'Writing',
    budget: 80,
    duration: '2-3 days',
    location: 'Remote',
    poster: 'store_owner',
    posterRating: 4.6,
    skills: ['Copywriting', 'E-commerce', 'SEO'],
    applications: 8,
    postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'open'
  },
  {
    id: '3',
    title: 'Social Media Management',
    description: 'Manage Instagram and Twitter accounts for a tech startup. Create engaging content and respond to comments.',
    category: 'Marketing',
    budget: 200,
    duration: '1 week',
    location: 'Remote',
    poster: 'tech_startup',
    posterRating: 4.9,
    skills: ['Social Media', 'Content Creation', 'Community Management'],
    applications: 15,
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'open'
  },
  {
    id: '4',
    title: 'Data Entry Project',
    description: 'Enter customer data from PDF files into spreadsheet. Attention to detail required.',
    category: 'Data Entry',
    budget: 50,
    duration: '1-2 days',
    location: 'Remote',
    poster: 'data_company',
    posterRating: 4.5,
    skills: ['Data Entry', 'Excel', 'Attention to Detail'],
    applications: 25,
    postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    status: 'open'
  },
  {
    id: '5',
    title: 'Mobile App Testing',
    description: 'Test new mobile app for bugs and usability issues. Provide detailed feedback report.',
    category: 'Testing',
    budget: 75,
    duration: '2-3 days',
    location: 'Remote',
    poster: 'app_developer',
    posterRating: 4.7,
    skills: ['QA Testing', 'Mobile Apps', 'Bug Reporting'],
    applications: 6,
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: 'open'
  }
]

const categories = ['All', 'Design', 'Writing', 'Marketing', 'Data Entry', 'Testing', 'Development', 'Translation']

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'budget-high':
        return b.budget - a.budget
      case 'budget-low':
        return a.budget - b.budget
      case 'applications':
        return a.applications - b.applications
      case 'newest':
      default:
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mini-Tasks</h1>
          <p className="text-muted-foreground">Find work that matches your skills</p>
        </div>
        <Button variant="vpay" asChild>
          <Link to="/tasks/create">
            <Plus className="h-4 w-4 mr-2" />
            Post a Task
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tasks, skills, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Categories */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "vpay" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-input rounded-md bg-background text-foreground text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="budget-high">Highest Budget</option>
                  <option value="budget-low">Lowest Budget</option>
                  <option value="applications">Fewest Applications</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link 
                      to={`/tasks/${task.id}`}
                      className="text-xl font-semibold hover:text-vpay-purple-600 transition-colors"
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatRelativeTime(task.postedAt)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{task.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{task.applications} applications</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-vpay-purple-600">
                      {formatCurrency(task.budget)}
                    </div>
                    <div className="text-sm text-muted-foreground">{task.duration}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground line-clamp-2">{task.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {task.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-vpay-purple-100 dark:bg-vpay-purple-900/20 text-vpay-purple-700 dark:text-vpay-purple-300 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">@{task.poster}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{task.posterRating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/tasks/${task.id}`}>View Details</Link>
                    </Button>
                    <Button variant="vpay" size="sm" asChild>
                      <Link to={`/tasks/${task.id}/apply`}>Apply Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedTasks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse different categories
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
