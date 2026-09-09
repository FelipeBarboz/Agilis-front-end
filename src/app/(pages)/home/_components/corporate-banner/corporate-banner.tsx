import { CorporateBannerDesktop } from "./corporate-banner-desktop";
import { CorporateBannerMobile } from "./corporate-banner-mobile";

export function CorporateBanner() {
    return (
        <>
            <div className="hidden lg:block">
                <CorporateBannerDesktop />
            </div>

            <div className="lg:hidden">
                <CorporateBannerMobile />
            </div>
        </>
    );
}
