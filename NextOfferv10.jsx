import React, { useState, useMemo } from 'react';
import { Plus, Calendar, Link as LinkIcon, CheckCircle2, TrendingUp, AlertCircle, Heart, Trash2, PartyPopper, MessageSquare, Send, Award, Archive, ListTodo, ChevronRight, GraduationCap } from 'lucide-react';

const MOTIVATIONS = [
    "2026年，是属于你大放异彩的一年！✨",
    "每一份努力都不会被辜负，所有的 Offer 都在路上。🚀",
    "心态稳住，我们能赢！💪",
    "保持节奏，保持热爱，奔赴山海。☀️"
];

const App = () => {
    const [apps, setApps] = useState([
        {
            id: 1, company: '美团', position: '产品经理', status: 'offered',
            date: '2026-03-28', isReferral: true,
            notesLink: 'https://feishu.cn/meituan_offer', materials: [{ name: '简历', done: true }, { name: '作品集', done: true }, { name: '录用函', done: true }]
        },
        {
            id: 2, company: '字节跳动', position: '高级产品经理实习生', status: 'interviewing',
            round: '终面', date: '2026-03-12', isReferral: false, notesLink: '', materials: []
        },
        {
            id: 3, company: '小红书', position: '社区产品运营', status: 'backlog',
            deadline: '2026-03-20', isReferral: true, materials: [{ name: '简历', done: false }]
        },
        {
            id: 4, company: '腾讯', position: 'AI 策略助理', status: 'applied',
            date: '2026-03-08', isReferral: false, materials: [{ name: '简历', done: true }]
        }
    ]);

    const [selectedId, setSelectedId] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [quote] = useState(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);

    const selectedCard = useMemo(() => apps.find(a => a.id === selectedId), [apps, selectedId]);

    const updateApp = (id, fields) => {
        if (fields.status === 'offered') {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 4000);
        }
        setApps(prev => prev.map(a => a.id === id ? { ...a, ...fields } : a));
    };

    const deleteApp = (id) => {
        setApps(prev => prev.filter(a => a.id !== id));
        setSelectedId(null);
    };

    const addApp = (status = 'backlog') => {
        const newId = Date.now();
        const newApp = { id: newId, company: '点击输入公司', position: '点击输入岗位', status, date: '2026-04-01', isReferral: false, materials: [{ name: '简历', done: false }] };
        setApps(prev => [...prev, newApp]);
        setSelectedId(newId);
    };

    const stats = useMemo(() => {
        const activeApps = apps.filter(a => a.status !== 'backlog');
        const interviewAndOffers = apps.filter(a => a.status === 'interviewing' || a.status === 'offered').length;
        return {
            total: apps.length,
            interviewing: apps.filter(a => a.status === 'interviewing').length,
            offers: apps.filter(a => a.status === 'offered').length,
            rate: activeApps.length > 0 ? ((interviewAndOffers / activeApps.length) * 100).toFixed(0) : 0
        };
    }, [apps]);

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-slate-700 p-8 font-sans relative overflow-x-hidden flex flex-col">

            {/* 统一的最大宽度包装容器 */}
            <div className="w-full max-w-[1440px] mx-auto flex flex-col flex-1">

                {/* 1. 激励区 - 强制宽度铺满 */}
                <div className="w-full mb-8 bg-orange-100/40 border border-orange-100/60 p-5 rounded-[32px] flex items-center gap-3">
                    <Heart size={20} className="text-orange-500 fill-orange-500" />
                    <p className="text-orange-800 font-bold italic tracking-wide">“ {quote} ”</p>
                </div>

                {/* 2. Header - 使用 justify-between 强制拉开两头 */}
                <header className="w-full flex justify-between items-center mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-200 rotate-3 transition-transform hover:rotate-0">
                            <TrendingUp size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-800">NextOffer</h1>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em]">2026 旗舰版求职管理</p>
                        </div>
                    </div>
                    <button onClick={() => addApp()} className="bg-slate-800 hover:bg-slate-900 text-white px-10 py-4 rounded-[24px] text-sm font-bold transition-all shadow-2xl active:scale-95 flex items-center gap-2">
                        <Plus size={20} /> 新增投递记录
                    </button>
                </header>

                {/* 3. 统计看板 - 强制 4 列等宽铺满 */}
                <div className="w-full grid grid-cols-4 gap-8 mb-16">
                    {[
                        { label: '项目总数', value: stats.total, color: 'text-slate-400', icon: '📝' },
                        { label: '面试转化率', value: `${stats.rate}%`, color: 'text-orange-600', icon: '📈' },
                        { label: '正在面试', value: stats.interviewing, color: 'text-orange-400', icon: '🎤' },
                        { label: '已获 Offer', value: stats.offers, color: 'text-emerald-500', icon: '🏆' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white shadow-sm flex items-center justify-between group hover:bg-white transition-all">
                            <div>
                                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">{s.label}</p>
                                <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                            </div>
                            <span className="text-4xl opacity-80">{s.icon}</span>
                        </div>
                    ))}
                </div>

                {/* 4. 看板区域 - 保持滚动条间距 */}
                <main className="w-full flex gap-8 overflow-x-auto pb-12 custom-scrollbar">
                    {[
                        { id: 'backlog', title: '准备中', icon: ListTodo, color: 'text-slate-400' },
                        { id: 'applied', title: '已投递', icon: Send, color: 'text-blue-400' },
                        { id: 'interviewing', title: '面试中', icon: MessageSquare, color: 'text-orange-500', isSpecial: true },
                        { id: 'offered', title: '已斩获', icon: Award, color: 'text-emerald-500' },
                        { id: 'closed', title: '已结束', icon: Archive, color: 'text-slate-300' }
                    ].map(col => (
                        <div key={col.id} className="w-80 flex-shrink-0 flex flex-col">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <div className={`p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100 relative ${col.isSpecial ? 'ring-2 ring-orange-100 shadow-orange-100' : ''}`}>
                                    {col.isSpecial && <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-ping"></span>}
                                    <col.icon size={20} className={col.color} />
                                </div>
                                <div>
                                    <h2 className={`font-black text-xs uppercase tracking-widest ${col.isSpecial ? 'text-orange-600' : 'text-slate-400'}`}>{col.title}</h2>
                                    <p className="text-[10px] text-slate-300 font-bold">{apps.filter(a => a.status === col.id).length} 个记录</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {apps.filter(a => a.status === col.id).map(card => (
                                    <div key={card.id} onClick={() => setSelectedId(card.id)} className="bg-white rounded-[32px] p-7 shadow-sm border border-transparent hover:border-orange-200 hover:shadow-2xl transition-all cursor-pointer relative group overflow-hidden active:scale-95">
                                        {card.isReferral && <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl">内推</div>}
                                        {card.status === 'offered' && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl shadow-lg">OFFER!</div>}
                                        <h3 className="font-bold text-slate-800 text-xl mb-1.5 group-hover:text-orange-500">{card.company}</h3>
                                        <p className="text-sm text-slate-400 font-semibold mb-6 truncate">{card.position}</p>
                                        <div className="flex items-center justify-between text-[11px] font-black tracking-tight">
                                            <div className={`flex items-center gap-1.5 ${card.deadline ? 'text-rose-500 font-bold' : 'text-slate-300'}`}>
                                                {card.deadline ? <AlertCircle size={15} className="animate-pulse" /> : <Calendar size={15} />}
                                                {card.deadline ? `截止: ${card.deadline}` : (card.date || '未设置')}
                                            </div>
                                            {card.round && <span className="bg-slate-50 text-slate-400 px-2 py-1 rounded-lg border border-slate-100">{card.round}</span>}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => addApp(col.id)} className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-300 hover:border-orange-200 transition-all flex justify-center hover:bg-white"><Plus size={28} /></button>
                            </div>
                        </div>
                    ))}
                </main>

                {/* 5. Footer - 居中署名 */}
                <footer className="w-full py-12 flex flex-col items-center opacity-40">
                    <div className="h-[1px] w-16 bg-orange-200 mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                        Designed & Developed by <span className="text-orange-600">Xav</span> @ <GraduationCap size={14} /> Peking University
                    </p>
                </footer>
            </div>

            {/* 6. 浮层组件 (不受父容器宽度影响) */}
            {showCelebration && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="text-center animate-bounce">
                        <PartyPopper size={120} className="mx-auto text-orange-500 mb-6" />
                        <h2 className="text-6xl font-black text-orange-600 tracking-tighter shadow-sm">CONGRATS! OFFER! 🎉</h2>
                    </div>
                </div>
            )}

            {selectedCard && (
                <div className="fixed inset-0 z-[150] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedId(null)} />
                    <div className="relative w-[520px] bg-white h-full shadow-2xl p-14 overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col text-slate-800">
                        <div className="flex justify-between items-center mb-14">
                            <span className="text-[11px] font-black text-orange-500 bg-orange-50 px-5 py-2 rounded-full uppercase tracking-widest font-mono">EDIT DETAILS</span>
                            <div className="flex gap-5 text-slate-400">
                                <button onClick={() => deleteApp(selectedCard.id)} className="p-2 hover:text-rose-500 transition-colors"><Trash2 size={26} /></button>
                                <button onClick={() => setSelectedId(null)} className="p-2 hover:text-slate-600 font-bold text-3xl">✕</button>
                            </div>
                        </div>
                        <div className="mb-14">
                            <input value={selectedCard.company} onFocus={(e) => e.target.select()} onChange={(e) => updateApp(selectedCard.id, { company: e.target.value })} className="text-5xl font-black text-slate-800 w-full bg-transparent border-none focus:outline-none mb-3" />
                            <input value={selectedCard.position} onFocus={(e) => e.target.select()} onChange={(e) => updateApp(selectedCard.id, { position: e.target.value })} className="text-2xl font-bold text-slate-300 w-full bg-transparent border-none focus:outline-none" />
                        </div>
                        <div className="space-y-14 flex-1">
                            <section>
                                <label className="text-[11px] font-black text-slate-300 uppercase mb-5 block tracking-[0.2em]">流程状态</label>
                                <div className="grid grid-cols-5 gap-3">
                                    {['backlog', 'applied', 'interviewing', 'offered', 'closed'].map(s => (
                                        <button key={s} onClick={() => updateApp(selectedCard.id, { status: s })} className={`py-4 text-[11px] font-black rounded-2xl border transition-all ${selectedCard.status === s ? 'bg-orange-500 border-orange-500 text-white shadow-xl scale-105' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}>
                                            {s === 'backlog' ? '准备' : s === 'applied' ? '已投' : s === 'interviewing' ? '面试' : s === 'offered' ? '斩获' : '结束'}
                                        </button>
                                    ))}
                                </div>
                            </section>
                            <section>
                                <label className="text-[11px] font-black text-slate-300 uppercase mb-5 block tracking-[0.2em]">日期管理 (2026)</label>
                                <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[28px] border-2 border-transparent focus-within:border-orange-100 transition-all shadow-inner">
                                    <Calendar size={24} className="text-slate-400" />
                                    <input type="date" value={selectedCard.deadline || selectedCard.date || ""} onChange={(e) => {
                                        const val = e.target.value;
                                        if (selectedCard.status === 'backlog') updateApp(selectedCard.id, { deadline: val, date: null });
                                        else updateApp(selectedCard.id, { date: val, deadline: null });
                                    }} className="bg-transparent border-none w-full text-xl font-bold text-slate-800 focus:ring-0 cursor-pointer" />
                                </div>
                            </section>
                        </div>
                        <button onClick={() => setSelectedId(null)} className="mt-14 py-6 bg-slate-800 text-white rounded-[40px] font-black shadow-2xl active:scale-95 transition-all text-sm tracking-widest uppercase text-center">SAVE & RETURN</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;