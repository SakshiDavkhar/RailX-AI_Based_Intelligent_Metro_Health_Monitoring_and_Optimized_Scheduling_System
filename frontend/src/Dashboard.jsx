
import React, { useState, useEffect } from 'react';
import api from './api';
import { Plus, Maximize2, Thermometer, Zap, Activity, Droplets, GaugeCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const RadialHealth = ({ score }) => {
    const data = [{ name: 'Health', value: score, fill: score > 70 ? '#34d399' : score < 40 ? '#f43f5e' : '#fbbf24' }];

    return (
        <div className="relative h-32 w-32 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={8} data={data} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-bold ${score > 70 ? 'text-emerald-400' : score < 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {Math.round(score)}%
                </span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Integrity</span>
            </div>
        </div>
    );
};

const MiniChart = ({ data, color }) => (
    <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke={color} strokeWidth={2} fill={`url(#gradient-${color})`} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

// Simulated historical data generator for visuals
const generateHistory = (base) => Array.from({ length: 10 }, (_, i) => ({ val: base + Math.random() * 2 - 1 }));

const Dashboard = () => {
    const [trains, setTrains] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTrain, setNewTrain] = useState({
        train_id: '', tp2: 0, tp3: 0, h1: 0, dv_pressure: 0,
        reservoirs: 0, oil_temperature: 0, motor_current: 0
    });

    // Fetch logic same as before...
    const fetchTrains = async () => {
        try {
            const res = await api.get('/trains');
            setTrains(res.data);
        } catch (err) { console.error("API Error", err); }
    };

    useEffect(() => { fetchTrains(); const i = setInterval(fetchTrains, 5000); return () => clearInterval(i); }, []);

    const handleAddTrain = async (e) => {
        e.preventDefault();
        await api.post('/trains/add', newTrain);
        setShowAddModal(false);
        fetchTrains();
        setNewTrain({ train_id: '', tp2: 0, tp3: 0, h1: 0, dv_pressure: 0, reservoirs: 0, oil_temperature: 0, motor_current: 0 });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-5xl font-bold text-white tracking-tight mb-2">Fleet Command</h2>
                    <div className="flex items-center gap-3 text-zinc-400 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-mono tracking-widest">{trains.length} UNITS ONLINE</span>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="group relative px-6 py-3 rounded-2xl bg-cyan-600 text-white font-semibold overflow-hidden shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-transform active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-2">
                        <Plus size={18} /> Deploy System
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {trains.map((train) => (
                        <motion.div
                            key={train.train_id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="glass-card rounded-[2rem] p-1 relative overflow-hidden"
                        >
                            <div className="bg-[#0e0e11] rounded-[1.8rem] p-6 h-full relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className='flex gap-4 items-center'>
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{train.train_id}</h3>
                                            <p className="text-xs text-zinc-500 font-mono">SERIES-M</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border uppercase ${train.status === 'Optimal'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                        {train.status}
                                    </div>
                                </div>

                                {/* Main Viz */}
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <div className="space-y-4">
                                        <div className="flex items-end gap-2">
                                            <div className="text-4xl font-mono text-white">{train.oil_temperature}</div>
                                            <div className="text-zinc-500 text-sm mb-1">°C</div>
                                        </div>
                                        <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, train.oil_temperature)}%` }}
                                                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                            />
                                        </div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Oil Temp</div>
                                    </div>
                                    <RadialHealth score={train.health_score} />
                                </div>

                                {/* Grid Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-2">
                                            <GaugeCircle size={16} className="text-cyan-400" />
                                            <span className="text-xs text-zinc-500">TP2 BAR</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-lg font-mono text-white">{train.tp2}</span>
                                            <MiniChart data={generateHistory(train.tp2)} color="#22d3ee" />
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900/50 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-2">
                                            <Activity size={16} className="text-purple-400" />
                                            <span className="text-xs text-zinc-500">MOTOR A</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-lg font-mono text-white">{train.motor_current}</span>
                                            <MiniChart data={generateHistory(train.motor_current)} color="#c084fc" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-[#0A0A0B] border border-zinc-800 p-8 rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden"
                    >
                        {/* Glossy Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />

                        <h3 className="text-2xl font-bold mb-8 text-white relative z-10">Initialize New Unit</h3>

                        <form onSubmit={handleAddTrain} className="space-y-6 relative z-10">
                            <input
                                type="text"
                                value={newTrain.train_id}
                                onChange={e => setNewTrain({ ...newTrain, train_id: e.target.value })}
                                className="input-field text-xl font-mono tracking-wider"
                                placeholder="UNIT-ID"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className='space-y-2'>
                                    <label className='text-xs text-zinc-500 font-bold ml-1'>OIL TEMP</label>
                                    <input type="number" step="0.1" value={newTrain.oil_temperature} onChange={e => setNewTrain({ ...newTrain, oil_temperature: parseFloat(e.target.value) })} className="input-field" placeholder="00.0" />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs text-zinc-500 font-bold ml-1'>TP2 PRESS</label>
                                    <input type="number" step="0.01" value={newTrain.tp2} onChange={e => setNewTrain({ ...newTrain, tp2: parseFloat(e.target.value) })} className="input-field" placeholder="0.00" />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs text-zinc-500 font-bold ml-1'>TP3 PRESS</label>
                                    <input type="number" step="0.01" value={newTrain.tp3} onChange={e => setNewTrain({ ...newTrain, tp3: parseFloat(e.target.value) })} className="input-field" placeholder="0.00" />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs text-zinc-500 font-bold ml-1'>CURRENT</label>
                                    <input type="number" step="0.01" value={newTrain.motor_current} onChange={e => setNewTrain({ ...newTrain, motor_current: parseFloat(e.target.value) })} className="input-field" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 rounded-xl font-bold text-zinc-400 hover:bg-zinc-900 transition-colors">Abort</button>
                                <button type="submit" className="flex-1 bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-white/10">Authorize Launch</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
