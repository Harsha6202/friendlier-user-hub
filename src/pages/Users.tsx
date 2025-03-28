
import React, { useState, useEffect } from 'react';
import { UserService } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Loader2, LogOut, Search, Edit, Trash2, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [createFormData, setCreateFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [createErrors, setCreateErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  const { toast } = useToast();
  const { logout } = useAuth();

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const response = await UserService.getUsers(page);
      setUsers(response.data);
      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error Fetching Users",
        description: "There was a problem loading the user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateClick = () => {
    setCreateFormData({
      first_name: '',
      last_name: '',
      email: '',
    });
    setCreateErrors({
      first_name: '',
      last_name: '',
      email: '',
    });
    setIsCreateDialogOpen(true);
  };

  const validateEditForm = () => {
    let valid = true;
    const newErrors = {
      first_name: '',
      last_name: '',
      email: '',
    };

    if (!editFormData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
      valid = false;
    }

    if (!editFormData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
      valid = false;
    }

    if (!editFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateCreateForm = () => {
    let valid = true;
    const newErrors = {
      first_name: '',
      last_name: '',
      email: '',
    };

    if (!createFormData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
      valid = false;
    }

    if (!createFormData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
      valid = false;
    }

    if (!createFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(createFormData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    setCreateErrors(newErrors);
    return valid;
  };

  const handleEditSubmit = async () => {
    if (!validateEditForm() || !selectedUser) return;

    try {
      setLoading(true);
      await UserService.updateUser(selectedUser.id, editFormData);
      
      // Update local state to reflect changes
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, ...editFormData }
            : user
        )
      );
      
      setIsEditDialogOpen(false);
      toast({
        title: "User Updated",
        description: "User information has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async () => {
    if (!validateCreateForm()) return;

    try {
      setLoading(true);
      const response = await UserService.createUser(createFormData);
      
      // Add the new user to the local state
      const newUser = {
        id: response.id,
        first_name: createFormData.first_name,
        last_name: createFormData.last_name,
        email: createFormData.email,
        avatar: `https://ui-avatars.com/api/?name=${createFormData.first_name}+${createFormData.last_name}`,
      };
      
      setUsers([newUser, ...users]);
      
      setIsCreateDialogOpen(false);
      toast({
        title: "User Created",
        description: "New user has been added successfully",
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Creation Failed",
        description: "There was a problem creating the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      await UserService.deleteUser(selectedUser.id);
      
      // Update local state to remove deleted user
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      
      setIsDeleteDialogOpen(false);
      toast({
        title: "User Deleted",
        description: "User has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Delete Failed",
        description: "There was a problem deleting the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="default"
            onClick={handleCreateClick}
            className="bg-green-500 hover:bg-green-600"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-32 bg-gradient-to-r from-brand-blue to-brand-lightBlue"></div>
                  <div className="relative -mt-16 px-6 pb-6 pt-0">
                    <div className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-white bg-white">
                      <img
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-16 text-center">
                      <h3 className="text-xl font-bold">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-gray-500">{user.email}</p>
                      <div className="mt-4 flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex h-64 items-center justify-center">
              <p className="text-lg text-gray-500">No users found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={editFormData.first_name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, first_name: e.target.value })
                }
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={editFormData.last_name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, last_name: e.target.value })
                }
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create_first_name">First Name</Label>
              <Input
                id="create_first_name"
                value={createFormData.first_name}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, first_name: e.target.value })
                }
              />
              {createErrors.first_name && (
                <p className="text-sm text-red-500">{createErrors.first_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_last_name">Last Name</Label>
              <Input
                id="create_last_name"
                value={createFormData.last_name}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, last_name: e.target.value })
                }
              />
              {createErrors.last_name && (
                <p className="text-sm text-red-500">{createErrors.last_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_email">Email</Label>
              <Input
                id="create_email"
                type="email"
                value={createFormData.email}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, email: e.target.value })
                }
              />
              {createErrors.email && (
                <p className="text-sm text-red-500">{createErrors.email}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSubmit} 
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.first_name}{' '}
              {selectedUser?.last_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteConfirm}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
