import { HomeFooterDesktop } from "./home-footer-desktop";
import { HomeFooterMobile } from "./home-footer-mobile";

export function HomeFooter() {
    return (
        <>
            <div className="hidden lg:block">
                <HomeFooterDesktop />
            </div>

            <div className="lg:hidden">
                <HomeFooterMobile />
            </div>
        </>
    );
}
