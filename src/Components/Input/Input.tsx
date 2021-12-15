import React, { FC } from 'react';
import { InputProps } from '../../types';

const InputInbox: FC<InputProps> = ({ name, label, value, onChange, appendedText }) => {
    return (
        <div>
            <label>{label}</label>
            <input name={name} value={value} onChange={onChange} />
            <span>{appendedText}</span>
        </div>
    );
};

export default InputInbox;