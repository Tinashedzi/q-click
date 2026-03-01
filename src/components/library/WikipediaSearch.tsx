import { useState } from 'react';
import { Search, ExternalLink, BookPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface WikiResult {
  title: string;
  snippet: string;
  pageid: number;
}

const WikipediaSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WikiResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=8`);
      const data = await res.json();
      setResults(data.query?.search || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const saveToLibrary = (item: WikiResult) => {
    const saved = JSON.parse(localStorage.getItem('sensage-library-items') || '[]');
    saved.push({ id: `wiki-${item.pageid}`, title: item.title, source: 'wikipedia', description: item.snippet.replace(/<[^>]*>/g, ''), savedAt: new Date().toISOString() });
    localStorage.setItem('sensage-library-items', JSON.stringify(saved));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Wikipedia..." onKeyDown={(e) => e.key === 'Enter' && search()} />
        <Button onClick={search} disabled={loading}><Search className="w-4 h-4" /></Button>
      </div>

      {results.map((r, i) => (
        <motion.div key={r.pageid} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="py-3 px-4">
              <h4 className="text-sm font-medium text-foreground">{r.title}</h4>
              <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: r.snippet }} />
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={`https://en.wikipedia.org/?curid=${r.pageid}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" /> Read
                  </a>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => saveToLibrary(r)}>
                  <BookPlus className="w-3 h-3" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default WikipediaSearch;
