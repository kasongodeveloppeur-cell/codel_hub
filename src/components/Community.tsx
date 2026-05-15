import { 
  Users, 
  Search, 
  MessageSquare, 
  Hash, 
  Circle,
  Play,
  Calendar,
  Send,
  Plus,
  HelpCircle,
  Share2,
  TrendingUp,
  Flame,
  ChevronRight,
  ArrowLeft,
  Eye,
  MessageCircle,
  Shield,
  Zap,
  Terminal,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import { forumService } from '../services/forumService';
import { chatService, ChatMessage as ChatMessageType } from '../services/chatService';
import { ForumTopic, ForumThread, ForumComment } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Community() {
  const { user } = useAuth();
  const [view, setView] = useState<'topics' | 'threads' | 'thread'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newThreadData, setNewThreadData] = useState({ title: '', content: '' });
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      await forumService.initForumTopics();
      fetchTopics();
    };
    init();

    // Subscribe to chat
    const unsubscribe = chatService.subscribeToMessages((msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendChat = async () => {
    if (!user || !chatInput.trim()) return;
    await chatService.sendMessage({
      text: chatInput,
      author: user.name,
      authorId: user.id,
      avatar: user.avatar
    });
    setChatInput('');
  };

  const fetchTopics = async () => {
    setLoading(true);
    const data = await forumService.getTopics();
    setTopics(data);
    setLoading(false);
  };

  const handleSelectTopic = async (topic: ForumTopic) => {
    setLoading(true);
    setSelectedTopic(topic);
    const data = await forumService.getThreads(topic.id);
    setThreads(data);
    setView('threads');
    setLoading(false);
  };

  const handleSelectThread = async (thread: ForumThread) => {
    setLoading(true);
    setSelectedThread(thread);
    const data = await forumService.getComments(thread.id);
    setComments(data);
    setView('thread');
    setLoading(false);
  };

  const handleBackToTopics = () => {
    setView('topics');
    setSelectedTopic(null);
  };

  const handleBackToThreads = () => {
    setView('threads');
    setSelectedThread(null);
  };

  const handleCreateThread = async () => {
    if (!selectedTopic || !user || !newThreadData.title || !newThreadData.content) return;
    
    setLoading(true);
    try {
      await forumService.createThread({
        topicId: selectedTopic.id,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        title: newThreadData.title,
        content: newThreadData.content
      });
      setNewThreadData({ title: '', content: '' });
      setIsCreatingThread(false);
      const data = await forumService.getThreads(selectedTopic.id);
      setThreads(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!selectedThread || !user || !newComment.trim()) return;

    setLoading(true);
    try {
      await forumService.addComment({
        threadId: selectedThread.id,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        content: newComment
      });
      setNewComment('');
      const data = await forumService.getComments(selectedThread.id);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const formatDate = (date: any) => {
    if (!date) return '...';
    const d = date.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(d, { addSuffix: true, locale: fr });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="lg:col-span-8 space-y-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-[1px] bg-brand-cyan" />
              <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em]">MODULE COMMUNAUTÉ // CŒUR</span>
            </div>
            <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none mb-4 uppercase">FORUMS & <span className="text-slate-500">RELAIS</span></h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
              Connectez-vous avec des développeurs passionnés, collaborez sur des projets open-source et partagez des connaissances stratégiques.
            </p>
          </div>
        </header>

        {/* Dynamic View Content */}
        <AnimatePresence mode="wait">
          {view === 'topics' && (
            <motion.div 
              key="topics"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-12"
            >
              {/* Featured Event */}
              <div className="hub-card relative overflow-hidden group min-h-[380px] p-8 lg:p-12 border-t-2 border-brand-cyan">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 blur-[120px] rounded-full" />
                <div className="relative z-10 flex flex-col h-full justify-end items-start max-w-xl">
                  <div className="flex gap-3 mb-6">
                      <span className="px-2 py-1 bg-brand-cyan/20 border border-brand-cyan/40 text-[9px] font-mono text-brand-cyan uppercase tracking-widest">TRANSMISSION_LIVE</span>
                      <span className="px-2 py-1 bg-brand-magenta/20 border border-brand-magenta/40 text-[9px] font-mono text-brand-magenta uppercase tracking-widest">HACKATHON</span>
                  </div>
                  <h2 className="text-5xl font-display font-black text-white mb-6 tracking-tighter uppercase leading-none group-hover:text-glow-cyan transition-all">
                    LE CODE_DASH 2026
                  </h2>
                  <p className="text-slate-400 text-base mb-8 leading-relaxed">
                    Rejoignez le réseau décentralisé. 48 heures pour architecturer le futur des interfaces intelligentes. Prix globaux jusqu'à 50k€.
                  </p>
                  <button className="hub-button-primary scale-110 origin-left">
                    REJOINDRE LA STATION
                  </button>
                </div>
                <img 
                  src="https://picsum.photos/seed/cyber/1200/600" 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale blend-lighten pointer-events-none group-hover:opacity-40 transition-opacity duration-700" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Forum Topics */}
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div 
                    key={topic.id} 
                    onClick={() => handleSelectTopic(topic)}
                    className="hub-card p-6 flex items-center justify-between group cursor-pointer border-l-2 border-l-transparent hover:border-l-brand-cyan hover:bg-hub-surface-alt/20 transition-all"
                  >
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-hub-bg rounded-xl flex items-center justify-center border border-hub-border group-hover:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all">
                          {topic.category === 'Help' ? <HelpCircle className="w-8 h-8 text-slate-700 group-hover:text-brand-cyan" /> : 
                           topic.category === 'Showcase' ? <Share2 className="w-8 h-8 text-slate-700 group-hover:text-brand-cyan" /> :
                           <MessageSquare className="w-8 h-8 text-slate-700 group-hover:text-brand-cyan" />}
                       </div>
                       <div>
                         <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1 group-hover:text-brand-cyan transition-colors">{topic.title}</h3>
                         <p className="text-sm text-slate-500 line-clamp-1">{topic.description}</p>
                       </div>
                    </div>
                    <div className="text-right hidden md:block">
                       <div className="text-2xl font-display font-black text-white leading-none">{topic.threadsCount || 0}</div>
                       <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">SECTEURS</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'threads' && selectedTopic && (
            <motion.div 
              key="threads"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button onClick={handleBackToTopics} className="flex items-center gap-2 text-[10px] font-mono text-slate-500 hover:text-brand-cyan transition-colors group uppercase">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Retour aux Secteurs
                </button>
                <button 
                  onClick={() => setIsCreatingThread(true)}
                  className="hub-button-primary bg-brand-magenta text-hub-bg shadow-[0_0_15px_rgba(217,70,239,0.3)] border-none"
                >
                  NOUVEAU RELAIS
                </button>
              </div>

              <div className="p-8 bg-hub-surface-alt/10 border border-hub-border rounded-xl">
                 <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">{selectedTopic.title}</h2>
                 <p className="text-slate-400 mt-2 font-medium">{selectedTopic.description}</p>
              </div>

              {isCreatingThread && (
                <div className="hub-card p-10 space-y-6 animate-in slide-in-from-top-4">
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-brand-magenta" />
                    Ouvrir Nouvelle Transmission
                  </h3>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Titre du relais..." 
                      className="hub-input w-full h-12"
                      value={newThreadData.title}
                      onChange={(e) => setNewThreadData({...newThreadData, title: e.target.value})}
                    />
                    <textarea 
                      placeholder="Saisie paquet de données..." 
                      className="hub-input w-full min-h-[150px] py-4"
                      value={newThreadData.content}
                      onChange={(e) => setNewThreadData({...newThreadData, content: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setIsCreatingThread(false)} className="hub-button-secondary">Abandonner</button>
                    <button onClick={handleCreateThread} className="hub-button-primary bg-brand-magenta">Diffuser</button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {threads.map((thread) => (
                  <div 
                    key={thread.id} 
                    onClick={() => handleSelectThread(thread)}
                    className="hub-card p-6 flex items-center justify-between group cursor-pointer hover:bg-hub-surface-alt/30 transition-all border-l-2 border-l-transparent hover:border-l-brand-magenta"
                  >
                    <div className="flex gap-6 items-center">
                       <img src={thread.authorAvatar} className="w-12 h-12 rounded-lg grayscale group-hover:grayscale-0 transition-all border border-hub-border" alt="" referrerPolicy="no-referrer" />
                       <div>
                         <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-brand-magenta transition-colors">{thread.title}</h3>
                         <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 uppercase">
                            <span className="text-brand-cyan">UPLINK: @{thread.authorName.toLowerCase().replace(/\s+/g, '_')}</span>
                            <span>•</span>
                            <span>{formatDate(thread.createdAt)}</span>
                         </div>
                       </div>
                    </div>
                    <div className="flex gap-8 items-center hidden sm:flex">
                       <div className="text-center">
                          <div className="text-xl font-display font-bold text-white">{thread.repliesCount || 0}</div>
                          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">RELAIS</div>
                       </div>
                       <div className="text-center">
                          <div className="text-xl font-display font-bold text-white">{thread.views || 0}</div>
                          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">VUES</div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'thread' && selectedThread && (
            <motion.div 
              key="thread"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <button 
                onClick={handleBackToThreads} 
                className="flex items-center gap-2 text-[10px] font-mono text-slate-500 hover:text-brand-cyan transition-colors group uppercase"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Retour à la liste des relais
              </button>

              <div className="hub-card p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 blur-[80px] rounded-full" />
                <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                   <div className="flex flex-col items-center shrink-0 w-[120px]">
                      <div className="w-20 h-20 rounded-xl border border-hub-border p-1 group">
                        <img src={selectedThread.authorAvatar} className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all" alt="" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-[10px] font-mono text-brand-cyan uppercase tracking-tight mt-4">@{selectedThread.authorName.replace(/\s+/g, '_').toLowerCase()}</div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase border border-hub-border px-2 py-1 mt-2 rounded">OPÉRATIONNEL</div>
                   </div>
                   <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                         <h2 className="text-3xl lg:text-4xl font-display font-black text-white tracking-tighter uppercase leading-tight">{selectedThread.title}</h2>
                         <span className="text-[10px] font-mono text-slate-500 uppercase ml-4">{formatDate(selectedThread.createdAt)}</span>
                      </div>
                      <div className="h-px bg-hub-border w-full" />
                      <div className="text-base text-slate-300 font-medium leading-[1.8] whitespace-pre-wrap">
                        {selectedThread.content}
                      </div>
                   </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-6 lg:pl-20 relative">
                <div className="absolute left-10 top-0 bottom-0 w-px bg-hub-border hidden lg:block" />
                
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight ml-4 lg:ml-0">{comments.length} RELAIS_SYSTÈME</h3>
                
                {comments.map((comment) => (
                  <div key={comment.id} className="hub-card p-6 hover:border-brand-cyan/20 transition-all relative">
                    <div className="flex gap-6">
                       <img src={comment.authorAvatar} className="w-10 h-10 rounded-lg grayscale shrink-0 border border-hub-border" alt="" referrerPolicy="no-referrer" />
                       <div className="flex-1">
                          <div className="flex justify-between mb-3 items-center">
                             <span className="text-[10px] font-mono text-brand-cyan uppercase">@{comment.authorName.toLowerCase().replace(/\s+/g, '_')}</span>
                             <span className="text-[10px] font-mono text-slate-600 uppercase">{formatDate(comment.createdAt)}</span>
                          </div>
                          <div className="text-sm text-slate-400 leading-relaxed">
                            {comment.content}
                          </div>
                       </div>
                    </div>
                  </div>
                ))}

                {/* Reply Form */}
                <div className="hub-card p-8 bg-hub-surface-alt/30 border-brand-cyan/20">
                   <h4 className="text-lg font-display font-bold text-white uppercase tracking-tight mb-6">Ajouter au Relais</h4>
                   <textarea 
                     className="hub-input w-full min-h-[120px] mb-6"
                     placeholder="Saisissez vos données de réponse..."
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                   />
                   <div className="flex justify-end">
                      <button 
                        onClick={handleAddComment}
                        disabled={loading || !newComment.trim()}
                        className="hub-button-primary"
                      >
                         ENVOYER
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="lg:col-span-4 space-y-8">
        {/* Live Lab Feed */}
        <div className="hub-card flex flex-col h-[600px] border-t-2 border-brand-cyan bg-hub-surface/40 backdrop-blur-xl">
           <div className="px-6 py-4 border-b border-hub-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle className="w-2 h-2 fill-brand-cyan text-brand-cyan animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-[0.2em]">LAB_EN_DIRECT // LIVE</span>
              </div>
              <Activity className="w-4 h-4 text-slate-700" />
           </div>
           
           <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="text-center py-4">
                 <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Tampon Historique Actif</span>
              </div>
              
              {messages.map((m, i) => (
                <div key={m.id || i} className="space-y-1 group">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase text-brand-cyan">@{m.author.toLowerCase().replace(/\s+/g, '_')}</span>
                      <span className="text-[8px] font-mono text-slate-700">{formatDate(m.timestamp)}</span>
                   </div>
                   <div className="p-3 bg-hub-bg/50 border border-hub-border rounded-lg text-xs text-slate-400 leading-relaxed hover:border-slate-700 transition-colors">
                     {m.text}
                   </div>
                </div>
              ))}
           </div>

           <div className="p-4 bg-hub-surface border-t border-hub-border flex gap-2">
              <input 
                type="text" 
                placeholder="Relais de message..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="hub-input flex-1 h-10 text-xs"
              />
              <button 
                onClick={handleSendChat}
                className="p-2 bg-brand-cyan text-hub-bg rounded hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Global Statistics */}
        <div className="hub-card p-8 bg-hub-surface-alt/40 relative overflow-hidden border-t-2 border-brand-magenta">
           <div className="absolute top-0 right-0 p-4">
             <Shield className="w-8 h-8 text-brand-magenta opacity-10" />
           </div>
           <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-8">MÉTRIQUES_GLOBALES_RELAIS</h3>
           <div className="space-y-8">
              <div>
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-[9px] font-mono text-slate-600 uppercase">Trafic_Comm</span>
                    <TrendingUp className="w-3 h-3 text-brand-cyan" />
                 </div>
                 <div className="text-4xl font-display font-black text-white">148.4K</div>
                 <div className="w-full h-[2px] bg-hub-bg mt-2 overflow-hidden">
                    <div className="h-full bg-brand-cyan w-3/4 shadow-[0_0_8px_rgba(0,242,255,0.4)]" />
                 </div>
              </div>
              <div>
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-[9px] font-mono text-slate-600 uppercase">Relais_Ouverts</span>
                    <Flame className="w-3 h-3 text-brand-magenta" />
                 </div>
                 <div className="text-4xl font-display font-black text-white">12,856</div>
                 <div className="w-full h-[2px] bg-hub-bg mt-2 overflow-hidden">
                    <div className="h-full bg-brand-magenta w-1/2 shadow-[0_0_8px_rgba(217,70,239,0.4)]" />
                 </div>
              </div>
           </div>
           <button className="w-full hub-button-secondary mt-10 text-[10px]">Protocole de Station</button>
        </div>
      </aside>
    </div>
  );
}

