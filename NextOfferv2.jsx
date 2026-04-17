// 建议在 Notebook 中运行以下更新后的完整逻辑
import React, { useState, useMemo } from 'react';
import { 
  Plus, Calendar, Link as LinkIcon, CheckCircle2, TrendingUp, 
  AlertCircle, ExternalLink, ChevronRight, Link2, FileText, 
  MoreHorizontal, Clock, CheckCircle 
} from 'lucide-react';

// --- 1. 数据增强 (增加了 DDL 和 状态) ---
const INITIAL_DATA = [
    { id: '1', company: '美团', position: '产品经理实习生', status: 'interviewing', round: '二面', date: '2023-11-01 14:00', tags: ['北京'], isReferral: true, notesLink: 'https://notion.so/xxx', materials: [{ name: '简历', done: true }, { name: '作品集', done: true }] },
    { id: '2', company: '字节跳动', position: '前端开发', status: 'interviewing', round: '终面', date: '10-28', tags: [], isReferral: false, notesLink: '' },
    { id: '5', company: '小红书', position: '产品运营', status: 'backlog', deadline: '2023-10-27', tags: ['上海'], isReferral: true, materials: [{ name: '简历', done: false }] },
];

const COLUMNS = [
    { id: 'backlog', title: '准备中', icon: '📝' },
    { id: 'applied', title: '已投递', icon: '📤' },
    { id: 'interviewing', title: '面试中', icon: '💬' },
    { id: 'offered', title: '已斩获', icon: '🎉' },
    { id: 'closed', title: '已结束', icon: '📁' },
];

const App = () => {
    const [selectedCard, setSelectedCard] = useState(null);

    // --- 2. 逻辑计算：求职漏斗数据 ---
    const stats = useMemo(() => {
        const total = INITIAL_DATA.length;
        const interviewing = INITIAL_DATA.filter(i => i.status === 'interviewing').length;
        const offers = INITIAL_DATA.filter(i => i.status === 'offered').length;
        const rate = total > 0 ? ((interviewing / total) * 100).toFixed(0) : 0;
        return { total, interviewing, offers, rate };
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] p-6 font-sans">
            {/* Header */}
            <header className="flex justify-between items-center mb-6 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">NextOffer</h1>
                        <p className="text-xs text-slate-400 font-medium">智能求职管理系统</p>
                    </div>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-md active:scale-95">
                    <Plus size={18} /> 新增申请
                </button>
            </header>

            {/* --- 3. 统计仪表盘 (PM 推荐加分项) --- */}
            <div className="grid grid-cols-4 gap-4 mb-8 max-w-[1600px] mx-auto">
                {[
                    { label: '总投递数', value: stats.total, color: 'text-slate-600' },
                    { label: '面试转化率', value: `${stats.rate}%`, color: 'text-indigo-600' },
                    { label: '正在面试', value: stats.interviewing, color: 'text-amber-500' },
                    { label: '已拿 Offer', value: stats.offers, color: 'text-emerald-500' },
                ].map((s, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                        <p className="text-xs font-medium text-slate-400 mb-1">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            <main className="flex gap-6 overflow-x-auto pb-6 max-w-[1600px] mx-auto">
                {COLUMNS.map(column => (
                    <div key={column.id} className="flex-shrink-0 w-80">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{column.icon}</span>
                                <h2 className="font-bold text-sm text-slate-600 uppercase tracking-widest">{column.title}</h2>
                                <span className="bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {INITIAL_DATA.filter(d => d.status === column.id).length}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {INITIAL_DATA.filter(d => d.status === column.id).map(card => (
                                <div
                                    key={card.id}
                                    onClick={() => setSelectedCard(card)}
                                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    {/* 内推高亮条 */}
                                    {card.isReferral && <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />}

                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{card.company}</h3>
                                        {card.round && (
                                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-lg border border-indigo-100">
                                                {card.round}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-500 mb-4 font-medium">{card.position}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {card.isReferral && <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded-md border border-amber-100">INTERNAL 內推</span>}
                                        {card.tags.map(t => <span key={t} className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md">{t}</span>)}
                                    </div>

                                    {/* DDL 预警逻辑 */}
                                    <div className={`flex items-center gap-1.5 text-xs font-medium pt-3 border-t border-slate-50 ${card.deadline ? 'text-rose-500' : 'text-slate-400'}`}>
                                        {card.deadline ? <AlertCircle size={14} /> : <Calendar size={14} />}
                                        {card.deadline ? `截止日期: ${card.deadline}` : card.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </main>

            {/* --- 4. 详情抽屉 (Detail Drawer) --- */}
            {selectedCard && (
                <>
                    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedCard(null)} />
                    <div className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-50 p-10 transform transition-transform animate-in slide-in-from-right duration-300">
                        <button onClick={() => setSelectedCard(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>

                        <div className="mb-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-3xl shadow-inner">
                                {selectedCard.company[0]}
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-1">{selectedCard.company}</h2>
                            <p className="text-lg text-slate-400 font-medium">{selectedCard.position}</p>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">进度详情</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-xs text-slate-400 mb-1">当前阶段</p>
                                        <p className="font-bold text-slate-700">{selectedCard.round || '投递阶段'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-xs text-slate-400 mb-1">重要时间</p>
                                        <p className="font-bold text-indigo-600">{selectedCard.date || selectedCard.deadline}</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">求职资源</label>
                                <a
                                    href={selectedCard.notesLink}
                                    target="_blank"
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedCard.notesLink ? 'border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50' : 'border-dashed border-slate-100 text-slate-300 pointer-events-none'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <ExternalLink size={18} className="text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-indigo-900">面试复盘笔记</p>
                                            <p className="text-[10px] text-indigo-400">Notion / 飞书 链接</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-indigo-300" />
                                </a>
                            </section>

                            <section>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">材料清单</label>
                                <div className="space-y-2">
                                    {selectedCard.materials?.map((m, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${m.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-200 bg-white'}`}>
                                                {m.done && <CheckCircle2 size={12} />}
                                            </div>
                                            <span className={`text-sm font-medium ${m.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{m.name}</span>
                                        </div>
                                    ))}
                                    {!selectedCard.materials && <p className="text-sm text-slate-300 italic px-2">暂无材料要求</p>}
                                </div>
                            </section>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default App;