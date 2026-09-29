import React, { useState, useEffect } from 'react';

export default function App() {
  const initialUsers = [
    { id: 1, name: 'Encik Luqman', email: 'luqman@staffsync.com', role: 'Supervisor / Admin', department: 'Management', status: 'Online' },
    { id: 2, name: 'Uzma Afiqah', email: 'uzmaafiqah@staffsync.com', role: 'Backend Developer', department: 'Engineering', status: 'Online' },
    { id: 3, name: 'Syafiqah Azman', email: 'ikaa@staffsync.com', role: 'Frontend Specialist', department: 'Design & UI', status: 'Away' },
    { id: 4, name: 'Nurin Aleya', email: 'nurinaleya@staffsync.com', role: 'Database Engineer', department: 'Engineering', status: 'Online' },
    { id: 5, name: 'Faatin Husna', email: 'faatinhusna@staffsync.com', role: 'Developer', department: 'Engineering', status: 'Offline' },
    { id: 6, name: 'Irfan hakimi', email: 'irfan@staffsync.com', role: 'Cybersecurity Specialist', department: 'Engineering', status: 'Online' },
    { id: 7, name: 'Damia Nabila', email: 'damia@staffsync.com', role: 'Operations Coordinator', department: 'Marketing', status: 'Online' },
    { id: 8, name: 'Irdina Andy', email: 'irdina@staffsync.com', role: 'HR Manager', department: 'Human Resources', status: 'Online' },
    { id: 9, name: 'Aminudin Razif', email: 'amin@staffsync.com', role: 'Account Executive', department: 'Sales', status: 'Online' },
    { id: 10, name: 'Hanis Hashamudin', email: 'hanis@staffsync.com', role: 'Content Strategist', department: 'Marketing', status: 'Online' }
  ];

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('staffsync_users_v3');
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return initialUsers;
  });

  useEffect(() => {
    localStorage.setItem('staffsync_users_v3', JSON.stringify(users));
  }, [users]);

  // Persistent login state matching Encik Luqman's workflow
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('staffsync_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('staffsync_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    return { id: 1, name: 'Encik Luqman', email: 'luqman@staffsync.com', role: 'Supervisor / Admin', department: 'Management', status: 'Online' };
  });

  const [emailInput, setEmailInput] = useState('uzmaafiqah@staffsync.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    localStorage.setItem('staffsync_logged_in', isLoggedIn);
    if (currentUser) {
      localStorage.setItem('staffsync_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('staffsync_current_user');
    }
  }, [isLoggedIn, currentUser]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Developer');
  const [newDept, setNewDept] = useState('Engineering');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [announcement, setAnnouncement] = useState('📌 Reminder: Project presentation sync check is ready!');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const quotes = [
    "💡 'Alone we can do so little; together we can do so much.' – Helen Keller",
    "🚀 'Great things in business are never done by one person.' – Steve Jobs",
    "☕ 'Coming together is a beginning, staying together is progress, working together is success.'",
    "✨ 'Teamwork makes the dream work.'",
    "🎯 'Quality is not an act, it is a habit.' – Aristotle"
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good morning';
    if (hour < 18) return '☀️ Good afternoon';
    return '🌙 Good evening';
  };

  const triggerConfettiEffect = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const validatePassword = (user, inputPassword) => {
    const passInput = inputPassword.trim().toLowerCase();
    const firstName = user.name.trim().split(' ')[0].toLowerCase();
    const pass1 = `${firstName}123`;
    const emailPrefix = user.email.split('@')[0].toLowerCase();
    const pass2 = `${emailPrefix}123`;
    return passInput === pass1 || passInput === pass2;
  };

  const cycleUserStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const nextStatus = user.status === 'Online' ? 'Away' : user.status === 'Away' ? 'Busy' : 'Online';
        return { ...user, status: nextStatus };
      }
      return user;
    }));
  };

  const syncWithBackend = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
        setSuccessMessage('🎉 Successfully synced with backend server!');
      } else {
        setSuccessMessage('Connected to server, keeping current roster.');
      }
      triggerConfettiEffect();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      setSuccessMessage('ℹ️ Running in standalone secure mode (Local Storage Active).');
      triggerConfettiEffect();
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('staffsync_users_v3', JSON.stringify(updatedUsers));
    setSuccessMessage('Staff member removed successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const exportRoster = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "staffsync_roster.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSuccessMessage('📁 Roster downloaded successfully!');
    triggerConfettiEffect();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || user.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const onlineCount = users.filter(u => u.status === 'Online').length;

  const bgMain = isDarkMode ? '#1E293B' : '#BCE6EC';
  const cardBg = isDarkMode ? '#0F172A' : '#FFFDF9';
  const cardBorder = isDarkMode ? '#334155' : '#FAD4D8';
  const textColor = isDarkMode ? '#F8FAFC' : '#4A3B3C';
  const headerTitleColor = isDarkMode ? '#FAD4D8' : '#D47E88';

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: bgMain, minHeight: '100vh', color: textColor }} className="flex items-center justify-center p-4 font-sans transition-colors duration-300">
        <div style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="p-8 rounded-2xl border-4 shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: headerTitleColor }}>✨ StaffSync Secure Login</h1>
          <p className="text-sm opacity-70 text-center mb-6">Authenticate with your corporate email & password</p>
          
          {loginError && <p className="text-red-500 text-sm mb-4 text-center font-medium bg-red-50 p-2 rounded-lg border border-red-200">{loginError}</p>}
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold opacity-70 mb-1 block">Corporate Email</label>
              <input 
                type="email" 
                placeholder="e.g. uzmaafiqah@staffsync.com" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{ borderColor: cardBorder, backgroundColor: isDarkMode ? '#1E293B' : '#FFF', color: textColor }}
                className="w-full p-3 border-2 rounded-lg outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold opacity-70 mb-1 block">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ borderColor: cardBorder, backgroundColor: isDarkMode ? '#1E293B' : '#FFF', color: textColor }}
                className="w-full p-3 border-2 rounded-lg outline-none text-sm"
              />
            </div>
            <button 
              onClick={() => {
                if (emailInput.trim().toLowerCase() === 'uzmaafiqah@staffsync.com' && (passwordInput.trim() === 'uzma123' || passwordInput.trim() === 'uzmaafiqah123')) {
                  const uzmaUser = users.find(u => u.email.includes('uzma')) || { id: 2, name: 'Uzma Afiqah', email: 'uzmaafiqah@staffsync.com', role: 'Backend Developer', department: 'Engineering', status: 'Online' };
                  setCurrentUser(uzmaUser);
                  setIsLoggedIn(true);
                  setLoginError('');
                  return;
                }

                const foundStaff = users.find(u => u.email.toLowerCase() === emailInput.trim().toLowerCase());
                if (!foundStaff) {
                  setLoginError('❌ Invalid email or password.');
                  return;
                }

                if (validatePassword(foundStaff, passwordInput)) {
                  setCurrentUser(foundStaff);
                  setIsLoggedIn(true);
                  setLoginError('');
                } else {
                  setLoginError('❌ Invalid email or password.');
                }
              }}
              style={{ backgroundColor: '#D47E88' }}
              className="w-full text-white py-3 rounded-lg font-semibold shadow hover:opacity-90 transition mt-2"
            >
              Sign In to Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bgMain, minHeight: '100vh', color: textColor }} className="p-6 font-sans relative overflow-hidden transition-colors duration-300">
      
      {confettiActive && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-[#D47E88] text-white px-6 py-2 rounded-full font-bold shadow-lg animate-bounce z-50 text-sm">
          ✨🎉 Action Completed Successfully! 🎉✨
        </div>
      )}

      {/* Top Header */}
      <div style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="rounded-2xl p-6 shadow-md border-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
        <div>
          <h1 style={{ color: headerTitleColor }} className="text-2xl font-bold flex items-center gap-2">
            ✨ StaffSync <span className="text-xs bg-[#FFF5C0] text-amber-900 px-2.5 py-1 rounded-full font-semibold">{getGreeting()}, {currentUser?.name}!</span>
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Logged in as: <span className="font-semibold text-[#D47E88]">{currentUser?.role}</span> ({currentUser?.department}) | Live Time: <span className="font-semibold">{currentTime}</span>
          </p>
          {successMessage && <p className="text-xs text-[#D47E88] font-semibold mt-1">{successMessage}</p>}
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="bg-[#FFF5C0] text-amber-900 border-2 border-amber-200 px-3 py-2 rounded-xl text-xs font-semibold hover:opacity-80 transition"
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button 
            onClick={syncWithBackend}
            className="bg-[#BCE6EC] text-cyan-900 border-2 border-cyan-200 px-3 py-2 rounded-xl text-xs font-semibold hover:opacity-80 transition"
          >
            🔄 Sync DB
          </button>
          <button 
            onClick={exportRoster}
            className="bg-[#FAD4D8] text-rose-900 border-2 border-rose-200 px-3 py-2 rounded-xl text-xs font-semibold hover:opacity-80 transition"
          >
            📁 Export JSON
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#D47E88' }} 
            className="text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:opacity-90 transition"
          >
            + Add Staff
          </button>
          <button 
            onClick={() => { 
              setIsLoggedIn(false); 
              setCurrentUser(null); 
              setPasswordInput(''); 
              localStorage.removeItem('staffsync_logged_in');
              localStorage.removeItem('staffsync_current_user');
            }}
            className="bg-white/80 text-gray-700 border-2 border-gray-200 px-3 py-2 rounded-xl text-xs font-medium hover:bg-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Interactive Quick Sticky Announcement Note */}
      <div style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="p-4 rounded-xl border-2 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-3 transition-colors duration-300">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
          <span className="text-xl">📌</span>
          {isEditingNote ? (
            <input 
              type="text" 
              value={noteInput} 
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Type new team announcement..."
              style={{ borderColor: cardBorder, backgroundColor: isDarkMode ? '#1E293B' : '#FFF', color: textColor }}
              className="w-full p-1.5 border-2 rounded-lg text-sm outline-none"
            />
          ) : (
            <p className="text-sm font-medium">{announcement}</p>
          )}
        </div>
        <div>
          {isEditingNote ? (
            <button 
              onClick={() => {
                if(noteInput) setAnnouncement(noteInput);
                setIsEditingNote(false);
              }}
              style={{ backgroundColor: '#D47E88' }}
              className="px-3 py-1.5 text-white rounded-lg text-xs font-semibold shadow"
            >
              Save Note
            </button>
          ) : (
            <button 
              onClick={() => { setNoteInput(announcement); setIsEditingNote(true); }}
              className="text-xs text-[#D47E88] font-bold hover:underline"
            >
              Edit Note 📝
            </button>
          )}
        </div>
      </div>

      {/* Interactive Motivation Banner */}
      <div 
        onClick={() => setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)}
        style={{ backgroundColor: '#FFF5C0', borderColor: '#FAD4D8', color: '#5A4A32' }} 
        className="p-3 rounded-xl border-2 shadow-sm mb-6 text-center cursor-pointer hover:opacity-90 transition text-sm font-medium flex items-center justify-center gap-2"
      >
        <span>{quotes[currentQuoteIndex]}</span>
        <span className="text-xs text-[#D47E88] font-bold underline">(Click for next quote!)</span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="p-4 rounded-xl border-2 shadow-sm transition-colors duration-300">
          <p className="text-xs opacity-60 font-semibold uppercase">Total Members</p>
          <p className="text-2xl font-bold mt-1" style={{ color: headerTitleColor }}>{users.length}</p>
        </div>
        <div style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="p-4 rounded-xl border-2 shadow-sm transition-colors duration-300">
          <p className="text-xs opacity-60 font-semibold uppercase">Active / Online Now</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{onlineCount} <span className="text-xs opacity-50 font-normal">members</span></p>
        </div>
        <div style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="p-4 rounded-xl border-2 shadow-sm transition-colors duration-300">
          <p className="text-xs opacity-60 font-semibold uppercase">Security Status</p>
          <p className="text-sm font-semibold mt-2 text-emerald-600 flex items-center gap-1">🟢 Verified Staff Account</p>
        </div>
      </div>

      {/* Search and Department Filters */}
      <div style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="p-4 rounded-xl border-2 shadow-sm mb-6 flex flex-col md:flex-row justify-between gap-4 transition-colors duration-300">
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ borderColor: cardBorder, backgroundColor: isDarkMode ? '#1E293B' : '#FFF', color: textColor }}
          className="px-4 py-2 rounded-lg border-2 outline-none w-full md:w-1/3"
        />
        <div className="flex gap-2 flex-wrap">
          {['All', 'Management', 'Engineering', 'Design & UI', 'Marketing', 'Sales', 'Human Resources'].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              style={{
                backgroundColor: selectedDept === dept ? '#D47E88' : (isDarkMode ? '#1E293B' : '#FFF'),
                color: selectedDept === dept ? '#FFF' : textColor,
                borderColor: cardBorder
              }}
              className="px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition"
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="p-5 rounded-2xl border-2 shadow-sm flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-4">
              <div style={{ backgroundColor: '#D47E88' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg" style={{ color: textColor }}>{user.name}</h3>
                  <button 
                    onClick={() => cycleUserStatus(user.id)}
                    title="Click to change status!"
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition hover:scale-105 ${
                      user.status === 'Online' ? 'bg-emerald-100 text-emerald-700' :
                      user.status === 'Away' ? 'bg-amber-100 text-amber-700' : 
                      user.status === 'Busy' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    ● {user.status || 'Online'} 🔄
                  </button>
                </div>
                {/* ROLE DISPLAYED RIGHT BELOW EACH NAME */}
                <p className="text-xs font-semibold text-[#D47E88] mt-0.5">{user.role}</p>
                <p className="text-xs opacity-60 mt-0.5">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-[#FFF5C0] text-amber-900 font-semibold border border-amber-200">
                {user.department}
              </span>
              <button 
                onClick={() => deleteUser(user.id)}
                className="text-xs text-red-400 hover:text-red-600 font-medium transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding staff */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div style={{ backgroundColor: cardBg, borderColor: cardBorder }} className="p-6 rounded-2xl border-4 w-full max-w-md shadow-xl transition-colors duration-300">
            <h2 className="text-xl font-bold mb-4" style={{ color: headerTitleColor }}>Add New Team Member</h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Full Name (e.g. Dania Sofia)" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                style={{ borderColor: cardBorder, backgroundColor: isDarkMode ? '#1E293B' : '#FFF', color: textColor }}
                className="w-full p-2 border-2 rounded-lg"
              />
              <input 
                type="email" 
                placeholder="Email Address (e.g. dania@staffsync.com)" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ borderColor: cardBorder, backgroundColor: isDarkMode ? '#1E293B' : '#FFF', color: textColor }}
                className="w-full p-2 border-2 rounded-lg"
              />
              <input 
                type="text" 
                placeholder="Role (e.g. Talent Acquisition Specialist)" 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)}
                style={{ borderColor: cardBorder, backgroundColor: isDarkMode ? '#1E293B' : '#FFF', color: textColor }}
                className="w-full p-2 border-2 rounded-lg"
              />
              <select 
                value={newDept} 
                onChange={(e) => setNewDept(e.target.value)}
                style={{ borderColor: cardBorder, backgroundColor: isDarkMode ? '#1E293B' : '#FFF', color: textColor }}
                className="w-full p-2 border-2 rounded-lg"
              >
                <option value="Engineering">Engineering</option>
                <option value="Management">Management</option>
                <option value="Design & UI">Design & UI</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if(newName && newEmail) {
                    const newStaffMember = {
                      id: Date.now(),
                      name: newName,
                      email: newEmail,
                      role: newRole,
                      department: newDept,
                      status: 'Online'
                    };
                    
                    const updatedUsers = [...users, newStaffMember];
                    setUsers(updatedUsers);
                    localStorage.setItem('staffsync_users_v3', JSON.stringify(updatedUsers));

                    setIsModalOpen(false);
                    setNewName('');
                    setNewEmail('');
                    setSuccessMessage('🎉 New member added securely to system database!');
                    triggerConfettiEffect();
                    setTimeout(() => setSuccessMessage(''), 4000);
                  }
                }}
                style={{ backgroundColor: '#D47E88' }}
                className="px-4 py-2 rounded-lg text-white font-medium shadow text-sm"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}