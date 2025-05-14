import { Button } from "../../components/ui/button";
import { FaHeart } from "react-icons/fa";

export default function FavoriteToggleButton( { productId } :{productId:string}) {
    return (
        <Button size='icon' className="p-2 cursor-pointer">
           <FaHeart  style={{color: 'red'}}/>
        </Button>
    )
}
