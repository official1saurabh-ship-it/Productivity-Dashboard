import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, Trash2, Edit3, Star, X, Check, Image, AlignLeft, Heading, Type } from 'lucide-react'

const emptyForm = { heading: '', subheading: '', description: '', image: '' }

export default function TodoList() {
  const [todos, setTodos] = useLocalStorage('todos', [])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  function addTodo(e) {
    e.preventDefault()
    const heading = form.heading.trim()
    if (!heading) return
    setTodos(prev => [...prev, { id: Date.now(), heading, subheading: form.subheading.trim(), description: form.description.trim(), image: form.image.trim(), completed: false, important: false }])
    setForm(emptyForm); setShowForm(false)
  }
  function toggleComplete(id) { setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)) }
  function toggleImportant(id) { setTodos(prev => prev.map(t => t.id === id ? { ...t, important: !t.important } : t)) }
  function deleteTodo(id) { setTodos(prev => prev.filter(t => t.id !== id)) }
  function startEdit(todo) { setEditingId(todo.id); setEditForm({ heading: todo.heading, subheading: todo.subheading || '', description: todo.description || '', image: todo.image || '' }) }
  function handleEditChange(e) { setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }
  function saveEdit(id) {
    const heading = editForm.heading.trim()
    if (!heading) { setTodos(prev => prev.filter(t => t.id !== id)) }
    else { setTodos(prev => prev.map(t => t.id === id ? { ...t, heading, subheading: editForm.subheading.trim(), description: editForm.description.trim(), image: editForm.image.trim() } : t)) }
    cancelEdit()
  }
  function cancelEdit() { setEditingId(null); setEditForm(emptyForm) }

  const inputCls = "w-full px-3.5 py-2.5 border rounded-lg bg-transparent text-sm transition-all duration-[var(--transition)] outline-none placeholder:opacity-40"
  const fieldCls = "flex items-center gap-2.5 px-3.5 py-2.5 border rounded-lg bg-transparent text-sm transition-all duration-[var(--transition)] outline-none"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Tasks</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{todos.length} task{todos.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-[var(--transition)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_var(--primary-glow)] bg-gradient-to-r from-[var(--primary)] to-[#4f46e5]">
          <Plus size={15} /> Add Task
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={addTodo}
            className="overflow-hidden mb-6"
          >
            <div className="p-5 rounded-xl border space-y-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className={fieldCls} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <Heading size={14} className="shrink-0" />
                <input name="heading" placeholder="Heading *" value={form.heading} onChange={handleChange} className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: 'var(--text)' }} autoFocus />
              </div>
              <div className={fieldCls} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <Type size={14} className="shrink-0" />
                <input name="subheading" placeholder="Sub-heading" value={form.subheading} onChange={handleChange} className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: 'var(--text)' }} />
              </div>
              <div className={fieldCls} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                <AlignLeft size={14} className="shrink-0 mt-0.5" />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="flex-1 bg-transparent border-none outline-none text-sm resize-y min-h-[40px]" style={{ color: 'var(--text)' }} rows={2} />
              </div>
              <div className={fieldCls} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <Image size={14} className="shrink-0" />
                <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: 'var(--text)' }} />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-[#4f46e5] transition-all hover:shadow-[0_4px_12px_var(--primary-glow)]">Add Task</button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
            <CheckSquare size={22} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No tasks yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Click "Add Task" to create one</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {todos.map((todo, index) => {
              const editing = editingId === todo.id
              return (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div
                    className="rounded-xl border overflow-hidden transition-all duration-[var(--transition)]"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: editing ? 'var(--primary)' : 'var(--border)',
                      boxShadow: editing ? '0 0 0 2px var(--primary-glow)' : 'var(--shadow)',
                      opacity: todo.completed ? 0.6 : 1,
                    }}
                  >
                    {editing ? (
                      <div className="p-5">
                        <div className="space-y-3">
                          {['image', 'heading', 'subheading', 'description'].map(field => (
                            <div key={field} className="flex flex-col gap-1">
                              <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{field}</label>
                              {field === 'description' ? (
                                <textarea name={field} value={editForm[field]} onChange={handleEditChange} className={`${inputCls} resize-y min-h-[60px]`} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} rows={3} />
                              ) : (
                                <input name={field} value={editForm[field]} onChange={handleEditChange} className={inputCls} style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                          <button onClick={cancelEdit} className="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
                          <button onClick={() => saveEdit(todo.id)} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-[#4f46e5] transition-all hover:shadow-[0_4px_12px_var(--primary-glow)]">Save</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                        {todo.image && (
                          <div className="w-36 min-h-[120px] shrink-0 overflow-hidden max-sm:hidden">
                            <img className="w-full h-full object-cover" src={todo.image} alt={todo.heading} onError={e => { e.target.style.display = 'none' }} />
                          </div>
                        )}
                        <div className="flex-1 p-5 min-w-0">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleComplete(todo.id)}
                              className="w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all duration-[var(--transition)]"
                              style={{
                                borderColor: todo.completed ? 'var(--success)' : 'var(--border)',
                                background: todo.completed ? 'var(--success)' : 'transparent',
                              }}
                              aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                            >
                              {todo.completed && <Check size={12} stroke="white" strokeWidth={3} />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-bold ${todo.completed ? 'line-through' : ''}`} style={{ color: todo.completed ? 'var(--text-muted)' : 'var(--text)' }}>{todo.heading}</h4>
                              {todo.subheading && <p className={`text-xs mt-0.5 ${todo.completed ? 'line-through' : ''}`} style={{ color: 'var(--text-secondary)' }}>{todo.subheading}</p>}
                              {todo.description && <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{todo.description}</p>}
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => startEdit(todo)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-muted)]" style={{ color: 'var(--text-muted)' }} aria-label="Edit">
                                <Edit3 size={13} />
                              </button>
                              <button onClick={() => toggleImportant(todo.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all" style={{ color: todo.important ? 'var(--warning)' : 'var(--text-muted)' }} aria-label="Mark important">
                                <Star size={13} fill={todo.important ? 'var(--warning)' : 'none'} />
                              </button>
                              <button onClick={() => deleteTodo(todo.id)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--danger-light)] hover:text-[var(--danger)]" style={{ color: 'var(--text-muted)' }} aria-label="Delete">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
