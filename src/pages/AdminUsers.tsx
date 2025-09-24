import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Search, Filter, MoreHorizontal, Mail, Calendar, Shield, Edit, Trash2, UserCheck, UserX, Eye, Save } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'master';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  credits?: number;
  approvedBy?: string;
  approvedAt?: string;
  phone?: string;
  avatar?: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Estados para modais e ações
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estados do formulário
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'student',
    status: 'pending',
    phone: ''
  });

  // Inicializar com mock data
  React.useEffect(() => {
    setUsers(mockUsers);
  }, []);

  // Dados mockados para demonstração
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      role: 'student',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-09-18',
      credits: 12
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      role: 'teacher',
      status: 'active',
      createdAt: '2024-02-20',
      lastLogin: '2024-09-17'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      role: 'student',
      status: 'inactive',
      createdAt: '2024-03-10',
      lastLogin: '2024-08-15',
      credits: 8
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      email: 'ana@email.com',
      role: 'teacher',
      status: 'active',
      createdAt: '2024-02-05',
      lastLogin: '2024-09-18'
    },
    {
      id: '5',
      name: 'Carlos Lima',
      email: 'carlos@email.com',
      role: 'student',
      status: 'pending',
      createdAt: '2024-09-17',
      credits: 0
    },
    {
      id: '6',
      name: 'Usuario Admin',
      email: 'admin@inglespareto.com',
      role: 'master',
      status: 'active',
      createdAt: '2024-09-18',
      lastLogin: '2024-09-18'
    }
  ];

  // Funções de validação
  const validateUser = (data: Partial<User>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!data.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (data.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!data.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Email inválido';
    }

    return newErrors;
  };

  // Funções CRUD para Usuários
  const handleCreateUser = async () => {
    setIsLoading(true);
    const validationErrors = validateUser(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    // Verificar se email já existe
    const emailExists = users.some(user => user.email === formData.email);
    if (emailExists) {
      setErrors({ email: 'Este email já está cadastrado' });
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name!,
        email: formData.email!,
        role: formData.role!,
        status: formData.role === 'teacher' ? 'pending' : formData.status!,
        createdAt: new Date().toISOString().split('T')[0],
        phone: formData.phone,
        credits: formData.role === 'student' ? 0 : undefined
      };

      setUsers(prev => [...prev, newUser]);
      setCreateModalOpen(false);
      resetForm();

      toast({
        title: "Sucesso!",
        description: `Usuário criado com sucesso.${formData.role === 'teacher' ? ' Aguardando aprovação.' : ''}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar usuário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    const validationErrors = validateUser(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.map(user =>
        user.id === selectedUser.id
          ? { ...user, ...formData }
          : user
      ));

      setEditModalOpen(false);
      resetForm();
      toast({
        title: "Sucesso!",
        description: "Usuário atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Sucesso!",
        description: "Usuário excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUser = async (user: User, approved: boolean) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.map(u =>
        u.id === user.id
          ? {
              ...u,
              status: approved ? 'active' : 'inactive',
              approvedBy: approved ? 'Admin Atual' : undefined,
              approvedAt: approved ? new Date().toISOString() : undefined
            }
          : u
      ));

      toast({
        title: approved ? "Usuário Aprovado!" : "Usuário Rejeitado",
        description: `${user.name} foi ${approved ? 'aprovado' : 'rejeitado'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${approved ? 'aprovar' : 'rejeitar'} usuário.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funções auxiliares
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'student',
      status: 'pending',
      phone: ''
    });
    setErrors({});
    setSelectedUser(null);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData(user);
    setEditModalOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const variants = {
      student: 'default',
      teacher: 'secondary',
      master: 'destructive'
    } as const;

    const labels = {
      student: 'Aluno',
      teacher: 'Professor',
      master: 'Admin'
    };

    return (
      <Badge variant={variants[role as keyof typeof variants]}>
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline'
    } as const;

    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const stats = {
    total: mockUsers.length,
    students: mockUsers.filter(u => u.role === 'student').length,
    teachers: mockUsers.filter(u => u.role === 'teacher').length,
    active: mockUsers.filter(u => u.status === 'active').length
  };

  return (
    <AdminPageLayout
      title="Gerenciamento de Usuários"
      description="Visualize e gerencie todos os usuários da plataforma"
    >
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.teachers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Shield className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtros e Busca
            </div>
            <Button onClick={openCreateModal}>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os roles</SelectItem>
                <SelectItem value="student">Alunos</SelectItem>
                <SelectItem value="teacher">Professores</SelectItem>
                <SelectItem value="master">Administradores</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Créditos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <div className="text-sm">
                        {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Nunca</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.credits !== undefined ? (
                      <Badge variant="outline">{user.credits} créditos</Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(user)}>
                          <Eye className="mr-2 h-3 w-3" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(user)}>
                          <Edit className="mr-2 h-3 w-3" />
                          Editar
                        </DropdownMenuItem>
                        {user.status === 'pending' && user.role === 'teacher' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleApproveUser(user, true)}>
                              <UserCheck className="mr-2 h-3 w-3 text-green-600" />
                              Aprovar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApproveUser(user, false)}>
                              <UserX className="mr-2 h-3 w-3 text-red-600" />
                              Rejeitar
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription>
              Visualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Nome</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
              </div>
              {selectedUser.phone && (
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Cadastrado em</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedUser.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              {selectedUser.lastLogin && (
                <div>
                  <Label className="text-sm font-medium">Último Login</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedUser.lastLogin).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              {selectedUser.credits !== undefined && (
                <div>
                  <Label className="text-sm font-medium">Créditos</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.credits}</p>
                </div>
              )}
              {selectedUser.approvedBy && (
                <div>
                  <Label className="text-sm font-medium">Aprovado por</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.approvedBy}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação/Edição */}
      <Dialog open={createModalOpen || editModalOpen} onOpenChange={(open) => {
        if (!open) {
          setCreateModalOpen(false);
          setEditModalOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {createModalOpen ? 'Novo Usuário' : 'Editar Usuário'}
            </DialogTitle>
            <DialogDescription>
              {createModalOpen
                ? 'Cadastre um novo usuário no sistema.'
                : 'Edite as informações do usuário.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: '' }));
                  }
                }}
                placeholder="Nome completo"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                placeholder="email@exemplo.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Função</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as User['role'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Aluno</SelectItem>
                    <SelectItem value="teacher">Professor</SelectItem>
                    <SelectItem value="master">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as User['status'] }))}
                  disabled={formData.role === 'teacher'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                {formData.role === 'teacher' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Professores ficam pendentes até aprovação
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCreateModalOpen(false);
              setEditModalOpen(false);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button
              onClick={createModalOpen ? handleCreateUser : handleUpdateUser}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                  {createModalOpen ? 'Criando...' : 'Salvando...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {createModalOpen ? 'Criar Usuário' : 'Salvar Alterações'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageLayout>
  );
};

export default AdminUsers;