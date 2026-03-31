import { useState } from 'react';
import { Search, BookOpen, BookPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface GutenbergBook {
  id: number;
  title: string;
  authors: { name: string }[];
  subjects: string[];
}

const GutenbergSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<GutenbergBook[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setBooks(data.results?.slice(0, 8) || []);
    } catch {
      setBooks([]);
    }
    setLoading(false);
  };

  const saveToLibrary = (book: GutenbergBook) => {
    const saved = JSON.parse(localStorage.getItem('qclick-library-items') || '[]');
    saved.push({ id: `gutenberg-${book.id}`, title: book.title, source: 'gutenberg', description: book.authors.map(a => a.name).join(', '), savedAt: new Date().toISOString() });
    localStorage.setItem('qclick-library-items', JSON.stringify(saved));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search 60,000+ free books..." onKeyDown={(e) => e.key === 'Enter' && search()} />
        <Button onClick={search} disabled={loading}><Search className="w-4 h-4" /></Button>
      </div>

      {books.map((b, i) => (
        <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="py-3 px-4">
              <h4 className="text-sm font-medium text-foreground">{b.title}</h4>
              <p className="text-xs text-muted-foreground">{b.authors.map(a => a.name).join(', ')}</p>
              {b.subjects.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {b.subjects.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={`https://www.gutenberg.org/ebooks/${b.id}`} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-3 h-3" /> Read
                  </a>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => saveToLibrary(b)}>
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

export default GutenbergSearch;
