import { Chess, Square } from "chess.js";
import { useEffect, useState } from "react";

type usePawnPromotionProps = {
    myColor: string | null;
    updateBoardAfterMove: (move: { from: Square; to: Square, promotion?: string }) => void;
    from: Square | null;
    to: Square | null;
    setShowPromotionModal: React.Dispatch<React.SetStateAction<boolean>>;
    chess: any;
}

const usePawnPromotion = ({ myColor, from, to, updateBoardAfterMove, setShowPromotionModal,chess }: usePawnPromotionProps) => {
    const promotionOptions = ['q', 'r', 'b', 'n']

    const [promotingTo, setPromotingTo] = useState<null | string>(null)
    const isPromoting = (to: Square, from: Square, chess: Chess) => {
        if (!from)
          return false;
        const piece = chess.get(from);
        console.log(piece, myColor)
        if (piece.type != 'p')
          return false;
        
        if (to[1] != '1' && to[1] != '8') 
          return false;
        if(myColor![0] != piece.color)
            return false;

        if(!((to[1] == '8' && myColor == "white") || (to[1] == '1' && myColor == "black")))
            return false;
        setShowPromotionModal(showPromotionModal => true);
        return true;
      }
    const promotionOptionsImages = promotionOptions.map((type) => {
        const color = myColor === "black" ? "b" : 'w';
        const piece = `${color}${type}`;
        return (
            <img
                key = {piece    }
                className="lg:w-14 w-11 my-3 mx-1 cursor-pointer hover:opacity-70"
                src={`/images/${piece}.png`}
                onClick={(e) => { setPromotingTo(promotingTo => type) }}
            />
        )
    })

    useEffect(() => {
        if (promotingTo) {
            const move = { from: from!, to: to!, promotion: promotingTo! };
            updateBoardAfterMove(move)
            setShowPromotionModal(showPromotionModal => false);
        }
    }, [promotingTo])

    return {promotionOptionsImages, isPromoting};
}

export default usePawnPromotion