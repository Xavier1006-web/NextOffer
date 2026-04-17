import React, { useState, useMemo } from 'react';
import { Plus, Calendar, Link as LinkIcon, CheckCircle2, TrendingUp, AlertCircle, Heart, Trash2, PartyPopper, MessageSquare, Send, Award, Archive, ListTodo } from 'lucide-react';

const MOTIVATIONS = ["保持节奏，你离大厂 Offer 只差最后一步！🚀", "每一份努力都不会被辜负。✨", "心态稳住，我们能赢！💪"];

const App = () => {
    // --- 1. 数据状态 ---
    const [apps, setApps] = useState([
        { id: 1, company: '美团', position: '产品经理实习生', status: 'interviewing', round: '二面', date: '2023-11-01', isReferral: true, notesLink: 'https://feishu.cn/xxx', materials: [{ name: '简历', done: true }] },
        { id: 3, company: '小红书', position: '产品运营', status: 'backlog', deadline: '2023-10-31', isReferral: true, materials: [{ name: '简历', done: false }] },
        { id: 4, company: '腾讯', position: '策略产品助理', status: 'applied', date: '2023-10-25', isReferral: false, materials: [{ name: '简历', done: true }] }
    ]);
    const [selectedId, setSelectedId] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const selectedCard = useMemo(() => apps.find(a => a.id === selectedId), [apps, selectedId]);

    // --- 2. 交互逻辑 (CRUD) ---
    const updateApp = (id, fields) => {
        if (fields.status === 'offered') {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }
        setApps(prev => prev.map(a => a.id === id ? { ...a, ...fields } : a));
    };

    const deleteApp = (id) => {
        setApps(prev => prev.filter(a => a.id !== id));
        setSelectedId(null);
    };

    const addApp = (status = 'backlog') => {
        const newId = Date.now();
        const newApp = { id: newId, company: '新公司名称', position: '输入岗位名称', status: status, date: '2023-11-20', isReferral: false, materials: [{ name: '简历', done: false }] };
        setApps(prev => [...prev, newApp]);
        setSelectedId(newId);
    };

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-slate-700 p-6 font-sans relative overflow-hidden">

            {showCelebration && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in">
                    <div className="text-center animate-bounce">
                        <PartyPopper size={80} className="mx-auto text-orange-500 mb-4" />
                        <h2 className="text-4xl font-black text-orange-600">恭喜斩获 OFFER !</h2>
                    </div>
                </div>
            )}

            {/* Header & Stats */}
            <header className="flex justify-between items-center mb-10 max-w-[1400px] mx-auto">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-100 rotate-3">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">NextOffer</h1>
                </div>
                <button onClick={() => addApp()} className="bg-slate-800 text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl active:scale-95 flex items-center gap-2"><Plus size={18} /> 新增投递</button>
            </header>

            {/* 看板区域 */}
            <main className="flex gap-8 overflow-x-auto pb-10 max-w-[1400px] mx-auto h-[calc(100vh-250px)]">
                {[
                    { id: 'backlog', title: '准备中', icon: ListTodo, color: 'text-slate-400' },
                    { id: 'applied', title: '已投递', icon: Send, color: 'text-blue-400' },
                    { id: 'interviewing', title: '面试中', icon: MessageSquare, color: 'text-orange-500', isSpecial: true },
                    { id: 'offered', title: '已斩获', icon: Award, color: 'text-emerald-500' },
                    { id: 'closed', title: '已结束', icon: Archive, color: 'text-slate-300' }
                ].map(col => (
                    <div key={col.id} className="w-80 flex-shrink-0 flex flex-col">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 relative ${col.isSpecial ? 'ring-2 ring-orange-100' : ''}`}>
                                {col.isSpecial && <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-ping"></span>}
                                <col.icon size={18} className={col.color} />
                            </div>
                            <h2 className={`font-black text-xs uppercase tracking-widest ${col.isSpecial ? 'text-orange-600' : 'text-slate-400'}`}>{col.title}</h2>
                        </div>

                        <div className="space-y-5 overflow-y-auto pr-2">
                            {apps.filter(a => a.status === col.id).map(card => (
                                <div key={card.id} onClick={() => setSelectedId(card.id)} className="bg-white rounded-[28px] p-6 shadow-sm border border-transparent hover:border-orange-200 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group">
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-orange-500">{card.company}</h3>
                                    <p className="text-sm text-slate-400 font-semibold mb-5">{card.position}</p>
                                    <div className="flex items-center justify-between text-[11px] font-black tracking-tight">
                                        <div className={`flex items-center gap-1.5 ${card.deadline ? 'text-rose-500 font-bold' : 'text-slate-300'}`}>
                                            {card.deadline ? <AlertCircle size={14} className="animate-pulse" /> : <Calendar size={14} />}
                                            {card.deadline ? `截止: ${card.deadline}` : (card.date || '待定')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addApp(col.id)} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[28px] text-slate-300 hover:border-orange-200 transition-all flex justify-center"><Plus size={24} /></button>
                        </div>
                    </div>
                ))}
            </main>

            {/* --- 重点修复的抽屉交互 --- */}
            {selectedCard && (
                <div className="fixed inset-0 z-[110] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedId(null)} />
                    <div className="relative w-[500px] bg-white h-full shadow-2xl p-12 overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">

                        <div className="flex justify-between items-center mb-10">
                            <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-4 py-1.5 rounded-full uppercase">编辑详情</span>
                            <div className="flex gap-4">
                                {/* 1. 删除修复：点击即删且关闭抽屉 */}
                                <button onClick={() => deleteApp(selectedCard.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={24} /></button>
                                <button onClick={() => setSelectedId(null)} className="p-2 text-slate-300 hover:text-slate-600 font-bold text-2xl">✕</button>
                            </div>
                        </div>

                        <div className="mb-12">
                            {/* 2. 输入体验修复：点击全选内容，直接覆盖输入 */}
                            <input
                                value={selectedCard.company}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => updateApp(selectedCard.id, { company: e.target.value })}
                                className="text-4xl font-black text-slate-800 w-full bg-transparent border-none focus:outline-none mb-2"
                            />
                            <input
                                value={selectedCard.position}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => updateApp(selectedCard.id, { position: e.target.value })}
                                className="text-xl font-bold text-slate-300 w-full bg-transparent border-none focus:outline-none"
                            />
                        </div>

                        <div className="space-y-12">
                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase mb-4 block">流程状态</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {['backlog', 'applied', 'interviewing', 'offered', 'closed'].map(s => (
                                        <button key={s} onClick={() => updateApp(selectedCard.id, { status: s })} className={`py-2 text-[10px] font-black rounded-xl border transition-all ${selectedCard.status === s ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                                            {s === 'backlog' ? '准备' : s === 'applied' ? '已投' : s === 'interviewing' ? '面试' : s === 'offered' ? '斩获' : '结束'}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase mb-4 block">面经/笔记外链</label>
                                <div className="flex items-center gap-3 p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                                    <LinkIcon size={18} className="text-orange-400" />
                                    <input
                                        value={selectedCard.notesLink}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => updateApp(selectedCard.id, { notesLink: e.target.value })}
                                        className="bg-transparent border-none w-full text-sm font-bold text-orange-900 focus:ring-0"
                                        placeholder="粘贴 Notion/飞书 链接"
                                    />
                                </div>
                            </section>

                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase mb-4 block">重要日期 (截止或面试)</label>
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-orange-100 transition-all">
                                    <Calendar size={20} className="text-slate-400" />
                                    {/* 3. 日期修复：使用原生 Date 类型，确保绝对可以输入/选择 */}
                                    <input
                                        type="date"
                                        value={selectedCard.deadline || selectedCard.date || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (selectedCard.status === 'backlog') updateApp(selectedCard.id, { deadline: val, date: null });
                                            else updateApp(selectedCard.id, { date: val, deadline: null });
                                        }}
                                        className="bg-transparent border-none w-full text-lg font-bold text-slate-800 focus:ring-0"
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="mt-auto">
                            <button onClick={() => setSelectedId(null)} className="w-full py-5 bg-slate-800 text-white rounded-[28px] font-black shadow-2xl active:scale-95 transition-all">保存并返回看板</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;