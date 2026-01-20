import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const Write: React.FC = () => {
    const [text, setText] = useState<string>('');

  return (
    <div className="p-6">

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

export default Write;