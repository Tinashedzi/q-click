import { useState } from 'react';
import { Search, FileText, BookPlus, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
}

const ArxivSearch = () => {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=6`);
      const text = await res.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      const entries = xml.querySelectorAll('entry');
      const parsed: ArxivPaper[] = Array.from(entries).map(e => ({
        id: e.querySelector('id')?.textContent || '',
        title: e.querySelector('title')?.textContent?.trim() || '',
        summary: e.querySelector('summary')?.textContent?.trim().slice(0, 200) || '',
        authors: Array.from(e.querySelectorAll('author name')).map(a => a.textContent || ''),
        published: e.querySelector('published')?.textContent?.slice(0, 10) || '',
      }));
      setPapers(parsed);
    } catch {
      setPapers([]);
    }
    setLoading(false);
  };

  const saveToLibrary = (paper: ArxivPaper) => {
    const saved = JSON.parse(localStorage.getItem('qclick-library-items') || '[]');
    saved.push({ id: `arxiv-${paper.id}`, title: paper.title, source: 'arxiv', description: paper.authors.slice(0, 3).join(', '), url: paper.id, savedAt: new Date().toISOString() });
    localStorage.setItem('qclick-library-items', JSON.stringify(saved));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search arXiv papers..." onKeyDown={(e) => e.key === 'Enter' && search()} />
        <Button onClick={search} disabled={loading}><Search className="w-4 h-4" /></Button>
      </div>

      {papers.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="py-3 px-4">
              <h4 className="text-sm font-medium text-foreground leading-tight">{p.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{p.authors.slice(0, 3).join(', ')}{p.authors.length > 3 ? ' et al.' : ''} · {p.published}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.summary}...</p>
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={p.id} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-3 h-3" /> Read
                  </a>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => saveToLibrary(p)}>
                  <BookPlus className="w-3 h-3" /> Save
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  <Sparkles className="w-3 h-3" /> AI Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ArxivSearch;
