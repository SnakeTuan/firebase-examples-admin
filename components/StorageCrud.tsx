'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'

export function StorageCrud() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
  }

  const uploadAvatar = async (userId: string, e: React.SyntheticEvent) => {
    e.preventDefault()
    setUploading(true)

    if (!selectedFile) return

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('userId', userId)

    const res = await fetch('/api/storage/uploadFile', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    console.log("Upload Avatar Response:", data)
    
    setSelectedFile(null)
    setEditingUserId(null)
    setUploading(false)
    fetchUsers()
  }

  const deleteAvatar = async (userId: string) => {
    const res = await fetch('/api/storage/deleteFile', {
      method: 'POST',
      body: JSON.stringify({ userId })
    })

    const data = await res.json()
    console.log("Delete Avatar Response:", data)

    fetchUsers()
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Firebase Users CRUD Example</h1>

      {loading ? (
        // Show loading icon while fetching users
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">User ID</th>
              <th className="py-2">User Name</th>
              <th className="py-2">Avatar</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="text-center">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-16 h-16 object-cover mx-auto" />
                  ) : (
                    'No Avatar'
                  )}
                </td>
                <td className="border px-4 py-2">
                  {user.avatarUrl ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => setEditingUserId(user.id)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteAvatar(user.id)}
                        className="text-white hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => setEditingUserId(user.id)}
                    >
                      <Plus size={16} />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Upload Avatar Modal */}
      {editingUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-96 p-4">
            <CardContent>
              <h2 className="text-xl mb-4">
                {users.find(u => u.id === editingUserId)?.avatarUrl ? 'Edit Avatar' : 'Upload Avatar'}
              </h2>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => setEditingUserId(null)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={(e) => uploadAvatar(editingUserId, e)}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}