import { motion } from 'framer-motion';
import { Swords, Calendar, Users, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleTournaments } from '@/data/gamificationData';

const statusColors: Record<string, string> = {
  active: 'bg-jade/10 text-jade border-jade/20',
  upcoming: 'bg-gold/10 text-gold border-gold/20',
  completed: 'bg-muted text-muted-foreground',
};

const TournamentEngine = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Swords className="w-5 h-5 text-clay" />
        <h3 className="font-serif text-lg text-foreground">Tournaments</h3>
      </div>

      {sampleTournaments.map((t, i) => (
        <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.title}</CardTitle>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[t.status]}`}>{t.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t.topic}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.startDate} → {t.endDate}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.participants.length} participants</span>
              </div>

              {t.participants.length > 0 && (
                <div className="space-y-1">
                  {t.participants.sort((a, b) => b.score - a.score).map((p, pi) => (
                    <div key={p.name} className="flex items-center gap-2 text-sm">
                      <span className="w-5 text-center">{pi === 0 ? <Medal className="w-4 h-4 text-gold inline" /> : `${pi + 1}.`}</span>
                      <span className={`flex-1 ${p.name === 'You' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{p.name}</span>
                      <span className="text-gold font-medium">{p.score}</span>
                    </div>
                  ))}
                </div>
              )}

              {t.status === 'upcoming' && (
                <Button variant="outline" className="w-full" size="sm">Join Tournament</Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TournamentEngine;
