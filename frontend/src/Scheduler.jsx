
import React, { useState, useEffect } from 'react';
import api from './api';
import { motion } from 'framer-motion';
import { Clock, Train, CheckCircle2, AlertOctagon, ArrowRight } from 'lucide-react';

const Scheduler = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await api.get('/schedule');
            setSchedule(res.data.schedule || []);
        } catch (err) {
            console.error("Failed to load schedule", err);
        } finally {
            setTimeout(() => setLoading(false), 1200);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-5xl font-bold text-white tracking-tighter mb-2">Logistics<span className="text-cyan-500">.AI</span></h2>
                    <p className="text-zinc-400 max-w-md">Predictive scheduling engine optimizing for fleet health scores above 70%.</p>
                </div>
                <button
                    onClick={fetchSchedule}
                    className="bg-zinc-100 hover:bg-white text-black font-bold px-8 py-4 rounded-full flex items-center gap-3 transition-all shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_35px_rgba(255,255,255,0.2)] active:scale-95"
                >
                    <Clock size={20} /> <span className="tracking-wide">OPTIMIZE</span>
                </button>
            </div>

            <div className="relative">
                {/* Terminal Header */}
                <div className="bg-[#0A0A0B] border border-zinc-800 rounded-t-3xl p-6 flex justify-between items-center relative z-10">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="text-xs font-mono text-zinc-600">/SYS/SCHEDULER/OUTPUT</div>
                </div>

                {/* Schedule List */}
                <div className="bg-[#050505] border-x border-b border-zinc-800 rounded-b-3xl overflow-hidden min-h-[500px] relative">

                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-black/80 backdrop-blur-sm z-20">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-r-2 border-blue-500 rounded-full animate-spin reverse"></div>
                                <div className="absolute inset-4 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-cyan-500 font-mono text-sm tracking-[0.2em] animate-pulse">COMPUTING VECTORS...</p>
                        </div>
                    ) : schedule.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
                            <AlertOctagon size={64} className="mb-6 opacity-20" />
                            <p className="text-xl font-light">Fleet Grounded via Safety Protocol.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-900 relative z-10">
                            <div className="grid grid-cols-12 p-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-950/50 sticky top-0 backdrop-blur-md">
                                <div className="col-span-2 pl-4">Departure</div>
                                <div className="col-span-4">Unit Identifier</div>
                                <div className="col-span-3">System Check</div>
                                <div className="col-span-3 text-right pr-4">Route</div>
                            </div>

                            {schedule.map((slot, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="grid grid-cols-12 p-5 items-center group hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="col-span-2 pl-4 flex items-center gap-3">
                                        <span className="font-mono text-xl text-cyan-400">{slot.time}</span>
                                    </div>

                                    <div className="col-span-4 flex items-center gap-4">
                                        <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                                            <Train size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-zinc-200 text-lg">{slot.train_id}</div>
                                            <div className="text-[10px] text-zinc-600 font-mono">NORTHBOUND LINE</div>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                            <span className="text-emerald-500 text-xs font-bold tracking-wider">CLEARED</span>
                                        </div>
                                    </div>

                                    <div className="col-span-3 text-right pr-4">
                                        <button className="text-zinc-500 hover:text-white transition-colors group/btn">
                                            <ArrowRight size={20} className="ml-auto group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Scheduler;
