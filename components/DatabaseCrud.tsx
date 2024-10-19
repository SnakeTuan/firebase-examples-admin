'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'

export function DatabaseCRUD() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [editingUser, setEditingUser] = useState<any>(null)

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/database/getUser')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Add a new user
  const addUser = async () => {
    if (newUserName.trim() === '' || newUserEmail.trim() === '') {
      return alert('Please fill in all the fields')
    }
    try {
      const res = await fetch('/api/database/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName, email: newUserEmail }),
      })
      if (res.ok) {
        setNewUserName('')
        setNewUserEmail('')
        fetchUsers()
        alert('User added successfully')
      } 
      else {
        const errorData = await res.json()
        alert(errorData.error || 'Failed to add user')
      }
    } 
    catch (error) {
      console.error('Error adding user:', error)
      alert('Failed to add user')
    }
  }

  // Update an existing user
  const updateUser = async () => {
    if (editingUser && (editingUser.name.trim() === '' || editingUser.email.trim() === '')) {
      return alert('Please fill in all the fields')
    }
    try {
      const res = await fetch('/api/database/editUser', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingUser.id, name: editingUser.name, email: editingUser.email }),
      })
      if (res.ok) {
        setEditingUser(null)
        fetchUsers()
        alert('User updated successfully')
      }
      else {
        const errorData = await res.json()
        alert(errorData.error || 'Failed to update user')
      }
    }
    catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    }
  }

  // Delete a user
  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')){
      return
    }

    try {
      const res = await fetch('/api/database/deleteUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        fetchUsers()
        alert('User deleted successfully')
      }
      else {
        const errorData = await res.json()
        alert(errorData.error || 'Failed to delete user')
      }
    }
    catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Firebase Users CRUD Example</h1>
      
      <div className="mb-6">
        {/* Add a user to 'users' collection */}
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="User Name"
            className="flex-grow"
          />
          <Input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="User Email"
            className="flex-grow"
          />
          <Button onClick={addUser} className="flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {loading ? (
        // Show loading icon while fetching users
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        // Show all users in 'users' collection
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between p-4 border-b">
                {editingUser && editingUser.id === user.id ? (
                  <>
                    <span className="flex-grow mr-2">{user.id}</span>
                    <Input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="flex-grow mr-2"
                    />
                    <Input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="flex-grow mr-2"
                    />
                  </>
                ) : (
                  <>
                    <span className="flex-grow text-center">{user.id}</span>
                    <span className="flex-grow text-center">{user.name}</span>
                    <span className="flex-grow text-center">{user.email}</span>
                  </>
                )}
                <div className="flex gap-2">
                  {editingUser && editingUser.id === user.id ? (
                    <Button onClick={updateUser} size="sm" variant="outline">
                      Save
                    </Button>
                  ) : (
                    <Button onClick={() => setEditingUser(user)} size="sm" variant="outline">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  <Button onClick={() => deleteUser(user.id)} size="sm" variant="outline" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}