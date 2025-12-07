'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus, Trash2, Save, ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';

interface DBRow {
  id: string;
  [key: string]: unknown;
}

function getRowPreview(row: DBRow): string {
    // Try to find common identifier fields
    const candidates = ['name', 'title', 'email', 'slug', 'username', 'code'];
    
    for (const field of candidates) {
        const val = row[field];
        if (typeof val === 'string' && val.length > 0) return val;
    }

    // Fallback: finding the first non-id string or number
    const otherKey = Object.keys(row).find(k => k !== 'id' && (typeof row[k] === 'string' || typeof row[k] === 'number'));
    if (otherKey) return String(row[otherKey]);

    return 'Record';
}

export function ModelEditor() {
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('User');
    const [rows, setRows] = useState<DBRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<string>('');

    // Modal States
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createData, setCreateData] = useState('{}');

    // Fetch available models
    useEffect(() => {
        let mounted = true;
        fetch('/api/dev/models', { method: 'POST' })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    try {
                        const json = JSON.parse(text);
                        throw new Error(json.error || res.statusText);
                    } catch {
                        throw new Error(`API Error ${res.status}: ${text.slice(0, 50)}`);
                    }
                }
                return res.json();
            })
            .then(data => {
                if (mounted && data.models) setModels(data.models.map((m: string) => capitalize(m)));
            })
            .catch(err => {
                if (mounted) {
                    console.error('Failed to fetch models', err);
                    setError(err instanceof Error ? err.message : 'Unknown error');
                }
            });
        return () => { mounted = false; };
    }, []);

    const fetchRows = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/dev/list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: selectedModel })
            });
            const json = await res.json();
            if (res.ok) {
                setRows(json.data || []);
            } else {
                setError(json.error || 'Failed to fetch');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [selectedModel]);

    // Fetch rows when model changes
    useEffect(() => {
       fetchRows();
    }, [fetchRows]);

    const handleEdit = (row: DBRow) => {
        setEditingId(row.id);
        const { ...editable } = row;
        setEditData(JSON.stringify(editable, null, 2));
    };

    const handleSave = async () => {
        if (!editingId) return;
        try {
            const parsed = JSON.parse(editData);
            if ('id' in parsed) delete parsed.id;
            
            const res = await fetch('/api/dev/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: selectedModel, id: editingId, data: parsed })
            });
            
            if (res.ok) {
                setEditingId(null);
                fetchRows();
            } else {
                const json = await res.json();
                setError(`Update Error: ${json.error}`);
            }
        } catch (err) {
            setError(`Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            const res = await fetch('/api/dev/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: selectedModel, id: deletingId })
            });
            if (res.ok) {
                setDeletingId(null);
                fetchRows();
            } else {
                const json = await res.json();
                setError(`Delete Error: ${json.error}`);
            }
        } catch (err) {
            setError(`Delete Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleCreateClick = () => {
        setCreateData(JSON.stringify({}, null, 2));
        setIsCreating(true);
    };

    const confirmCreate = async () => {
        try {
            const parsed = JSON.parse(createData);
            const res = await fetch('/api/dev/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: selectedModel, data: parsed })
            });
            if (res.ok) {
                setIsCreating(false);
                fetchRows();
            } else {
                const json = await res.json();
                setError(`Create Error: ${json.error}`);
            }
        } catch (err) {
            setError(`Create Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-925 relative">
            {/* Toolbar */}
            <div className="flex items-center gap-3 p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <select 
                    value={selectedModel} 
                    onChange={e => setSelectedModel(e.target.value)}
                    className="px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 border-none rounded focus:ring-2 ring-indigo-500"
                >
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                
                <button onClick={fetchRows} disabled={loading} className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded dark:text-zinc-400 dark:hover:bg-zinc-800">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <div className="flex-1" />

                <button onClick={handleCreateClick} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors">
                    <Plus className="w-3 h-3" />
                    New Record
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-3 bg-red-100 text-red-700 text-sm flex items-center gap-2 border-b border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {/* Content List */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
                {rows.map((row) => (
                    <div key={row.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden group">
                        {/* Row Header */}
                        <div 
                            className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            onClick={() => editingId === row.id ? setEditingId(null) : handleEdit(row)}
                        >
                            <div className="flex items-center gap-3">
                                {editingId === row.id 
                                    ? <ChevronDown className="w-4 h-4 text-zinc-400" />
                                    : <ChevronRight className="w-4 h-4 text-zinc-400" />
                                }
                                <span className="font-mono text-xs font-medium text-zinc-600 dark:text-zinc-400">{row.id}</span>
                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[300px]">
                                    {getRowPreview(row)}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(row.id); }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Editor View */}
                        {editingId === row.id && (
                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                                <textarea
                                    value={editData}
                                    onChange={e => setEditData(e.target.value)}
                                    className="w-full h-48 p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
                                />
                                <div className="flex justify-end gap-2 mt-3">
                                    <button 
                                        onClick={() => setEditingId(null)}
                                        className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded shadow-sm"
                                    >
                                        <Save className="w-3 h-3" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {rows.length === 0 && !loading && (
                    <div className="text-center py-12 text-zinc-400 text-sm">
                        No records found.
                    </div>
                )}
            </div>

            {/* DELETE MODAL */}
            {deletingId && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                     <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-sm">
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Delete Record?</h3>
                        <p className="text-sm text-zinc-500 mb-4">This action cannot be undone. Are you sure you want to delete <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{deletingId}</span>?</p>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setDeletingId(null)} 
                                className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded shadow-sm"
                            >
                                Delete Record
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE MODAL */}
            {isCreating && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                     <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg flex flex-col h-[70vh]">
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Create New {selectedModel}</h3>
                         <p className="text-xs text-zinc-500 mb-2">Enter the JSON data for the new record.</p>
                        <textarea 
                            value={createData}
                            onChange={(e) => setCreateData(e.target.value)}
                             className="flex-1 p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded mb-4 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsCreating(false)} 
                                className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmCreate} 
                                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm"
                            >
                                Create Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function capitalize(s: string) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}
