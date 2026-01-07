import { useState, useEffect, useContext, useRef } from 'react'
import Card from './ui/Card'
import ProgressBar from './ui/ProgressBar'
import Button from './ui/Button'
import { AppContext } from '../context/AppContext'
import Modal from './ui/Modal'

export default function Groups() {
  const { 
    groups, user, createGroup, joinGroup, exitGroup 
  } = useContext(AppContext)
  
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  const [newGroupPassword, setNewGroupPassword] = useState('')
  const [newGroupApproval, setNewGroupApproval] = useState(false)
  
  const [joinCode, setJoinCode] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  
  const [activeTab, setActiveTab] = useState('objectives')
  
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedGroupId, activeTab])

  useEffect(() => {
    if (groups && groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id)
    }
  }, [groups, selectedGroupId])

  const selectedGroup = groups?.find(g => g.id === selectedGroupId)
  const isHost = selectedGroup?.members?.find(m => m.id === user?.id)?.role === 'host'
  const isMember = selectedGroup?.members?.some(m => m.id === user?.id)
  const isPending = selectedGroup?.pendingMembers?.some(m => m.id === user?.id)

  const handleCreateGroup = (e) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    createGroup({ name: newGroupName, description: newGroupDesc, password: newGroupPassword, approvalRequired: newGroupApproval })
    setShowCreateModal(false)
    setNewGroupName(''); setNewGroupDesc(''); setNewGroupPassword(''); setNewGroupApproval(false)
  }

  const handleJoinGroup = (e) => {
    e.preventDefault()
    if (!joinCode.trim()) return
    joinGroup(joinCode, joinPassword)
    setShowJoinModal(false)
    setJoinCode(''); setJoinPassword('')
  }

  return (
    <div className="space-y-10 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="animate-slideUp">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            <h1 className="text-4xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>
              SQUAD_GRID
            </h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-tertiary)' }}>Collaborative performance and collective scaling</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setShowJoinModal(true)} variant="outline" className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] border-2">Sync_Node</Button>
          <Button onClick={() => setShowCreateModal(true)} variant="primary" className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] shadow-xl">Initialize_Cluster</Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">Active Clusters</h2>
            <div className="space-y-3">
              {groups?.filter(g => g.members?.some(m => m.id === user?.id)).map(group => (
                <div 
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border-2 relative overflow-hidden group ${
                    selectedGroupId === group.id 
                    ? 'bg-blue-500 border-blue-500 text-white shadow-xl scale-[1.02]' 
                    : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/50'
                  }`}
                >
                  <p className="font-black uppercase tracking-tight truncate relative z-10">{group.name}</p>
                  <div className="flex items-center gap-2 mt-2 relative z-10">
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedGroupId === group.id ? 'bg-white animate-pulse' : 'bg-green-500'}`}></span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedGroupId === group.id ? 'text-blue-100' : 'text-[var(--text-tertiary)]'}`}>
                      {group.members?.length || 0} Nodes Connected
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)] mb-6">Open Networks</h2>
            <div className="space-y-3">
              {groups?.filter(g => !g.members?.some(m => m.id === user?.id)).map(group => (
                <div 
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                    selectedGroupId === group.id 
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-xl scale-[1.02]' 
                    : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-indigo-500/50'
                  }`}
                >
                  <p className="font-black uppercase tracking-tight truncate">{group.name}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${selectedGroupId === group.id ? 'text-indigo-100' : 'text-[var(--text-tertiary)]'}`}>
                    Scan Available
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8 animate-fadeIn">
          {selectedGroup ? (
            <>
              <Card glass padding={true} className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Node Cluster ID: {selectedGroup.id}</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--text-primary)] mb-2">{selectedGroup.name}</h2>
                    <p className="text-[var(--text-secondary)] font-medium text-lg max-w-2xl">{selectedGroup.description}</p>
                  </div>
                  {isMember && (
                    <Button onClick={() => exitGroup(selectedGroup.id)} variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50 py-3">Terminate Connection</Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 pt-10 border-t border-dashed border-[var(--border-color)]">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">Cluster Output</p>
                    <p className="text-2xl font-black text-blue-500">{selectedGroup.score || 0} XP</p>
                  </div>
                  <div className="text-center md:text-left md:border-l border-dashed border-[var(--border-color)] md:pl-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">Network Load</p>
                    <p className="text-2xl font-black text-[var(--text-primary)]">{selectedGroup.members?.length || 0} Units</p>
                  </div>
                  <div className="text-center md:text-left md:border-l border-dashed border-[var(--border-color)] md:pl-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">Sync Status</p>
                    <p className="text-2xl font-black text-green-500">Stable</p>
                  </div>
                  <div className="text-center md:text-left md:border-l border-dashed border-[var(--border-color)] md:pl-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">Local Role</p>
                    <p className="text-2xl font-black uppercase tracking-tight text-indigo-500">
                      {isMember ? selectedGroup.members.find(m => m.id === user?.id)?.role : isPending ? 'Pending' : 'Visitor'}
                    </p>
                  </div>
                </div>
              </Card>

              {isMember ? (
                <div className="space-y-8">
                  <div className="flex gap-2 p-1 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] w-fit">
                    {[
                      { id: 'objectives', label: 'Objectives', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
                      { id: 'members', label: 'Nodes', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
                      { id: 'chat', label: 'Comm-Link', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
                      ...(isHost ? [{ id: 'manage', label: 'Mainframe', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg> }] : [])
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                          activeTab === tab.id 
                          ? 'bg-blue-500 text-white shadow-lg' 
                          : 'text-[var(--text-tertiary)] hover:text-blue-500 hover:bg-blue-500/5'
                        }`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'objectives' && (
                    <div className="grid md:grid-cols-2 gap-10 animate-fadeIn">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">Priority Protocols</h3>
                        </div>
                        <div className="space-y-4">
                          {selectedGroup.tasks?.map(task => (
                            <Card key={task.id} glass className="group hover:border-blue-500/30 transition-all border-l-4 border-l-blue-500">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <p className="font-black text-lg uppercase tracking-tight group-hover:text-blue-500 transition-colors">{task.name}</p>
                                  <div className="flex gap-2 mt-2">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                                      task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                                    }`}>{task.priority}</span>
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] uppercase tracking-widest">Est: {task.duration}D</span>
                                  </div>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${task.isVerified ? 'text-green-500' : 'text-orange-500'}`}>
                                  {task.isVerified ? 'Verified' : 'Pending'}
                                </span>
                              </div>
                              <ProgressBar progress={task.progress} color="from-blue-500 to-indigo-600" showLabel={true} className="h-2 rounded-full" />
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-purple-500">Node Performance</h3>
                        <div className="space-y-3">
                          {selectedGroup.members?.sort((a, b) => (b.taskCompletionPercentage || 0) - (a.taskCompletionPercentage || 0)).map((member, index) => (
                            <div key={member.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-500/30 transition-all">
                              <span className="text-lg font-black text-[var(--text-tertiary)] w-6">0{index + 1}</span>
                              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[var(--border-color)]">
                                <img src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`} alt="" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-black uppercase tracking-tight">{member.name}</p>
                                <div className="h-1.5 w-full bg-[var(--bg-tertiary)] rounded-full mt-2 overflow-hidden">
                                  <div className="h-full bg-purple-500" style={{ width: `${member.taskCompletionPercentage || 0}%` }}></div>
                                </div>
                              </div>
                              <span className="text-xs font-black text-purple-500">{member.taskCompletionPercentage || 0}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-32 glass rounded-[var(--radius-xl)] border-dashed border-2">
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 text-indigo-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">Cluster Locked</h3>
                  <p className="text-[var(--text-tertiary)] font-bold text-sm uppercase tracking-widest mb-8">Authorization required for network access</p>
                  <Button onClick={() => setShowJoinModal(true)} variant="primary" className="px-10 py-4 text-xs uppercase tracking-widest">Request Access</Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-40 glass rounded-[var(--radius-xl)] border-dashed border-2">
              <div className="w-24 h-24 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/10">
                <svg className="w-12 h-12 text-blue-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">Terminal Ready</h3>
              <p className="text-[var(--text-tertiary)] font-bold text-sm uppercase tracking-widest">Select a cluster from the grid to initialize</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Initialize New Cluster">
          <form onSubmit={handleCreateGroup} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">Network Alias</label>
              <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500/50" placeholder="OMEGA_SQUAD" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">Mission Parameters</label>
              <textarea value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 min-h-[100px]" placeholder="Collective scaling protocol..." />
            </div>
            <Button type="submit" variant="primary" className="w-full py-4 uppercase tracking-widest">Confirm Initialization</Button>
          </form>
        </Modal>
      )}

      {showJoinModal && (
        <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Synchronize with Node">
          <form onSubmit={handleJoinGroup} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">Cluster ID</label>
              <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value)} className="w-full bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] rounded-xl px-5 py-4 text-sm font-black focus:outline-none focus:border-blue-500/50" placeholder="PROTOCOL_HASH" />
            </div>
            <Button type="submit" variant="primary" className="w-full py-4 uppercase tracking-widest">Establish Connection</Button>
          </form>
        </Modal>
      )}
    </div>
  )
}
