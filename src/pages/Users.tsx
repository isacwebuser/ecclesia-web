import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Shield, 
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Mail,
  Loader2
} from 'lucide-react';
import { User } from '../types';
import { toast } from 'sonner';

const initialUsers: User[] = [
  { id: '1', name: 'Isac Rodrigues', email: 'isacrgs@gmail.com', role: 'ADMIN', status: 'ACTIVE', tenantId: '1' },
  { id: '2', name: 'Maria Silva', email: 'maria@exemplo.com', role: 'USER', status: 'PENDING', tenantId: '1' },
  { id: '3', name: 'João Santos', email: 'joao@exemplo.com', role: 'USER', status: 'ACTIVE', tenantId: '1' },
  { id: '4', name: 'Ana Oliveira', email: 'ana@exemplo.com', role: 'USER', status: 'INACTIVE', tenantId: '1' },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const toggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        toast.success(`Usuário ${newStatus === 'ACTIVE' ? 'ativado' : 'desativado'} com sucesso`);
        return { ...u, status: newStatus as any };
      }
      return u;
    }));
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: 'USER',
        status: 'PENDING',
        tenantId: '1'
      };
      setUsers([newUser, ...users]);
      setIsInviting(false);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      toast.success('Convite enviado com sucesso!');
    }, 1000);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-500 text-sm">Gerencie permissões e acessos da sua organização</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Convidar Usuário
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Função</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold mr-3">
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      {u.role === 'ADMIN' ? (
                        <Shield className="w-4 h-4 text-emerald-600 mr-2" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                      )}
                      <span className={u.role === 'ADMIN' ? 'font-bold text-emerald-700' : 'text-gray-600'}>
                        {u.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold",
                      u.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700" : 
                      u.status === 'PENDING' ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                    )}>
                      {u.status === 'ACTIVE' ? 'Ativo' : u.status === 'PENDING' ? 'Pendente' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.status !== 'PENDING' && (
                        <button 
                          onClick={() => toggleStatus(u.id)}
                          title={u.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            u.status === 'ACTIVE' ? "text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"
                          )}
                        >
                          {u.status === 'ACTIVE' ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Convidar Usuário</h2>
            <p className="text-gray-500 mb-6">Envie um convite por e-mail para que o usuário possa acessar a plataforma.</p>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail do Usuário</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="exemplo@email.com"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isInviting}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center shadow-lg shadow-emerald-200 disabled:opacity-70"
                >
                  {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Convite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
