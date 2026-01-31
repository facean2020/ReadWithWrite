import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  PenLine, 
  Sparkles, 
  ArrowRight, 
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_ARTICLES } from '@/mocks/readMock';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const latestArticles = MOCK_ARTICLES.slice(0, 3);

  return (
    <div className="flex flex-col gap-8 text-left animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('home.title', 'Welcome Back')}</h1>
            <p className="text-muted-foreground">{t('home.subtitle', 'Explore today\'s insights and start your writing journey.')}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Daily Writing Focus */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PenLine className="w-24 h-24 rotate-12" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">Daily Writing Topic</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">The ethical implications of AI in modern literature</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl">
                As large language models become more prevalent, how does the definition of "authorship" change? 
                Reflect on the balance between human creativity and machine assistance.
              </p>
              
              <Button onClick={() => navigate('/write')} className="gap-2">
                Start Writing <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Latest Reading Pulse */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Latest Reading</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/read')}>
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestArticles.map((article) => (
                <div key={article.id} className="flex flex-col gap-3 p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/read')}>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    {article.picUrl ? (
                      <img src={article.picUrl} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase">{article.source}</span>
                    <h4 className="font-bold line-clamp-2 leading-tight">{article.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-8">

          {/* Project Stats (Mock) */}
          <div className="rounded-2xl border bg-muted/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Total Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">12</span>
                <span className="text-[10px] text-muted-foreground uppercase">Articles Read</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">3</span>
                <span className="text-[10px] text-muted-foreground uppercase">Writing Sets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
