import { Square } from "chess.js";
import { useEffect, useState } from "react";

type usePawnPromotionProps = {
    myColor: string | null;
    updateBoardAfterMove: (move: { from: Square; to: Square, promotion?: string }) => void;
    from: Square | null;
    to: Square | null;
    setShowPromotionModal: React.Dispatch<React.SetStateAction<boolean>>;

}

const usePawnPromotion = ({ myColor, from, to, updateBoardAfterMove, setShowPromotionModal }: usePawnPromotionProps) => {
    const promotionOptions = ['q', 'r', 'b', 'n']
    const [promotingTo, setPromotingTo] = useState<null | string>(null)

    const promotionOptionsImages = promotionOptions.map((type) => {
        const color = myColor === "black" ? "b" : 'w';
        const piece = `${color}${type}`;
        return (
            <img
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

    return {promotionOptionsImages};
}

export default usePawnPromotion