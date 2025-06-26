import React from 'react';

interface CheckBoxProps {
    productId: string; // 상품의 고유 ID
    isChecked: boolean; // 체크 여부
    onChange: (id: string) => void; // 체크박스 상태 변경 핸들러
    className?: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({ productId, isChecked, onChange, className }) => {
    return (
        <div className={className}>
            <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onChange(productId)} // 클릭 시 상태 변경 함수 호출
        />
        </div>
    );
};

export default CheckBox;
