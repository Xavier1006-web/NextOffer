import React, { useState, useMemo } from 'react';
import {
    Plus, Calendar, Link as LinkIcon, CheckCircle2, TrendingUp, AlertCircle, Heart, Trash2,
    PartyPopper, MessageSquare, Send, Award, Archive, ListTodo, ChevronRight,
    Globe, GraduationCap, CalendarDays, ExternalLink, Search, Star
} from 'lucide-react';

const MOTIVATIONS = [
    "2026年，是属于你大放异彩的一年！✨",
    "每一份努力都不会被辜负，所有的 Offer 都在路上。🚀",
    "心态稳住，我们能赢！💪",
    "保持节奏，保持热爱，奔赴山海。☀️"
];

const BITABLE_URL = "https://my.feishu.cn/base/DftcbI4fIaHrWTs7LNccWjbXnCh?table=tblVWEwfKhmMXcvp&view=vew3ICmRCS";

const DISCOVERY_DATA = [
    { id: 'd1', company: '美团', position: '产品经理-核心大模型', city: '北京', type: '暑期实习', deadline: '2026-04-15' },
    { id: 'd2', company: '小红书', position: '社区产品运营', city: '上海', type: '日常实习', deadline: '2026-04-10' },
    { id: 'd3', company: '字节跳动', position: 'AI 绘画产品实习生', city: '北京', type: '暑期实习', deadline: '2026-04-20' },
];

