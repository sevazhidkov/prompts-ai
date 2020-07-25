import React, { useState } from 'react';

export function PromptEditor() {
    return (
        <div>
            <textarea placeholder={'Enter a prompt'}/>
            <p>Use {"{input}"} where test input supposed to be</p>
        </div>
    );
}