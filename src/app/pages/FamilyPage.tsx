import { Users, Plus, Mail } from 'lucide-react';

export function FamilyPage() {
  const familyMembers = [
    { id: '1', name: 'Олена Петренко', email: 'olena@example.com', role: 'Власник', color: '#4c929e' },
    { id: '2', name: 'Іван Петренко', email: 'ivan@example.com', role: 'Учасник', color: '#bed3c4' },
  ];

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 className="text-2xl md:text-3xl mb-6" style={{ color: '#222e54' }}>Сім'я</h1>

      {/* Add Member Card */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md mb-6">
        <h3 className="mb-4 flex items-center gap-2" style={{ color: '#222e54' }}>
          <Plus size={20} style={{ color: '#4c929e' }} />
          Запросити члена сім'ї
        </h3>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Email адреса"
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none min-h-[44px]"
            style={{ borderColor: '#bed3c4' }}
            onFocus={(e) => e.target.style.borderColor = '#4c929e'}
            onBlur={(e) => e.target.style.borderColor = '#bed3c4'}
          />
          <button
            className="px-6 py-2 rounded-lg text-white transition-opacity hover:opacity-90 min-h-[44px]"
            style={{ backgroundColor: '#4c929e' }}
          >
            Запросити
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Запрошені члени матимуть доступ до перегляду витрат
        </p>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md">
        <h3 className="mb-4 flex items-center gap-2" style={{ color: '#222e54' }}>
          <Users size={20} style={{ color: '#4c929e' }} />
          Члени сім'ї ({familyMembers.length})
        </h3>
        <div className="space-y-3">
          {familyMembers.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: '#bed3c4' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: member.color }}
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p style={{ color: '#222e54' }}>{member.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail size={14} />
                    {member.email}
                  </p>
                </div>
              </div>
              <span
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: member.role === 'Власник' ? '#4c929e20' : '#bed3c420',
                  color: member.role === 'Власник' ? '#4c929e' : '#222e54'
                }}
              >
                {member.role}
              </span>
              
            </div>
      
      
          ))}
          
        </div>
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f9f9f9' }}>
          <p className="text-sm text-gray-600">
            <strong style={{ color: '#222e54' }}>Це демонстраційна версія</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
