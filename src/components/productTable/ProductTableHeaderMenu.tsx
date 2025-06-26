import { FC } from "react";

interface HeaderMenuProps {
    className?: string;
    menu: string;
}

const ProductTableHeaderMenu: FC<HeaderMenuProps> = (props) => {
    const {className, menu} = props;
    
    return(
        <div className={className}>
            <p className={className}>{menu}</p>
        </div>
    )
}

export default ProductTableHeaderMenu;