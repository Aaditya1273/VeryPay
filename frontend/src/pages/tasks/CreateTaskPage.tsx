import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = [
  'Design', 'Writing', 'Marketing', 'Data Entry', 'Testing', 'Development', 
  'Translation', 'Video Editing', 'Photography', 'Consulting', 'Other'
]

const skillSuggestions = [
  'Graphic Design', 'Logo Design', 'Web Design', 'UI/UX Design',
  'Copywriting', 'Content Writing', 'Blog Writing', 'Technical Writing',
  'Social Media', 'SEO', 'Email Marketing', 'Digital Marketing',
  'Data Entry', 'Excel', 'Research', 'Virtual Assistant',
  'QA Testing', 'Mobile Testing', 'Web Testing', 'Bug Reporting',
  'JavaScript', 'React', 'Node.js', 'Python', 'WordPress',
  'Spanish', 'French', 'German', 'Chinese', 'Translation'
]

export default function CreateTaskPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    duration: '',
    location: 'Remote',
    skills: [] as string[],
    requirements: ''
  })
  const [skillInput, setSkillInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: parseFloat(formData.budget),
        deadline: formData.duration,
        skills: formData.skills,
        location: formData.location,
        requirements: formData.requirements
      }

      // Call the actual API to create the task
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('vpay-token')}`
        },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      await response.json()
      
      toast.success('Task posted successfully!')
      navigate('/tasks')
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to post task')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.title && formData.description && formData.category && 
                     formData.budget && formData.duration && formData.skills.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/tasks')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Post a New Task</h1>
          <p className="text-muted-foreground">Find the right person for your project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Task Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Design a logo for my coffee shop"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project in detail. What do you need? What are your expectations?"
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget and Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget (VRC) *
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  ≈ ${formData.budget ? (parseFloat(formData.budget) * 1.0).toFixed(2) : '0.00'} USD
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Expected Duration *
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="1 day">1 day</option>
                  <option value="2-3 days">2-3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2+ months">2+ months</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Required */}
        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="skills" className="text-sm font-medium">
                Add Skills *
              </label>
              <div className="flex space-x-2">
                <input
                  id="skills"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillInputKeyPress}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSkill(skillInput)}
                  disabled={!skillInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Skill Suggestions */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Suggested Skills:</p>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions
                  .filter(skill => !formData.skills.includes(skill))
                  .slice(0, 10)
                  .map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-2 py-1 text-xs border border-input rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-vpay-purple-100 dark:bg-vpay-purple-900/20 text-vpay-purple-700 dark:text-vpay-purple-300 text-sm rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label htmlFor="requirements" className="text-sm font-medium">
                Special Requirements (optional)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="Any specific requirements, deliverables, or qualifications needed?"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/tasks')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="vpay"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Task'}
          </Button>
        </div>
      </form>
    </div>
  )
}
