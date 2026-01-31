import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RecommendedRssSource } from '@/models/rssSource';
import { MOCK_RECOMMENDED_SOURCES } from '@/mocks/readMock';
import { Plus, Check, ExternalLink } from 'lucide-react';

interface RssSourceDialogProps {
    onAddSource: (url: string, name: string) => void;
}

export const RssSourceDialog: React.FC<RssSourceDialogProps> = ({ onAddSource }) => {
    const [mode, setMode] = useState<'menu' | 'recommend' | 'manual'>('menu');
    const [manualUrl, setManualUrl] = useState('');
    const [manualName, setManualName] = useState('');
    const [open, setOpen] = useState(false);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualUrl && manualName) {
            onAddSource(manualUrl, manualName);
            setOpen(false);
            setMode('menu');
            setManualUrl('');
            setManualName('');
        }
    };

    const handleSelectRecommend = (source: RecommendedRssSource) => {
        onAddSource(source.url, source.name);
        setOpen(false);
        setMode('menu');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage RSS Sources</DialogTitle>
                </DialogHeader>

                {mode === 'menu' && (
                    <div className="flex flex-col gap-4 py-4">
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => setMode('recommend')}
                        >
                            Get Recommended RSS Source
                        </Button>
                        <Button 
                            className="w-full justify-start" 
                            variant="outline"
                            onClick={() => setMode('manual')}
                        >
                            Manual Input Source
                        </Button>
                    </div>
                )}

                {mode === 'recommend' && (
                    <div className="flex flex-col gap-4 py-4 max-h-[400px] overflow-y-auto pr-2">
                        <Button variant="ghost" className="mb-2 self-start" onClick={() => setMode('menu')}>
                            ← Back
                        </Button>
                        {MOCK_RECOMMENDED_SOURCES.map(source => (
                            <div key={source.id} className="border rounded-md p-3 flex flex-col gap-2 hover:bg-accent cursor-pointer group" onClick={() => handleSelectRecommend(source)}>
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-sm">{source.name}</h4>
                                    <Check className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{source.description}</p>
                                <span className="text-[10px] text-blue-500 flex items-center gap-1">
                                    {source.url} <ExternalLink className="h-3 w-3" />
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {mode === 'manual' && (
                    <form onSubmit={handleManualSubmit} className="flex flex-col gap-4 py-4">
                        <Button variant="ghost" className="mb-2 self-start" onClick={() => setMode('menu')}>
                            ← Back
                        </Button>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Source Name</Label>
                            <Input 
                                id="name" 
                                placeholder="e.g. TechCrunch" 
                                value={manualName}
                                onChange={(e) => setManualName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="url">RSS URL</Label>
                            <Input 
                                id="url" 
                                placeholder="https://example.com/rss" 
                                value={manualUrl}
                                onChange={(e) => setManualUrl(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="mt-2">Add Source</Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};
