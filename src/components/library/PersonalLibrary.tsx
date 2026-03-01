import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleCollections } from '@/data/libraryData';
import type { LibraryItem } from '@/data/libraryData';

const sourceColors: Record<string, string> = {
  wikipedia: 'bg-jade/10 text-jade',
  gutenberg: 'bg-clay/10 text-clay',
  arxiv: 'bg-gold/10 text-gold',
  youtube: 'bg-petal/10 text-petal',
  government: 'bg-dew/10 text-dew',
};

const PersonalLibrary = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('sensage-library-items') || '[]'));
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('sensage-library-items', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Collections */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Collections</h4>
        <div className="grid grid-cols-3 gap-2">
          {sampleCollections.map(c => (
            <Card key={c.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="py-3 px-3 text-center">
                <span className="text-xl">{c.icon}</span>
                <p className="text-xs font-medium text-foreground mt-1">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{items.filter(i => i.collection === c.id).length} items</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Saved Items */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">All Saved ({items.length})</h4>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Your library is empty. Save items from Wikipedia, Gutenberg, or arXiv.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <Card>
                  <CardContent className="py-2 px-3 flex items-center gap-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${sourceColors[item.source]}`}>{item.source}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{item.title}</p>
                      {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalLibrary;
