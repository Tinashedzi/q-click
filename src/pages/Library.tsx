import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library as LibraryIcon, Search, Atom, Code, Wrench, Calculator, Palette, Globe, Heart, Sparkles, Filter, Play, BookPlus, Star, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import WikipediaSearch from '@/components/library/WikipediaSearch';
import GutenbergSearch from '@/components/library/GutenbergSearch';
import ArxivSearch from '@/components/library/ArxivSearch';
import YouTubeSearch from '@/components/library/YouTubeSearch';
import GovernmentPortal from '@/components/library/GovernmentPortal';
import PersonalLibrary from '@/components/library/PersonalLibrary';
import { supabase } from '@/integrations/supabase/client';

const STEM_DOMAINS = [
  { key: 'all', label: 'All', icon: Sparkles, color: 'hsl(var(--primary))' },
  { key: 'Science', label: 'Science', icon: Atom, color: '#06B6D4' },
  { key: 'Technology', label: 'Tech', icon: Code, color: '#8B5CF6' },
  { key: 'Engineering', label: 'Engineering', icon: Wrench, color: '#F59E0B' },
  { key: 'Mathematics', label: 'Math', icon: Calculator, color: '#EF4444' },
  { key: 'Arts', label: 'Arts', icon: Palette, color: '#EC4899' },
  { key: 'Humanities', label: 'Humanities', icon: Globe, color: '#10B981' },
  { key: 'Health', label: 'Health', icon: Heart, color: '#F43F5E' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  advanced: 'bg-red-500/10 text-red-600 border-red-500/20',
};

interface VideoContent {
  id: string;
  title: string;
  description: string | null;
  youtube_id: string;
  channel_name: string | null;
  thumbnail_url: string | null;
  stem_domain: string;
  stem_subdomain: string | null;
  stem_topic: string | null;
  difficulty_level: string;
  ai_summary: string | null;
  ai_keywords: string[] | null;
  ai_quality_score: number | null;
  is_curated: boolean | null;
}

const Library = () => {
  const [activeDomain, setActiveDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    fetchVideos();
  }, [activeDomain]);

  const fetchVideos = async () => {
    setLoading(true);
    let query = supabase.from('video_content').select('*').order('ai_quality_score', { ascending: false });
    if (activeDomain !== 'all') {
      query = query.eq('stem_domain', activeDomain);
    }
    const { data } = await query.limit(50);
    setVideos((data as VideoContent[]) || []);
    setLoading(false);
  };

  const filteredVideos = searchQuery
    ? videos.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.ai_summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.ai_keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : videos;

  // Group videos by subdomain
  const grouped = filteredVideos.reduce<Record<string, VideoContent[]>>((acc, v) => {
    const key = v.stem_subdomain || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LibraryIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Super Library</h1>
            <p className="text-sm text-muted-foreground">Infinite knowledge, organized by STEM</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search topics, keywords, channels..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-background/70 backdrop-blur-xl border-border"
          />
        </div>
      </motion.div>

      {/* STEM Domain Nav */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide"
      >
        {STEM_DOMAINS.map(domain => {
          const Icon = domain.icon;
          const isActive = activeDomain === domain.key;
          return (
            <button
              key={domain.key}
              onClick={() => setActiveDomain(domain.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-background/60 text-muted-foreground border-border hover:border-primary/40 hover:bg-background/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {domain.label}
            </button>
          );
        })}
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50 backdrop-blur-xl border border-border rounded-2xl p-1">
          <TabsTrigger value="discover" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sparkles className="w-3 h-3 mr-1" /> AI Curated
          </TabsTrigger>
          <TabsTrigger value="wikipedia" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Wikipedia</TabsTrigger>
          <TabsTrigger value="books" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Books</TabsTrigger>
          <TabsTrigger value="papers" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Papers</TabsTrigger>
          <TabsTrigger value="videos" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Videos</TabsTrigger>
          <TabsTrigger value="pro" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Professional</TabsTrigger>
          <TabsTrigger value="saved" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Saved</TabsTrigger>
        </TabsList>

        {/* AI Curated Content */}
        <TabsContent value="discover" className="mt-0 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <LibraryIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Content Coming Soon</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Our AI is curating the best educational content for you. Check the other tabs for existing resources!
              </p>
            </motion.div>
          ) : (
            Object.entries(grouped).map(([subdomain, vids]) => (
              <div key={subdomain}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {subdomain}
                  <Badge variant="secondary" className="text-[10px]">{vids.length}</Badge>
                </h3>

                {/* Netflix-style horizontal scroll */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {vids.map((video, i) => (
                    <motion.a
                      key={video.id}
                      href={`https://youtube.com/watch?v=${video.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="shrink-0 w-64 rounded-2xl border border-border bg-background/70 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        <img
                          src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                            <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                          </div>
                        </div>
                        {video.ai_quality_score && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] text-white font-medium">{video.ai_quality_score}</span>
                          </div>
                        )}
                        <Badge
                          className={`absolute bottom-2 left-2 text-[10px] border ${DIFFICULTY_COLORS[video.difficulty_level] || ''}`}
                        >
                          {video.difficulty_level}
                        </Badge>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{video.title}</h4>
                        {video.channel_name && (
                          <p className="text-xs text-muted-foreground mt-1">{video.channel_name}</p>
                        )}
                        {video.stem_topic && (
                          <Badge variant="outline" className="mt-2 text-[10px]">{video.stem_topic}</Badge>
                        )}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="wikipedia" className="mt-0">
          <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
            <WikipediaSearch />
          </div>
        </TabsContent>
        <TabsContent value="books" className="mt-0">
          <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
            <GutenbergSearch />
          </div>
        </TabsContent>
        <TabsContent value="papers" className="mt-0">
          <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
            <ArxivSearch />
          </div>
        </TabsContent>
        <TabsContent value="videos" className="mt-0">
          <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
            <YouTubeSearch />
          </div>
        </TabsContent>
        <TabsContent value="pro" className="mt-0">
          <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
            <GovernmentPortal />
          </div>
        </TabsContent>
        <TabsContent value="saved" className="mt-0">
          <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
            <PersonalLibrary />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
