import { FC, ReactNode} from "react";
import ProductDetail from "./ProductDetail";
import QuantityButton from "./QuantityButton";
import CheckBox from "./CheckBox";
import DeleteButton from "./DeleteButton";
import ProductContent from "./ProductContent";
import Quantity from "./Quantity";

interface TableMenu {
    className?: string;
    children: ReactNode;
}

interface TableMenuCompoundProps {
    QuantityButton: typeof QuantityButton;
    Detail: typeof ProductDetail;
    CheckBox: typeof CheckBox;
    DeleteButton: typeof DeleteButton;
    Content: typeof ProductContent; // 배송현황, 가격
    Quantity : typeof Quantity;
}

const ProductTableMenu: FC<TableMenu> & TableMenuCompoundProps = (props) => {
    const {children} = props;
    return(
        <div>
            {children}
        </div>
    )
}

ProductTableMenu.Detail = ProductDetail;
ProductTableMenu.Content = ProductContent;
ProductTableMenu.Quantity = Quantity;

ProductTableMenu.QuantityButton = QuantityButton;
ProductTableMenu.CheckBox = CheckBox;
ProductTableMenu.DeleteButton = DeleteButton;


export default ProductTableMenu;