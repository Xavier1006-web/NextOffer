import React, { useState, useMemo } from 'react';
import { Plus, Calendar, Link as LinkIcon, CheckCircle2, TrendingUp, AlertCircle, Heart, Trash2, PartyPopper, MessageSquare, Send, Award, Archive, ListTodo, ChevronRight } from 'lucide-react';

const MOTIVATIONS = [
    "2026年，是属于你大放异彩的一年！✨",
    "每一份努力都不会被辜负，所有的 Offer 都在路上。🚀",
    "心态稳住，我们能赢！💪",
    "保持节奏，保持热爱，奔赴山海。☀️"
];

const App = () => {
    // --- 1. 2026 增强版 Mock 数据 (包含已斩获的 Offer 用于 Demo) ---
    const [apps, setApps] = useState([
        {
            id: 1, company: '美团', position: '产品经理', status: 'offered', // 预置一个 Offer 给面试官看
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

    // --- 2. 交互逻辑 ---
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

    // --- 3. 专业统计算法优化 ---
    const stats = useMemo(() => {
        // 排除“准备中”的干扰，只计算已投出的项目
        const activeApps = apps.filter(a => a.status !== 'backlog');
        const totalApplied = activeApps.length;
        const interviewAndOffers = apps.filter(a => a.status === 'interviewing' || a.status === 'offered').length;

        return {
            total: apps.length,
            realApplied: totalApplied,
            interviewing: apps.filter(a => a.status === 'interviewing').length,
            offers: apps.filter(a => a.status === 'offered').length,
            // 转化率 = (面试+Offer) / 已投出总数
            rate: totalApplied > 0 ? ((interviewAndOffers / totalApplied) * 100).toFixed(0) : 0
        };
    }, [apps]);

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-slate-700 p-6 font-sans relative overflow-hidden">

            {/* 庆祝动画 */}
            {showCelebration && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="text-center animate-bounce">
                        <PartyPopper size={100} className="mx-auto text-orange-500 mb-4" />
                        <h2 className="text-5xl font-black text-orange-600 tracking-tighter shadow-sm">CONGRATS! OFFER! 🎉</h2>
                        <p className="text-orange-400 font-bold mt-4 text-xl">2026 梦想达成，继续前行</p>
                    </div>
                </div>
            )}

            {/* 顶部激励 */}
            <div className="max-w-[1400px] mx-auto mb-6 bg-orange-100/40 border border-orange-100/60 p-4 rounded-3xl flex items-center gap-3">
                <Heart size={18} className="text-orange-500 fill-orange-500" />
                <p className="text-orange-800 font-bold italic text-sm">“ {quote} ”</p>
            </div>

            <header className="flex justify-between items-center mb-10 max-w-[1400px] mx-auto">
                <div className="flex items-center gap-4 text-slate-800">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-100 rotate-3">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">NextOffer</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">2026 旗舰版求职管理</p>
                    </div>
                </div>
                <button onClick={() => addApp()} className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl active:scale-95 flex items-center gap-2">
                    <Plus size={18} /> 新增投递记录
                </button>
            </header>

            {/* 专业统计看板 */}
            <div className="grid grid-cols-4 gap-6 mb-12 max-w-[1400px] mx-auto">
                {[
                    { label: '项目总数', value: stats.total, color: 'text-slate-400', icon: '📝' },
                    { label: '面试转化率', value: `${stats.rate}%`, color: 'text-orange-600', icon: '📈', desc: '基于已投递数据' },
                    { label: '正在面试', value: stats.interviewing, color: 'text-orange-400', icon: '🎤' },
                    { label: '已获 Offer', value: stats.offers, color: 'text-emerald-500', icon: '🏆' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-sm flex items-center justify-between group hover:bg-white transition-all">
                        <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                            {s.desc && <p className="text-[9px] text-slate-400 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{s.desc}</p>}
                        </div>
                        <span className="text-3xl opacity-80">{s.icon}</span>
                    </div>
                ))}
            </div>

            {/* 看板区域 */}
            <main className="flex gap-8 overflow-x-auto pb-10 max-w-[1400px] mx-auto h-[calc(100vh-320px)]">
                {[
                    { id: 'backlog', title: '准备中', icon: ListTodo, color: 'text-slate-400' },
                    { id: 'applied', title: '已投递', icon: Send, color: 'text-blue-400' },
                    { id: 'interviewing', title: '面试中', icon: MessageSquare, color: 'text-orange-500', isSpecial: true },
                    { id: 'offered', title: '已斩获', icon: Award, color: 'text-emerald-500' },
                    { id: 'closed', title: '已结束', icon: Archive, color: 'text-slate-300' }
                ].map(col => (
                    <div key={col.id} className="w-80 flex-shrink-0 flex flex-col">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 relative ${col.isSpecial ? 'ring-2 ring-orange-100 shadow-orange-100' : ''}`}>
                                {col.isSpecial && <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-ping"></span>}
                                <col.icon size={18} className={col.color} />
                            </div>
                            <div>
                                <h2 className={`font-black text-xs uppercase tracking-widest ${col.isSpecial ? 'text-orange-600' : 'text-slate-400'}`}>{col.title}</h2>
                                <p className="text-[10px] text-slate-300 font-bold">{apps.filter(a => a.status === col.id).length} 个记录</p>
                            </div>
                        </div>

                        <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                            {apps.filter(a => a.status === col.id).map(card => (
                                <div key={card.id} onClick={() => setSelectedId(card.id)} className="bg-white rounded-[28px] p-6 shadow-sm border border-transparent hover:border-orange-200 hover:shadow-2xl transition-all cursor-pointer relative group overflow-hidden active:scale-95">
                                    {card.isReferral && <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-bl-xl">内推</div>}
                                    {card.status === 'offered' && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-lg">OFFER!</div>}
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-orange-500">{card.company}</h3>
                                    <p className="text-sm text-slate-400 font-semibold mb-5 truncate">{card.position}</p>
                                    <div className="flex items-center justify-between text-[11px] font-black">
                                        <div className={`flex items-center gap-1.5 ${card.deadline ? 'text-rose-500 font-bold' : 'text-slate-300'}`}>
                                            {card.deadline ? <AlertCircle size={14} className="animate-pulse" /> : <Calendar size={14} />}
                                            {card.deadline ? `截止: ${card.deadline}` : (card.date || '未设置')}
                                        </div>
                                        {card.round && <span className="bg-slate-50 text-slate-400 px-2 py-1 rounded-lg border border-slate-100">{card.round}</span>}
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addApp(col.id)} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[28px] text-slate-300 hover:border-orange-200 hover:text-orange-200 transition-all flex justify-center"><Plus size={24} /></button>
                        </div>
                    </div>
                ))}
            </main>

            {/* 深度全功能交互抽屉 */}
            {selectedCard && (
                <div className="fixed inset-0 z-[110] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedId(null)} />
                    <div className="relative w-[500px] bg-white h-full shadow-2xl p-12 overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">

                        <div className="flex justify-between items-center mb-12">
                            <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-4 py-1.5 rounded-full uppercase tracking-widest font-mono">EDIT DETAILS</span>
                            <div className="flex gap-4">
                                <button onClick={() => deleteApp(selectedCard.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={24} /></button>
                                <button onClick={() => setSelectedId(null)} className="p-2 text-slate-300 hover:text-slate-600 font-bold text-2xl">✕</button>
                            </div>
                        </div>

                        <div className="mb-12">
                            <input
                                value={selectedCard.company}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => updateApp(selectedCard.id, { company: e.target.value })}
                                className="text-4xl font-black text-slate-800 w-full bg-transparent border-none focus:outline-none mb-2"
                                placeholder="公司名称"
                            />
                            <input
                                value={selectedCard.position}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => updateApp(selectedCard.id, { position: e.target.value })}
                                className="text-xl font-bold text-slate-300 w-full bg-transparent border-none focus:outline-none"
                                placeholder="职位名称"
                            />
                        </div>

                        <div className="space-y-12">
                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase mb-4 block tracking-widest">流程状态</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {['backlog', 'applied', 'interviewing', 'offered', 'closed'].map(s => (
                                        <button key={s} onClick={() => updateApp(selectedCard.id, { status: s })} className={`py-3 text-[10px] font-black rounded-2xl border transition-all ${selectedCard.status === s ? 'bg-orange-500 border-orange-500 text-white shadow-xl scale-105' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}>
                                            {s === 'backlog' ? '准备' : s === 'applied' ? '已投' : s === 'interviewing' ? '面试' : s === 'offered' ? '斩获' : '结束'}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase mb-4 block tracking-widest">求职资源外链</label>
                                <div className="flex items-center gap-3 p-5 bg-orange-50/50 rounded-2xl border border-orange-100 transition-all focus-within:ring-2 focus-within:ring-orange-100">
                                    <LinkIcon size={18} className="text-orange-400" />
                                    <input
                                        value={selectedCard.notesLink}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updateApp(selectedApp.id, { notesLink: e.target.value })}
                                        className="bg-transparent border-none w-full text-sm font-bold text-orange-900 focus:ring-0 placeholder-orange-200"
                                        placeholder="粘贴 飞书/Notion 链接..."
                                    />
                                </div>
                            </section>

                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase mb-4 block tracking-widest">日期管理 (2026 未来版)</label>
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-orange-100 transition-all shadow-inner">
                                    <Calendar size={20} className="text-slate-400" />
                                    <input
                                        type="date"
                                        value={selectedCard.deadline || selectedCard.date || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (selectedCard.status === 'backlog') updateApp(selectedCard.id, { deadline: val, date: null });
                                            else updateApp(selectedCard.id, { date: val, deadline: null });
                                        }}
                                        className="bg-transparent border-none w-full text-lg font-bold text-slate-800 focus:ring-0 cursor-pointer"
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="mt-auto">
                            <button onClick={() => setSelectedId(null)} className="w-full py-5 bg-slate-800 text-white rounded-[32px] font-black shadow-2xl active:scale-95 transition-all text-sm tracking-widest uppercase">
                                SAVE & RETURN TO BOARD
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;