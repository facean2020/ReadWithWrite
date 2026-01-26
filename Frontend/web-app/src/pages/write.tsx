import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History, ChevronLeft } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface WritingHistory {
    id: string;
    topicTitle: string;
    content: string;
    revisedContent: string;
    feedback: string;
    createdAt: string;
}

const dummyHistory: WritingHistory[] = [
    {
        id: '1',
        topicTitle: 'Technology in Education',
        content: 'I believe that technology has a profound impact on education. For example, online courses allow students from all over the world to access high-quality resources. In the future, AI will likely play an even bigger role in personalizing learning experiences.',
        revisedContent: 'I believe that technology has a profound impact on education. For example, online courses allow students from all over the world to access high-quality resources. In the future, AI will likely play an even bigger role in personalizing learning experiences.',
        feedback: 'Good work!',
        createdAt: '2026-01-20T10:00:00Z'
    },
    {
        id: '2',
        topicTitle: 'Traditional Festivals',
        content: 'Spring Festival is the most important festival in China. It is a time for family reunions and celebrating the new year. People usually eat dumplings and set off firecrackers to welcome the arrival of spring.',
        revisedContent: 'The Spring Festival is the most important holiday in China. It is a time for family reunions and celebrating the lunar new year. People usually eat dumplings and set off firecrackers to welcome the arrival of spring.',
        feedback: 'Nice description.',
        createdAt: '2026-01-15T10:00:00Z'
    },
    {
        id: '3',
        topicTitle: 'Travel Experiences',
        content: 'Last summer, I went to Japan for a vacation. I visited Tokyo and Kyoto. The food was delicious, and the scenery was breathtaking. I especially enjoyed the traditional temples and the bustling city life.',
        revisedContent: 'Last summer, I went to Japan for a vacation. I visited Tokyo and Kyoto. The food was delicious, and the scenery was breathtaking. I especially enjoyed visiting the traditional temples and experiencing the bustling city life.',
        feedback: 'Well written.',
        createdAt: '2026-01-10T10:00:00Z'
    }
];

const MyCard: React.FC<{ dailyTopic: string }> =({ dailyTopic }) => {
    return (
        <div className="my-card border rounded-xl p-4 shadow-md w-full max-w-md">
            <div className="topic-area">
                <div className="topic-area content-start">
                    <p className="text-sm text-start break-words max-h-32 overflow-y-auto">
                        {dailyTopic}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MyWritingArea: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
    return (
        <div className="writing-area border rounded-xl p-4 shadow-md w-full max-w-md h-96">
            <div className="input-area h-full">
                <textarea
                    className="w-full h-full resize-none border-0 outline-none bg-transparent"
                    placeholder="Start writing here..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                ></textarea>
            </div>
        </div>
    );
}

function HistoryArea({ historyList }: { historyList: WritingHistory[] }) {
    const [selectedItem, setSelectedItem] = useState<WritingHistory | null>(null);

    if (selectedItem) {
        return (
            <div className="h-full flex flex-col mt-4">
                <SheetHeader className="mb-6 flex flex-row items-center space-y-0 gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)} className="rounded-full">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <SheetTitle className="text-2xl font-bold text-left">Detail</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto pb-10">
                    <HistoryDetail item={selectedItem} />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col mt-4">
            <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-bold text-left">Writing History</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-1">
                    {historyList.map((item, index) => (
                        <div key={item.id}>
                            <div 
                                className="py-4 cursor-pointer hover:bg-slate-50 transition-colors px-2 rounded-lg"
                                onClick={() => setSelectedItem(item)}
                            >
                                <h3 className="font-semibold text-lg">{item.topicTitle}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                                    {item.content}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-slate-400">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            {index < historyList.length - 1 && <Separator className="my-2" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function HistoryDetail({ item }: { item: WritingHistory }) {
    return (
        <div className="space-y-6 px-2">
            <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Topic</h4>
                <div className="p-4 border rounded-xl bg-slate-50 font-semibold italic text-slate-700">
                    {item.topicTitle}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Your Writing</h4>
                <div className="p-4 border rounded-xl shadow-sm bg-white min-h-[100px] whitespace-pre-wrap">
                    {item.content}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Revised Content</h4>
                <div className="p-4 border rounded-xl shadow-sm bg-blue-50/30 border-blue-100 min-h-[100px] whitespace-pre-wrap">
                    {item.revisedContent}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Feedback</h4>
                <div className="p-4 border rounded-xl bg-amber-50/30 border-amber-100 text-amber-900 leading-relaxed">
                    {item.feedback}
                </div>
            </div>

            <div className="flex justify-end pr-2">
                <span className="text-xs text-slate-400">
                    Created on {new Date(item.createdAt).toLocaleString()}
                </span>
            </div>
        </div>
    );
}

const HistoryButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    (props, ref) => {
        return (
            <Button {...props} ref={ref} variant="outline" size="icon" className="rounded-xl shadow-sm">
                <History className="h-5 w-5" />
            </Button>
        );
    }
);
HistoryButton.displayName = "HistoryButton";

const Write: React.FC = () => {
    const [text, setText] = useState<string>('');

  return (
    <div className="p-6 relative">
        <div className="top-6 right-6 absolute">
            <Sheet>
                <SheetTrigger asChild>
                    <HistoryButton />
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[100dvh] w-full flex flex-col">
                    <HistoryArea historyList={dummyHistory} />
                </SheetContent>
            </Sheet>
        </div>

        <div className="content-header mb-8">
            <h1 className="text-3xl font-bold mb-2">Today's topic</h1>
        </div>

        <div className="content-center my-6 flex justify-center">
            <div className="w-full max-w-md">
                <MyCard dailyTopic="Today's topic" />
            </div>
        </div>

        <div>
            <br />
        </div>

        <div className="content-center my-6 flex justify-center">
            <div className="w-full max-w-md">
                <MyWritingArea value={text} onChange={setText} />
            </div>
        </div>

        <div className="content-footer my-6 flex justify-center">
            <div className="w-full max-w-md flex justify-end">
                <Button className='rounded-xl' onClick={() => console.log('Submit:', text)}>Submit</Button>
            </div>
        </div>
    </div>
  );
};

export default Write;