const App = () => {
    const [activeTab, setActiveTab] = useState('board');
    const [apps, setApps] = useState([
        { id: 1, company: '美团', position: '产品经理', status: 'offered', date: '2026-03-28', isReferral: true, round: '', notesLink: 'https://feishu.cn/meituan_offer', materials: [{ name: '简历', done: true }, { name: '作品集', done: true }, { name: '录用函', done: true }] },
        { id: 2, company: '字节跳动', position: '高级产品经理实习生', status: 'interviewing', round: '终面', date: '2026-03-12', isReferral: false, notesLink: '', materials: [] },
        { id: 3, company: '小红书', position: '社区产品运营', status: 'backlog', deadline: '2026-03-20', isReferral: true, round: '', materials: [{ name: '简历', done: false }] },
        { id: 4, company: '腾讯', position: 'AI 策略助理', status: 'applied', date: '2026-03-08', isReferral: false, round: '', materials: [{ name: '简历', done: true }] }
    ]);

    const [selectedId, setSelectedId] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [quote] = useState(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);

    const selectedCard = useMemo(() => apps.find(a => a.id === selectedId), [apps, selectedId]);

    // --- 📅 1. 真正的 Apple 日历同步逻辑 (ICS 生成) ---
    const downloadCalendarFile = (app) => {
        const title = `面试: ${app.company} - ${app.position}`;
        const dateStr = (app.deadline || app.date || '20260401').replace(/-/g, '');
        const icsData = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
            `SUMMARY:${title}`, `DTSTART:${dateStr}T090000Z`, `DTEND:${dateStr}T100000Z`,
            'DESCRIPTION:来自 NextOffer 的面试提醒', 'END:VEVENT', 'END:VCALENDAR'
        ].join('\n');
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${app.company}_面试.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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

    const addApp = (status = 'backlog', customData = {}) => {
        const newId = Date.now();
        const newApp = { id: newId, company: customData.company || '点击输入公司', position: customData.position || '点击输入岗位', status, date: customData.deadline || '2026-04-01', isReferral: false, round: '', materials: [{ name: '简历', done: false }] };
        setApps(prev => [...prev, newApp]);
        if (!customData.company) setSelectedId(newId);
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
        <div className="min-h-screen bg-[#FFFBF5] text-slate-700 p-6 font-sans relative overflow-hidden flex flex-col">

            {/* 侧边导航栏 */}
            <aside className="fixed left-0 top-0 h-full w-20 border-r border-orange-100/50 flex flex-col items-center py-8 gap-10 bg-white/50 backdrop-blur-md z-30">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-100 rotate-3 transition-transform hover:rotate-0 cursor-pointer">
                    <TrendingUp size={24} className="text-white" />
                </div>
                <div className="flex flex-col gap-10 mt-10">
                    <button onClick={() => setActiveTab('board')} className={`p-4 rounded-2xl transition-all ${activeTab === 'board' ? 'bg-orange-100 text-orange-600 shadow-inner scale-110' : 'text-slate-300 hover:text-orange-400'}`}>
                        <ListTodo size={28} />
                    </button>
                    <button onClick={() => setActiveTab('discover')} className={`p-4 rounded-2xl transition-all ${activeTab === 'discover' ? 'bg-orange-100 text-orange-600 shadow-inner scale-110' : 'text-slate-300 hover:text-orange-400'}`}>
                        <Globe size={28} />
                    </button>
                </div>
            </aside>

            {/* 主内容 - 左右拉开布局 */}
            <div className="flex-1 ml-20 flex flex-col relative overflow-y-auto">
                {showCelebration && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in duration-500">
                        <div className="text-center animate-bounce">
                            <PartyPopper size={100} className="mx-auto text-orange-500 mb-4" />
                            <h2 className="text-5xl font-black text-orange-600 tracking-tighter shadow-sm uppercase">Congrats! Offer! 🎉</h2>
                        </div>
                    </div>
                )}

                <div className="p-8 w-full max-w-[1500px] mx-auto flex flex-col flex-1">
                    <div className="w-full mb-8 bg-orange-100/40 border border-orange-100/60 p-4 rounded-3xl flex items-center gap-3">
                        <Heart size={18} className="text-orange-500 fill-orange-500" />
                        <p className="text-orange-800 font-bold italic text-sm">“ {quote} ”</p>
                    </div>

                    <header className="flex justify-between items-center mb-10 w-full">
                        <div className="text-slate-800">
                            <h1 className="text-3xl font-black tracking-tight">NextOffer</h1>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">2026 PKU EDITION</p>
                        </div>
                        <button onClick={() => addApp()} className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl active:scale-95 flex items-center gap-2">
                            <Plus size={18} /> 新增投递记录
                        </button>
                    </header>

                    {activeTab === 'board' ? (
                        <>
                            <div className="grid grid-cols-4 gap-8 mb-12 w-full">
                                {[
                                    { label: '项目总数', value: stats.total, color: 'text-slate-400', icon: '📝' },
                                    { label: '面试转化率', value: `${stats.rate}%`, color: 'text-orange-600', icon: '📈' },
                                    { label: '正在面试', value: stats.interviewing, color: 'text-orange-400', icon: '🎤' },
                                    { label: '已获 Offer', value: stats.offers, color: 'text-emerald-500', icon: '🏆' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/60 backdrop-blur-xl p-8 rounded-[40px] border border-white/50 shadow-sm flex items-center justify-between group hover:bg-white transition-all">
                                        <div>
                                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">{s.label}</p>
                                            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                                        </div>
                                        <span className="text-3xl opacity-80 group-hover:scale-110 transition-transform">{s.icon}</span>
                                    </div>
                                ))}
                            </div>

                            <main className="grid grid-cols-5 gap-8 pb-10 flex-1">
                                {['backlog', 'applied', 'interviewing', 'offered', 'closed'].map(col => (
                                    <div key={col} className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-3 mb-6 px-2">
                                            <div className={`p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 relative ${col === 'interviewing' ? 'ring-2 ring-orange-100 shadow-orange-100' : ''}`}>
                                                {col === 'interviewing' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-ping"></span>}
                                                {col === 'backlog' ? <ListTodo size={18} className="text-slate-400" /> : col === 'applied' ? <Send size={18} className="text-blue-400" /> : col === 'interviewing' ? <MessageSquare size={18} className="text-orange-500" /> : col === 'offered' ? <Award size={18} className="text-emerald-500" /> : <Archive size={18} className="text-slate-300" />}
                                            </div>
                                            <div>
                                                <h2 className="font-black text-xs uppercase tracking-widest text-slate-400">{col}</h2>
                                                <p className="text-[10px] text-slate-300 font-bold">{apps.filter(a => a.status === col).length} 个记录</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6 flex-1 pr-1 overflow-y-auto custom-scrollbar">
                                            {apps.filter(a => a.status === col).map(card => (
                                                <div key={card.id} onClick={() => setSelectedId(card.id)} className="bg-white rounded-[32px] p-8 shadow-sm border border-transparent hover:border-orange-200 hover:shadow-2xl transition-all cursor-pointer relative group overflow-hidden active:scale-95">
                                                    {card.isReferral && <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl">内推</div>}
                                                    {card.status === 'offered' && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl shadow-lg">OFFER!</div>}
                                                    <h3 className="font-bold text-slate-800 text-xl mb-2 group-hover:text-orange-500 truncate">{card.company}</h3>
                                                    <p className="text-sm text-slate-400 font-semibold mb-6 truncate">{card.position}</p>
                                                    <div className="flex items-center justify-between text-[11px] font-black tracking-tight">
                                                        <div className={`flex items-center gap-1.5 ${card.deadline ? 'text-rose-500 font-bold' : 'text-slate-300'}`}>
                                                            {card.deadline ? <AlertCircle size={15} /> : <Calendar size={15} />}
                                                            {card.deadline || card.date}
                                                        </div>
                                                        {card.round && <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-xl border border-slate-100 font-bold">{card.round}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={() => addApp(col)} className="w-full py-8 border-2 border-dashed border-slate-200 rounded-[35px] text-slate-300 hover:border-orange-200 hover:text-orange-200 transition-all flex justify-center hover:bg-white/50"><Plus size={32} /></button>
                                        </div>
                                    </div>
                                ))}
                            </main>
                        </>
                    ) : (
                        <div className="flex-1 w-full animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-[45px] border border-orange-100 p-12 shadow-sm flex flex-col h-[calc(100vh-320px)]">
                                <div className="flex items-center justify-between mb-10 text-slate-800">
                                    <h2 className="text-2xl font-black flex items-center gap-3"><Search className="text-orange-500" /> 最新职位发现</h2>
                                    <a href={BITABLE_URL} target="_blank" rel="noreferrer" className="text-xs font-black text-orange-500 bg-orange-50 px-5 py-3 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-sm flex items-center gap-2">直接访问飞书原表 <ExternalLink size={14} /></a>
                                </div>
                                <div className="space-y-6 overflow-y-auto pr-4 custom-scrollbar flex-1">
                                    {DISCOVERY_DATA.map(item => (
                                        <div key={item.id} className="p-8 bg-slate-50/50 rounded-[35px] flex items-center justify-between group hover:bg-white border border-transparent hover:border-orange-100 transition-all shadow-sm hover:shadow-xl">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center font-black text-slate-200 shadow-inner text-2xl">{item.company[0]}</div>
                                                <div><p className="font-black text-slate-800 text-xl mb-1">{item.position}</p><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.company} · {item.city} · {item.type}</p></div>
                                            </div>
                                            <button onClick={() => { addApp('backlog', item); setActiveTab('board'); }} className="p-5 bg-orange-500 text-white rounded-3xl shadow-xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 font-bold px-8"><Plus size={20} /> 一键导入</button>
                                        </div>
                                    ))}
                                    <button onClick={() => addApp('backlog')} className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[35px] text-slate-300 hover:border-orange-400 transition-all flex flex-col items-center justify-center gap-2 hover:bg-white/50 shadow-inner">
                                        <Plus size={40} /><span className="text-xs font-black uppercase tracking-widest">手动录入新发现</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <footer className="mt-16 py-10 flex flex-col items-center border-t border-orange-100/30">
                        <div className="flex items-center gap-3 text-slate-300 font-black text-[11px] uppercase tracking-[0.3em]">
                            <span>Designed & Developed by</span>
                            <span className="text-orange-400/80 px-3 py-1 border border-orange-100 rounded-xl bg-white shadow-sm">Xav</span>
                            <span className="flex items-center gap-1.5 text-slate-400">@ <GraduationCap size={16} /> Peking University</span>
                        </div>
                    </footer>
                </div>

                {/* 深度全功能交互抽屉 */}
                {selectedCard && (
                    <div className="fixed inset-0 z-[110] flex justify-end">
                        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedId(null)} />
                        <div className="relative w-[520px] bg-white h-full shadow-2xl p-14 overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col text-slate-800">
                            <div className="flex justify-between items-center mb-14">
                                <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-4 py-1.5 rounded-full uppercase tracking-widest font-mono tracking-tighter">Edit Details</span>
                                <div className="flex gap-4">
                                    <button onClick={() => deleteApp(selectedCard.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={24} /></button>
                                    <button onClick={() => setSelectedId(null)} className="p-3 text-slate-800 font-bold text-3xl">✕</button>
                                </div>
                            </div>

                            <input value={selectedCard.company} onFocus={(e) => e.target.select()} onChange={(e) => updateApp(selectedCard.id, { company: e.target.value })} className="text-5xl font-black w-full bg-transparent border-none focus:outline-none mb-3 tracking-tighter" />
                            <input value={selectedCard.position} onFocus={(e) => e.target.select()} onChange={(e) => updateApp(selectedCard.id, { position: e.target.value })} className="text-2xl font-bold text-slate-300 w-full bg-transparent border-none focus:outline-none italic mb-10" />

                            <div className="space-y-12 flex-1">
                                <section>
                                    <label className="text-[11px] font-black text-slate-300 uppercase mb-5 block tracking-[0.2em]">流程状态</label>
                                    <div className="grid grid-cols-5 gap-2 bg-slate-50 p-2 rounded-[25px]">
                                        {['backlog', 'applied', 'interviewing', 'offered', 'closed'].map(s => (
                                            <button key={s} onClick={() => updateApp(selectedCard.id, { status: s })} className={`py-3 text-[10px] font-black rounded-[20px] transition-all ${selectedCard.status === s ? 'bg-orange-500 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white'}`}>{s.slice(0, 4).toUpperCase()}</button>
                                        ))}
                                    </div>
                                </section>

                                {/* --- 💡 2. 新增：标签与轮次交互 --- */}
                                <section className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[11px] font-black text-slate-300 uppercase mb-4 block tracking-[0.2em]">面试轮次</label>
                                        <input value={selectedCard.round || ""} onChange={(e) => updateApp(selectedCard.id, { round: e.target.value })} placeholder="一面、终面" className="w-full p-5 bg-slate-50 rounded-[28px] border-none text-sm font-bold focus:ring-2 focus:ring-orange-100" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-slate-300 uppercase mb-4 block tracking-[0.2em]">内推标记</label>
                                        <button onClick={() => updateApp(selectedCard.id, { isReferral: !selectedCard.isReferral })} className={`w-full p-5 rounded-[28px] font-black text-sm flex items-center justify-center gap-2 transition-all ${selectedCard.isReferral ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-200' : 'bg-slate-50 text-slate-300'}`}>
                                            <Star size={16} fill={selectedCard.isReferral ? "currentColor" : "none"} /> {selectedCard.isReferral ? '已标记内推' : '标记内推'}
                                        </button>
                                    </div>
                                </section>

                                <section>
                                    <label className="text-[11px] font-black text-slate-300 uppercase mb-5 block tracking-[0.2em]">求职资源外链 (点击右侧图标跳转 ✅)</label>
                                    <div className="flex items-center gap-4 p-6 bg-orange-50/50 rounded-[28px] border border-orange-100 focus-within:ring-4 focus-within:ring-orange-100/30">
                                        <LinkIcon size={20} className="text-orange-400" />
                                        <input value={selectedCard.notesLink} onFocus={(e) => e.target.select()} onChange={(e) => updateApp(selectedCard.id, { notesLink: e.target.value })} className="bg-transparent border-none w-full text-sm font-bold text-orange-900 focus:ring-0 placeholder-orange-200" placeholder="粘贴飞书/Notion链接..." />
                                        {selectedCard.notesLink && <button onClick={() => window.open(selectedCard.notesLink, '_blank')} className="p-3 bg-white rounded-2xl text-orange-500 shadow-sm hover:scale-110 active:scale-95 transition-all"><ExternalLink size={18} /></button>}
                                    </div>
                                </section>

                                {/* --- 💡 3. 新增：Apple 日历同步交互 --- */}
                                <section>
                                    <div className="flex justify-between items-center mb-5">
                                        <label className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">日期与同步</label>
                                        <button onClick={() => downloadCalendarFile(selectedCard)} className="text-[10px] font-black bg-indigo-50 text-indigo-500 px-4 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2 shadow-sm">
                                            <CalendarDays size={14} /> SYNC TO APPLE CAL
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[28px] shadow-inner">
                                        <Calendar size={24} className="text-slate-400" />
                                        <input type="date" value={selectedCard.deadline || selectedCard.date || ""} onChange={(e) => updateApp(selectedCard.id, selectedCard.status === 'backlog' ? { deadline: e.target.value } : { date: e.target.value })} className="bg-transparent border-none w-full text-xl font-bold text-slate-800 focus:ring-0 cursor-pointer" />
                                    </div>
                                </section>
                            </div>

                            <button onClick={() => setSelectedId(null)} className="mt-14 py-6 bg-slate-800 text-white rounded-[40px] font-black shadow-2xl active:scale-95 transition-all text-sm tracking-widest uppercase text-center flex items-center justify-center gap-2 hover:bg-slate-700">
                                <CheckCircle2 size={18} /> SAVE & RETURN TO BOARD
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;