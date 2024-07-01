import { FC } from 'react';

interface IconMenuPurchaseProps {
    className?: string;
}

const IconMenuPurchase: FC<IconMenuPurchaseProps> = ({ className }) => {
    return (

<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<rect width="14" height="14" fill="url(#menu_purchase)"/>
<defs>
<pattern id="menu_purchase" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0_67_3268" transform="scale(0.01)"/>
</pattern>
<image id="image0_67_3268" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
</defs>
</svg>

    );
};

export default IconMenuPurchase;
