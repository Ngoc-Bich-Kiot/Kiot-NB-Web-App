'use client';
import React, { useState } from 'react';
import { Steps, Step } from 'intro.js-react';
import 'intro.js/introjs.css';

type IntroTourProps = {
    steps: Step[];
    children?: React.ReactNode;
    buttonContent?: React.ReactNode;
};

const IntroTour = ({ steps, children, buttonContent }: IntroTourProps) => {
    const [enabled, setEnabled] = useState(false);

    const handleStartTour = () => {
        setTimeout(() => setEnabled(true), 300);
    };
    const handleExit = () => {
        setEnabled(false);
    };

    return (
        <div>
            {children}
            <button onClick={handleStartTour}>
                {buttonContent ?? 'Bắt đầu hướng dẫn'}
            </button>

            {/* Tour Component */}
            <Steps
                enabled={enabled}
                steps={steps}
                initialStep={0}
                onExit={handleExit}
            />
        </div>
    );
};

export default IntroTour;
