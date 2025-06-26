import {ReactNode, FC } from "react";
import ProductTableHeaderMenu from "./ProductTableHeaderMenu";


interface TableHeaderProps {
    children: ReactNode;
    className?: string;
}

interface TableCompundProps {
    Menu: typeof ProductTableHeaderMenu;
}


const ProductTableHeader: FC<TableHeaderProps> & TableCompundProps = (props) => {
    const {children, className} = props;
    
    return(
        <div className={className}>
            {children}
        </div>
    )
}

ProductTableHeader.Menu = ProductTableHeaderMenu;
export default ProductTableHeader;